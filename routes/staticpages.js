const path = require('path');
const express = require('express');
const staticpagesController = require('../controllers/staticpages');
const router = express.Router();
const Product = require('../models/product');
const NewsletterSubscriber = require('../models/newsletter');

const geoip = require('geoip-lite');



router.get('/:lang/TermCondition', staticpagesController.getTearmCondition);
router.get('/:lang/PrivacyPolicy', staticpagesController.getPrivacyPolicy);
router.get('/:lang/DataProtection', staticpagesController.getDataProtection);
router.get('/:lang/imprint', staticpagesController.getimprint);
router.get('/:lang/CodeofEthics', staticpagesController.getCodeofEthics);
router.get('/:lang/QualityPolicy', staticpagesController.getQualityPolicy);
router.get('/:lang/SustainabilityPolicy', staticpagesController.getSustainabilityPolicy);
router.get('/:lang/Qualifications', staticpagesController.getQualifications);
router.get('/:lang/licenses', staticpagesController.getLicensePage);
router.get('/:lang/aboutus', staticpagesController.getaboutus);



module.exports = router;

