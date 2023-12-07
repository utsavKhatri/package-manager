import express from 'express';
import { changePassword, login, logout, me, register } from '../controllers/auth.js'; // Import your login controller or function
import { isAuthenticated } from '../middlewares/index.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', register);
authRouter.post('/logout', isAuthenticated, logout);
authRouter.get('/me', isAuthenticated, me);
authRouter.post('/changePassword', isAuthenticated, changePassword);

export default authRouter;
