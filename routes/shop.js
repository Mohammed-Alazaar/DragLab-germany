const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const Product = require('../models/product');
const NewsletterSubscriber = require('../models/newsletter');

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
router.get('/:lang/aboutus', shopController.getaboutus);
router.get('/:lang/Articles', shopController.getArticles);
router.get('/:lang/articles/:slug', shopController.getArticleDetails);
router.get('/:lang/Downloads', shopController.getDownloads);
router.get('/:lang/TermCondition', shopController.getTearmCondition);
router.get('/:lang/PrivacyPolicy', shopController.getPrivacyPolicy);
router.get('/:lang/DataProtection', shopController.getDataProtection);
router.get('/:lang/imprint', shopController.getimprint);
router.get('/:lang/CodeofEthics', shopController.getCodeofEthics);
router.get('/:lang/quality-policy', shopController.getQualitypolicy);
router.get('/:lang/WarrantyRegistration', shopController.getWarrantyRegistration);
router.post('/submit-warranty', shopController.postWarrantyRegistration);
router.get('/:lang/Industry', shopController.getIndustryPage);
router.get('/:lang/industry/:slug', shopController.getIndustryDetails);
router.get('/:lang/QualityPolicy', shopController.getQualityPolicy);
router.get('/:lang/SustainabilityPolicy', shopController.getSustainabilityPolicy);
router.get('/:lang/Qualifications', shopController.getQualifications);
router.get('/:lang/licenses', shopController.getLicensePage);

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
  const lang = req.query.lang || 'EN';

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const models = product.Models.map(m => ({
      _id: m._id,
      ModelName: m.Language[lang]?.[0]?.ModelName || m.Language['EN']?.[0]?.ModelName || 'Unnamed Model'
    }));

    res.json({ models });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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

module.exports = router;