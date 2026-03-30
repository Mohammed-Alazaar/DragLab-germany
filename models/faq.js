// models/faq.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  category: {
    type: String,
    enum: ['Installation', 'Maintenance', 'Troubleshooting', 'Warranty', 'Product Usage', 'General'],
    default: 'General'
  },
  relatedProducts: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  lang:  { type: String, default: 'EN' },
  slug:  { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', faqSchema);
