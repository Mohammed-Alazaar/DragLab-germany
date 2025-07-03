const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
  email: { type: String, required: true, unique: true },
  language: { type: String, default: 'EN' },
  subscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewsletterSubscriber', newsletterSchema);
