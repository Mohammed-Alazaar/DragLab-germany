// models/contactUs.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
  firstName:     { type: String, required: true },
  lastName:      { type: String, required: true },
  subject:       { type: String, required: true },
  email:         { type: String, required: true },
  message:       { type: String, required: true },
  isDone:        { type: Boolean, default: false },
  isSpam:        { type: Boolean, default: false },
  dateSubmitted: { type: Date, default: Date.now },
  lang:          { type: String, default: 'EN' },
  ipAddress:     { type: String },
  userAgent:     { type: String },
  referrer:      { type: String },
  geoLocation: {
    country: String,
    region:  String,
    city:    String,
    isp:     String
  }
});

module.exports = mongoose.model('ContactUs', contactUsSchema);
