import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/userModel.js';
import { Session } from '../db/sessionModel.js';

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
  });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
  });
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createError(409, 'Email in use');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: passwordHash });
  const { password: _password, ...userSafe } = user.toObject();
  return userSafe;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is wrong');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw createError(401, 'Email or password is wrong');
  }

  await Session.deleteMany({ userId: user._id });

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + ACCESS_TOKEN_TTL_MS);
  const refreshTokenValidUntil = new Date(now + REFRESH_TOKEN_TTL_MS);

  const accessToken = createAccessToken({ sub: String(user._id), email: user.email, name: user.name });
  const refreshToken = createRefreshToken({ sub: String(user._id) });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { sessionId: String(session._id), accessToken, refreshToken, refreshTokenValidUntil };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw createError(401, 'Unauthorized');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'Unauthorized');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    throw createError(401, 'Unauthorized');
  }

  await Session.deleteMany({ userId: payload.sub });

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + ACCESS_TOKEN_TTL_MS);
  const refreshTokenValidUntil = new Date(now + REFRESH_TOKEN_TTL_MS);

  const accessToken = createAccessToken({ sub: String(payload.sub) });
  const newRefreshToken = createRefreshToken({ sub: String(payload.sub) });

  const newSession = await Session.create({
    userId: payload.sub,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { sessionId: String(newSession._id), accessToken, refreshToken: newRefreshToken, refreshTokenValidUntil };
}

export async function logoutSession(refreshToken, sessionId) {
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  } else if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }
}
