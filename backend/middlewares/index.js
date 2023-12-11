import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

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
