// models/accessory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicableModelSchema = new Schema({
  modelId:   { type: Schema.Types.ObjectId },
  modelName: { type: String, default: '' },
  modelSlug: { type: String, default: '' }
}, { _id: false });

const applicableProductSchema = new Schema({
  productId:   { type: Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, default: '' },
  productSlug: { type: String, default: '' },
  models:      [applicableModelSchema]
}, { _id: false });

const langStatusEnum = ['none', 'draft', 'published'];

const accessorySchema = new Schema({
  name:          { type: String, required: true, trim: true },
  slug:          { type: String, required: true, unique: true },
  articleNumber: { type: String, trim: true, default: '' },
  image:         { type: String, default: '' },
  description: {
    en: { type: String, default: '' },
    es: { type: String, default: '' },
    de: { type: String, default: '' },
    tr: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  langStatus: {
    en: { type: String, enum: langStatusEnum, default: 'none' },
    es: { type: String, enum: langStatusEnum, default: 'none' },
    de: { type: String, enum: langStatusEnum, default: 'none' },
    tr: { type: String, enum: langStatusEnum, default: 'none' },
    fr: { type: String, enum: langStatusEnum, default: 'none' }
  },
  applicableProducts: [applicableProductSchema],
  status: {
    type:    String,
    enum:    ['draft', 'published'],
    default: 'draft'
  }
}, { timestamps: true });

accessorySchema.index({ 'langStatus.en': 1 });
accessorySchema.index({ 'langStatus.de': 1 });
accessorySchema.index({ 'langStatus.es': 1 });
accessorySchema.index({ 'langStatus.tr': 1 });
accessorySchema.index({ 'langStatus.fr': 1 });
accessorySchema.index({ 'applicableProducts.productSlug': 1 });
accessorySchema.index({ 'applicableProducts.models.modelId': 1 });

module.exports = mongoose.model('Accessory', accessorySchema);
