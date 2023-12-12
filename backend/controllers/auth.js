import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, validateUser } from '../models/User.js';
import { Package } from '../models/Package.js';
import { UserPackageMap } from '../models/UserPackageMap.js';
import { isPast } from 'date-fns';
import { Request, Response } from 'express';

/**
 * Authenticates a user by checking their email and password.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Object} the JSON response with user information and a token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isActive === false) {
      return res.status(400).json({ message: 'Your account is deactivated' });
    }

    const token = jwt.sign({ id: user._id }, 'your-secret-key', {
      expiresIn: '1d',
    });

    user.token = token;
    user.lastLoginAt = new Date();
    await user.save();

    let userData = {
      message: 'Login successful',
      token,
      isExpired: false,
      id: user._id,
    };

    if (user.isAdmin) {
      userData.role = user.isSuperAdmin ? 'superAdmin' : 'admin';
    } else {
      const userPackageMap = await UserPackageMap.findOne({ user: user._id });

      if (userPackageMap) {
        if (userPackageMap.isExpired) {
          userData.role = 'businessUser';
          userData.isExpired = true;
        } else {
          if (isPast(new Date(userPackageMap.expiredAt))) {
            userPackageMap.isExpired = true;
            await userPackageMap.save();
            userData.role = 'businessUser';
            userData.isExpired = true;
          } else {
            userData.role = 'businessUser';
          }
        }
      }
    }

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Registers a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Object} The response object with a success or error message.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const { error } = await validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    // assign trial pack to business user
    if (isAdmin === false) {
      const TrialPackage = await Package.findOne({ name: 'Trial Pack' });

      // expiredAt set to 14 days from now
      const expiredAt = Date.now() + 14 * 24 * 60 * 60 * 1000;

      const userPackageMap = await UserPackageMap.create({
        user: newUser._id,
        package: TrialPackage._id,
        enrolledAt: Date.now(),
        expiredAt: expiredAt,
      });

      newUser.package = userPackageMap._id;
    }

    user = await newUser.save();

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Logout function that handles user logout.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Object} Returns a JSON object with a message property indicating the success or failure of the logout operation.
 */
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.token = null;
    await user.save();

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves the user information based on the provided user ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Object} The user information or an error message.
 */
export const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate([
        {
          path: 'package',
          select: '-__v',
        },
        {
          path: 'package',
          populate: {
            path: 'package',
            select: '-__v -createdAt -updatedAt',
          },
        },
      ])
      .select('-password -__v -createdAt -updatedAt -token -isSuperAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Updates the user's password.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Object} The response object with a success or error message.
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Old password and new password are required' });
    }

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (await bcrypt.compare(oldPassword, user.password)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({ message: 'Password changed successfully' });
    } else {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
