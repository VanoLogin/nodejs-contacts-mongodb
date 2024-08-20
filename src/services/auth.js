import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import * as fs from 'node:fs/promises';

//======================Modals================//
import User from '../db/modals/User.js';
import { Session } from '../db/modals/session.js';
import {
  ACCESS_TOKEN_TIL,
  REFRESH_TOKEN_TIL,
  SMTP,
  APP_DOMAIN,
  TEMPLATE_DIR,
} from '../constants/index.js';

//======================Utils================//
import { sendEmail } from '../utils/sendEmail.js';

//======================CREATE USER =================//
async function createNewUser(user) {
  const maybeUser = await User.findOne({ email: user.email });

  if (maybeUser !== null) throw createHttpError(409, 'Email already in use');

  user.password = await bcrypt.hash(user.password, 10);

  return User.create(user);
}

//======================LOGIN USER =================//

async function loginUser(email, password) {
  const maybeUser = await User.findOne({ email });

  if (maybeUser === null) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(password, maybeUser.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: maybeUser._id }); //удаление сессии перед созданием

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: maybeUser._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TIL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TIL),
  });
}

//======================LOGOUT USER =================//

const logoutUser = async ({ sessionId, refreshToken }) => {
  await Session.deleteOne({ _id: sessionId, refreshToken });
};

//======================Refresh USER =================//

async function refreshUser(sessionId, refreshToken) {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw createHttpError(400, 'Invalid session ID format');
  }
  const session = await Session.findOne({ _id: sessionId, refreshToken }); //

  if (session === null) throw createHttpError(401, 'Session not found');

  if (new Date() > new Date(session.refreshTokenValidUntil))
    throw createHttpError(401, 'Refresh token is expired');

  const userId = session.userId;
  await Session.deleteOne({ _id: sessionId }); //

  return Session.create({
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TIL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TIL),
  });
}

//======================Resen Email=================//

async function resetEmail(email) {
  const user = await User.findOne({ email });

  if (user === null) throw createHttpError(404, 'User not found');

  const jwtResetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    SMTP.JWT_SECRET_TOKEN,
    { expiresIn: '15m' },
  );

  const templateFilePath = path.join(TEMPLATE_DIR, 'index.html');

  const templateFsReader = await fs.readFile(templateFilePath, {
    encoding: 'utf8',
  });

  const sendingTemplate = handlebars.compile(templateFsReader);

  const html = sendingTemplate({
    name: user.name,
    link: `${APP_DOMAIN}/reset-password?token=${jwtResetToken}`,
  });

  sendEmail({
    from: SMTP.FROM, // sender address
    to: email, // list of receivers
    subject: 'Reset your password', // Subject line
    html,
  });
}

async function resetPassword(password, token) {
  let decoded;
  try {
    decoded = jwt.verify(token, SMTP.JWT_SECRET_TOKEN);
    console.log(decoded);
  } catch (error) {
    throw createHttpError(401, error.message);
  }

  const user = await User.findOne({
    email: decoded.email,
    _id: decoded.sub,
  });

  const hashedPassword = await bcrypt.hash(password, 10);
  if (user === null) throw createHttpError(404, 'User not found');

  await User.updateOne({ _id: user._id }, { password: hashedPassword });
}

export {
  createNewUser,
  loginUser,
  logoutUser,
  refreshUser,
  resetEmail,
  resetPassword,
};
