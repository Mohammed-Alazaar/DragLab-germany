const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const multer = require('multer');
const uploadQuoteAttachment = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('quoteAttachment');
const isAuth = require('../middleware/is-auth');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const Product = require('../models/product');
const NewsletterSubscriber = require('../models/newsletter');
const mongoose = require('mongoose');

const geoip = require('geoip-lite');

//shop/getting all products => GET
router.get('/Products', shopController.getProducts);
//shop/getting product details by product id => GET
router.get('/Products/:productId', shopController.getProduct);



router.get('/search', shopController.search);


router.get('/:lang/products/:productSlug', shopController.getProductDetails);
router.get('/:lang/products/:productSlug/:modelSlug', shopController.getModelDetailsPage);



router.get('/:lang/technical-service', shopController.geTechnicalservice);
router.post('/technical-service', shopController.postTechnicalService);

router.get('/:lang/Contactus', shopController.getContactus);
router.post('/submit-contactus', shopController.postContactUs);

router.get('/:lang/support', shopController.getSupport);
router.get('/:lang/Articles', shopController.getArticles);
router.get('/:lang/articles/:slug', shopController.getArticleDetails);
router.get('/:lang/Downloads', shopController.getDownloads);
router.get('/:lang/WarrantyRegistration', shopController.getWarrantyRegistration);
router.post('/submit-warranty', shopController.postWarrantyRegistration);
router.get('/:lang/Industry', shopController.getIndustryPage);
router.get('/:lang/industry/:slug', shopController.getIndustryDetails);

router.post('/subscribe', async (req, res) => {
  try {
    const { email, language } = req.body;

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;

    const geo = geoip.lookup(ip); // e.g., { country: 'US', region: 'CA', city: 'San Francisco', ... }

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        email,
        language: language || 'EN',
        ipAddress: ip,
        geoLocation: {
          country: geo?.country || null,
          region: geo?.region || null,
          city: geo?.city || null,
          isp: geo?.org || null
        }
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('❌ Newsletter Subscription Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



router.get('/api/models/:productId', async (req, res) => {
  const lang = (req.query.lang || 'EN').toUpperCase();
  const { productId } = req.params;

  // 🔒 Validate productId before hitting MongoDB
  if (!mongoose.isValidObjectId(productId)) {
    console.error('❌ Invalid productId in /api/models:', productId);
    return res.status(400).json({ models: [] });
  }

  try {
    const product = await Product.findById(productId)
      .select([
        'Models._id',              // ✅ ensure subdocument _id is present
        'Models.isPublished',
        `Models.Language.${lang}`,
        'Models.Language.EN'
      ])
      .lean();

    if (!product) {
      return res.status(404).json({ models: [] });
    }

    const models = (product.Models || [])
      .filter((m) => {
        const langBlock = m?.Language?.[lang]?.[0];
        const enBlock   = m?.Language?.EN?.[0];
        return m?.isPublished === true ||
               langBlock?.publish === true ||
               enBlock?.publish === true;
      })
      .map((m) => {
        const block = m.Language?.[lang]?.[0] || m.Language?.EN?.[0] || {};
        return {
          _id: m._id,                                  // ✅ valid ObjectId
          ModelName: block.ModelName || 'Unnamed Model'
        };
      });

    return res.json({ models });
  } catch (err) {
    console.error('❌ /api/models error:', err);
    return res.status(500).json({ models: [] });
  }
});



router.get('/', (req, res) => {
  const acceptLang = req.headers['accept-language'] || '';
  const browserLang = acceptLang.slice(0, 2).toLowerCase();

  let redirectLang = 'EN'; // default

  if (browserLang === 'es') redirectLang = 'ES';
  else if (browserLang === 'de') redirectLang = 'DE';

  res.redirect(`/${redirectLang}`);
});



//shop/getting home page => GET
router.get('/:lang', shopController.getHomePage);


// ── PAGE 1: Request a Quote ──────────────────────────────────────────────────
router.get('/:lang/request-a-quote', shopController.getRequestQuote);
router.post('/submit-quote', uploadQuoteAttachment, shopController.postRequestQuote);

// ── PAGE 2: Become a Distributor ─────────────────────────────────────────────
router.get('/:lang/become-a-distributor', shopController.getBecomDistributor);
router.post('/submit-distributor-application', shopController.postDistributorApplication);

// ── PAGE 3: Knowledge Base / FAQ ─────────────────────────────────────────────
router.get('/:lang/knowledge-base', shopController.getKnowledgeBase);
router.get('/:lang/knowledge-base/:category', shopController.getKnowledgeBaseCategory);

// ── PAGE 4: Case Studies ─────────────────────────────────────────────────────
router.get('/:lang/case-studies', shopController.getCaseStudies);
router.get('/:lang/case-studies/:slug', shopController.getCaseStudyDetail);

// ── PAGE 5: Laboratory Glossary ──────────────────────────────────────────────
router.get('/:lang/laboratory-glossary', shopController.getLaboratoryGlossary);
router.get('/:lang/laboratory-glossary/:slug', shopController.getGlossaryTerm);

module.exports = router;