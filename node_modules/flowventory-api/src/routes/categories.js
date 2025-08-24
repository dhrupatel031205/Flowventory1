import express from 'express';
import Category from '../models/Category.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (_req, res) => {
  res.json(await Category.find());
});

router.post('/', authRequired, adminOnly, async (req, res) => {
  const created = await Category.create(req.body);
  res.status(201).json(created);
});

router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  
  // Import Item model and Log model
  const Item = (await import('../models/Item.js')).default;
  const Log = (await import('../models/Log.js')).default;
  
  // Find all items using this category
  const itemsUsingCategory = await Item.find({ category: id });
  
  if (itemsUsingCategory.length > 0) {
    // Delete all items that use this category
    const itemIds = itemsUsingCategory.map(item => item.id);
    await Item.deleteMany({ category: id });
    
    // Log the deletion of items for audit purposes
    for (const item of itemsUsingCategory) {
      await Log.create({
        action: 'deleted',
        itemId: item.id,
        itemName: item.name,
        userId: req.user.id,
        userName: req.user.name,
        details: `Item automatically deleted due to category deletion: ${item.name} (SKU: ${item.sku})`
      });
    }
  }
  
  await Category.findByIdAndDelete(id);
  res.json({ 
    ok: true, 
    message: `Category deleted successfully. ${itemsUsingCategory.length > 0 ? `${itemsUsingCategory.length} associated inventory items were also removed.` : ''}`
  });
});

export default router;
