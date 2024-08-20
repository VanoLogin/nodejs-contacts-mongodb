import path from 'node:path';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
//login
const ACCESS_TOKEN_TIL = 30 * 60 * 1000;
const REFRESH_TOKEN_TIL = 24 * 60 * 60 * 1000;

//reset password and sending email
export const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: Number(process.env.SMTP_PORT),
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM: process.env.SMTP_FROM,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
};

export const APP_DOMAIN = process.env.APP_DOMAIN;
export const TEMPLATE_DIR = path.resolve('src', 'templates');

//adding photo

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  ENABLE_CLOUDINARY: process.env.ENABLE_CLOUDINARY,
};

export { SORT_ORDER, ACCESS_TOKEN_TIL, REFRESH_TOKEN_TIL };
