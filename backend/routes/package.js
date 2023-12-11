import express from 'express';
import { isAdmin, isAuthenticated, isSuperAdmin } from '../middlewares/index.js';
import {
  assignPackageToUser,
  createPackage,
  dashboardData,
  deletePackages,
  getPackage,
  getPackages,
  updatePackage,
} from '../controllers/package.js';

const packageRouter = express.Router();

packageRouter.get('/dashboard', isAdmin, dashboardData);
packageRouter.get('/:id', [isAdmin, isSuperAdmin], getPackage);
packageRouter.put('/:id', isAdmin, updatePackage);
packageRouter.delete('/:id', [isAdmin, isSuperAdmin], deletePackages);
packageRouter.get('/', isAuthenticated, getPackages);
packageRouter.post('/', isAdmin, createPackage);
packageRouter.post('/assign', isAuthenticated, assignPackageToUser);

export default packageRouter;
