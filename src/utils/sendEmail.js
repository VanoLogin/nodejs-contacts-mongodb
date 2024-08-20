import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: SMTP.HOST,
  port: Number(SMTP.PORT),
  secure: false,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

export function sendEmail(option) {
  transporter.sendMail(option);
}
