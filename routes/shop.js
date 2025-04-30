const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const Product = require('../models/product');

//shop/getting all products => GET
router.get('/Products', shopController.getProducts);
//shop/getting product details by product id => GET
router.get('/Products/:productId', shopController.getProduct);



router.get('/search', shopController.search);


router.get('/product/:productId/:lang', shopController.getProductDetails);
router.get('/model/:productId/:modelId/:lang', shopController.getModelDetailsPage);



router.get('/technical-service/:lang', shopController.geTechnicalservice);
router.post('/technical-service', shopController.postTechnicalService);

router.get('/Contactus/:lang', shopController.getContactus);
router.post('/submit-contactus', shopController.postContactUs);

router.get('/support/:lang', shopController.getSupport);
router.get('/aboutus/:lang', shopController.getaboutus);
router.get('/Articles/:lang', shopController.getArticles);
router.get('/article/:id/:lang', shopController.getArticleDetails);
router.get('/Downloads/:lang', shopController.getDownloads);
router.get('/TermCondition/:lang', shopController.getTearmCondition);
router.get('/PrivacyPolicy/:lang', shopController.getPrivacyPolicy);
router.get('/Qualitypolicy/:lang', shopController.getQualitypolicy);
router.get('/WarrantyRegistration/:lang', shopController.getWarrantyRegistration);
router.post('/submit-warranty', shopController.postWarrantyRegistration);

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




//shop/getting home page => GET
router.get('/:lang', shopController.getHomePage);

module.exports = router;