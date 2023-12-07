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

dotenv.config();
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/pack-manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.use('/packages', packageRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

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
          '$2a$10$xKCSs0/cxJI5iLtrJrfNvO3bS0G4OO8fjEVu23bKUStKGV7nAyloi',
        isSuperAdmin: true,
      });

      superAdminId = superAdmin._id;
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
