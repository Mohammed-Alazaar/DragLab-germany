const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  fileName: String,
  filePath: String,
  fileSize: String,
  language: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const catalogCategorySchema = new Schema({
  categoryName: { type: String, required: true },
  categoryKey: { type: String, required: true, unique: true },
  files: [fileSchema]
});

module.exports = mongoose.models.CatalogCategory || mongoose.model('CatalogCategory', catalogCategorySchema);
