import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Item from '../models/Item.js';
import Log from '../models/Log.js';

// Resolve __dirname in ESM and load .env from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flowventory';

function codeFromName(name) {
  return name
    .split(/\s|&|\-/)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase())
    .join('')
    .slice(0, 3);
}

function makeStatusFromQty(qty) {
  if (qty <= 0) return 'out-of-stock';
  if (qty <= 10) return 'low-stock';
  return 'in-stock';
}

async function run() {
  console.log('WARNING: This will delete existing Users, Categories, Brands, Items, Logs');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Item.deleteMany({}),
    Log.deleteMany({}),
  ]);

  // Users
  const adminPass = await bcrypt.hash('admin123', 10);
  const staffPass = await bcrypt.hash('staff123', 10);
  const [admin, staff] = await User.insertMany([
    { name: 'Admin User', email: 'admin@flowenventory.com', role: 'admin', passwordHash: adminPass, isActive: true },
    { name: 'Staff User', email: 'staff@flowenventory.com', role: 'staff', passwordHash: staffPass, isActive: true },
  ]);

  // Categories
  const categoryData = [
    { name: 'Electronics', description: 'Electronic devices and components' },
    { name: 'Office Supplies', description: 'General office and stationery items' },
    { name: 'Furniture', description: 'Office and commercial furniture' },
    { name: 'Appliances', description: 'Home and office appliances' },
    { name: 'Tools', description: 'Hand tools and power tools' },
    { name: 'Clothing', description: 'Uniforms and workwear' },
    { name: 'Food & Beverage', description: 'Consumables for pantry and break rooms' },
    { name: 'Health & Safety', description: 'PPE and safety equipment' },
    { name: 'Networking', description: 'Routers, switches, cables' },
    { name: 'Storage', description: 'Storage media and accessories' },
  ];
  const categories = await Category.insertMany(categoryData);

  // Brands
  const brandData = [
    { name: 'TechCorp' },
    { name: 'OfficeMax' },
    { name: 'FurniturePlus' },
    { name: 'HomePro' },
    { name: 'ToolMaster' },
    { name: 'FashionCo' },
    { name: 'FreshFoods' },
    { name: 'SafeGuard' },
    { name: 'NetGearPro' },
    { name: 'DataBox' },
  ];
  const brands = await Brand.insertMany(brandData);

  // Generate Items
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[random(0, arr.length - 1)];

  const itemNamesByCategory = {
    Electronics: ['Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub', '27" Monitor', 'Webcam HD', 'Bluetooth Speaker', 'External SSD', 'Noise-cancel Headset'],
    'Office Supplies': ['Printer Paper A4', 'Gel Pens Pack', 'Sticky Notes', 'Stapler Pro', 'File Folders', 'Desk Organizer', 'Whiteboard Markers', 'Highlighter Set'],
    Furniture: ['Ergo Office Chair', 'Standing Desk', 'Filing Cabinet', 'Bookshelf', 'Meeting Table', 'Visitor Chair'],
    Appliances: ['Microwave Oven', 'Mini Fridge', 'Air Purifier', 'Coffee Machine'],
    Tools: ['Cordless Drill', 'Tool Kit 50pc', 'Screwdriver Set', 'Measuring Tape', 'Hammer Pro'],
    Clothing: ['Safety Vest', 'Work Gloves', 'Hard Hat', 'Steel Toe Boots', 'Lab Coat'],
    'Food & Beverage': ['Bottled Water 24pk', 'Organic Coffee Beans', 'Green Tea Bags', 'Chocolate Cookies'],
    'Health & Safety': ['First Aid Kit', 'Face Masks Box', 'Hand Sanitizer 500ml', 'Safety Goggles'],
    Networking: ['Gigabit Router', 'Managed Switch 24p', 'Cat6 Cable 30m', 'WiFi Range Extender'],
    Storage: ['USB Drive 64GB', 'External HDD 2TB', 'SD Card 128GB', 'NAS Enclosure'],
  };

  const items = [];
  let skuCounter = 1;
  for (const cat of categories) {
    const catNames = itemNamesByCategory[cat.name] || [`${cat.name} Item`];
    const catCode = codeFromName(cat.name);
    for (let i = 0; i < 5; i++) { // ~5 per category ⇒ ~50 total
      const brand = pick(brands);
      const name = pick(catNames);
      const price = parseFloat((random(5, 1500) + Math.random()).toFixed(2));
      const quantity = random(0, 120);
      const status = makeStatusFromQty(quantity);
      const creator = Math.random() < 0.6 ? admin : staff;
      const brandCode = codeFromName(brand.name);
      const sku = `${catCode}-${brandCode}-${String(skuCounter).padStart(4, '0')}`;
      skuCounter += 1;

      items.push({
        name,
        sku,
        quantity,
        price,
        description: `${name} by ${brand.name} in ${cat.name} category`,
        status,
        category: cat.id,
        brand: brand.id,
        createdBy: creator.id,
      });
    }
  }

  const insertedItems = await Item.insertMany(items);

  // Generate Activity Logs (created/updated/deleted)
  const actions = ['created', 'updated', 'deleted'];
  const logsToInsert = [];
  for (let i = 0; i < 60; i++) {
    const item = pick(insertedItems);
    const actor = Math.random() < 0.7 ? admin : staff;
    const action = pick(actions);
    const details =
      action === 'created'
        ? `Initial stock added: ${item.quantity}`
        : action === 'updated'
        ? `Adjusted price to ${item.price}`
        : 'Item removed from shelf (logical)';

    logsToInsert.push({
      action,
      itemId: item.id,
      itemName: item.name,
      userId: actor.id,
      userName: actor.name,
      details,
    });
  }
  await Log.insertMany(logsToInsert);

  console.log(`Seeded: Users(${2}), Categories(${categories.length}), Brands(${brands.length}), Items(${insertedItems.length}), Logs(${logsToInsert.length})`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});