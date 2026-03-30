// models/quote.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  companyName:      { type: String, required: true },
  country:          { type: String, required: true },
  industry:         { type: String },
  contactName:      { type: String },
  email:            { type: String, required: true },
  phone:            { type: String },
  productCategory:  { type: String },
  productModel:     { type: String },
  quantity:         { type: String },
  message:          { type: String },
  fileAttachment:   { type: String },
  deliveryDeadline: { type: Date },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  lang:             { type: String, default: 'EN' },
  ipAddress:        { type: String },
  isSpam:           { type: Boolean, default: false },
  createdAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
