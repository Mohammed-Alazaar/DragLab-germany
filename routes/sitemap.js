const express = require('express');
const Article = require('../models/articles');
const Product = require('../models/product');
const IndustryPage = require('../models/IndustryPage');

const router = express.Router();
const SITE = 'https://www.drag-lab.de';
const ALL_LANGS = ['EN', 'ES', 'DE', 'TR', 'FR'];

// Static pages (same for every language)
const STATIC_PAGES = [
  { path: '/',                    changefreq: 'weekly',  priority: '1.0' },
  { path: '/aboutus',             changefreq: 'weekly',  priority: '0.9' },
  { path: '/technical-service',   changefreq: 'weekly',  priority: '0.9' },
  { path: '/Articles',            changefreq: 'weekly',  priority: '0.8' },
  { path: '/support',             changefreq: 'weekly',  priority: '0.9' },
  { path: '/Downloads',           changefreq: 'weekly',  priority: '0.8' },
  { path: '/Industry',            changefreq: 'weekly',  priority: '0.8' },
  { path: '/Qualifications',      changefreq: 'monthly', priority: '0.7' },
  { path: '/QualityPolicy',       changefreq: 'monthly', priority: '0.6' },
  { path: '/SustainabilityPolicy',changefreq: 'monthly', priority: '0.6' },
  { path: '/CodeofEthics',        changefreq: 'monthly', priority: '0.6' },
  { path: '/WarrantyRegistration',changefreq: 'monthly', priority: '0.6' },
  { path: '/TermCondition',       changefreq: 'monthly', priority: '0.5' },
  { path: '/PrivacyPolicy',       changefreq: 'monthly', priority: '0.5' },
  { path: '/DataProtection',      changefreq: 'monthly', priority: '0.5' },
  { path: '/imprint',             changefreq: 'monthly', priority: '0.5' },
  { path: '/licenses',            changefreq: 'monthly', priority: '0.5' },
];

function escXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

function urlEntry(loc, lastmod, changefreq, priority) {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${escXml(loc)}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Sitemap index — references all sub-sitemaps
router.get('/sitemap.xml', (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  const sitemaps = ['sitemap-pages.xml', 'sitemap-products.xml', 'sitemap-articles.xml', 'sitemap-industry.xml'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>\n    <loc>${SITE}/${s}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`).join('\n')}
</sitemapindex>`;
  res.set('Content-Type', 'application/xml; charset=UTF-8');
  res.send(xml);
});

// Static pages sitemap — generated dynamically from STATIC_PAGES list
router.get('/sitemap-pages.xml', (req, res) => {
  const entries = [];
  for (const lang of ALL_LANGS) {
    for (const page of STATIC_PAGES) {
      entries.push(urlEntry(`${SITE}/${lang}${page.path}`, null, page.changefreq, page.priority));
    }
  }
  res.set('Content-Type', 'application/xml; charset=UTF-8');
  res.send(buildUrlset(entries));
});

// Dynamic products + models sitemap
router.get('/sitemap-products.xml', async (req, res) => {
  try {
    const products = await Product.find({})
      .select(['slug', 'updatedAt', 'createdAt', 'Language', 'Models.slug', 'Models.Language'])
      .lean();

    const entries = [];

    for (const p of products) {
      if (!p.slug) continue;
      const lastmod = p.updatedAt || p.createdAt
        ? new Date(p.updatedAt || p.createdAt).toISOString().split('T')[0]
        : null;

      for (const lang of ALL_LANGS) {
        const published = p.Language?.[lang]?.[0]?.publish === true;
        if (!published) continue;
        entries.push(urlEntry(`${SITE}/${lang}/products/${p.slug}`, lastmod, 'weekly', '0.9'));

        for (const model of (p.Models || [])) {
          if (!model.slug) continue;
          const modelPublished = model.Language?.[lang]?.[0]?.publish === true;
          if (!modelPublished) continue;
          entries.push(urlEntry(`${SITE}/${lang}/products/${p.slug}/${model.slug}`, lastmod, 'weekly', '0.8'));
        }
      }
    }

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.send(buildUrlset(entries));
  } catch (err) {
    console.error('Sitemap products error:', err);
    res.status(500).send('Error generating products sitemap');
  }
});

// Dynamic articles sitemap
router.get('/sitemap-articles.xml', async (req, res) => {
  try {
    const articles = await Article.find({})
      .select('slug language createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    const entries = [];
    for (const a of articles) {
      const langs = (a.language === 'ALL') ? ALL_LANGS : [a.language];
      const lastmod = (a.updatedAt || a.createdAt)
        ? new Date(a.updatedAt || a.createdAt).toISOString().split('T')[0]
        : null;

      for (const l of langs) {
        entries.push(urlEntry(`${SITE}/${l}/articles/${a.slug}`, lastmod, 'monthly', '0.7'));
      }
    }

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.send(buildUrlset(entries));
  } catch (err) {
    console.error('Sitemap articles error:', err);
    res.status(500).send('Error generating articles sitemap');
  }
});

// Dynamic industry pages sitemap
router.get('/sitemap-industry.xml', async (req, res) => {
  try {
    const pages = await IndustryPage.find({})
      .select('slug updatedAt createdAt')
      .lean();

    const entries = [];
    for (const page of pages) {
      if (!page.slug) continue;
      const lastmod = page.updatedAt || page.createdAt
        ? new Date(page.updatedAt || page.createdAt).toISOString().split('T')[0]
        : null;

      for (const lang of ALL_LANGS) {
        entries.push(urlEntry(`${SITE}/${lang}/industry/${page.slug}`, lastmod, 'monthly', '0.7'));
      }
    }

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.send(buildUrlset(entries));
  } catch (err) {
    console.error('Sitemap industry error:', err);
    res.status(500).send('Error generating industry sitemap');
  }
});

module.exports = router;
