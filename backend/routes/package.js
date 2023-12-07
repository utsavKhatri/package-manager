import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/index.js';
import {
  assignPackageToUser,
  createPackage,
  deletePackage,
  getPackage,
  getPackages,
  updatePackage,
} from '../controllers/package.js';

const packageRouter = express.Router();

packageRouter.post('/', isAdmin, createPackage);
packageRouter.post('/assign', isAuthenticated, assignPackageToUser);
packageRouter.get('/', isAuthenticated, getPackages);
packageRouter.get('/:id', isAdmin, getPackage);
packageRouter.put('/:id', isAdmin, updatePackage);
packageRouter.delete('/:id', isAdmin, deletePackage);


export default packageRouter;
