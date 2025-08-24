import express from 'express';
import Brand from '../models/Brand.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (_req, res) => {
  res.json(await Brand.find());
});

router.post('/', authRequired, adminOnly, async (req, res) => {
  const created = await Brand.create(req.body);
  res.status(201).json(created);
});

router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const updated = await Brand.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  
  // Import Item model and Log model
  const Item = (await import('../models/Item.js')).default;
  const Log = (await import('../models/Log.js')).default;
  
  // Find all items using this brand
  const itemsUsingBrand = await Item.find({ brand: id });
  
  if (itemsUsingBrand.length > 0) {
    // Delete all items that use this brand
    const itemIds = itemsUsingBrand.map(item => item.id);
    await Item.deleteMany({ brand: id });
    
    // Log the deletion of items for audit purposes
    for (const item of itemsUsingBrand) {
      await Log.create({
        action: 'deleted',
        itemId: item.id,
        itemName: item.name,
        userId: req.user.id,
        userName: req.user.name,
        details: `Item automatically deleted due to brand deletion: ${item.name} (SKU: ${item.sku})`
      });
    }
  }
  
  await Brand.findByIdAndDelete(id);
  res.json({ 
    ok: true, 
    message: `Brand deleted successfully. ${itemsUsingBrand.length > 0 ? `${itemsUsingBrand.length} associated inventory items were also removed.` : ''}`
  });
});

export default router;
