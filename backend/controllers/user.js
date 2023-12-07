import { User, validateUserForAdmin } from '../models/User.js';
import bcrypt from 'bcrypt';
import { transporter, generateStrongPassword } from '../utils/index.js';
import { UserPackageMap } from '../models/UserPackageMap.js';

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
      from: 'package-manager@gmail.com',
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
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    return res
      .status(201)
      .json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
    if (isActive) {
      isExist.isActive = isActive;
    }
    if (isAdmin !== null || isAdmin !== undefined) {
      isExist.isAdmin = isAdmin;
    }

    isExist.updatedBy = req.user.id;
    await isExist.save();

    return res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // find relation exits in userPackageMap
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
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

    const users = await User.find(query)
      .populate([
        {
          path: 'package',
        },
        {
          path: 'package',
          populate: {
            path: 'package',
          },
        },
      ])
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
