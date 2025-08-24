import express from 'express';
import Item from '../models/Item.js';
import Log from '../models/Log.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const items = await Item.find().populate('category').populate('brand');
  res.json(items);
});

router.post('/', authRequired, async (req, res) => {
  const data = req.body;
  const item = await Item.create(data);
  await Log.create({
    action: 'created',
    itemId: item.id,
    itemName: item.name,
    userId: req.user.id,
    userName: req.user.name,
    details: `Created new item: ${item.name} (SKU: ${item.sku})`
  });
  const populated = await Item.findById(item.id).populate('category').populate('brand');
  res.status(201).json(populated);
});

router.patch('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const oldItem = await Item.findById(id);
  const item = await Item.findByIdAndUpdate(id, updates, { new: true }).populate('category').populate('brand');
  if (oldItem) {
    await Log.create({
      action: 'updated',
      itemId: id,
      itemName: oldItem.name,
      userId: req.user.id,
      userName: req.user.name,
      details: 'Item updated'
    });
  }
  res.json(item);
});

router.delete('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  await Item.findByIdAndDelete(id);
  if (item) {
    await Log.create({
      action: 'deleted',
      itemId: id,
      itemName: item.name,
      userId: req.user.id,
      userName: req.user.name,
      details: `Deleted item: ${item.name} (SKU: ${item.sku})`
    });
  }
  res.json({ ok: true });
});

export default router;