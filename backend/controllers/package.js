import mongoose from 'mongoose';
import { Package, validatePackage } from '../models/Package.js';
import { User } from '../models/User.js';
import { UserPackageMap } from '../models/UserPackageMap.js';
import { transporter, stripe } from '../utils/index.js';
import { config } from 'dotenv';

config();

/**
 * Creates a new package.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Object} The response object.
 */
export const createPackage = async (req, res) => {
  try {
    const { name, price, status, duration } = req.body;

    const { error } = validatePackage(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // check already exists
    const packageExists = await Package.findOne({ name });

    if (packageExists) {
      return res.status(400).json({ message: 'Package already exists' });
    }

    const newPackage = new Package({
      name,
      price,
      status,
      duration,
      createdBy: req.user.id,
    });

    const stripePriceInfo = await stripe.prices.create({
      currency: 'inr',
      unit_amount: price * 100,
      product_data: {
        name: name,
      },
    });

    newPackage.stripe_p_id = stripePriceInfo.id;

    await newPackage.save();

    return res
      .status(201)
      .json({ message: 'Package created successfully', package: newPackage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a package based on the provided package ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Object} The found package.
 */
export const getPackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const foundPackage = await Package.findById(packageId);
    if (!foundPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    return res.json(foundPackage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a list of packages based on the specified query parameters.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Promise} A promise that resolves to the JSON response containing the list of packages.
 */
export const getPackages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  try {
    let response;
    if (req.user.isAdmin === true) {
      let query = {};
      let select = '';
      if (req.user.isAdmin === false) {
        query = { status: true };
        select = '-__v -createdBy -createdAt -updatedAt';
      } else {
        select = '-__v';
      }

      const totalCount = await Package.countDocuments(query);
      const totalPages = Math.ceil(totalCount / pageSize);

      const packages = await Package.find(query)
        .populate([
          {
            path: 'createdBy',
            select: 'name email',
          },
        ])
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select(select);

      response = {
        totalCount: parseInt(totalCount),
        totalPages: parseInt(totalPages),
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        packages: packages ? packages : [],
      };

      return res.json(response);
    } else {
      const packages = await Package.find({
        status: true,
        name: {
          $ne: 'Trial Pack',
        },
      }).select('-__v -createdBy -createdAt -updatedAt');

      response = { packages: packages ? packages : [] };

      return res.json(response);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a package in the database.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @return {Promise<Object>} The updated package and a success message.
 */
export const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(404).json({ message: 'Invalid package ID' });
    }
    const { name, price, status, duration } = req.body;

    let isExistPackage = await Package.findById(packageId);

    if (!isExistPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (isExistPackage.name === 'Trial Pack') {
      return res
        .status(400)
        .json({ message: 'Trial package cannot be deleted' });
    }

    if (name) {
      isExistPackage.name = name;
    }

    if (price) {
      isExistPackage.price = price;
    }

    if (status !== null || status !== undefined) {
      // find any relation exits in userPackageMap
      const mapingExists = await UserPackageMap.find({
        package: packageId,
      });

      if (mapingExists.length > 0) {
        return res.status(400).json({
          message: 'Package status cannot be changed as it is in use',
        });
      }

      isExistPackage.status = status;
    }

    if (duration) {
      isExistPackage.duration = duration;
    }

    const updatedPackage = await isExistPackage.save();

    return res.json({
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a package by ID after performing necessary checks and updates.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A JSON response indicating the operation result.
 */
export const deletePackages = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: 'Invalid package ID' });
    }

    const packageExists = await Package.findById(packageId);

    if (!packageExists) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (packageExists.name === 'Trial Pack') {
      return res
        .status(400)
        .json({ message: 'Trial package cannot be deleted' });
    }

    // Check if there are any existing relations in userPackageMap
    const mappingExists = await UserPackageMap.find({ package: packageId });

    if (mappingExists.length > 0) {
      return res.status(400).json({ message: 'Package is in use' });
    }

    await stripe.prices.update(packageExists.stripePriceId, {
      active: false,
    });

    await Package.findByIdAndDelete(packageId);

    return res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Assigns a package to a user after performing necessary validations and updates.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A JSON response indicating the operation result.
 */
export const assignPackageToUser = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    if (
      !userId ||
      !packageId ||
      !mongoose.Types.ObjectId.isValid(packageId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ message: 'User ID and Package ID are required' });
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.isAdmin === false && userExists.isAdmin === true) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this user package' });
    }

    const packageExists = await Package.findById(packageId);

    if (!packageExists || !packageExists.stripe_p_id) {
      return res.status(404).json({ message: 'Invalid package details' });
    }

    const userPackageMapData = {
      user: userId,
      package: packageId,
      enrolledAt: new Date(),
      expiredAt: new Date(
        new Date().setDate(new Date().getDate() + packageExists.duration)
      ),
      isExpired: false,
    };

    let updatedPackage;

    const existingMapping = await UserPackageMap.find({
      user: userId,
    });

    if (existingMapping.length > 0) {
      await UserPackageMap.deleteMany({
        _id: {
          $in: existingMapping.map((mapping) => mapping._id),
        },
      });
      updatedPackage = await UserPackageMap.create(userPackageMapData);
    } else {
      updatedPackage = await UserPackageMap.create(userPackageMapData);
    }

    await User.findByIdAndUpdate(userId, {
      package: updatedPackage._id,
    });

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: userExists.email,
      subject: 'Package Assigned Successfully!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f5f5f5;
                color: #333333;
              }
              h2 {
                color: #007bff;
              }
              ul {
                list-style: none;
                padding: 0;
              }
              li {
                margin-bottom: 10px;
              }
              @media (prefers-color-scheme: dark) {
                body {
                  background-color: #333333;
                  color: #f5f5f5;
                }
                h2 {
                  color: #00ff00;
                }
              }
            </style>
          </head>
          <body>
            <div style="max-width: 600px; margin: auto;">
              <h2>Hello, ${userExists.name}!</h2>
              <p>Your package has been assigned successfully.</p>
              <h3>Package Details:</h3>
              <ul>
                <li><strong>Package Name:</strong> ${packageExists.name}</li>
                <li><strong>Package Price:</strong> ${packageExists.price}</li>
                <li><strong>Package Duration:</strong> ${
                  packageExists.duration
                } days</li>
                <li><strong>Enrolled Date:</strong> ${new Date().toDateString()}</li>
                <li><strong>Expiration Date:</strong> ${new Date(
                  new Date().setDate(
                    new Date().getDate() + packageExists.duration
                  )
                ).toDateString()}</li>
              </ul>
              <p>Please make the most out of our platform with your newly assigned package!</p>
              <br />
              <p>Best regards,</p>
              <p>Your App Team</p>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log('Email sent');
      }
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      allow_promotion_codes: true,
      customer_email: userExists.email,
      metadata: {
        userId: userId,
        packageId: packageId,
      },
      line_items: [
        {
          price: packageExists.stripe_p_id,
          quantity: 1,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.SUCCESS_URL}?success=paymentSuccess`,
      cancel_url: `${process.env.CANCEL_URL}?error=paymentFailed`,
    });

    return res.json({
      message: 'redirecting to payment page',
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves various statistics and information for the dashboard.
 * This function gathers data such as total package count, total user count excluding super admins,
 * the highest selling package, the user with the most expensive package, the cheapest package,
 * and the most expensive package.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A JSON response containing dashboard statistics and information.
 *
 * @throws {Error} Throws an error if there's any issue during the data retrieval process.
 */
export const dashboardData = async (req, res) => {
  try {
    // Get total packages count
    const packagesCount = await Package.countDocuments();

    // Get total users count except super admins
    const usersCount = await User.countDocuments({ isSuperAdmin: false });

    // Find the highest selling package (package with most users)
    const highestSellingPackage = await UserPackageMap.aggregate([
      { $group: { _id: '$package', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: '_id',
          as: 'packageDetails',
        },
      },
    ]);

    // Find the user who has taken the most expensive package
    const mostExpensiveUser = await UserPackageMap.aggregate([
      {
        $lookup: {
          from: 'packages',
          localField: 'package',
          foreignField: '_id',
          as: 'packageDetails',
        },
      },
      { $unwind: '$packageDetails' },
      { $sort: { 'packageDetails.price': -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: '$userDetails._id',
          name: '$userDetails.name',
          email: '$userDetails.email',
          package: '$packageDetails',
        },
      },
    ]);

    // Find the cheapest and most expensive packages
    const cheapestPackage = await Package.findOne({})
      .sort({ price: 1 })
      .limit(1);
    const mostExpensivePackage = await Package.findOne({})
      .sort({ price: -1 })
      .limit(1);

    // Prepare final response
    const dashboardInfo = {
      totalCount: {
        packages: packagesCount,
        users: usersCount,
      },
      highestSellingPackage,
      mostExpensiveUser: mostExpensiveUser[0],
      cheapestPackage,
      mostExpensivePackage,
    };

    return res.json(dashboardInfo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
