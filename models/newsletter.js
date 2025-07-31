const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
  email: { type: String, required: true, unique: true },
  language: { type: String, default: 'EN' },
  subscribedAt: { type: Date, default: Date.now },
  isExtracted: { type: Boolean, default: false },
  ipAddress: { type: String }, // ✅ New field
  geoLocation: {
    country: String,
    region: String,
    city: String,
    isp: String
  }
});



module.exports = mongoose.model('NewsletterSubscriber', newsletterSchema);
