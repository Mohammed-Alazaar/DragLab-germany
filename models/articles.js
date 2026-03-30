// models/articles.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationSchema = new Schema({
  title:       { type: String, trim: true, default: '' },
  slug:        { type: String, default: '' },
  body:        { type: String, default: '' },
  summary:     { type: String, trim: true, default: '' },
  tags:        { type: [String], default: [] },
  status:      { type: String, enum: ['none', 'draft', 'published'], default: 'none' },
  publishedAt: { type: Date }
}, { _id: false });

const ArticleSchema = new Schema({
  thumbnail: { type: String, default: '' },
  author:    { type: String, trim: true, default: '' },
  category:  {
    type: String,
    enum: ['News', 'Products', 'Industries', 'Company', 'Tutorials', 'Scientific', 'Other'],
    default: 'News'
  },
  translations: {
    en: { type: translationSchema, default: () => ({}) },
    es: { type: translationSchema, default: () => ({}) },
    de: { type: translationSchema, default: () => ({}) },
    tr: { type: translationSchema, default: () => ({}) },
    fr: { type: translationSchema, default: () => ({}) }
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
