import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import { config } from 'dotenv';
config();

export const stripe = new Stripe(process.env.STRIPE_SECRET);

/**
 * Generates a strong password with a specified length and character set.
 *
 * @return {string} The generated strong password.
 */
export const generateStrongPassword = () => {
  const length = 8;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const SMTPcreds = {
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a026e41da8d100',
    pass: 'ab248f64487cec',
  },
};

export const transporter = nodemailer.createTransport(SMTPcreds);
