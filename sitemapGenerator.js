const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

// Replace with your domain
const sitemap = new SitemapStream({ hostname: 'https://drag-lab.de/' });
const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

// Static multilingual pages
const staticPages = ['/', '/aboutus', '/products', '/news', '/contact'];

const languages = ['EN', 'ES', 'GR'];

languages.forEach(lang => {
  staticPages.forEach(page => {
    sitemap.write({
      url: `${page}/${lang}`,
      changefreq: 'weekly',
      priority: 0.9
    });
  });
});

// Optionally: generate model/product links dynamically from your DB
// Example:
const productsFromDB = [
  { slug: 'incubator-model-1' },
  { slug: 'waterbath-model-2' },
];

productsFromDB.forEach(product => {
  languages.forEach(lang => {
    sitemap.write({
      url: `/model/${lang}/${product.slug}`,
      changefreq: 'weekly',
      priority: 0.8
    });
  });
});

sitemap.end();

streamToPromise(sitemap).then(() => {
  console.log('✅ Sitemap created at public/sitemap.xml');
});
