const mongoose = require('mongoose');

const industryPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  sharedImages: {
    slideImage: String,
    introImage: String,
  },
  Language: {
    EN: [{
      slideTitle: String,
      slideSubTitle: String,
      slideDesc: String,
      introTitle: String,
      introDesc: String,
      features: [{
        FeatureName: String,
        FeatureDesc: String,
        FeatureImage: String
      }]
    }],
    ES: [{ slideTitle: String, slideSubTitle: String, slideDesc: String, introTitle: String, introDesc: String, features: [{ FeatureName: String, FeatureDesc: String }] }],
    DE: [{ slideTitle: String, slideSubTitle: String, slideDesc: String, introTitle: String, introDesc: String, features: [{ FeatureName: String, FeatureDesc: String }] }]
  },
  isDraft: Boolean
});

module.exports = mongoose.model('IndustryPage', industryPageSchema);
