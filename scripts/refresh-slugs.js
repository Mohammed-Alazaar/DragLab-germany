// scripts/refresh-slugs.js
const path = require('path');

// 1) Load .env explicitly from project root
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../models/product'); // make sure the casing matches the file

function generateSlug(text) {
  return slugify(text || 'item', { lower: true, strict: true });
}

// 2) Build MONGODB_URI with multiple fallbacks
const argvUri = process.argv.slice(2).find(a => a.startsWith('--uri='))?.split('=')[1];

const MONGODB_URI =
  argvUri ||
  process.env.MONGODB_URI ||
  (
    process.env.MONGO_USER &&
    process.env.MONGO_PASSWORD &&
    process.env.MONGO_DATABASE &&
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
    `@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&ssl=true`
  );

if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
  console.error('❌ Missing Mongo URI.\n' +
    'Provide one of:\n' +
    '  • .env with MONGODB_URI, or\n' +
    '  • .env with MONGO_USER / MONGO_PASSWORD / MONGO_DATABASE, or\n' +
    '  • CLI: node scripts/refresh-slugs.js --uri="mongodb+srv://user:pass@host/db?options"\n');
  // Helpful debug:
  console.error('Env seen by script:', {
    MONGODB_URI: !!process.env.MONGODB_URI,
    MONGO_USER: !!process.env.MONGO_USER,
    MONGO_PASSWORD: !!process.env.MONGO_PASSWORD,
    MONGO_DATABASE: !!process.env.MONGO_DATABASE,
    envPath: path.resolve(__dirname, '..', '.env'),
  });
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    let pCount = 0, mCount = 0;

    for (const prod of products) {
      const en = prod.Language?.EN?.[0];

      // Product slug from EN ProductName
      if (en?.ProductName) {
        const newSlug = generateSlug(en.ProductName);
        if (prod.slug !== newSlug) {
          prod.slug = newSlug;
          pCount++;
        }
      }

      // Model slugs from EN ModelName
      if (Array.isArray(prod.Models)) {
        for (const model of prod.Models) {
          const me = model.Language?.EN?.[0];
          if (me?.ModelName) {
            const newSlug = generateSlug(me.ModelName);
            if (model.slug !== newSlug) {
              model.slug = newSlug;
              mCount++;
            }
          }
        }
      }

      await prod.save();
    }

    console.log(`🎉 Slugs refreshed. Products updated: ${pCount}, Models updated: ${mCount}`);
    process.exit(0);
  } catch (err) {
    console.error('🔥 Error refreshing slugs:', err);
    process.exit(1);
  }
})();
