const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelsSchema = new Schema({
    ModelThumbnail: { type: String },
    ModelPhotos: [{ type: String }],
    overviewThumbnail: { type: String },
    modelcapacity: { type: String },
    Language: {
        EN: [{
            ModelName: { type: String },
            ModelNameDesc: { type: String },
            ModelDesc: { type: String },
            overview: [{
                overviewName: { type: String },
                overviewDesc: { type: String },
                overviewImage: { type: String }
            }],
            industry: [{
                industryName: { type: String },
                industryImage: { type: String },
                industryLogo: { type: String }
            }],
            technicalSpecifications: [{
                sectionTitle: { type: String },
                rows: [{
                    title: { type: String },
                    value: { type: String }
                }]
            }],
            downloads: [{
                fileName: String,
                filePath: String,
                fileSize: String,
                fileCategory: String,
                fileProductCategory: String
            }]
        }],
        ES: [{
            ModelName: { type: String },
            ModelNameDesc: { type: String },
            ModelDesc: { type: String },
            ModelApplications: { type: String },
            overview: [{
                overviewName: { type: String },
                overviewDesc: { type: String }
            }],
            industry: [{
                industryName: { type: String }
            }],
            technicalSpecifications: [{
                sectionTitle: { type: String },
                rows: [{
                    title: { type: String },
                    value: { type: String }
                }]
            }],
            downloads: [{
                fileName: String,
                filePath: String,
                fileSize: String,
                fileCategory: String,
                fileProductCategory: String
            }]
        }],
        DE: [{
            ModelName: { type: String },
            ModelNameDesc: { type: String },
            ModelDesc: { type: String },
            ModelApplications: { type: String },
            overview: [{
                overviewName: { type: String },
                overviewDesc: { type: String }
            }],
            industry: [{
                industryName: { type: String }
            }],
            technicalSpecifications: [{
                sectionTitle: { type: String },
                rows: [{
                    title: { type: String },
                    value: { type: String }
                }]
            }],
            downloads: [{
                fileName: String,
                filePath: String,
                fileSize: String,
                fileCategory: String,
                fileProductCategory: String
            }]
        }]
    },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, required: false }, // ✅ Model slug

}, { timestamps: true });

const productSchema = new Schema({
    ProductThumbnail: { type: String },
    ProductSketch: { type: String },
    Language: {
        EN: [{
            features: [{
                FeatureImage: { type: String },
                FeatureName: { type: String },
                FeatureDesc: { type: String }
            }],
            ProductName: {
                type: String,
                required: function () {
                    return !this.parent().parent().isDraft;
                }
            },
            ProductNameDesc: {
                type: String,
                required: function () {
                    return !this.parent().parent().isDraft;
                }
            },
            ProductDesc: {
                type: String,
                required: function () {
                    return !this.parent().parent().isDraft;
                }
            },
            WhyProductDesc: {
                type: String,
                required: function () {
                    return !this.parent().parent().isDraft;
                }
            }
        }],
        ES: [{
            features: [{
                FeatureImage: { type: String },
                FeatureName: { type: String },
                FeatureDesc: { type: String }
            }],
            ProductName: { type: String, required: false },          // ✅ No required
            ProductNameDesc: { type: String, required: false },       // ✅ No required
            ProductDesc: { type: String, required: false },           // ✅ No required
            WhyProductDesc: { type: String, required: false }         // ✅ No required
        }],
        DE: [{
            features: [{
                FeatureImage: { type: String },
                FeatureName: { type: String },
                FeatureDesc: { type: String }
            }],
            ProductName: { type: String, required: false },          // ✅ No required
            ProductNameDesc: { type: String, required: false },       // ✅ No required
            ProductDesc: { type: String, required: false },           // ✅ No required
            WhyProductDesc: { type: String, required: false }         // ✅ No required
        }]
    },
    Models: [ModelsSchema],
    isDraft: { type: Boolean, default: false },
    slug: { type: String, required: false, unique: true }, // ✅ Product slug

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
