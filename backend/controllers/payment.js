import { User } from '../models/User.js';
import { stripe, transporter } from '../utils/index.js';
import { config } from 'dotenv';

config();

/**
 * Generates a function comment for the given function body.
 *
 * @param {import('express').Request} req - the request object
 * @param {import('express').Response} res - the response object
 * @return {Promise} - a promise that resolves when the function completes
 */
export const wenhooks = async (req, res) => {
  let data;
  let eventType;
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log('🚀 ~ file: payment.js:26 ~ wenhooks ~ err:', err.message);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }
  console.log('\x1b[38;5;153m%s\x1b[0m', `event type: -> ${req.body.type}`);

  if (eventType === 'checkout.session.completed') {
    console.log(`🔔  Payment received!`);
  }

  if (eventType === 'invoice.payment_succeeded') {
    console.log(`🔔  Payment received!`);
    const userData = await User.findOne({ email: data.object.customer_email });
    if (userData) {
      // make look email template for sending invoice pdf link via nodemailer
      const mailOptions = {
        from: 'package-manager@gmail.com',
        to: userData.email,
        subject: 'Invoice',
        text: 'Please find the invoice attached.',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                /* Base styles for the email */
                body {
                  font-family: Arial, sans-serif;
                }
                .container {
                  max-width: 600px;
                  margin: auto;
                  padding: 20px;
                  background-color: #ffffff;
                  color: #000000;
                }
                h1 {
                  color: #007bff;
                }
                /* Dark mode styles */
                @media (prefers-color-scheme: dark) {
                  body,
                  .container {
                    background-color: #000000;
                    color: #ffffff;
                  }
                  h1 {
                    color: #00ff00;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Hello ${userData.name},</h1>
                <p>Your invoice is ready. Please find it <a href="${data.object.invoice_pdf}" style="color: #007bff;">here</a>.</p>
                <p>Thank you!</p>
              </div>
            </body>
          </html>
        `,
      };
      // send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log('Email sent');
        }
      });
    }
  }

  res.sendStatus(200);
};
