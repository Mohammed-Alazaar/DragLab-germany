const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slideTranslationSchema = new Schema({
  title:       { type: String, trim: true, default: '' },
  desc:        { type: String, trim: true, default: '' },
  buttonLabel: { type: String, trim: true, default: '' },  // e.g. "View Products"
  buttonLink:  { type: String, trim: true, default: '' },  // e.g. /en/products/water-bath-series
  status:      { type: String, enum: ['none', 'draft', 'published'], default: 'none' }
}, { _id: false });

const slideSchema = new Schema({
  image: { type: String, default: '' },
  translations: {
    en: { type: slideTranslationSchema, default: () => ({}) },
    es: { type: slideTranslationSchema, default: () => ({}) },
    de: { type: slideTranslationSchema, default: () => ({}) },
    tr: { type: slideTranslationSchema, default: () => ({}) },
    fr: { type: slideTranslationSchema, default: () => ({}) }
  }
}, { timestamps: true });

module.exports = mongoose.model('Slideshow', slideSchema);
