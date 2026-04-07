const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  quote:  { type: String, default: '' },
  status: { type: String, enum: ['none', 'draft', 'published'], default: 'none' }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  company:     { type: String, default: '' },
  country:     { type: String, default: '' },
  industry:    { type: String, default: '' },
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  productName: { type: String, default: '' },
  modelIds:    [{ type: String }],
  modelNames:  [{ type: String }],
  rating:      { type: Number, min: 1, max: 5, default: 5 },
  // Multilingual quote + publish status per language
  translations: {
    en: { type: translationSchema, default: () => ({}) },
    es: { type: translationSchema, default: () => ({}) },
    de: { type: translationSchema, default: () => ({}) },
    tr: { type: translationSchema, default: () => ({}) },
    fr: { type: translationSchema, default: () => ({}) }
  },
  image:     { type: String, default: '' },
  logo:      { type: String, default: '' },
  featured:  { type: Boolean, default: false },
  caseStudy: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
