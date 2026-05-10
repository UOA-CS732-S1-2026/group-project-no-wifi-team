import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/user.js';
import { UserStats } from '../db/userStats.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'no-wifi-team-jwt-secret-dev';

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
    const existing = await User.findOne({ email: normalizedEmail });
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

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
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
    const user = await User.findOne({ userId: req.userId });
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

    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
