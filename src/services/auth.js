import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import mongoose from 'mongoose';

//======================Modals================//
import User from '../db/modals/User.js';
import { Session } from '../db/modals/session.js';
import { ACCESS_TOKEN_TIL, REFRESH_TOKEN_TIL } from '../constants/index.js';

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

export { createNewUser, loginUser, logoutUser, refreshUser };
