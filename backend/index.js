import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { UserPackageMap } from './models/UserPackageMap.js';
import { Package } from './models/Package.js';
import { User } from './models/User.js';

import authRouter from './routes/auth.js';
import packageRouter from './routes/package.js';
import userRouter from './routes/user.js';
import { wenhooks } from './controllers/payment.js';
import paymentRouter from './routes/payment.js';

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/pack-manager')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.use('/packages', packageRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/payment', paymentRouter);

app.post('/webhook', wenhooks);

const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

cron.schedule('0 0 * * *', async () => {
  const upMapingData = await UserPackageMap.find({});
  if (upMapingData && upMapingData.length > 0) {
    for (let item of upMapingData) {
      if (item.expiredAt < Date.now()) {
        item.isExpired = true;
        await item.save();
      }
    }
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const admin = await User.findOne({
      email: 'superadmin@gmail.com',
      isSuperAdmin: true,
    });

    let superAdminId = null;

    if (!admin) {
      const superAdmin = await User.create({
        email: 'superadmin@gmail.com',
        name: 'Super Admin',
        password:
          '$2a$10$uO03EmrTj8wFcjq2Ujt4l.1F9EPjlOT6/JMF9d.4hG9DpFmIHKSnO',
        isSuperAdmin: true,
        isAdmin: true,
      });

      superAdminId = superAdmin._id;

      const trailPackExists = await Package.findOne({
        name: 'Trial Pack',
      });

      if (!trailPackExists) {
        await Package.create({
          name: 'Trial Pack',
          price: 0,
          status: true,
          createdBy: superAdminId,
          duration: 14,
        });
      }
    } else {
      superAdminId = admin._id;

      const trailPackExists = await Package.findOne({
        name: 'Trial Pack',
      });

      if (!trailPackExists) {
        await Package.create({
          name: 'Trial Pack',
          price: 0,
          status: true,
          createdBy: superAdminId,
          duration: 14,
        });
      }
    }
  } catch (error) {
    throw error;
  }
});
