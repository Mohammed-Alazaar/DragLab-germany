const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slideSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true // File path to the uploaded image
    },
    language: {
        type: String,
        enum: ['EN', 'ES', 'GR', 'ALL'],
        default: 'EN',
        required: true
      }
      
}, { timestamps: true });

module.exports = mongoose.model('Slideshow', slideSchema);
