import express from 'express';
import Log from '../models/Log.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (_req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

export default router;