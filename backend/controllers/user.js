import { User, validateUserForAdmin } from '../models/User.js';
import bcrypt from 'bcrypt';
import { transporter, generateStrongPassword } from '../utils/index.js';
import { UserPackageMap } from '../models/UserPackageMap.js';

/**
 * Creates a new user.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Object} The response object containing the status and message.
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;

    const { error } = await validateUserForAdmin(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const isExist = await User.findOne({ email });

    if (isExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const generatedPassword = generateStrongPassword();

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      name,
      email,
      isAdmin,
      password: hashedPassword,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      selfRegistration: false,
    });

    const savedUser = await newUser.save();

    // Send email with user credentials
    const mailOptions = {
      from: 'packagemanager777@gmail.com',
      to: email,
      subject: 'Welcome to Our Platform!',
      html: `
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome, ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${generatedPassword}</p>
          <p>Please login and change your password immediately after signing in.</p>
          <br />
          <p>Regards,</p>
          <p>Your App Team</p>
        </body>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log('Email sent');
      }
    });
    return res
      .status(201)
      .json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a user's information.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Object} The updated user object or an error message.
 */
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, isActive, isAdmin } = req.body;

    let isExist = await User.findById(userId);

    if (!isExist) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.isAdmin === false && isExist.isAdmin === true) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this user' });
    }

    if (name) {
      isExist.name = name;
    }
    if (email) {
      isExist.email = email;
    }

    if (isExist.id === req.user.id) {
      if (isExist.isActive === true && isActive === false) {
        return res
          .status(400)
          .json({ message: 'You cannot deactivate your account' });
      }
    }

    if (isActive !== null || isActive !== undefined) {
      isExist.isActive = isActive;
    }
    if (isAdmin !== null || isAdmin !== undefined) {
      if (isAdmin === true && isExist.isAdmin === false) {
        // assign trial pack to business user
        const TrialPackage = await Package.findOne({ name: 'Trial Pack' });

        // expiredAt set to duration of package
        let expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + TrialPackage.duration);

        const newUserPackageMap = await UserPackageMap.create({
          user: isExist._id,
          package: TrialPackage._id,
          enrolledAt: new Date(),
          expiredAt,
          isExpired: false,
        });
        isExist.isAdmin = isAdmin;
      } else if (isAdmin === false && isExist.isAdmin === true) {
        // remove trial pack from business user
        await UserPackageMap.deleteOne({ user: isExist._id });

        isExist.isAdmin = isAdmin;
      }
    }

    isExist.updatedBy = req.user.id;
    await isExist.save();

    return res.json({
      message: 'User updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a user.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {object} The response JSON object with a message indicating the result of the deletion.
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // find relation exits in userPackageMap
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id === userId) {
      return res.status(403).json({ message: 'You cannot delete yourself' });
    }

    if (req.user.isAdmin === false && userExists.isAdmin === true) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this user' });
    }

    const mapingExists = await UserPackageMap.find({
      user: userId,
    });

    if (mapingExists.length > 0) {
      await UserPackageMap.deleteMany({
        user: userId,
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a user by their ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {object} The found user.
 */
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const foundUser = await User.findById(userId).populate([
      {
        path: 'package',
      },
      {
        path: 'package',
        populate: {
          path: 'package',
        },
      },
    ]);

    if (req.user.isAdmin === false && foundUser.isAdmin === true) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to access this user' });
    }

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(foundUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a list of users with pagination.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Object} The list of users with pagination details.
 */
export const getUsers = async (req, res) => {
  try {
    let { page = 1, pageSize = 10 } = req.query;
    let query = {};
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    if (req.user.isAdmin === false) {
      query = { isAdmin: false, isSuperAdmin: false };
    } else {
      query = { isSuperAdmin: false };
    }

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const options = {
      limit: parseInt(pageSize),
      skip: (page - 1) * pageSize,
    };

    let populateArray = [
      {
        path: 'package',
      },
      {
        path: 'package',
        populate: {
          path: 'package',
        },
      },
      {
        path: 'createdBy',
        select: 'name email',
      },
    ];

    if (req.user.isSuperAdmin) {
      populateArray.push({
        path: 'updatedBy',
        select: 'name email',
      });
    }

    const users = await User.find(query)
      .populate(populateArray)
      .limit(options.limit)
      .skip(options.skip);

    return res.json({
      users,
      totalCount: parseInt(totalCount),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: parseInt(totalPages),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
