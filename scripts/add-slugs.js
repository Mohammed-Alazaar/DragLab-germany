const mongoose = require('mongoose');
const slugify = require('slugify');
const Article  = require('../models/articles'); // adjust path if different

const  MONGODB_URI = `mongodb+srv://mhmdalazr:SvKVmOXSRO2tqN4J@cluster0.yrit4.mongodb.net/test?retryWrites=true&w=majority&ssl=true`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  return addSlugsToArticles();
}).catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});

async function addSlugsToArticles() {
  try {
    const articles = await Article.find({ slug: { $exists: false } });

    for (const article of articles) {
      const baseSlug = slugify(article.title || 'untitled-article', { lower: true, strict: true });
      let uniqueSlug = baseSlug;
      let counter = 1;

      // Ensure the slug is unique
      while (await Article.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      article.slug = uniqueSlug;
      await article.save();
      console.log(`✅ Updated article: "${article.title}" → ${article.slug}`);
    }

    console.log('🎉 Slug generation complete.');
    process.exit(0);
  } catch (err) {
    console.error('🔥 Error during slug generation:', err);
    process.exit(1);
  }
}