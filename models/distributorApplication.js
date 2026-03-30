// models/distributorApplication.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distributorApplicationSchema = new Schema({
  companyName:      { type: String, required: true },
  country:          { type: String, required: true },
  website:          { type: String },
  yearsExperience:  { type: Number },
  currentBrands:    { type: String },
  targetMarket:     { type: String },
  contactName:      { type: String, required: true },
  email:            { type: String, required: true },
  phone:            { type: String },
  companyProfile:   { type: String },
  status: {
    type: String,
    enum: ['new', 'under_review', 'accepted', 'rejected'],
    default: 'new'
  },
  lang:             { type: String, default: 'EN' },
  ipAddress:        { type: String },
  createdAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('DistributorApplication', distributorApplicationSchema);
