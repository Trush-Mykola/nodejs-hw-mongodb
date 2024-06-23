import nodemailer from 'nodemailer';
import { env } from './env.js';

const transport = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

transport.verify((error, success) => {
  if (error) {
    console.error('SMTP Configuration Error:', error);
  } else {
    console.log('SMTP Configuration Successful');
  }
});

export const sendMail = async (options) => {
  console.log('Sending mail with options:', options);
  return await transport.sendMail(options);
};
