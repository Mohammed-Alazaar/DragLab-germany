const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const technicalServiceSchema = new Schema({
    infoType: { type: String, enum: ['company', 'private'], required: true },
    company: { type: String },
    department: { type: String },
    salutation: { type: String, enum: ['Mrs/Ms', 'Mr'] },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    postalTown: { type: String },
    street: { type: String },
    country: { type: String },
    telephone: { type: String },
    telefax: { type: String },
    email: { type: String, required: true },

    failureDate: { type: Date },
    deviceCategory: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    deviceModel: { type: Schema.Types.ObjectId }, // ✅ no ref
    serialNo: { type: String },
    note: { type: String },

    lang: { type: String, default: 'EN' },
    dateSubmitted: { type: Date, default: Date.now },
    status: { type: String, default: 'pending', enum: ['pending', 'done'] }

}, { timestamps: true });

module.exports = mongoose.model('TechnicalService', technicalServiceSchema);
