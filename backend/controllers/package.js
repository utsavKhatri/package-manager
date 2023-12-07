import { Package, validatePackage } from '../models/Package.js';
import { User } from '../models/User.js';
import { UserPackageMap } from '../models/UserPackageMap.js';
import { transporter } from '../utils/index.js';

export const createPackage = async (req, res) => {
  try {
    const { name, price, status, duration } = req.body;

    const { error } = validatePackage(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newPackage = await Package.create({
      name,
      price,
      status,
      duration,
      createdBy: req.user.id,
    });

    return res
      .status(201)
      .json({ message: 'Package created successfully', package: newPackage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

export const getPackages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
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

    const response = {
      totalCount :parseInt(totalCount),
      totalPages: parseInt(totalPages),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      packages: packages ? packages : [],
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const { name, price, status, duration } = req.body;

    let isExistPackage = await Package.findById(packageId);

    if (!isExistPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (name) {
      isExistPackage.name = name;
    }

    if (price) {
      isExistPackage.price = price;
    }

    if (status) {
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

export const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const packageExists = await Package.findById(packageId);

    if (!packageExists) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // find relation exits in userPackageMap
    const mapingExists = await UserPackageMap.find({
      package: packageId,
    });

    if (mapingExists.length > 0) {
      return res.status(400).json({ message: 'Package is in use' });
    }

    await Package.findByIdAndDelete(packageId);

    return res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const assignPackageToUser = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    if (!userId || !packageId) {
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

    if (!packageExists) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // check relation already exists in userPackageMap
    const mapingExists = await UserPackageMap.findOne({
      user: userId,
      package: packageId,
    });

    if (mapingExists) {
      // update userPackageMap data
      const updatedPackage = await UserPackageMap.findByIdAndUpdate(
        mapingExists._id,
        {
          package: packageId,
          enrolledAt: new Date(),
          expiredAt: new Date(
            new Date().setDate(new Date().getDate() + packageExists.duration)
          ),
          isExpired: false,
        }
      )
        .populate('user package')
        .exec();
      const mailOptions = {
        from: 'package-manager@gmail.com',
        to: updatedPackage.user.email,
        subject: 'Package Update Notification',
        html: `
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hello, ${updatedPackage.user.name}!</h2>
                <p>Your package details have been updated successfully.</p>
                <h3>Updated Package Information:</h3>
                <ul>
                  <li><strong>Package Name:</strong> ${
                    updatedPackage.package.name
                  }</li>
                  <li><strong>Package Price:</strong> ${
                    updatedPackage.package.price
                  }</li>
                  <li><strong>Package Duration:</strong> ${
                    updatedPackage.package.duration
                  } days</li>
                  <li><strong>Updated Date:</strong> ${new Date().toDateString()}</li>
                  <li><strong>Expiration Date:</strong> ${new Date(
                    new Date().setDate(
                      new Date().getDate() + updatedPackage.package.duration
                    )
                  ).toDateString()}</li>
                </ul>
                <p>Your package information has been updated. Please review the changes made.</p>
                <br />
                <p>Best regards,</p>
                <p>Your App Team</p>
              </body>
            `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred while sending email: ', error.message);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.json({ message: 'Package updated successfully' });
    } else {
      await UserPackageMap.create({
        user: userId,
        package: packageId,
        enrolledAt: new Date(),
        expiredAt: new Date(
          new Date().setDate(new Date().getDate() + packageExists.duration)
        ),
        isExpired: false,
      });

      // Inside your logic where the package is assigned to the user
      const mailOptions = {
        from: 'package-manager@gmail.com',
        to: userExists.email,
        subject: 'Package Assigned Successfully!',
        html: `
          <body style="font-family: Arial, sans-serif; padding: 20px;">
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
          </body>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred while sending email: ', error.message);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return res.json({ message: 'Package assigned to user successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
