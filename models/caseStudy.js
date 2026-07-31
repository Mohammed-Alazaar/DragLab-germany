// models/caseStudy.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationBlock = {
  title:         { type: String },
  slug:          { type: String },
  clientProfile: { type: String },
  problem:       { type: String },
  solution:      { type: String },
  results:       { type: String },
  summary:       { type: String },
  status:        { type: String, enum: ['draft', 'published'], default: 'draft' }
};

const caseStudySchema = new Schema({
  title:          { type: String },
  slug:           { type: String },
  clientType:     { type: String },
  clientLocation: { type: String },
  clientSize:     { type: String },
  industry:       { type: String },
  problem:        { type: String },
  solution:       { type: String },
  results:        { type: String },
  productsUsed: [{
    name: { type: String },
    link: { type: String }
  }],
  thumbnail: { type: String },
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

module.exports = mongoose.model('CaseStudy', caseStudySchema);
