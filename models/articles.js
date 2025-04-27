const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({

    title: String,
    author: String,
    thumbnail: String,
    body: String,

    language: {
        type: String,
        enum: ['EN', 'ES', 'GR', 'ALL'],
        default: 'EN',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
