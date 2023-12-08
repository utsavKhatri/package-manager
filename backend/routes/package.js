import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/index.js';
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

packageRouter.post('/', isAdmin, createPackage);
packageRouter.post('/assign', isAuthenticated, assignPackageToUser);
packageRouter.get('/dashboard', isAdmin, dashboardData);
packageRouter.get('/', isAuthenticated, getPackages);
packageRouter.delete('/:id', isAdmin, deletePackages);
packageRouter.get('/:id', isAdmin, getPackage);
packageRouter.put('/:id', isAdmin, updatePackage);

export default packageRouter;
