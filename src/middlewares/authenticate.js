import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../db/sessionModel.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Unauthorized'));
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createError(401, 'Unauthorized'));
    }
    if (session.accessTokenValidUntil && session.accessTokenValidUntil.getTime() <= Date.now()) {
      return next(createError(401, 'Access token expired'));
    }

    req.user = { _id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }
    return next(createError(401, 'Unauthorized'));
  }
}
