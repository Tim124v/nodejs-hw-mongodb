import { registerUser, loginUser, refreshSession, logoutSession } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../db/userModel.js';
import bcrypt from 'bcrypt';
import { sendResetPasswordEmail } from '../services/email.js';

export async function registerController(req, res) {
  const { name, email, password } = req.body;
  const userSafe = await registerUser({ name, email, password });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userSafe,
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const { sessionId, accessToken, refreshToken, refreshTokenValidUntil } = await loginUser({ email, password });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', expires: refreshTokenValidUntil });
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax', expires: refreshTokenValidUntil });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
}

export async function refreshController(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  const { sessionId, accessToken, refreshToken: newRefreshToken, refreshTokenValidUntil } = await refreshSession(refreshToken);
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'lax', expires: refreshTokenValidUntil });
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax', expires: refreshTokenValidUntil });
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  const sessionId = req.cookies?.sessionId;
  await logoutSession(refreshToken, sessionId);
  res.status(204).send();
}

export async function sendResetEmailController(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const base = process.env.APP_DOMAIN || 'http://localhost:3000/auth';
  const resetUrl = `${base.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendResetPasswordEmail({ to: email, resetUrl });
  } catch (e) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw createError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: passwordHash });

 
  const { Session } = await import('../db/sessionModel.js');
  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
