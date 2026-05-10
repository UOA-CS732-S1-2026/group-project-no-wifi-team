import { Router } from 'express';
import { randomUUID } from 'crypto';
import { User } from '../db/user.js';

const router = Router();

// Find or create a user by username
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'username is required' });
  }
  const name = username.trim();
  let user = await User.findOne({ username: name });
  if (!user) {
    user = await User.create({ username: name });
  } else if (!user.userId) {
    user.userId = randomUUID();
    await user.save();
  }
  res.json({
    username: user.username,
    userId: user.userId,
    achievements: user.achievements ?? [],
    endings: user.endings ?? [],
  });
});

// Add an achievement to a user (idempotent)
router.post('/achievement', async (req, res) => {
  const { username, achievementKey } = req.body;
  if (!username || !achievementKey) {
    return res.status(400).json({ error: 'username and achievementKey are required' });
  }
  const user = await User.findOneAndUpdate(
    { username },
    { $addToSet: { achievements: achievementKey } },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ achievements: user.achievements });
});

// Get all achievements for a user
router.get('/achievements/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ achievements: user.achievements });
});

// Get all unlocked endings for a user
router.get('/endings/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ endings: user.endings ?? [] });
});

export default router;
