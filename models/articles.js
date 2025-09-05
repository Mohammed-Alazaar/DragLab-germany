// models/article.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title:   { type: String, required: true, trim: true },
  slug:    { type: String, required: true, unique: true, index: true },
  author:  { type: String, trim: true },
  summary: { type: String, trim: true },                 // ✅ NEW (for meta description)
  thumbnail: String,
  body: String,

  // ✅ NEW (drives <meta property="article:section">)
  category: {
    type: String,
    enum: ['News', 'Products', 'Industries', 'Company', 'Tutorials','Scientific', 'Other'],
    default: 'News'
  },

  // ✅ NEW (drives multiple <meta property="article:tag">)
  tags: { type: [String], default: [], index: true },

  language: {
    type: String,
    enum: ['EN', 'ES', 'DE', 'TR', 'FR', 'ALL'],
    default: 'EN',
    required: true
  }
}, { timestamps: true });

// Optional: auto-generate a unique slug if missing or title changed
ArticleSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Ensure uniqueness by suffixing -2, -3, ...
  if (this.isModified('slug')) {
    const base = this.slug;
    let i = 1;
    while (await mongoose.models.Article.findOne({ _id: { $ne: this._id }, slug: this.slug })) {
      i += 1;
      this.slug = `${base}-${i}`;
    }
  }
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
