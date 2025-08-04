const mongoose = require('mongoose');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');
require('dotenv').config(); // Load env variables
const fs = require('fs');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const Product = require('./models/product');
const Article = require('./models/articles');
const Industry = require('./models/IndustryPage'); // Adjust path as needed

(async () => {
  await mongoose.connect(MONGODB_URI);

  const sitemap = new SitemapStream({ hostname: 'https://www.drag-lab.de/' });

  // ✅ Ensure 'public' folder exists before writing sitemap.xml
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }




  const writeStream = createWriteStream(path.join(__dirname, 'public', 'sitemap.xml'));
  sitemap.pipe(writeStream);

  const staticPages = ['/', '/aboutus', '/technical-service', '/Articles', '/support', '/Downloads', '/TermCondition', '/PrivacyPolicy', '/DataProtection', '/imprint', '/CodeofEthics', '/QualityPolicy', '/WarrantyRegistration', '/Industry', '/Qualifications', '/SustainabilityPolicy', '/licenses'];
  const languages = ['EN', 'ES', 'DE'];

  // ✅ Add static pages
  languages.forEach(lang => {
    staticPages.forEach(page => {
      sitemap.write({
        url: `/${lang}${page}`,
        changefreq: 'weekly',
        priority: 0.9
      });
    });
  });

  // ✅ Add product and model pages from a single query
  console.log('🔎 Fetching products...');
  const products = await Product.find({ isDraft: false }, 'slug Models');
  console.log('✅ Products found:', products.length);

  products.forEach(product => {
    console.log(`➡️ Writing product: ${product.slug}`); // 👈 ADD THIS LINE
    // Product pages
    languages.forEach(lang => {
      sitemap.write({
        url: `/${lang}/products/${product.slug}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Model pages
    if (product.Models && product.Models.length > 0) {
      product.Models.forEach(model => {
        if (model.slug && model.isPublished) {
          console.log(`🧩 Writing model: ${model.slug}`); // 👈 ADD THIS TOO

          languages.forEach(lang => {
            sitemap.write({
              url: `/${lang}/products/${product.slug}/${model.slug}`,
              changefreq: 'weekly',
              priority: 0.7
            });
          });
        }
      });

    }
  });

  console.log('📰 Fetching articles...');
const articles = await Article.find({}, 'slug language');

console.log('✅ Articles found:', articles.length);

articles.forEach(article => {
  if (article.slug && ['EN', 'ES', 'DE'].includes(article.language)) {
    sitemap.write({
      url: `/${article.language}/articles/${article.slug}`,
      changefreq: 'monthly',
      priority: 0.6
    });
  }
});




  console.log('🏭 Fetching industries...');
  const industries = await Industry.find({}, 'slug');
  console.log('✅ Industries found:', industries.length);

  industries.forEach(industry => {
    if (industry.slug) {
      languages.forEach(lang => {
        sitemap.write({
          url: `/${lang}/industry/${industry.slug}`,
          changefreq: 'monthly',
          priority: 0.6
        });
      });
    }
  });


  await streamToPromise(sitemap);
  sitemap.end();
  console.log('✅ Sitemap created at public/sitemap.xml');

  mongoose.disconnect();
})();
