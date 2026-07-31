/**
 * migrate-slideshow.js
 *
 * Converts old flat slideshow docs  { language, title, desc, ... }
 * to the current multilingual format { translations: { en: {...}, de: {...}, ... } }
 *
 * Run once:  node migrate-slideshow.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&ssl=true`;

// Use raw schema so we can read old fields without schema enforcement
const Slide = mongoose.model(
  'Slideshow',
  new mongoose.Schema({}, { strict: false, timestamps: true }),
  'slideshows'
);

const LANG_KEYS = ['en', 'es', 'de', 'tr', 'fr'];

function toKey(lang) {
  if (!lang) return null;
  return lang.toLowerCase();
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const all = await Slide.find({}).lean();
  console.log(`Total slides in collection: ${all.length}`);

  let migrated = 0;
  let skipped  = 0;
  let errors   = 0;

  for (const doc of all) {
    // Detect if already in new format
    const hasTrans = doc.translations &&
      LANG_KEYS.some(l => doc.translations[l] && (doc.translations[l].title || doc.translations[l].status === 'published'));

    if (hasTrans) {
      console.log(`  ⏭  Already migrated: _id=${doc._id}`);
      skipped++;
      continue;
    }

    const title  = (doc.title || '').trim();
    const desc   = (doc.desc  || '').trim();
    const langRaw = doc.language || 'ALL';
    const isAll   = langRaw.toUpperCase() === 'ALL';
    const langKeys = isAll ? LANG_KEYS : [toKey(langRaw)].filter(Boolean);

    if (!title && !desc && !doc.image) {
      console.warn(`  ⚠  Skipping _id=${doc._id} — no content`);
      skipped++;
      continue;
    }

    const translations = {};
    for (const l of LANG_KEYS) {
      translations[l] = { title: '', desc: '', status: 'none' };
    }
    for (const l of langKeys) {
      translations[l] = { title, desc, status: 'published' };
    }

    try {
      await Slide.updateOne(
        { _id: doc._id },
        {
          $set:   { translations },
          $unset: { language: '', title: '', desc: '', status: '' }
        }
      );
      console.log(`  ✓  Migrated [${langKeys.join(',')}] "${title.slice(0, 50)}" (_id=${doc._id})`);
      migrated++;
    } catch (err) {
      console.error(`  ✗  Error migrating _id=${doc._id}:`, err.message);
      errors++;
    }
  }

  console.log('\n────────────────────────────────────');
  console.log(`Done.  Migrated: ${migrated}  |  Already up-to-date: ${skipped}  |  Errors: ${errors}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
