import createHttpError from 'http-errors';
import { Session } from '../db/modals/session.js';
import User from '../db/modals/User.js';

export async function authUser(req, res, next) {
  if (typeof req.headers.authorization !== 'string')
    return next(
      createHttpError(401, 'Please provide a valid authorization header'),
    );

  const [bearer, token] = req.headers.authorization.split(' ', 2);

  if (bearer !== 'Bearer')
    return next(createHttpError(401, 'Auth header must be type "Bearer"'));

  if (typeof token !== 'string')
    return next(
      createHttpError(401, 'AccessToken header must be type "Bearer"'),
    );

  const session = await Session.findOne({ accessToken: token });
  if (session === null) return next(createHttpError(401, 'Session not found'));

  if (new Date() > new Date(session.accessTokenValidUntil))
    return next(createHttpError(401, 'Access token is expired'));

  const user = await User.findById(session.userId);

  if (user === null) return next(createHttpError(401, 'User not found'));

  req.user = user;

  next();
}
