const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warrantyRegistrationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  datePurchased: { type: Date, required: true },
  deviceCategory: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  deviceModel: { type: Schema.Types.ObjectId, required: true }, // subdocument
  serialNo: { type: String, required: true },
  message: { type: String },
  lang: { type: String, default: 'EN' },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('WarrantyRegistration', warrantyRegistrationSchema);
