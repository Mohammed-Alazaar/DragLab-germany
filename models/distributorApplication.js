// models/distributorApplication.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distributorApplicationSchema = new Schema({
  // Company Information
  companyName:           { type: String, required: true },
  country:               { type: String, required: true },
  website:               { type: String },
  companyOverview:       { type: String },          // required textarea

  // Business & Distribution Capability
  companyEstablished:    { type: String },            // year founded e.g. "2005"
  currentBrands:         { type: String },
  industryFocus:         { type: [String] },           // multi-select
  salesChannels:         { type: [String] },           // multi-select
  salesChannelsOther:    { type: String },            // free-text when "Other" is checked
  annualSalesVolume:     { type: String },

  // Market & Territory
  distributionTerritory: { type: String },
  targetMarket:          { type: String },

  // Supporting Documents
  companyProfileUrl:     { type: String },           // Cloudinary URL

  // Contact
  contactName:           { type: String, required: true },
  email:                 { type: String, required: true },
  phone:                 { type: String },

  // Meta
  companyProfile:        { type: String },           // legacy field
  status: {
    type: String,
    enum: ['new', 'under_review', 'accepted', 'rejected'],
    default: 'new'
  },
  lang:      { type: String, default: 'EN' },
  ipAddress: { type: String },
  isSpam:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DistributorApplication', distributorApplicationSchema);
