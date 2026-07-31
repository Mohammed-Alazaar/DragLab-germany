/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');
const fs = require('fs');

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const Product = require('./models/product');
const Article = require('./models/articles');
const Industry = require('./models/IndustryPage');

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('🔌 Connected to MongoDB');

  const hostname = 'https://www.drag-lab.de';
  const sitemap = new SitemapStream({ hostname });

  // ensure ./public exists
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const outPath = path.join(publicDir, 'sitemap.xml');
  const writeStream = createWriteStream(outPath);
  sitemap.pipe(writeStream);

  const languages = ['EN', 'ES', 'DE', 'FR', 'TR'];
  const staticPages = [
    '/', '/aboutus', '/technical-service', '/Articles', '/support', '/Downloads',
    '/TermCondition', '/PrivacyPolicy', '/DataProtection', '/imprint',
    '/CodeofEthics', '/QualityPolicy', '/WarrantyRegistration',
    '/Industry', '/Qualifications', '/SustainabilityPolicy', '/licenses'
  ];

  // --- URL de-dup guard
  const urls = new Set();
  const writeUrl = (url, opts = {}) => {
    if (!urls.has(url)) {
      sitemap.write({ url, changefreq: opts.changefreq || 'weekly', priority: opts.priority ?? 0.5 });
      urls.add(url);
    }
  };

  // --- Static pages
  languages.forEach(lang => {
    staticPages.forEach(page => {
      writeUrl(`/${lang}${page}`, { changefreq: 'weekly', priority: 0.9 });
    });
  });

  // --- Products & Models
  console.log('🔎 Fetching products...');
  // Pull only what we need
  const products = await Product
    .find({ isDraft: false }, { slug: 1, Models: 1 })
    .lean();

  // De-duplicate products by slug (first doc wins)
  const seenProductSlugs = new Set();
  let productCount = 0;
  let modelCount = 0;

  for (const product of products) {
    if (!product.slug) continue;
    if (seenProductSlugs.has(product.slug)) continue;
    seenProductSlugs.add(product.slug);
    productCount++;

    // product page per language
    languages.forEach(lang => {
      writeUrl(`/${lang}/products/${product.slug}`, { changefreq: 'weekly', priority: 0.8 });
    });

    // model pages per language
    const seenModelSlugs = new Set();
    if (Array.isArray(product.Models)) {
      for (const model of product.Models) {
        // guard: published & has slug
        if (!model || !model.slug || model.isPublished !== true) continue;
        if (seenModelSlugs.has(model.slug)) continue;
        seenModelSlugs.add(model.slug);
        modelCount++;

        languages.forEach(lang => {
          writeUrl(
            `/${lang}/products/${product.slug}/${model.slug}`,
            { changefreq: 'weekly', priority: 0.7 }
          );
        });
      }
    }
  }
  console.log(`✅ Unique products: ${productCount}, unique models: ${modelCount}`);

  // --- Articles
  console.log('📰 Fetching articles...');
  const articles = await Article.find({}, { slug: 1, language: 1 }).lean();
  const validLang = new Set(languages);
  const seenArticleKeys = new Set();
  let articleCount = 0;

  for (const a of articles) {
    if (!a?.slug || !a?.language || !validLang.has(a.language)) continue;
    const key = `${a.language}:${a.slug}`;
    if (seenArticleKeys.has(key)) continue;
    seenArticleKeys.add(key);
    articleCount++;

    writeUrl(`/${a.language}/articles/${a.slug}`, { changefreq: 'monthly', priority: 0.6 });
  }
  console.log(`✅ Unique articles: ${articleCount}`);

  // --- Industries
  console.log('🏭 Fetching industries...');
  const industries = await Industry.find({}, { slug: 1 }).lean();
  const seenIndustrySlugs = new Set();
  let industryCount = 0;

  for (const ind of industries) {
    if (!ind?.slug) continue;
    if (seenIndustrySlugs.has(ind.slug)) continue;
    seenIndustrySlugs.add(ind.slug);
    industryCount++;

    languages.forEach(lang => {
      writeUrl(`/${lang}/industry/${ind.slug}`, { changefreq: 'monthly', priority: 0.6 });
    });
  }
 // ...everything above stays the same...

  console.log(`✅ Unique industries: ${industryCount}`);

  // ✅ 1) signal we're done writing
  sitemap.end();

  // ✅ 2) wait for the sitemap stream to finish
  await streamToPromise(sitemap);

  // ✅ 3) wait for file to flush to disk
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log(`🎯 Wrote ${urls.size} unique URLs`);
  console.log('✅ Sitemap created at public/sitemap.xml');

  // ✅ 4) clean shutdown
  await mongoose.disconnect();
  process.exit(0);
})();
