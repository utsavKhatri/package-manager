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

dotenv.config();

const app = express();

/* The code `app.use(express.urlencoded({ extended: true }))` is setting up middleware to parse
URL-encoded data. This allows the server to handle form data submitted via POST requests. */
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


/* This code is establishing a connection to a MongoDB database. It uses the `mongoose` library to
connect to the database located at `mongodb://localhost:27017/pack-manager`. If the connection is
successful, it logs a message saying "Connected to MongoDB". If there is an error connecting to the
database, it logs an error message and exits the process with a status code of 1. */
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
app.post('/webhook', wenhooks);

const server = http.createServer(app);

/* The code `server.on('error', (error) => { ... })` is an event listener that listens for errors that
occur while starting the server. If an error occurs, the callback function is executed. */
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

/* The `cron.schedule` function is used to schedule a task to run at a specific time or interval. In
this case, the task is scheduled to run every day at midnight (`'0 0 * * *'`). */
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
