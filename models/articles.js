const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({

    title: String,
    author: String,
    thumbnail: String,
    body: String,
  slug: { type: String, required: true, unique: true }, // ✅ ADD THIS

    language: {
        type: String,
        enum: ['EN', 'ES', 'DE', 'ALL'],
        default: 'EN',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
