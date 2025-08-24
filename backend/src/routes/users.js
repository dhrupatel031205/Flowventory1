import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, adminOnly, async (_req, res) => {
  res.json(await User.find());
});

router.post('/', authRequired, adminOnly, async (req, res) => {
  const { name, email, role, password, isActive } = req.body;
  const passwordHash = await bcrypt.hash(password || 'password123', 10);
  const user = await User.create({ name, email, role, isActive, passwordHash });
  res.status(201).json(user);
});

router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { password, ...rest } = req.body;
  const updates = { ...rest };
  if (password) updates.passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  res.json(user);
});

router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ ok: true });
});

export default router;