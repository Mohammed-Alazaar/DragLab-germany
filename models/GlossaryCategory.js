// models/GlossaryCategory.js
const mongoose = require('mongoose');

const glossaryCategorySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  slug:      { type: String, required: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlossaryCategory', glossaryCategorySchema);
