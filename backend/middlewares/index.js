import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Middleware function to authenticate and verify a JWT token present in the request header.
 * If the token is valid and the user is authorized, it adds user information to the request object.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} Calls the next middleware function or sends an unauthorized response.
 *
 * @throws {Error} Throws an error if there's an issue during the token verification process.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    const decoded = jwt.verify(token, 'your-secret-key');
    if (!decoded.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = await User.findOne({ _id: decoded.id });
    if (!userData || !userData.token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    if (userData.isSuperAdmin) {
      req.user['isAdmin'] = true;
      req.user['isSuperAdmin'] = true;
    } else {
      req.user['isAdmin'] = userData.isAdmin;
    }
    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/**
 * Authorizes a user based on their role and the requested URL.
 *
 * @param {boolean} isAdmin - Determines if the user is an admin.
 * @param {boolean} adminChecked - Indicates if the admin has been checked.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @return {void}
 */
const authorizeUser =
  (isAdmin, adminChecked = false) =>
  (req, res, next) => {
    if (req.originalUrl.includes('/edit')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (
      isAdmin === 'superAdmin' ||
      req.originalUrl.includes('/delete') ||
      req.originalUrl.includes('/getAll')
    ) {
      return next();
    }

    if (req.user.isAdmin !== isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.adminChecked = adminChecked;
    return next();
  };

export const isAuthenticated = authenticateToken;
export const isBusinessUser = [authenticateToken, authorizeUser(false)];
export const isAdmin = [authenticateToken, authorizeUser(true)];
export const isSuperAdmin = [
  authenticateToken,
  authorizeUser('superAdmin', true),
];
