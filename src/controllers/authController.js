import { registerUser, loginUser, refreshSession, logoutSession } from '../services/auth.js';

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
