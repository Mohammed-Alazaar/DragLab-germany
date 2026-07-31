// routes/feed.js
const express = require('express');
const Article = require('../models/articles');
const validateLang = require('../middleware/validate-lang');
const router = express.Router();

// Validate :lang param on every route in this router
router.param('lang', validateLang);

router.get('/:lang/feed.xml', async (req, res, next) => {
  try {
    // Dynamically import Feed class from the ESM package
    const { Feed } = await import('feed');

    const lang = (req.params.lang || 'EN').toUpperCase();
    const siteUrl = 'https://www.drag-lab.de';

    const feed = new Feed({
      title: `DragLab Articles (${lang})`,
      description: 'Latest articles from DragLab',
      id: `${siteUrl}/${lang}/`,
      link: `${siteUrl}/${lang}/`,
      language: lang === 'EN' ? 'en' : lang === 'ES' ? 'es' : 'de',
      favicon: `${siteUrl}/assets/Imgs/logo/favicon.png`,
      generator: 'DragLab Feed',
    });

    const articles = await Article.find({ language: { $in: [lang, 'ALL'] } })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    articles.forEach(a => {
      const url = `${siteUrl}/${lang}/articles/${a.slug}`;
      const image = a.thumbnail?.startsWith('http') ? a.thumbnail : (a.thumbnail ? `${siteUrl}${a.thumbnail}` : undefined);
      feed.addItem({
        title: a.title,
        id: url,
        link: url,
        description: a.summary || undefined,
        date: a.createdAt || new Date(),
        image,
        author: a.author ? [{ name: a.author }] : [{ name: 'DragLab' }],
        category: a.category ? [{ name: a.category }] : undefined
      });
    });

    res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.send(feed.rss2());

  } catch (err) {
    next(err);
  }
});

module.exports = router;
