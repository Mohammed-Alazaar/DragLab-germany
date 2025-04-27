// models/contactUs.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isDone: { type: Boolean, default: false }, // Mark as Done or not
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactUs', contactUsSchema);
