// models/glossary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationBlock = {
  term:        { type: String },
  definition:  { type: String },
  description: { type: String },
  status:      { type: String, enum: ['draft', 'published'], default: 'draft' }
};

const glossarySchema = new Schema({
  term:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  definition:  { type: String, required: true },
  description: { type: String },
  letter:      { type: String, maxlength: 1 },
  category: { type: String, default: '' },
  relatedProducts: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  translations: {
    en: translationBlock,
    es: translationBlock,
    de: translationBlock,
    tr: translationBlock,
    fr: translationBlock
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Glossary', glossarySchema);
