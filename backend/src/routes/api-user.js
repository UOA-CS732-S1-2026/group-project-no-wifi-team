import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../db/user.js';
import { UserStats } from '../db/userStats.js';
import { authRequired } from '../middleware/auth.js';
import { JWT_SECRET, GOOGLE_CLIENT_ID } from '../config.js';

const router = Router();
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function signToken(userId, username) {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /user/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'username is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail, isDeleted: { $ne: true } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // Create UserStats on registration
    await UserStats.create({ userId: user.userId });

    const token = signToken(user.userId, user.username);
    res.status(201).json({
      token,
      userId: user.userId,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /user/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), isDeleted: { $ne: true } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const stats = await UserStats.findOne({ userId: user.userId });
    const token = signToken(user.userId, user.username);
    res.json({
      token,
      userId: user.userId,
      username: user.username,
      email: user.email,
      achievements: stats?.achievements ?? [],
      endings: stats?.endings ?? [],
      totalPlays: stats?.totalPlays ?? 0,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /user/me
router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId, isDeleted: { $ne: true } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const stats = await UserStats.findOne({ userId: req.userId });
    res.json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      achievements: stats?.achievements ?? [],
      endings: stats?.endings ?? [],
      totalPlays: stats?.totalPlays ?? 0,
    });
  } catch (error) {
    console.error('/me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// PUT /user/password
router.put('/password', authRequired, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'oldPassword and newPassword are required' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'new password must be at least 6 characters' });
    }

    const user = await User.findOne({ userId: req.userId, isDeleted: { $ne: true } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.passwordHash) {
      return res.status(400).json({ error: 'Google-authenticated accounts do not have a password' });
    }

    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// POST /user/logout (client-side token removal is sufficient; this is a no-op endpoint)
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' });
});

// POST /user/google
router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token || typeof access_token !== 'string') {
      return res.status(400).json({ error: 'Google access token is required' });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google login is not configured' });
    }

    const tokenInfo = await googleClient.getTokenInfo(access_token);

    if (!tokenInfo.email) {
      return res.status(400).json({ error: 'Invalid Google access token' });
    }

    // Verify the token is issued to our app
    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return res.status(400).json({ error: 'Token was not issued to this application' });
    }

    // Fetch user display name from Google's userinfo endpoint
    let displayName = tokenInfo.email.split('@')[0];
    try {
      const userInfoClient = new OAuth2Client();
      userInfoClient.setCredentials({ access_token });
      const { data } = await userInfoClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      if (typeof data === 'object' && data && 'name' in data && typeof data.name === 'string') {
        displayName = data.name;
      }
    } catch {
      // Use email prefix as fallback
    }

    const email = tokenInfo.email.toLowerCase();
    let user = await User.findOne({ email, isDeleted: { $ne: true } });

    if (!user) {
      user = await User.create({
        username: displayName,
        email,
      });
      await UserStats.create({ userId: user.userId });
    }

    const stats = await UserStats.findOne({ userId: user.userId });
    const token = signToken(user.userId, user.username);
    res.json({
      token,
      userId: user.userId,
      username: user.username,
      email: user.email,
      achievements: stats?.achievements ?? [],
      endings: stats?.endings ?? [],
      totalPlays: stats?.totalPlays ?? 0,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google login failed' });
  }
});

// GET /user/achievements/:userId (public)
router.get('/achievements/:userId', async (req, res) => {
  const stats = await UserStats.findOne({ userId: req.params.userId });
  if (!stats) return res.status(404).json({ error: 'User not found' });
  res.json({ achievements: stats.achievements });
});

// GET /user/endings/:userId (public)
router.get('/endings/:userId', async (req, res) => {
  const stats = await UserStats.findOne({ userId: req.params.userId });
  if (!stats) return res.status(404).json({ error: 'User not found' });
  res.json({ endings: stats.endings });
});

export default router;
