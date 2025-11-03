const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const KeywordsByLangSchema = new Schema({
  EN: { type: [String], default: [] },
  ES: { type: [String], default: [] },
  DE: { type: [String], default: [] },
  TR: { type: [String], default: [] },
  FR: { type: [String], default: [] }
}, { _id: false });


const ModelsSchema = new Schema({
    ModelThumbnail: { type: String },
    ModelPhotos: [{ type: String }],
    overviewThumbnail: { type: String },
    modelcapacity: { type: String },
      // ✅ NEW: model-level SEO
  tags:  { type: KeywordsByLangSchema, default: () => ({}) }, // localized keywords
  meta: {
    EN: { title: String, description: String },
    ES: { title: String, description: String },
    DE: { title: String, description: String },
    TR: { title: String, description: String },
    FR: { title: String, description: String }
  },

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
            }],
            publish: {
                type: Boolean,
                default: false
            }
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
            }],
            publish: {
                type: Boolean,
                default: false
            }
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
            }],
            publish: {
                type: Boolean,
                default: false
            }
        }],
        TR: [{
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
            }],
            publish: {
                type: Boolean,
                default: false
            }
        }],
        FR: [{
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
            }],
            publish: {
                type: Boolean,
                default: false
            }
        }]
    },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, required: false }, // ✅ Model slug

}, { timestamps: true });

const productSchema = new Schema({
    ProductThumbnail: { type: String },
    ProductSketch: { type: String },
    
  // ✅ New: SEO fields
  tags: { type: KeywordsByLangSchema, default: () => ({}) },  // localized keyword tags
  meta: {
    EN: { title: String, description: String },
    ES: { title: String, description: String },
    DE: { title: String, description: String },
    TR: { title: String, description: String },
    FR: { title: String, description: String }
  },

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
            },
            publish: {
                type: Boolean,
                default: false
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
            WhyProductDesc: { type: String, required: false },
            publish: {
                type: Boolean,
                default: false
            }
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
            ,
            publish: {
                type: Boolean,
                default: false
            }
        }],
        TR: [{
            features: [{
                FeatureImage: { type: String },
                FeatureName: { type: String },
                FeatureDesc: { type: String }
            }],
            ProductName: { type: String, required: false },          // ✅ No required
            ProductNameDesc: { type: String, required: false },       // ✅ No required
            ProductDesc: { type: String, required: false },           // ✅ No required
            WhyProductDesc: { type: String, required: false }         // ✅ No required
            ,
            publish: {
                type: Boolean,
                default: false
            }
        }],
        FR: [{
            features: [{
                FeatureImage: { type: String },
                FeatureName: { type: String },
                FeatureDesc: { type: String }
            }],
            ProductName: { type: String, required: false },          // ✅ No required
            ProductNameDesc: { type: String, required: false },       // ✅ No required
            ProductDesc: { type: String, required: false },           // ✅ No required
            WhyProductDesc: { type: String, required: false }         // ✅ No required
            ,
            publish: {
                type: Boolean,
                default: false
            }
        }],
    },
    Models: [ModelsSchema],
    isDraft: { type: Boolean, default: false },
    slug: { type: String, required: false, unique: true }, // ✅ Product slug

}, { timestamps: true });

// ✅ Weighted text index for search (names + desc + tags)
productSchema.index({
 // ===== Product fields =====
  'Language.EN.0.ProductName': 'text',
  'Language.EN.0.ProductNameDesc': 'text',
  'Language.EN.0.ProductDesc': 'text',
  'tags.EN': 'text',

  'Language.ES.0.ProductName': 'text',
  'Language.ES.0.ProductDesc': 'text',
  'tags.ES': 'text',

  'Language.DE.0.ProductName': 'text',
  'Language.DE.0.ProductDesc': 'text',
  'tags.DE': 'text',

  'Language.TR.0.ProductName': 'text',
  'Language.TR.0.ProductDesc': 'text',
  'tags.TR': 'text',

  'Language.FR.0.ProductName': 'text',
  'Language.FR.0.ProductDesc': 'text',
  'tags.FR': 'text',

  // ===== Model fields (nested under product.Models[]) =====
  'Models.Language.EN.0.ModelName': 'text',
  'Models.Language.EN.0.ModelDesc': 'text',
  'Models.tags.EN': 'text',

  'Models.Language.ES.0.ModelName': 'text',
  'Models.Language.ES.0.ModelDesc': 'text',
  'Models.tags.ES': 'text',

  'Models.Language.DE.0.ModelName': 'text',
  'Models.Language.DE.0.ModelDesc': 'text',
  'Models.tags.DE': 'text',

  'Models.Language.TR.0.ModelName': 'text',
  'Models.Language.TR.0.ModelDesc': 'text',
  'Models.tags.TR': 'text',

  'Models.Language.FR.0.ModelName': 'text',
  'Models.Language.FR.0.ModelDesc': 'text',
  'Models.tags.FR': 'text'
}, {
  weights: {
    // Product weights
    'Language.EN.0.ProductName': 10,
    'Language.ES.0.ProductName': 10,
    'Language.DE.0.ProductName': 10,
    'Language.TR.0.ProductName': 10,
    'Language.FR.0.ProductName': 10,

    'Language.EN.0.ProductDesc': 5,
    'Language.ES.0.ProductDesc': 5,
    'Language.DE.0.ProductDesc': 5,
    'Language.TR.0.ProductDesc': 5,
    'Language.FR.0.ProductDesc': 5,

    'tags.EN': 8, 'tags.ES': 8, 'tags.DE': 8, 'tags.TR': 8, 'tags.FR': 8,

    // Model weights (mirror products)
    'Models.Language.EN.0.ModelName': 10,
    'Models.Language.ES.0.ModelName': 10,
    'Models.Language.DE.0.ModelName': 10,
    'Models.Language.TR.0.ModelName': 10,
    'Models.Language.FR.0.ModelName': 10,

    'Models.Language.EN.0.ModelDesc': 5,
    'Models.Language.ES.0.ModelDesc': 5,
    'Models.Language.DE.0.ModelDesc': 5,
    'Models.Language.TR.0.ModelDesc': 5,
    'Models.Language.FR.0.ModelDesc': 5,

    'Models.tags.EN': 8, 'Models.tags.ES': 8, 'Models.tags.DE': 8, 'Models.tags.TR': 8, 'Models.tags.FR': 8
  },
  name: 'products_text_index_multilang'
});

module.exports = mongoose.model('Product', productSchema);
