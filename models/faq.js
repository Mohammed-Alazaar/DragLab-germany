// models/faq.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationSchema = new Schema({
  question: { type: String, default: '' },
  answer:   { type: String, default: '' },
  status:   { type: String, enum: ['none', 'draft', 'published'], default: 'none' }
}, { _id: false });

const faqSchema = new Schema({
  translations: {
    en: { type: translationSchema, default: () => ({}) },
    es: { type: translationSchema, default: () => ({}) },
    de: { type: translationSchema, default: () => ({}) },
    tr: { type: translationSchema, default: () => ({}) },
    fr: { type: translationSchema, default: () => ({}) }
  },
  category: {
    type: String,
    enum: ['Installation', 'Maintenance', 'Troubleshooting', 'Warranty', 'Product Usage', 'General'],
    default: 'General'
  },
  relatedProducts:     [{ type: String }],
  relatedProductNames: [{ type: String }],
  slug:  { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', faqSchema);
