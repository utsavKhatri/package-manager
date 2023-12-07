import express from 'express';
import {
  isAdmin,
  isAuthenticated,
  isSuperAdmin,
} from '../middlewares/index.js';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post('/', isAdmin, createUser);
userRouter.get('/', isAuthenticated, getUsers);
userRouter.get('/:id', isAuthenticated, getUser);
userRouter.put('/:id', isAuthenticated, updateUser);
userRouter.delete('/:id', isSuperAdmin, deleteUser);

export default userRouter;
