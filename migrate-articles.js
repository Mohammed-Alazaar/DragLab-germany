/**
 * migrate-articles.js
 *
 * Converts old flat articles  { language, title, body, slug, ... }
 * to the current multilingual format { translations: { en: {...}, de: {...}, ... } }
 *
 * Run once:  node migrate-articles.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

// ── Connection ──────────────────────────────────────────────────────────────
const MONGODB_URI = `mongodb+srv://mhmdalazr:${process.env.MONGO_PASSWORD}@cluster0.r8u1rna.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority&ssl=true`;

// ── Article model (use the raw collection, no schema enforcement) ────────────
const Article = mongoose.model(
  'Article',
  new mongoose.Schema({}, { strict: false, timestamps: true }),
  'articles'
);

const LANG_KEYS = ['en', 'es', 'de', 'tr', 'fr'];

function toKey(lang) {
  if (!lang) return null;
  return lang.toLowerCase();
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find every article that is still in the old format.
  // Old format: has a top-level `language` field OR has a top-level `title` field.
  // New format: has a `translations` object with at least one language key populated.
  const all = await Article.find({}).lean();
  console.log(`Total articles in collection: ${all.length}`);

  let migrated  = 0;
  let skipped   = 0;
  let errors    = 0;

  for (const doc of all) {
    // ── Detect whether this document is already in the new format ────────────
    const hasTrans = doc.translations &&
      LANG_KEYS.some(l => doc.translations[l] && doc.translations[l].title);

    if (hasTrans) {
      skipped++;
      continue; // Already migrated
    }

    // ── Build the new translations object from the old flat fields ───────────
    const title     = (doc.title   || '').trim();
    const slug      = (doc.slug    || '').trim();
    const body      = doc.body     || '';
    const summary   = (doc.summary || '').trim();
    const tags      = Array.isArray(doc.tags) ? doc.tags : [];
    const oldStatus = (doc.status  || '').toLowerCase();
    const status    = (oldStatus === 'published' || oldStatus === 'active' || !oldStatus) ? 'published' : 'draft';
    const publishedAt = doc.publishedAt || doc.createdAt || new Date();

    const langRaw  = doc.language || 'EN';
    const isAll    = langRaw.toUpperCase() === 'ALL';
    const langKeys = isAll ? LANG_KEYS : [toKey(langRaw)].filter(Boolean);

    // Only migrate documents that have at least a title or body
    if (!title && !body) {
      console.warn(`  ⚠  Skipping _id=${doc._id} — no title and no body`);
      skipped++;
      continue;
    }

    const translations = {};
    // Initialise every language as empty so the model is consistent
    for (const l of LANG_KEYS) {
      translations[l] = { title: '', slug: '', body: '', summary: '', tags: [], status: 'none' };
    }
    // Fill in the languages that have content
    for (const l of langKeys) {
      translations[l] = { title, slug, body, summary, tags, status, publishedAt };
    }

    try {
      await Article.updateOne(
        { _id: doc._id },
        {
          $set:   { translations },
          $unset: { language: '', title: '', slug: '', body: '', summary: '', tags: '', status: '' }
        }
      );
      console.log(`  ✓  Migrated [${langKeys.join(',')}] "${title.slice(0, 60)}" (_id=${doc._id})`);
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
