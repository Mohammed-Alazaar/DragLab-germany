const path = require('path'); // Add this line to import the path module
const Product = require('../models/product'); // Add this line to import the Product model
const Slideshow = require('../models/slideshow');
const user = require('../models/user');
const CatalogCategory = require('../models/CatalogCategory');

// New page models
const Quote = require('../models/quote');
const DistributorApplication = require('../models/distributorApplication');
const FAQ = require('../models/faq');
const CaseStudy = require('../models/caseStudy');
const Glossary = require('../models/glossary');
const TechnicalService = require('../models/technicalService');
const WarrantyRegistration = require('../models/warrantyRegistration');
const ContactUs = require('../models/contactUs');
const Article = require('../models/articles');
const IndustryPage = require('../models/IndustryPage');
const NewsletterSubscriber = require('../models/newsletter.js');
const PDFDocument = require('pdfkit');
const cloudinary = require('../util/cloudinaryConfig'); // ✅ Import Cloudinary
const sanitize = require('sanitize-filename');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto'); // ✅ Node built-in module

const exp = require('constants');
const express = require('express');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const fs = require('fs');

const languages = ['EN', 'ES', 'DE', 'TR', 'FR'];

const allanguages = ['EN', 'ES', 'DE', 'TR', 'FR'];






exports.getAddProduct = (req, res, next) => {
  res.render('sellercompany/edit-product', {

    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    product: {
      Language: {
        EN: [{
          ProductName: '',
          ProductNameDesc: '',
          ProductDesc: '',
          WhyProductDesc: '',
          features: [
            { FeatureImage: '', FeatureName: '', FeatureDesc: '' },
            { FeatureImage: '', FeatureName: '', FeatureDesc: '' },
            { FeatureImage: '', FeatureName: '', FeatureDesc: '' },
            { FeatureImage: '', FeatureName: '', FeatureDesc: '' }
          ]
        }],
        ES: [{
          ProductName: '',
          ProductNameDesc: '',
          ProductDesc: '',
          WhyProductDesc: '',
          features: [
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' }
          ]
        }],
        DE: [{
          ProductName: '',
          ProductNameDesc: '',
          ProductDesc: '',
          WhyProductDesc: '',
          features: [
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' }
          ]
        }],
        TR: [{
          ProductName: '',
          ProductNameDesc: '',
          ProductDesc: '',
          WhyProductDesc: '',
          features: [
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' }
          ]
        }],
        FR: [{
          ProductName: '',
          ProductNameDesc: '',
          ProductDesc: '',
          WhyProductDesc: '',
          features: [
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' },
            { FeatureName: '', FeatureDesc: '' }
          ]
        }],
      }
    },
    validationErrors: [],
    errorMessage: null,
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
    role: req.session.role,
    languages: allanguages,
    isDraft: false // because it's new
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    // who is editing?
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));

    // Files from multer (cloudinaryUrl injected by your middleware)
    const productThumbnail = req.files['productThumbnail']?.[0]?.cloudinaryUrl || req.body.oldProductThumbnail || '';
    const productSketch = req.files['productSketch']?.[0]?.cloudinaryUrl || req.body.oldProductSketch || '';

    const languages = allanguages;
    const languageData = {};
      const metaData = {};
    const tagsData = {};
    const validationErrors = [];


    
const normalizeTags = (raw) => {
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toLowerCase())   // normalize case
    .map(s => s.replace(/\s+/g, ' ')) // collapse inner spaces
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
    .slice(0, 12);
};


    // Requested publish flags (UI should be hidden for non-admin, but enforce server-side too)
    const requestedPublish = Object.fromEntries(
      languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
    );
    const anyLangPublishedRequested = Object.values(requestedPublish).some(Boolean);

    // Save as draft when:
    // - user explicitly chooses draft (if you use saveType), OR
    // - user is NOT admin, OR
    // - no language publish was requested
    const isDraft = (req.body.saveType === 'draft') || !isAdmin || !anyLangPublishedRequested;

    // Global images required ONLY when not draft
    if (!isDraft) {
      if (!productThumbnail) {
        validationErrors.push({ path: 'ProductThumbnail', msg: 'Product Thumbnail is required.' });
      }
      if (!productSketch) {
        validationErrors.push({ path: 'ProductSketch', msg: 'Product Sketch is required.' });
      }
    }

    // Per-language data + validation
    for (const lang of languages) {
      // Effective publish (non-admins cannot publish)
      const publishLang = isAdmin ? requestedPublish[lang] : false;

      // Validate EN always; other languages only if effectively published
      const validateThisLanguage = (lang === 'EN') || publishLang;

      const productName = (req.body[`ProductName_${lang}`] || '').trim();
      const productNameDesc = (req.body[`ProductNameDesc_${lang}`] || '').trim();
      const productDesc = (req.body[`ProductDesc_${lang}`] || '').trim();
      const whyProductDesc = (req.body[`WhyProductDesc_${lang}`] || '').trim();
    // meta parsing stays, but keep alongside tags
      const metaTitle = (req.body[`MetaTitle_${lang}`] || '').trim();
      const metaDesc  = (req.body[`MetaDesc_${lang}`]  || '').trim();
      metaData[lang] = {
        title: metaTitle || undefined,
        description: metaDesc || undefined
      };
      // Make sure your EJS input name is name="Tags_<%= lang %>"
      tagsData[lang] = normalizeTags(req.body[`Tags_${lang}`]);


      if (!isDraft && validateThisLanguage) {
        if (!productName) validationErrors.push({ path: `ProductName_${lang}`, msg: `Product Name (${lang}) is required.` });
        if (!productNameDesc) validationErrors.push({ path: `ProductNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
        if (!productDesc) validationErrors.push({ path: `ProductDesc_${lang}`, msg: `Product Description (${lang}) is required.` });
        if (!whyProductDesc) validationErrors.push({ path: `WhyProductDesc_${lang}`, msg: `Why Product Description (${lang}) is required.` });
      }

      // Features (4 slots)
      const names = req.body[`FeatureName_${lang}`] || [];
      const descs = req.body[`FeatureDesc_${lang}`] || [];
      const oldImages = req.body[`OldFeatureImage_${lang}`] || [];
      const features = [];

      const requireFeatureImage = (lang === 'EN') && !isDraft; // images required only for EN when publishing

      for (let i = 0; i < 4; i++) {
        const featureName = names[i]?.trim() || '';
        const featureDesc = descs[i]?.trim() || '';

        // pick image
        let imagePath = '';
        const file = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0];

        if (file) {
          imagePath = file.cloudinaryUrl;
        } else if (lang !== 'EN') {
          // Non-EN: never required, but we can inherit EN or prior image if present
          const enFile = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
          if (enFile) imagePath = enFile.cloudinaryUrl;
          else if (Array.isArray(oldImages)) imagePath = oldImages[i] || '';
          else imagePath = oldImages || '';
        } else {
          // EN: keep prior if any (usually empty for add)
          imagePath = Array.isArray(oldImages) ? (oldImages[i] || '') : (oldImages || '');
        }

        if (!isDraft && validateThisLanguage) {
          if (!featureName) {
            validationErrors.push({
              path: `FeatureName_${lang}_${i}`,
              msg: `Feature Name ${i + 1} (${lang}) is required.`
            });
          }
          if (requireFeatureImage && !imagePath) {
            validationErrors.push({
              path: `FeatureImage_${lang}_${i}`,
              msg: `Feature Image ${i + 1} (${lang}) is required.`
            });
          }
        }

        features.push({
          FeatureName: featureName,
          FeatureDesc: featureDesc,
          FeatureImage: imagePath
        });
      }

      languageData[lang] = [{
        ProductName: productName,
        ProductNameDesc: productNameDesc,
        ProductDesc: productDesc,
        WhyProductDesc: whyProductDesc,
        features,
        publish: publishLang
      }];
    }

    // If validation fails, re-render
    if (validationErrors.length > 0) {
      return res.status(422).render('sellercompany/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        errorMessage: 'Please fix the highlighted errors.',
        validationErrors,
        isAuthenticated: req.session.isLoggedIn,
        product: {
          ProductThumbnail: productThumbnail,
          ProductSketch: productSketch,
          Language: languageData,
          tags: tagsData,
          meta: metaData
        }
      });
    }

    // Build slug from EN name
    const productNameEN = req.body['ProductName_EN'];
    const productSlug = slugify(productNameEN || 'unnamed-product', { lower: true, strict: true });

    // Save
    const Product = require('../models/product');
    const product = new Product({
      slug: productSlug,
      ProductThumbnail: productThumbnail,
      ProductSketch: productSketch,
      Language: languageData,
         tags: tagsData,
      meta: metaData,
      isDraft // final draft flag based on admin + publish selections
    });

    await product.save();
    console.log('✅ Product successfully added!');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('🔥 Internal Server Error:', err);
    if (!res.headersSent) res.status(500).send(`🔥 Internal Server Error: ${err.message}`);
  }
};





exports.getMyproduct = async (req, res, next) => {
  try {
    const PAGE_SIZE = 10;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const totalItems = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const products = await Product.find()
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    res.render('sellercompany/my-products', {
      pageTitle: 'My Product',
      path: '/admin/Myproduct',
      prods: products,
      isAuthenticated: req.session.isLoggedIn,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/Myproduct'
    });
  } catch (err) {
    next(err);
  }
};


exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');

    const prodId = req.params.productId;

    // 🔁 CHANGED: also pull tags + meta for the form
    const product = await Product.findById(prodId)
      .select('Language ProductThumbnail ProductSketch isDraft tags meta slug createdAt')
      .lean();

    if (!product) return res.redirect('/');

    // ✅ NEW: ensure tags/meta objects exist so EJS value bindings don't crash
    const ensureLangObj = (obj) => obj || { EN: [], ES: [], DE: [], TR: [], FR: [] };
    const ensureMetaObj = (obj) => obj || { EN: {}, ES: {}, DE: {}, TR: {}, FR: {} };

    product.tags = ensureLangObj(product.tags);
    product.meta = ensureMetaObj(product.meta);

    return res.render('sellercompany/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
      hasError: false,
      validationErrors: [],
      errorMessage: null,
      isAuthenticated: req.session.isLoggedIn,
      isDraft: product.isDraft,
      languages: allanguages
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const languages = allanguages;
    const languageData = {};
    const validationErrors = [];
   // ✅ NEW: meta/tags holders
    const metaData = {};   // per-language meta overrides
    const tagsData = {};   // per-language tags/keywords


        // ✅ NEW: normalize tags helper (same as add-product)
    const normalizeTags = (raw) => {
      if (!raw) return [];
      return String(raw)
        .split(',')
        .map(s => s.trim().toLowerCase())
        .map(s => s.replace(/\s+/g, ' '))
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 12);
    };
    // who is editing?
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));

    // Pull existing for publish fallback (non-admin) and old values
    const existing = await Product.findById(productId)
      .select('Language ProductThumbnail ProductSketch isDraft tags meta slug')
      .lean();
    if (!existing) return res.redirect('/admin/Myproduct');

    // Requested publish per language (from form)
    const requestedPublish = Object.fromEntries(
      languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
    );

    // Effective publish = admin can set, non-admin keeps previous publish
    const effectivePublishMap = Object.fromEntries(
      languages.map(l => {
        const prev = existing?.Language?.[l]?.[0]?.publish === true;
        const incoming = requestedPublish[l];
        return [l, isAdmin ? incoming : prev];
      })
    );

    const anyLangPublished = Object.values(effectivePublishMap).some(Boolean);

    // ONE-TIME files (keep old if no new)
    const updatedProductThumbnail =
      req.files['productThumbnail']?.[0]?.cloudinaryUrl || req.body.oldProductThumbnail || '';
    const updatedProductSketch =
      req.files['productSketch']?.[0]?.cloudinaryUrl || req.body.oldProductSketch || '';

    // ✅ IMPORTANT: If nothing is published, DO NOT validate anything at all.
    // Only validate when at least one language is effectively published.
    if (anyLangPublished) {
      // Global images required only when publishing
      if (!updatedProductThumbnail) {
        validationErrors.push({ path: 'ProductThumbnail', msg: 'Product Thumbnail is required.' });
      }
      if (!updatedProductSketch) {
        validationErrors.push({ path: 'ProductSketch', msg: 'Product Sketch is required.' });
      }
    }

    // Build per-language data (+ conditional validation)
    for (const lang of languages) {
      const effectivePublish = !!effectivePublishMap[lang];

      // Validate this language only when something is being published:
      // - EN always when publishing (even if EN isn't toggled)
      // - Any other lang only if its publish is toggled
      const validateThisLanguage = anyLangPublished && (lang === 'EN' || effectivePublish);

      const productName = (req.body[`ProductName_${lang}`] || '').trim();
      const productNameDesc = (req.body[`ProductNameDesc_${lang}`] || '').trim();
      const productDesc = (req.body[`ProductDesc_${lang}`] || '').trim();
      const whyProductDesc = (req.body[`WhyProductDesc_${lang}`] || '').trim();


       // ✅ NEW: read meta fields per language
      const metaTitle = (req.body[`MetaTitle_${lang}`] || '').trim();
      const metaDesc  = (req.body[`MetaDesc_${lang}`]  || '').trim();
      metaData[lang] = {
        title: metaTitle || undefined,
        description: metaDesc || undefined
      };

      // ✅ NEW: read + normalize tags per language
      tagsData[lang] = normalizeTags(req.body[`Tags_${lang}`]);


      
      if (validateThisLanguage) {
        if (!productName) validationErrors.push({ path: `ProductName_${lang}`, msg: `Product Name (${lang}) is required.` });
        if (!productNameDesc) validationErrors.push({ path: `ProductNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
        if (!productDesc) validationErrors.push({ path: `ProductDesc_${lang}`, msg: `Product Description (${lang}) is required.` });
        if (!whyProductDesc) validationErrors.push({ path: `WhyProductDesc_${lang}`, msg: `Why Product Description (${lang}) is required.` });
      }

      // Features (4)
      const names = req.body[`FeatureName_${lang}`] || [];
      const descs = req.body[`FeatureDesc_${lang}`] || [];
      const oldImages = req.body[`OldFeatureImage_${lang}`] || [];
      const features = [];

      // Only EN feature images are required, and only when publishing
      const requireFeatureImage = anyLangPublished && (lang === 'EN');

      for (let i = 0; i < 4; i++) {
        const featureName = names[i]?.trim() || '';
        const featureDesc = descs[i]?.trim() || '';

        let imagePath = '';
        const file = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0];

        if (file) {
          imagePath = file.cloudinaryUrl;
        } else if (lang !== 'EN') {
          // Non-EN: never required; try to inherit EN or keep previous if present
          const enFile = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
          if (enFile) imagePath = enFile.cloudinaryUrl;
          else if (Array.isArray(oldImages)) imagePath = oldImages[i] || '';
          else imagePath = oldImages || '';
        } else {
          // EN: keep old if exists
          imagePath = Array.isArray(oldImages) ? (oldImages[i] || '') : (oldImages || '');
        }

        if (validateThisLanguage) {
          if (!featureName) {
            validationErrors.push({
              path: `FeatureName_${lang}_${i}`,
              msg: `Feature Name ${i + 1} (${lang}) is required.`
            });
          }
          if (requireFeatureImage && !imagePath) {
            validationErrors.push({
              path: `FeatureImage_${lang}_${i}`,
              msg: `Feature Image ${i + 1} (${lang}) is required.`
            });
          }
        }

        features.push({ FeatureName: featureName, FeatureDesc: featureDesc, FeatureImage: imagePath });
      }

      languageData[lang] = [{
        ProductName: productName,
        ProductNameDesc: productNameDesc,
        ProductDesc: productDesc,
        WhyProductDesc: whyProductDesc,
        features,
        publish: effectivePublish  // enforce server-side
      }];
    }

    // If there are validation errors (only possible when anyLangPublished === true), re-render
    if (validationErrors.length > 0) {
      return res.status(422).render('sellercompany/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        errorMessage: 'Please fix the highlighted errors.',
        validationErrors,
        isAuthenticated: req.session.isLoggedIn,
        isDraft: !anyLangPublished, // reflect current intent
        product: {
          _id: productId,
          Language: languageData,
          ProductThumbnail: updatedProductThumbnail,
          ProductSketch: updatedProductSketch,
          tags: tagsData,     // ✅ NEW: preserve entered tags on error
          meta: metaData      // ✅ NEW: preserve meta on error
        }
      });
    }

    // ✅ Update DB
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    product.Language = languageData;
    product.ProductThumbnail = updatedProductThumbnail;
    product.ProductSketch = updatedProductSketch;

    // CRUCIAL: If nothing is published, mark draft so Mongoose "required" won't fire later.
    product.isDraft = !anyLangPublished;

       // ✅ NEW: persist meta/tags
    product.meta = metaData;
    product.tags = tagsData;

    await product.save();
    console.log('✅ Product Updated');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('🔥 Error updating product:', err);
    if (!res.headersSent) return next(err);
  }
};










// 🔒 Safe file deletion helper
function safeUnlink(relativePath) {
  if (!relativePath) return;
  const fullPath = path.join('public', relativePath);
  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
    fs.unlinkSync(fullPath);
  }
}

exports.postDeleteModel = async (req, res, next) => {
  const { productId, modelId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    const model = product.Models.id(modelId);
    if (!model) return res.redirect('/admin/Myproduct');

    // 🧹 1. Delete static fields
    ['ModelThumbnail', 'overviewThumbnail'].forEach(field => {
      safeUnlink(model[field]);
    });

    // 🧹 2. Delete ModelPhotos
    if (Array.isArray(model.ModelPhotos)) {
      model.ModelPhotos.forEach(photo => safeUnlink(photo));
    }

    // 🧹 3. Delete multilingual files
    const languages = Object.keys(model.Language || {});
    languages.forEach(lang => {
      const langData = model.Language[lang]?.[0];
      if (!langData) return;

      // Delete downloads
      langData.downloads?.forEach(file => safeUnlink(file.filePath));

      // Delete overview images
      langData.overview?.forEach(o => safeUnlink(o.overviewImage));

      // Delete industry images and logos
      langData.industry?.forEach(i => {
        safeUnlink(i.industryImage);
        safeUnlink(i.industryLogo);
      });
    });

    // 🗑️ 4. Remove model from array
    product.Models = product.Models.filter(m => m._id.toString() !== modelId);
    await product.save();

    console.log('✅ Model and files deleted successfully.');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('❌ Error deleting model:', err);
    next(err);
  }
};

// ✅ ADD: sanitize + ensure extension
function buildDesiredName(inputName, extFallback, originalExt) {
  const ext = (originalExt || '').toLowerCase();
  const fallback = (extFallback || '.pdf').toLowerCase();

  const baseRaw = (inputName || '').trim() || 'draglab-file';
  const base = sanitize(baseRaw)
    .replace(/\s+/g, '-')          // spaces -> dashes
    .replace(/[^\w.-]+/g, '')      // keep only word, dot, dash
    .replace(/-+/g, '-')           // collapse multiple dashes
    .replace(/^[-.]+|[-.]+$/g, '') // trim leading/trailing dots/dashes
    .slice(0, 80);                 // keep short and tidy

  // Use provided extension if it looks valid, otherwise fallback
  const finalExt = ext && ext !== '.webp' ? ext : fallback;
  return base.toLowerCase().endsWith(finalExt) ? base : `${base}${finalExt}`;
}




exports.getAddModel = (req, res, next) => {
  const productId = req.params.productId;
  Promise.all([
    Product.findById(productId),
    IndustryPage.find({ isDraft: false }).lean()
  ]).then(([product, allIndustries]) => {
    if (!product) return res.redirect('/admin/Myproduct');
    res.render('sellercompany/add-model', {
      pageTitle: 'Add Model',
      path: '/admin/add-model',
      product,
      model: null,
      editing: false,
      productId,
      validationErrors: [],
      hasError: false,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: null,
      allIndustries
    });
  }).catch(err => next(err));
};

exports.getEditModel = (req, res, next) => {
  const { productId, modelId } = req.params;
  Promise.all([
    Product.findById(productId),
    IndustryPage.find({ isDraft: false }).lean()
  ]).then(([product, allIndustries]) => {
    if (!product) return res.redirect('/admin/Myproduct');
    const model = product.Models.id(modelId);
    if (!model) return res.redirect('/admin/Myproduct');
    res.render('sellercompany/add-model', {
      pageTitle: 'Edit Model',
      path: '/admin/edit-model',
      product,
      model,
      editing: true,
      productId,
      modelId,
      validationErrors: [],
      hasError: false,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: null,
      allIndustries
    });
  }).catch(err => next(err));
};


const streamifier = require('streamifier');
const sharp = require('sharp');

// 🧠 Compress PDF using pdf-lib
const compressPdfBuffer = async (buffer) => {
  const pdfDoc = await PDFDocument.load(buffer);
  return await pdfDoc.save({ useObjectStreams: true }); // basic compression
};
// Controller for adding a model


const uploadToCloudinary = async (file, {
  folder = 'draglab',
  desiredFileName = '',
  treatAsDownload = false
} = {}) => {
  try {
    // Check if it's an image and not a raw doc
    const isImage = file.mimetype.startsWith('image/');

    let finalBuffer = file.buffer;
    let uploadFolder = folder;

    // If it's an image and NOT a raw file, convert to WebP
    if (isImage && !treatAsDownload) {
      finalBuffer = await sharp(file.buffer)
        .webp({ quality: 85 })
        .toBuffer();

      // Set file extension
      if (desiredFileName && !desiredFileName.endsWith('.webp')) {
        desiredFileName = desiredFileName.replace(/\.[^/.]+$/, '') + '.webp';
      }
    }

    // If raw (PDF, DOC), keep original buffer and name
    if (treatAsDownload) {
      cloudinary.config({ resource_type: 'raw' });
    } else {
      cloudinary.config({ resource_type: 'image' });
    }

    // Create a promise that uploads via stream
    const uploadStream = (resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream({
        folder: uploadFolder,
        public_id: desiredFileName ? desiredFileName : undefined,
        format: treatAsDownload ? path.extname(desiredFileName).slice(1) : 'webp',
        resource_type: treatAsDownload ? 'raw' : 'image',
        format: treatAsDownload ? undefined : 'webp',
        use_filename: false,
        unique_filename: true,
        overwrite: true
      }, (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Failed:', error);
          return reject(error);
        }
        console.log('✅ Uploaded to Cloudinary:', result.secure_url);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          savedName: result.original_filename
        });
      });

      streamifier.createReadStream(finalBuffer).pipe(cloudinaryStream);
    };

    return await new Promise(uploadStream);
  } catch (err) {
    console.error('❌ Error in uploadToCloudinary:', err);
    return null;
  }
};

const toIndexedArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') {
    const keys = Object.keys(val).filter(k => /^\d+$/.test(k)).sort((a, b) => (+a) - (+b));
    if (keys.length) return keys.map(k => val[k]);
    return [val];
  }
  return [];
};

const clean = (s) => (typeof s === 'string' ? s.trim() : '');

const canonicalizeLangKey = (k) => {
  const up = String(k || '').toUpperCase();
  const m = up.match(/\b[A-Z]{2}\b/);
  return m ? m[0] : up.replace(/[^A-Z]/g, '');
};

// Group all variants per canonical lang, preserving each variant separately
const groupSpecsByLangVariants = (specsRoot) => {
  const grouped = {};
  if (!specsRoot || typeof specsRoot !== 'object') return grouped;
  for (const [k, v] of Object.entries(specsRoot)) {
    const canon = canonicalizeLangKey(k);
    if (!grouped[canon]) grouped[canon] = [];
    grouped[canon].push(v);
  }
  return grouped;
};

// Merge sections *by index* across all variants (e.g., "EN" + "EN ▸")
const mergeSectionsByIndex = (sectionVariantsList) => {
  const arrays = sectionVariantsList.map(toIndexedArray);
  const maxLen = Math.max(0, ...arrays.map(a => a.length));
  const merged = [];

  const mergeRowsByIndex = (rowsA, rowsB) => {
    const a = toIndexedArray(rowsA);
    const b = toIndexedArray(rowsB);
    const max = Math.max(a.length, b.length);
    const out = [];
    for (let j = 0; j < max; j++) {
      const rA = a[j] || {};
      const rB = b[j] || {};
      out.push({
        title: clean(rA.title) || clean(rB.title) || '',
        value: clean(rA.value) || clean(rB.value) || ''
      });
    }
    return out;
  };

  for (let i = 0; i < maxLen; i++) {
    let acc = { sectionTitle: '', rows: [] };
    for (const arr of arrays) {
      const sec = arr[i] || {};
      const title = clean(sec.sectionTitle);
      if (title && !acc.sectionTitle) acc.sectionTitle = title;
      acc.rows = mergeRowsByIndex(acc.rows, sec.rows);
    }
    const hasAnyRow = acc.rows.some(r => r.title || r.value);
    if (acc.sectionTitle || hasAnyRow) merged.push(acc);
  }
  return merged;
};

// Build final normalized specs for a given lang from the grouped variants
const buildFinalSpecsForLang = (grouped, lang) => {
  const variants = grouped?.[lang] || [];
  if (variants.length === 0) return [];
  return mergeSectionsByIndex(variants);
};
// Coerce a single value or an array into an array (keeps strings intact)
const toList = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v]));




const parseTags = (s) =>
  (typeof s === 'string' ? s : '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 12); // keep it sane

const collectSeoFromBody = (langs, body) => {
  const tags = {};
  const meta = {};
  langs.forEach(l => {
    // always present in form => allow clearing
    const t = parseTags(body[`Tags_${l}`]);
    tags[l] = t;

    const title = clean(body[`MetaTitle_${l}`]);
    const description = clean(body[`MetaDesc_${l}`]);
    meta[l] = { title, description };
  });
  return { tags, meta };
};



exports.postAddModel = async (req, res) => {
  const productId = req.params.productId;
  const languages = allanguages; // ['EN','ES','DE',...]
  const languageData = {};
  const validationErrors = [];

  // Read selected industry slugs (max 3)
  const rawIndustrySlugs = req.body.industrySlugs;
  const industrySlugs = (Array.isArray(rawIndustrySlugs)
    ? rawIndustrySlugs
    : rawIndustrySlugs ? [rawIndustrySlugs] : []
  ).slice(0, 4);

  const allIndustries = await IndustryPage.find({ isDraft: false }).lean();

  const requestedPublish = Object.fromEntries(
    languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
  );
  const shouldValidate = Object.values(requestedPublish).some(Boolean);
  const mustValidateLang = (lang) => shouldValidate && (lang === 'EN' || requestedPublish[lang]);

    const { tags: modelTags, meta: modelMeta } = collectSeoFromBody(languages, req.body);

    
  try {
    // Slug + top-level uploads
    // Slug first
    const modelSlug = slugify(req.body['ModelName_EN'] || 'model', { lower: true, strict: true });

    // Model Thumbnail
    const ModelThumbnail = req.files?.ModelThumbnail?.[0]
      ? (await uploadToCloudinary(req.files.ModelThumbnail[0], {
        folder: 'draglab/models/thumbnails',
        desiredFileName: `${modelSlug}-thumbnail`,
        treatAsDownload: false,
      }))?.url || ''
      : (req.body.oldModelThumbnail || '');

    // Overview Thumbnail
    const overviewThumbnail = req.files?.overviewThumbnail?.[0]
      ? (await uploadToCloudinary(req.files.overviewThumbnail[0], {
        folder: 'draglab/models/overview',
        desiredFileName: `${modelSlug}-overview-thumb`,
        treatAsDownload: false,
      }))?.url || ''
      : (req.body.oldOverviewThumbnail || '');


    if (shouldValidate) {
      if (!ModelThumbnail) validationErrors.push({ path: 'ModelThumbnail', msg: 'Model Thumbnail is required when publishing.' });
      if (!overviewThumbnail) validationErrors.push({ path: 'overviewThumbnail', msg: 'Overview Thumbnail is required when publishing.' });
    }

    // Normalize TS keys and group by lang variants
    const groupedTechSpecs = groupSpecsByLangVariants(req.body.technicalSpecifications || {});
    console.log('TS KEYS RAW:', Object.keys(req.body.technicalSpecifications || {}));
    console.log('TS KEY GROUPS:', Object.fromEntries(Object.entries(groupedTechSpecs).map(([k, v]) => [k, v.length])));

    for (const lang of languages) {
      const validateThis = mustValidateLang(lang);

      const ModelName = clean(req.body[`ModelName_${lang}`]);
      const ModelNameDesc = clean(req.body[`ModelNameDesc_${lang}`]);
      const ModelDesc = clean(req.body[`ModelDesc_${lang}`]);

      if (validateThis) {
        if (!ModelName) validationErrors.push({ path: `ModelName_${lang}`, msg: `Model Name (${lang}) is required.` });
        if (!ModelNameDesc) validationErrors.push({ path: `ModelNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
        if (!ModelDesc) validationErrors.push({ path: `ModelDesc_${lang}`, msg: `Model Description (${lang}) is required.` });
      }

      // Overview (4)
      const overview = [];
      for (let i = 0; i < 4; i++) {
        const overviewName = clean(req.body.overview?.[lang]?.[i]?.overviewName);
        const overviewDesc = clean(req.body.overview?.[lang]?.[i]?.overviewDesc);

        const overviewImageFile = req.files?.[`overviewImages_${lang}[${i}]`] && req.files[`overviewImages_${lang}[${i}]`][0];
        const oldOverviewImg = req.body[`oldOverviewImages_${i}`] || ''; // EJS emits this for EN only

        const overviewImage = overviewImageFile
          ? (await uploadToCloudinary(overviewImageFile, {
            folder: `draglab/models/overview/${lang}`,
            desiredFileName: `${modelSlug}-overview-${i + 1}`,
            treatAsDownload: false,
          }))?.url || ''
          : (lang === 'EN' ? oldOverviewImg : '');

        // ...validation as you already have for EN...
        overview.push({ overviewName, overviewDesc, overviewImage });
      }


      // Technical Specifications (merge by index across variants)
      const technicalSpecifications = buildFinalSpecsForLang(groupedTechSpecs, lang);

      if (validateThis && lang === 'EN') {
        const hasValidSection = technicalSpecifications.some(
          sec => sec.sectionTitle && toIndexedArray(sec.rows).some(r => r.title && r.value)
        );
        if (!hasValidSection) {
          validationErrors.push({
            path: `technicalSpecifications_${lang}`,
            msg: 'At least one Technical Specifications section with one row is required (EN).'
          });
        }
      }

      // Downloads
    // ---- Downloads (keep existing from error re-render + add new uploads)
const downloads = [];

// Keep existing (not deleted) downloads coming back from the form
// Your frontend sends hidden inputs named existingDownloads_LANG[] with JSON.
const existingJsons =
  toList(req.body[`existingDownloads_${lang}[]`])  // most browsers
  .concat(toList(req.body[`existingDownloads_${lang}`])); // fallback name, just in case

for (const js of existingJsons) {
  try {
    const d = JSON.parse(js);
    // sanitize & keep shape consistent
    downloads.push({
      fileName: d.fileName || '',
      filePath: d.filePath || '',
      fileSize: d.fileSize || '',
      fileCategory: d.fileCategory || 'Uncategorized',
      fileProductCategory: d.fileProductCategory || '',
    });
  } catch (_) { /* ignore bad JSON */ }
}

// Add new uploads (if any)
if (req.files?.[`downloadFiles_${lang}`]) {
  const names = toIndexedArray(req.body[`downloadFileNames_${lang}`]);   // from your form
  const cats  = toIndexedArray(req.body[`downloadCategories_${lang}`]);

  for (let i = 0; i < req.files[`downloadFiles_${lang}`].length; i++) {
    const file = req.files[`downloadFiles_${lang}`][i];
    const originalExt = path.extname(file.originalname).toLowerCase() || '.pdf';
    const adminName = clean(names[i]) || path.basename(file.originalname, originalExt);
    const desiredNameForSave = buildDesiredName(adminName, '.pdf', originalExt);

    const uploaded = await uploadToCloudinary(file, {
      folder: `draglab/models/downloads/${lang}`,
      desiredFileName: desiredNameForSave,
      treatAsDownload: true,
    });

    downloads.push({
      fileName: adminName,
      filePath: uploaded?.url || '',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileCategory: clean(cats[i]) || 'Uncategorized',
      fileProductCategory: '',
    });
  }
}


      languageData[lang] = [{
        ModelName,
        ModelNameDesc,
        ModelDesc,
        overview,
        technicalSpecifications,
        downloads,
        publish: shouldValidate && !!requestedPublish[lang],
      }];
    }
    // Gallery photos: upload if new ones present, else reuse from session draft
    let ModelPhotos = [];
    if (req.files?.ModelPhotos) {
      ModelPhotos = await Promise.all(
        req.files.ModelPhotos.map(async (f, idx) => {
          const up = await uploadToCloudinary(f, {
            folder: 'draglab/models/photos',
            desiredFileName: `${modelSlug}-photo-${idx + 1}`,
            treatAsDownload: false,
          });
          return up?.url || '';
        })
      );
    } else if (req.session?.addModelDraft?.[productId]?.ModelPhotos) {
      ModelPhotos = req.session.addModelDraft[productId].ModelPhotos;
    }

    // Debug (optional)
    console.log('DEBUG RAW TS EN:', JSON.stringify(req.body.technicalSpecifications?.EN, null, 2));
    console.log('DEBUG MERGED TS EN:', JSON.stringify(buildFinalSpecsForLang(groupedTechSpecs, 'EN'), null, 2));

    // Validation re-render
    if (validationErrors.length > 0) {
      // ✅ Stash gallery so next submit (draft) can reuse it
      req.session.addModelDraft = req.session.addModelDraft || {};
      req.session.addModelDraft[productId] = { ModelPhotos };
      return res.status(422).render('sellercompany/add-model', {
        pageTitle: 'Add Model',
        path: '/admin/add-model',
        editing: false,
        hasError: true,
        errorMessage: 'Please fix the highlighted errors.',
        validationErrors,
        isAuthenticated: req.session.isLoggedIn,
        isDraft: !shouldValidate,
        productId,
        languages,
        allIndustries,
        model: {
          slug: modelSlug,
          ModelThumbnail,
          ModelPhotos,
          overviewThumbnail,
          modelcapacity: req.body.modelcapacity || '',
          Language: languageData,
          tags: modelTags,
          meta: modelMeta,
          industrySlugs
        }
      });
    }

    // Persist
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    const newModel = product.Models.create({
      slug: modelSlug,
      ModelThumbnail,
      ModelPhotos,
      overviewThumbnail,
      modelcapacity: req.body.modelcapacity || '',
      Language: languageData,
      isPublished: shouldValidate,
      tags: modelTags,
      meta: modelMeta,
      industrySlugs
    });

    product.Models.push(newModel);
    await product.save();

    console.log('✅ Model successfully added!');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('🔥 Error adding model:', err);
    if (!res.headersSent) {
      const productId = req.params.productId;
      return res.status(500).render('sellercompany/add-model', {
        pageTitle: 'Add Model',
        path: '/admin/add-model',
        editing: false,
        hasError: true,
        errorMessage: 'Unexpected error while adding model.',
        validationErrors: [],
        isAuthenticated: req.session.isLoggedIn,
        isDraft: !Object.values(req.body || {}).some((v, k) => String(k || '').startsWith('publish_')),
        productId,
        languages,
        model: {
          slug: slugify(req.body['ModelName_EN'] || 'model', { lower: true, strict: true }),
          ModelThumbnail: '',
          ModelPhotos: [],
          overviewThumbnail: '',
          modelcapacity: req.body.modelcapacity || '',
          Language: languageData,
          tags: modelTags,
          meta: modelMeta
        }
      });
    }
  }
};





// single-or-array -> array

exports.postEditModel = async (req, res) => {
  const { productId, modelId } = req.params;
  const languages = allanguages;
  const validationErrors = [];

  // Read selected industry slugs (max 3)
  const rawIndustrySlugs = req.body.industrySlugs;
  const industrySlugs = (Array.isArray(rawIndustrySlugs)
    ? rawIndustrySlugs
    : rawIndustrySlugs ? [rawIndustrySlugs] : []
  ).slice(0, 4);

  const allIndustries = await IndustryPage.find({ isDraft: false }).lean();

  // publish intent: if any lang checked => publishing => validate; else draft
  const requestedPublish = Object.fromEntries(
    languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
  );
  const shouldValidate = Object.values(requestedPublish).some(Boolean);
  const mustValidateLang = (lang) => shouldValidate && (lang === 'EN' || requestedPublish[lang]);

  const { tags: modelTags, meta: modelMeta } = collectSeoFromBody(languages, req.body);

  try {
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    const model = product.Models.id(modelId);
    if (!model) return res.redirect('/admin/Myproduct');

    // ---------- TOP-LEVEL ----------
    const modelSlug = model.slug || slugify(req.body['ModelName_EN'] || 'model', { lower: true, strict: true });

    // ModelThumbnail (new -> session -> prev)
    let ModelThumbnail;
    if (req.files?.ModelThumbnail?.[0]) {
      ModelThumbnail = (await uploadToCloudinary(req.files.ModelThumbnail[0], {
        folder: 'draglab/models/thumbnails',
        desiredFileName: `${modelSlug}-thumbnail`,
        treatAsDownload: false,
      }))?.url || '';
    } else if (req.session?.editModelDraft?.[modelId]?.ModelThumbnail) {
      ModelThumbnail = req.session.editModelDraft[modelId].ModelThumbnail;
    } else {
      ModelThumbnail = model.ModelThumbnail || '';
    }

    // Overview Thumbnail (new -> session -> prev)
    let overviewThumbnail;
    if (req.files?.overviewThumbnail?.[0]) {
      overviewThumbnail = (await uploadToCloudinary(req.files.overviewThumbnail[0], {
        folder: 'draglab/models/overview',
        desiredFileName: `${modelSlug}-overview-thumb`,
        treatAsDownload: false,
      }))?.url || '';
    } else if (req.session?.editModelDraft?.[modelId]?.overviewThumbnail) {
      overviewThumbnail = req.session.editModelDraft[modelId].overviewThumbnail;
    } else {
      overviewThumbnail = model.overviewThumbnail || '';
    }

    // Gallery photos (new -> session -> prev)
    let ModelPhotos = [];
    if (req.files?.ModelPhotos) {
      ModelPhotos = await Promise.all(
        req.files.ModelPhotos.map(async (f, idx) => {
          const up = await uploadToCloudinary(f, {
            folder: 'draglab/models/photos',
            desiredFileName: `${modelSlug}-photo-${idx + 1}`,
            treatAsDownload: false,
          });
          return up?.url || '';
        })
      );
    } else if (req.session?.editModelDraft?.[modelId]?.ModelPhotos) {
      ModelPhotos = req.session.editModelDraft[modelId].ModelPhotos;
    } else {
      ModelPhotos = model.ModelPhotos || [];
    }

    if (shouldValidate) {
      if (!ModelThumbnail)    validationErrors.push({ path: 'ModelThumbnail',    msg: 'Model Thumbnail is required when publishing.' });
      if (!overviewThumbnail) validationErrors.push({ path: 'overviewThumbnail', msg: 'Overview Thumbnail is required when publishing.' });
    }

    // ---------- TECH SPECS (merge weird lang keys, e.g. "EN ▸") ----------
    const groupedTechSpecs = groupSpecsByLangVariants(req.body.technicalSpecifications || {});
    // console.log('TS KEYS RAW:', Object.keys(req.body.technicalSpecifications || {}));
    // console.log('TS KEY GROUPS:', Object.fromEntries(Object.entries(groupedTechSpecs).map(([k,v]) => [k, v.length])));

    // ---------- PER-LANGUAGE ----------
    let anyLangPublished = false;
    const languageData = {};

    for (const lang of languages) {
      const prev = model.Language?.[lang]?.[0] || {};
      const validateThis = mustValidateLang(lang);

      const ModelName     = clean(req.body[`ModelName_${lang}`])     || prev.ModelName     || '';
      const ModelNameDesc = clean(req.body[`ModelNameDesc_${lang}`]) || prev.ModelNameDesc || '';
      const ModelDesc     = clean(req.body[`ModelDesc_${lang}`])     || prev.ModelDesc     || '';

      if (validateThis) {
        if (!ModelName)     validationErrors.push({ path: `ModelName_${lang}`,     msg: `Model Name (${lang}) is required.` });
        if (!ModelNameDesc) validationErrors.push({ path: `ModelNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
        if (!ModelDesc)     validationErrors.push({ path: `ModelDesc_${lang}`,     msg: `Model Description (${lang}) is required.` });
      }

      // ---- Overview (4)
      const overview = [];
      for (let i = 0; i < 4; i++) {
        const overviewName = clean(req.body.overview?.[lang]?.[i]?.overviewName) || prev.overview?.[i]?.overviewName || '';
        const overviewDesc = clean(req.body.overview?.[lang]?.[i]?.overviewDesc) || prev.overview?.[i]?.overviewDesc || '';

        const newOverviewFile = req.files?.[`overviewImages_${lang}[${i}]`]?.[0];
        const overviewImage = newOverviewFile
          ? (await uploadToCloudinary(newOverviewFile, {
              folder: `draglab/models/overview/${lang}`,
              desiredFileName: `${modelSlug}-overview-${i + 1}`,
              treatAsDownload: false,
            }))?.url || ''
          : (prev.overview?.[i]?.overviewImage || '');

        if (validateThis && lang === 'EN') {
          if (!overviewName) validationErrors.push({ path: `overview_${lang}_${i}_name`, msg: `Overview ${i + 1} name (${lang}) is required.` });
          if (!overviewDesc) validationErrors.push({ path: `overview_${lang}_${i}_desc`, msg: `Overview ${i + 1} description (${lang}) is required.` });
          if (!overviewImage) validationErrors.push({ path: `overview_${lang}_${i}_image`, msg: `Overview ${i + 1} image (EN) is required.` });
        }

        overview.push({ overviewName, overviewDesc, overviewImage });
      }

      // ---- Technical Specifications (merged by index across variants)
      let technicalSpecifications = [];
      const built = buildFinalSpecsForLang(groupedTechSpecs, lang);
      if (built.length > 0 || Object.keys(req.body.technicalSpecifications || {}).length > 0) {
        technicalSpecifications = built;
      } else if (prev.technicalSpecifications) {
        technicalSpecifications = prev.technicalSpecifications;
      }

      if (validateThis && lang === 'EN') {
        const hasValidSection = (technicalSpecifications || []).some(
          sec => sec.sectionTitle && toIndexedArray(sec.rows).some(r => r.title && r.value)
        );
        if (!hasValidSection) {
          validationErrors.push({
            path: `technicalSpecifications_${lang}`,
            msg: 'At least one Technical Specifications section with one row is required (EN).'
          });
        }
      }

      // ---- Downloads (keep existing from hidden JSON + add new uploads)
      const downloads = [];
      const existingJsons =
        toList(req.body[`existingDownloads_${lang}[]`]).concat(toList(req.body[`existingDownloads_${lang}`]));
      for (const js of existingJsons) {
        try {
          const d = JSON.parse(js);
          downloads.push({
            fileName: d.fileName || '',
            filePath: d.filePath || '',
            fileSize: d.fileSize || '',
            fileCategory: d.fileCategory || 'Uncategorized',
            fileProductCategory: d.fileProductCategory || ''
          });
        } catch (_) { /* ignore */ }
      }

      if (req.files?.[`downloadFiles_${lang}`]) {
        const names = toIndexedArray(req.body[`downloadFileNames_${lang}`]);
        const cats  = toIndexedArray(req.body[`downloadCategories_${lang}`]);
        for (let i = 0; i < req.files[`downloadFiles_${lang}`].length; i++) {
          const file = req.files[`downloadFiles_${lang}`][i];
          const originalExt = path.extname(file.originalname).toLowerCase() || '.pdf';
          const adminName = clean(names[i]) || path.basename(file.originalname, originalExt);
          const desiredNameForSave = buildDesiredName(adminName, '.pdf', originalExt);

          const uploaded = await uploadToCloudinary(file, {
            folder: `draglab/models/downloads/${lang}`,
            desiredFileName: desiredNameForSave,
            treatAsDownload: true,
          });

          downloads.push({
            fileName: adminName,
            filePath: uploaded?.url || '',
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            fileCategory: clean(cats[i]) || 'Uncategorized',
            fileProductCategory: prev.fileProductCategory || ''
          });
        }
      }

      // Commit per-language
      const publish = !!requestedPublish[lang];
      anyLangPublished = anyLangPublished || publish;

      languageData[lang] = [{
        ModelName,
        ModelNameDesc,
        ModelDesc,
        overview,
        technicalSpecifications,
        downloads,
        publish
      }];
    }

    // ---------- If validation fails, re-render (and stash images/photos in session) ----------
    if (validationErrors.length > 0) {
      req.session.editModelDraft = req.session.editModelDraft || {};
      req.session.editModelDraft[modelId] = {
        ModelThumbnail,
        overviewThumbnail,
        ModelPhotos
      };

      return res.status(422).render('sellercompany/add-model', {
        pageTitle: 'Edit Model',
        path: '/admin/edit-model',
        editing: true,
        hasError: true,
        errorMessage: 'Please fix the highlighted errors.',
        validationErrors,
        isAuthenticated: req.session.isLoggedIn,
        isDraft: !shouldValidate,
        productId,
        modelId,
        languages,
        allIndustries,
        model: {
          _id: modelId,
          slug: modelSlug,
          ModelThumbnail,
          overviewThumbnail,
          ModelPhotos,
          modelcapacity: req.body.modelcapacity || model.modelcapacity || '',
          Language: languageData,
          tags: modelTags,
          meta: modelMeta,
          industrySlugs
        }
      });
    }

    // ---------- Persist ----------
    model.ModelThumbnail = ModelThumbnail;
    model.overviewThumbnail = overviewThumbnail;
    model.ModelPhotos = ModelPhotos;
    model.modelcapacity = req.body.modelcapacity || model.modelcapacity;
    model.Language = languageData;
    model.isPublished = anyLangPublished;
    model.tags = modelTags;
    model.meta = modelMeta;
    model.industrySlugs = industrySlugs.length > 0 ? industrySlugs : (model.industrySlugs || []);
    await product.save();

    // clear session stash on success
    if (req.session?.editModelDraft?.[modelId]) {
      delete req.session.editModelDraft[modelId];
    }

    console.log('✅ Model successfully updated!');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('Error updating model:', err);
    if (!res.headersSent) return res.redirect('/admin/Myproduct');
  }
};






const SLIDE_LANGS = ['en', 'es', 'de', 'tr', 'fr'];

exports.getAllSlides = async (req, res) => {
  try {
    const slides = await Slideshow.find().sort({ createdAt: -1 });
    res.render('sellercompany/indexSlide', {
      path: '/admin/slideshow',
      slides,
      pageTitle: 'Slideshow',
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) { console.log(err); }
};

exports.getAddSlideForm = (req, res) => {
  res.render('sellercompany/add-indexSlide', {
    path: '/admin/addslideshow',
    pageTitle: 'Add Slide',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    slide: null
  });
};

exports.postAddSlide = async (req, res) => {
  const imageFile = req.files?.slideshowImage?.[0];
  try {
    if (!imageFile) throw new Error('No image file uploaded.');
    const uploaded = await uploadToCloudinary(imageFile, { folder: 'slideshow' });
    if (!uploaded?.url) throw new Error('Upload returned no URL');

    const translations = {};
    for (const l of SLIDE_LANGS) {
      translations[l] = {
        title:  (req.body[l + '_title']  || '').trim(),
        desc:   (req.body[l + '_desc']   || '').trim(),
        status: req.body[l + '_status']  || 'none'
      };
    }

    await new Slideshow({ image: uploaded.url, translations }).save();
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('Error adding slide:', err);
    res.status(500).send('Error adding slide.');
  }
};

exports.getEditSlideForm = async (req, res) => {
  try {
    const slide = await Slideshow.findById(req.params.id);
    if (!slide) return res.redirect('/admin/slideshow');
    res.render('sellercompany/add-indexSlide', {
      slide,
      pageTitle: 'Edit Slide',
      path: '/admin/edit-slide',
      editing: true,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) { console.log(err); }
};

exports.postEditSlide = async (req, res) => {
  try {
    const slide = await Slideshow.findById(req.params.id);
    if (!slide) return res.status(404).send('Slide not found');

    const newFile = req.files?.slideshowImage?.[0];
    if (newFile) {
      try {
        if (slide.image) {
          const oldPublicId = slide.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy('slideshow/' + oldPublicId);
        }
      } catch (e) { /* ignore */ }
      const uploaded = await uploadToCloudinary(newFile, { folder: 'slideshow' });
      if (!uploaded?.url) return res.status(500).send('Failed to upload image');
      slide.image = uploaded.url;
    }

    for (const l of SLIDE_LANGS) {
      slide.translations[l] = {
        title:  (req.body[l + '_title']  || '').trim(),
        desc:   (req.body[l + '_desc']   || '').trim(),
        status: req.body[l + '_status']  || 'none'
      };
    }

    await slide.save();
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('Error updating slide:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const slide = await Slideshow.findById(req.params.id);
    if (!slide) return res.redirect('/admin/slideshow');
    if (slide.image) {
      try {
        const publicId = slide.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy('slideshow/' + publicId);
      } catch (e) { /* ignore */ }
    }
    await Slideshow.findByIdAndDelete(req.params.id);
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('Error deleting slide:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Articles controllers 


// GET: All Articles
// Helper: generate a unique slug for a given language
async function generateUniqueSlug(title, articleId, lang) {
  const base = slugify(title || 'article', { lower: true, strict: true }) || 'article';
  let slug = base;
  let i = 1;
  while (true) {
    const query = { [`translations.${lang}.slug`]: slug };
    if (articleId) query._id = { $ne: articleId };
    const existing = await Article.findOne(query);
    if (!existing) break;
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}

const ARTICLE_LANGS = ['en', 'es', 'de', 'tr', 'fr'];

exports.getAllArticles = async (req, res, next) => {
  try {
    const PAGE_SIZE = 20;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const totalItems = await Article.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    res.render('sellercompany/all-articles', {
      path: '/admin/articles',
      pageTitle: 'Articles',
      articles,
      isAuthenticated: req.session.isLoggedIn,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/articles'
    });
  } catch (err) {
    next(err);
  }
};

// GET: Add Article Form
exports.getAddArticle = (req, res) => {
  res.render('sellercompany/add-article', {
    path: '/admin/add-article',
    pageTitle: 'Add Article',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    article: null
  });
};

// POST: Add New Article
exports.postAddArticle = async (req, res) => {
  const author   = (req.body.author || '').trim();
  const category = req.body.category || 'News';

  const file = req.files?.thumbnail?.[0];
  let thumbnail = '';
  if (file) {
    try {
      thumbnail = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'draglab/articles', public_id: file.originalname.split('.')[0], format: 'webp' },
          (error, r) => error ? reject(error) : resolve(r.secure_url)
        ).end(file.buffer);
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      return res.status(500).send('Failed to upload thumbnail');
    }
  }

  const translations = {};
  for (const l of ARTICLE_LANGS) {
    const title   = (req.body[`${l}_title`]   || '').trim();
    const summary = (req.body[`${l}_summary`] || '').trim();
    const body    = req.body[`${l}_body`]    || '';
    const tags    = (req.body[`${l}_tags`]   || '').split(',').map(t => t.trim()).filter(Boolean);
    const status  = req.body[`${l}_status`]  || 'none';

    let slug = '';
    if (title) slug = await generateUniqueSlug(title, null, l);

    const publishedAt = (status === 'published') ? new Date() : undefined;
    translations[l] = { title, slug, body, summary, tags, status, publishedAt };
  }

  try {
    await new Article({ author, category, thumbnail, translations }).save();
    res.redirect('/admin/articles');
  } catch (err) {
    console.error('Error adding article:', err);
    res.status(500).send('Error adding article');
  }
};

// GET: Edit Article Form
exports.getEditArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.redirect('/admin/articles');
    res.render('sellercompany/add-article', {
      article,
      pageTitle: 'Edit Article',
      path: '/admin/edit-article',
      editing: true,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/articles');
  }
};

// POST: Edit Article
exports.postEditArticle = async (req, res) => {
  const author   = (req.body.author || '').trim();
  const category = req.body.category || 'News';
  const file     = req.files?.thumbnail?.[0];

  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.redirect('/admin/articles');

    article.author   = author;
    article.category = category;

    if (file) {
      if (article.thumbnail) {
        const publicId = article.thumbnail.split('/draglab/articles/')[1]?.replace('.webp', '');
        if (publicId) {
          try { await cloudinary.uploader.destroy(`draglab/articles/${publicId}`); } catch { }
        }
      }
      article.thumbnail = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'draglab/articles', public_id: file.originalname.split('.')[0], format: 'webp' },
          (error, r) => error ? reject(error) : resolve(r.secure_url)
        ).end(file.buffer);
      });
    }

    for (const l of ARTICLE_LANGS) {
      const title   = (req.body[`${l}_title`]   || '').trim();
      const summary = (req.body[`${l}_summary`] || '').trim();
      const body    = req.body[`${l}_body`]    || '';
      const tags    = (req.body[`${l}_tags`]   || '').split(',').map(t => t.trim()).filter(Boolean);
      const status  = req.body[`${l}_status`]  || 'none';
      const existing = article.translations[l] || {};

      let slug = existing.slug || '';
      if (title && title !== existing.title) {
        slug = await generateUniqueSlug(title, article._id, l);
      } else if (!slug && title) {
        slug = await generateUniqueSlug(title, article._id, l);
      }

      let publishedAt = existing.publishedAt;
      if (status === 'published' && existing.status !== 'published') {
        publishedAt = new Date();
      }

      article.translations[l] = { title, slug, body, summary, tags, status, publishedAt };
    }

    await article.save();
    res.redirect('/admin/articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating article');
  }
};

// POST: Delete Article
exports.postDeleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.redirect('/admin/articles');

    if (article.thumbnail) {
      const publicId = article.thumbnail.split('/draglab/articles/')[1]?.replace('.webp', '');
      if (publicId) {
        try { await cloudinary.uploader.destroy(`draglab/articles/${publicId}`); } catch { }
      }
    }

    await Article.findByIdAndDelete(req.params.articleId);
    res.redirect('/admin/articles');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/articles');
  }
};









exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    if (!product) return res.redirect('/admin/Myproduct');

    // 🧹 1. Delete related files
    const folderPath = path.join('uploads', 'products', product._id.toString()); // assuming _id = uuid used in folder
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Deleted folder: ${folderPath}`);
    }

    // 🧹 2. Delete model-specific files (if saved outside main folder - unlikely but just in case)
    product.Models.forEach(model => {
      ['ModelThumbnail', 'overviewThumbnail'].forEach(field => {
        if (model[field]) {
          const fullPath = path.join('public', model[field]);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      });

      const langKeys = Object.keys(model.Language || {});
      langKeys.forEach(lang => {
        const langData = model.Language[lang]?.[0];
        if (!langData) return;

        // Delete downloads
        langData.downloads?.forEach(file => {
          const filePath = path.join('public', file.filePath);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        // Delete overview images
        langData.overview?.forEach(o => {
          const imgPath = path.join('public', o.overviewImage || '');
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });

        // Delete industry images and logos
        langData.industry?.forEach(i => {
          const imgPaths = [i.industryImage, i.industryLogo].filter(Boolean);
          imgPaths.forEach(img => {
            const imgPath = path.join('public', img);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          });
        });
      });
    });

    // 🧹 3. Delete product thumbnail & sketch
    ['ProductThumbnail', 'ProductSketch'].forEach(field => {
      if (product[field]) {
        const filePath = path.join('public', product[field]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    // 🗑️ 4. Delete from DB
    await Product.findByIdAndDelete(prodId);
    console.log('✅ Product and files deleted');
    res.redirect('/admin/Myproduct');

  } catch (err) {
    console.error('❌ Error deleting product and files:', err);
    res.redirect('/admin/Myproduct');
  }
};



exports.getDashboard = async (req, res, next) => {
  try {
    const products = await Product.find(); // Await the completion of the find operation



    res.render('sellercompany/dashboard', {
      pageTitle: 'Dashboard',
      products: products,
      path: '/admin/Dashboard',
      lang: 'EN',
      isAuthenticated: req.session.isLoggedIn,
      faqSchema: {
        EN: {
          url: "https://www.drag-lab.de/EN"
        }
      }
    });
  } catch (err) {
    next(new Error(err));
  }
};





exports.getAllCategories = async (req, res) => {
  const categories = await CatalogCategory.find();
  res.render('sellercompany/Catalog-categories', {

    pageTitle: 'Catalog Categories',
    categories,
    path: '/admin/catalogs',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null
  });
};

exports.getAddCategoryForm = (req, res) => {
  res.render('sellercompany/add-category', {
    pageTitle: 'Add Catalog Category',
    path: '/admin/catalogs/add',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    query: req.query

  });
};

exports.postAddCategory = async (req, res) => {
  const { categoryName, categoryKey } = req.body;

  try {
    await new CatalogCategory({ categoryName, categoryKey }).save();
    res.redirect('/admin/catalogs?success=added');
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.redirect('/admin/catalogs/add?error=duplicate');
    }

    console.error('Error adding category:', err);
    res.redirect('/admin/catalogs/add?error=unexpected');
  }
};

exports.getUploadForm = async (req, res) => {
  const category = await CatalogCategory.findById(req.params.categoryId);
  res.render('sellercompany/upload-file', {

    pageTitle: 'Upload File',
    category,
    path: '/admin/catalogs/:categoryId/upload',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null
  });
};

exports.postUploadFile = async (req, res) => {
  try {
    const file = req.files?.catalogFile?.[0];

    if (!file) {
      console.error('⚠️ No file received.');
      return res.redirect('/admin/catalogs?error=nofile');
    }

    const fileSizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // ✅ Check if Category exists before uploading
    const category = await CatalogCategory.findById(req.params.categoryId);
    if (!category) {
      console.error('⚠️ Category not found.');
      return res.status(404).send('Category not found.');
    }

    // ✅ Upload to Cloudinary as a raw file (PDF/DOCX)
    const sanitizedFilename = sanitize(file.originalname);
    let fileUrl = '';
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'draglab/catalogs',
            public_id: `${Date.now()}-${sanitizedFilename}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(file.buffer);
      });

      fileUrl = result;
      console.log('Uploaded to Cloudinary:', fileUrl);
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      return res.redirect('/admin/catalogs?error=upload');
    }

    // ✅ Save to Category
    category.files.push({
      fileName: req.body.fileName,
      filePath: fileUrl,
      fileSize: fileSizeMB,
      language: req.body.language
    });

    await category.save();
    res.redirect('/admin/catalogs?success=true');
  } catch (err) {
    console.error('Error uploading catalog file:', err);
    res.redirect('/admin/catalogs?error=true');
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await CatalogCategory.findById(req.params.categoryId);

  for (const file of category.files) {
    const publicId = file.filePath.split('/draglab/catalogs/')[1].replace(/\.[^/.]+$/, '');

    try {
      const result = await cloudinary.uploader.destroy(`draglab/catalogs/${publicId}`, {
        resource_type: 'raw'
      });
      console.log('File deleted from Cloudinary:', result);
    } catch (err) {
      console.error(`Failed to delete ${file.fileName} from Cloudinary:`, err.message);
    }
  }

  await CatalogCategory.findByIdAndDelete(req.params.categoryId);
  res.redirect('/admin/catalogs');
};


exports.deleteFile = async (req, res) => {
  const { categoryId, fileId } = req.params;
  const category = await CatalogCategory.findById(categoryId);

  const file = category.files.id(fileId);

  // ✅ Extract the public ID from the Cloudinary URL
  if (file && file.filePath) {
    const publicId = file.filePath.split('/draglab/catalogs/')[1].replace(/\.[^/.]+$/, '');

    try {
      const result = await cloudinary.uploader.destroy(`draglab/catalogs/${publicId}`, {
        resource_type: 'raw'
      });
      console.log('File deleted from Cloudinary:', result);
    } catch (err) {
      console.error('Failed to delete file from Cloudinary:', err.message);
    }
  }

  category.files.id(fileId).deleteOne();
  await category.save();

  res.redirect('/admin/catalogs');
};



exports.getAllTechnicalRequests = async (req, res) => {
  try {
    const PAGE_SIZE = 20;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const totalItems = await TechnicalService.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const requests = await TechnicalService.find()
      .populate('deviceCategory')
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    // Batch-fetch all products needed for model names (fixes N+1 query)
    const productIds = [...new Set(
      requests.filter(r => r.deviceCategory).map(r => r.deviceCategory._id.toString())
    )];
    const productMap = {};
    if (productIds.length) {
      const products = await Product.find({ _id: { $in: productIds } }).select('Models');
      products.forEach(p => { productMap[p._id.toString()] = p; });
    }

    const requestsWithModelNames = requests.map(r => {
      let modelName = 'None';
      if (r.deviceCategory && r.deviceModel) {
        const product = productMap[r.deviceCategory._id.toString()];
        const model = product?.Models?.id(r.deviceModel);
        modelName = model?.Language?.EN?.[0]?.ModelName || 'None';
      }
      return { ...r.toObject(), modelName };
    });

    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    res.render('sellercompany/all-technical-service', {
      pageTitle: 'Technical Support Requests',
      path: '/admin/TechnicalRequests',
      requests: requestsWithModelNames,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/TechnicalRequests'
    });
  } catch (err) {
    console.error('Error loading technical requests:', err);
    res.redirect('/admin/Dashboard');
  }
};

exports.getTechnicalRequestById = async (req, res) => {
  try {
    const request = await TechnicalService.findById(req.params.id)
      .populate('deviceCategory');

    if (!request) return res.redirect('/admin/technical-requests');

    let modelName = 'None';
    if (request.deviceCategory && request.deviceModel) {
      const product = await Product.findById(request.deviceCategory._id);
      const model = product?.Models?.id(request.deviceModel);
      modelName = model?.Language?.EN?.[0]?.ModelName || 'None';
    }

    res.render('sellercompany/view-technical-request', {
      pageTitle: 'Technical Request Details',
      path: '/admin/technical-requests',
      request,
      modelName,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error('Error fetching request:', err);
    res.redirect('/admin/technical-requests');
  }
};



exports.markTechnicalRequestDone = async (req, res) => {
  try {
    await TechnicalService.findByIdAndUpdate(req.params.id, { status: 'done' });
    res.redirect(`/admin/technical-requests/${req.params.id}`);
  } catch (err) {
    console.error('Error marking as done:', err);
    res.redirect('/admin/technical-requests');
  }
};


exports.postMarkTechnicalSpam = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    const doc = await TechnicalService.findById(req.params.id);
    if (!doc) return res.redirect('/admin/TechnicalRequests');
    doc.isSpam = !doc.isSpam;
    await doc.save();
    res.redirect('/admin/TechnicalRequests');
  } catch (err) { console.error(err); next(err); }
};

exports.deleteTechnicalRequest = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    await TechnicalService.findByIdAndDelete(req.params.id);
    res.redirect('/admin/TechnicalRequests');
  } catch (err) { console.error(err); next(err); }
};

exports.exportTechnicalRequestPDF = async (req, res) => {
  try {
    const request = await TechnicalService.findById(req.params.id).populate('deviceCategory');

    // Manually get model name if it's a subdocument in Product.Models
    let modelName = 'None';
    if (request.deviceCategory && request.deviceModel) {
      const product = await Product.findById(request.deviceCategory._id);
      const model = product?.Models?.id(request.deviceModel);
      modelName = model?.Language?.EN?.[0]?.ModelName || 'None';
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-disposition', `attachment; filename=request-${req.params.id}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    const getOrNone = (val) => val || 'None';
    const getLangName = (product) => product?.Language?.EN?.[0]?.ProductName || 'None';

    // Header
    doc
      .fillColor('#1f4e78')
      .fontSize(22)
      .text('Technical Support Request', { align: 'center', underline: true })
      .moveDown(1.5);

    // Submission Info
    doc
      .fontSize(14)
      .fillColor('black')
      .text('Submission Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Status: `, { continued: true }).font('Helvetica-Bold').text(getOrNone(request.status))
      .font('Helvetica').text(`Date Submitted: `, { continued: true }).font('Helvetica-Bold').text(request.createdAt.toLocaleDateString())
      .moveDown();

    // Personal Info
    doc
      .font('Helvetica')
      .fontSize(14)
      .fillColor('black')
      .text('Personal Information', { underline: true })
      .moveDown(0.5);

    const infoPairs = [
      ['Info Type', getOrNone(request.infoType)],
      ['Salutation', getOrNone(request.salutation)],
      ['First Name', getOrNone(request.firstName)],
      ['Last Name', getOrNone(request.lastName)],
      ['Company', getOrNone(request.company)],
      ['Department', getOrNone(request.department)],
      ['Street', getOrNone(request.street)],
      ['Postal/Town', getOrNone(request.postalTown)],
      ['Country', getOrNone(request.country)],
      ['Telephone', getOrNone(request.telephone)],
      ['Telefax', getOrNone(request.telefax)],
      ['Email', getOrNone(request.email)],
    ];

    infoPairs.forEach(([label, value]) => {
      doc.font('Helvetica').fontSize(12).text(`${label}: `, { continued: true }).font('Helvetica-Bold').text(value);
    });

    doc.moveDown();

    // Device Info
    doc
      .font('Helvetica')
      .fontSize(14)
      .fillColor('black')
      .text('Device Information', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Device Category: `, { continued: true }).font('Helvetica-Bold').text(getLangName(request.deviceCategory))
      .font('Helvetica').text(`Device Model: `, { continued: true }).font('Helvetica-Bold').text(modelName)
      .font('Helvetica').text(`Serial No: `, { continued: true }).font('Helvetica-Bold').text(getOrNone(request.serialNo))
      .font('Helvetica').text(`Failure Date: `, { continued: true }).font('Helvetica-Bold').text(request.failureDate ? new Date(request.failureDate).toLocaleDateString() : 'None')
      .moveDown();

    // Note
    doc
      .font('Helvetica')
      .fontSize(14)
      .fillColor('black')
      .text('User Note', { underline: true })
      .moveDown(0.5)
      .font('Helvetica')
      .fontSize(12)
      .text(getOrNone(request.note), {
        indent: 20,
        lineGap: 4,
        align: 'justify'
      });

    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    res.redirect(`/admin/technical-requests/${req.params.id}`);
  }
};







exports.getAllWarrantyRegistrations = async (req, res) => {
  try {
    const PAGE_SIZE = 20;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const totalItems = await WarrantyRegistration.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const warranties = await WarrantyRegistration.find()
      .populate('deviceCategory')
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    // Batch-fetch all products needed for model names (fixes N+1 query)
    const productIds = [...new Set(
      warranties.filter(r => r.deviceCategory).map(r => r.deviceCategory._id.toString())
    )];
    const productMap = {};
    if (productIds.length) {
      const products = await Product.find({ _id: { $in: productIds } }).select('Models');
      products.forEach(p => { productMap[p._id.toString()] = p; });
    }

    const withModelNames = warranties.map(reg => {
      const product = productMap[reg.deviceCategory?._id?.toString()];
      const model = product?.Models?.id(reg.deviceModel);
      return {
        ...reg.toObject(),
        modelName: model?.Language?.EN?.[0]?.ModelName || 'None'
      };
    });

    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    res.render('sellercompany/all-warranty-registrations', {
      warranties: withModelNames,
      pageTitle: 'Warranty Registrations',
      path: '/admin/warranty-registrations',
      isAuthenticated: req.session.isLoggedIn,
      isAdmin,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/warranty-registrations'
    });
  } catch (err) {
    console.error('Error loading warranties:', err);
    res.redirect('/admin/Dashboard');
  }
};


exports.getWarrantyRegistrationById = async (req, res) => {
  try {
    const reg = await WarrantyRegistration.findById(req.params.id).populate('deviceCategory');
    const product = await Product.findById(reg.deviceCategory);
    const model = product?.Models?.id(reg.deviceModel);

    res.render('sellercompany/view-warranty-registration', {
      registration: reg,
      modelName: model?.Language?.EN?.[0]?.ModelName || 'None',
      isAuthenticated: req.session.isLoggedIn,
      path: '/admin/warranty-registrations', // ✅ Add this
      isAuthenticated: req.session.isLoggedIn,

    });
  } catch (err) {
    console.error('Error getting warranty:', err);
    res.redirect('/admin/warranty-registrations');
  }
};



exports.markWarrantyAsDone = async (req, res) => {
  try {
    await WarrantyRegistration.findByIdAndUpdate(req.params.id, { status: 'done' });
    res.redirect(`/admin/warranty-registrations/${req.params.id}`);
  } catch (err) {
    console.error('Error updating status:', err);
    res.redirect('/admin/warranty-registrations');
  }
};



exports.postMarkWarrantySpam = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    const doc = await WarrantyRegistration.findById(req.params.id);
    if (!doc) return res.redirect('/admin/warranty-registrations');
    doc.isSpam = !doc.isSpam;
    await doc.save();
    res.redirect('/admin/warranty-registrations');
  } catch (err) { console.error(err); next(err); }
};

exports.deleteWarrantyRegistration = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    await WarrantyRegistration.findByIdAndDelete(req.params.id);
    res.redirect('/admin/warranty-registrations');
  } catch (err) { console.error(err); next(err); }
};

exports.exportWarrantyToPDF = async (req, res) => {
  try {
    const reg = await WarrantyRegistration.findById(req.params.id).populate('deviceCategory');

    const product = await Product.findById(reg.deviceCategory);
    const model = product?.Models?.id(reg.deviceModel);
    const modelName = model?.Language?.EN?.[0]?.ModelName || 'None';
    const categoryName = product?.Language?.EN?.[0]?.ProductName || 'None';

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-disposition', `attachment; filename=warranty-${reg._id}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    const getOrNone = (val) => val || 'None';

    doc
      .fontSize(20)
      .fillColor('#1f4e78')
      .text('Warranty Registration', { align: 'center', underline: true })
      .moveDown(1.5);

    doc
      .fontSize(14)
      .fillColor('black')
      .text('Customer Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .font('Helvetica')
      .text(`Name: ${getOrNone(reg.name)}`)
      .text(`Email: ${getOrNone(reg.email)}`)
      .text(`Date Purchased: ${reg.datePurchased.toLocaleDateString()}`)
      .moveDown();

    doc
      .fontSize(14)
      .text('Device Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Device Category: ${categoryName}`)
      .text(`Device Model: ${modelName}`)
      .text(`Serial No: ${getOrNone(reg.serialNo)}`)
      .text(`Message: ${getOrNone(reg.message)}`)
      .text(`Status: ${reg.status}`)
      .text(`Submitted: ${reg.createdAt.toLocaleDateString()}`);

    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    res.redirect(`/admin/warranty-registrations/${req.params.id}`);
  }
};









// Admin - List All
exports.getAllContactUs = async (req, res, next) => {
  try {
    const PAGE_SIZE = 20;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    const totalItems = await ContactUs.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const messages = await ContactUs.find()
      .sort({ dateSubmitted: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    res.render('sellercompany/contactUs-list', {
      pageTitle: 'Contact Messages',
      path: '/admin/contactUs-list',
      isAuthenticated: req.session.isLoggedIn,
      isAdmin,
      messages,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/contact-messages'
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Admin only — toggle spam flag
exports.postMarkContactUsSpam = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');

    const message = await ContactUs.findById(req.params.id);
    if (!message) return res.redirect('/admin/contact-messages');

    message.isSpam = !message.isSpam; // toggle
    await message.save();
    res.redirect('/admin/contact-messages');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Admin only — permanently delete a contact message
exports.deleteContactUs = async (req, res, next) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');

    await ContactUs.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contact-messages');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Admin - View Single ContactUs
exports.getContactUsDetail = (req, res, next) => {
  const messageId = req.params.id;
  ContactUs.findById(messageId)
    .then(message => {
      if (!message) return res.redirect('/admin/contact-messages');
      res.render('sellercompany/contactUs-detail', {
        pageTitle: 'Contact Message Detail',
        path: '/admin/contactUs-detail',
        isAuthenticated: req.session.isLoggedIn,
        message
      });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
};

// Admin - Mark as Done
exports.postMarkContactUsDone = (req, res, next) => {
  const messageId = req.body.messageId;
  ContactUs.findById(messageId)
    .then(message => {
      if (!message) return res.redirect('/admin/contact-messages');
      message.isDone = true;
      return message.save();
    })
    .then(() => res.redirect('/admin/contact-messages'))
    .catch(err => {
      console.error(err);
      next(err);
    });
};

// Admin - Download as PDF
exports.exportContactUsToPDF = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);

    if (!contact) {
      return res.redirect('/admin/contact-messages');
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-disposition', `attachment; filename=contact-${contact._id}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    const getOrNone = (val) => val || 'None';

    // Header
    doc
      .fontSize(20)
      .fillColor('#1f4e78')
      .text('Contact Message', { align: 'center', underline: true })
      .moveDown(1.5);

    // Contact Info
    doc
      .fontSize(14)
      .fillColor('black')
      .text('Customer Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .font('Helvetica')
      .text(`First Name: ${getOrNone(contact.firstName)}`)
      .text(`Last Name: ${getOrNone(contact.lastName)}`)
      .text(`Email: ${getOrNone(contact.email)}`)
      .text(`Subject: ${getOrNone(contact.subject)}`)
      .moveDown();

    // Message
    doc
      .fontSize(14)
      .text('Message', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`${getOrNone(contact.message)}`)
      .moveDown();

    // Status and Date
    doc
      .fontSize(14)
      .text('Submission Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Status: ${contact.isDone ? 'Done' : 'Pending'}`)
      .text(`Date Submitted: ${contact.dateSubmitted.toLocaleDateString()}`);

    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    res.redirect(`/admin/contact-message/${req.params.id}`);
  }
};



exports.getAddIndustry = async (req, res) => {
  try {
    const allProducts = await Product.find({}, 'slug Language'); // only fetch necessary fields

    res.render('sellercompany/add-industry', {
      pageTitle: 'Add Industry Page',
      path: '/admin/add-industry',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      industry: null,
      allProducts, // ✅ send products to EJS
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error('❌ Error loading Add Industry Page:', err);
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session?.isLoggedIn || false
    });
  }
};



exports.postAddIndustry = async (req, res) => {
  try {
    const { saveType } = req.body;
    const isDraft = saveType === 'draft';
    const slideImage = req.files?.slideImage?.[0]?.cloudinaryUrl || '';
    const introImage = req.files?.introImage?.[0]?.cloudinaryUrl || '';

    const languages = allanguages;
    const languageData = {};
    const validationErrors = [];

    const frequentlyUsedProducts = {}; // ✅ FIXED

    for (const lang of languages) {
      const slideTitle = req.body[`slideTitle_${lang}`] || '';
      const slideSubTitle = req.body[`slideSubTitle_${lang}`] || '';
      const slideDesc = req.body[`slideDesc_${lang}`] || '';
      const introTitle = req.body[`introTitle_${lang}`] || '';
      const introDesc = req.body[`introDesc_${lang}`] || '';
      const featureNames = req.body[`FeatureName_${lang}`] || [];
      const featureDescs = req.body[`FeatureDesc_${lang}`] || [];
      const oldFeatureImages = req.body[`OldFeatureImage_${lang}`] || [];

      const features = [];

      for (let i = 0; i < 3; i++) {
        let FeatureImage = '';
        if (lang === 'EN') {
          FeatureImage = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0]?.cloudinaryUrl || oldFeatureImages[i] || '';
        }

        if (!isDraft && lang === 'EN') {
          if (!featureNames[i]) {
            validationErrors.push({ path: `FeatureName_${lang}_${i}`, msg: `Feature Name ${i + 1} (${lang}) is required.` });
          }
          if (!FeatureImage) {
            validationErrors.push({ path: `FeatureImage_${lang}_${i}`, msg: `Feature Image ${i + 1} (${lang}) is required.` });
          }
        }

        features.push({
          FeatureName: featureNames[i] || '',
          FeatureDesc: featureDescs[i] || '',
          ...(lang === 'EN' ? { FeatureImage } : {})
        });
      }

      // ✅ Handle Frequently Used Products per language
      frequentlyUsedProducts[lang] = [];
      const productIds = req.body[`frequentlyUsedProductId_${lang}`] || [];
      const productTexts = req.body[`frequentlyUsedProductText_${lang}`] || [];

      for (let i = 0; i < productIds.length; i++) {
        if (productIds[i] && productTexts[i]) {
          frequentlyUsedProducts[lang].push({
            productId: productIds[i],
            text: productTexts[i]
          });
        }
      }

      languageData[lang] = [{
        slideTitle, slideSubTitle, slideDesc, introTitle, introDesc, features
      }];
    }

    // ✅ Validate shared images
    if (!isDraft) {
      if (!slideImage) {
        validationErrors.push({ path: 'slideImage', msg: 'Slide Image is required.' });
      }
      if (!introImage) {
        validationErrors.push({ path: 'introImage', msg: 'Intro Image is required.' });
      }
    }

    // ✅ Generate slug
    const slug = slugify(req.body['slideTitle_EN'] || 'untitled-industry', { lower: true, strict: true });

    // ✅ Check for duplicate
    const existing = await IndustryPage.findOne({ slug });
    if (existing) {
      validationErrors.push({ path: 'slideTitle_EN', msg: 'An industry page with this title already exists.' });
    }

    if (validationErrors.length > 0) {
      const allProducts = await Product.find({ isDraft: false });

      return res.status(422).render('sellercompany/add-industry', {
        pageTitle: 'Add Industry Page',
        path: '/admin/add-industry',
        editing: false,
        hasError: true,
        errorMessage: 'Please fix the errors below.',
        validationErrors,
        industry: {
          slug,
          sharedImages: { slideImage, introImage },
          Language: languageData,
          frequentlyUsedProducts
        },
        allProducts,
        isAuthenticated: req.session.isLoggedIn
      });
    }

    // ✅ Save
    const page = new IndustryPage({
      slug,
      sharedImages: { slideImage, introImage },
      Language: languageData,
      frequentlyUsedProducts,
      isDraft
    });

    await page.save();
    console.log('✅ Industry Page Saved Successfully');
    res.redirect('/admin/industry-pages');

  } catch (err) {
    console.error('❌ Error saving Industry Page:', err);
    res.status(500).send('Internal Server Error');
  }
};



exports.getEditIndustryPage = async (req, res) => {
  const slug = req.params.slug;

  try {
    const industry = await IndustryPage.findOne({ slug });
    const allProducts = await Product.find({}, 'slug ProductThumbnail Language');

    if (!industry) {
      return res.status(404).render('404', {
        pageTitle: 'Not Found',
        path: '/sellercompany/industry-pages'
      });
    }

    res.render('sellercompany/add-industry', {
      pageTitle: 'Edit Industry Page',
      path: '/admin/edit-industry',
      editing: true,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      industry,
      allProducts,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error('❌ Error loading Industry Page for edit:', err.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.postEditIndustryPage = async (req, res) => {
  try {
    const { industryId, slug, saveType } = req.body;
    const isDraft = saveType === 'draft';
    const languages = ['EN', 'ES', 'DE', 'TR', 'FR'];
    const validationErrors = [];
    const languageData = {};

    const slideImage = req.files?.slideImage?.[0]?.cloudinaryUrl || '';
    const introImage = req.files?.introImage?.[0]?.cloudinaryUrl || '';

    // ✅ Fetch the existing document
    const industry = await IndustryPage.findById(industryId);
    if (!industry) {
      return res.status(404).send('Industry page not found.');
    }
    const allProducts = await Product.find({ isDraft: false }); // ✅ FIX HERE

    // ✅ Build language data
    const frequentlyUsedProducts = {};

    for (const lang of languages) {
      const slideTitle = req.body[`slideTitle_${lang}`] || '';
      const slideSubTitle = req.body[`slideSubTitle_${lang}`] || '';
      const slideDesc = req.body[`slideDesc_${lang}`] || '';
      const introTitle = req.body[`introTitle_${lang}`] || '';
      const introDesc = req.body[`introDesc_${lang}`] || '';
      const featureNames = req.body[`FeatureName_${lang}`] || [];
      const featureDescs = req.body[`FeatureDesc_${lang}`] || [];
      const oldFeatureImages = req.body[`OldFeatureImage_${lang}`] || [];

      const features = [];

      for (let i = 0; i < 3; i++) {
        let FeatureImage = '';
        if (lang === 'EN') {
          const file = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0];
          FeatureImage = file?.cloudinaryUrl || oldFeatureImages[i] || '';
        }

        if (!isDraft && lang === 'EN') {
          if (!featureNames[i]) {
            validationErrors.push({
              path: `FeatureName_${lang}_${i}`,
              msg: `Feature Name ${i + 1} (${lang}) is required.`
            });
          }
          if (!FeatureImage) {
            validationErrors.push({
              path: `FeatureImage_${lang}_${i}`,
              msg: `Feature Image ${i + 1} (${lang}) is required.`
            });
          }
        }

        features.push({
          FeatureName: featureNames[i] || '',
          FeatureDesc: featureDescs[i] || '',
          ...(lang === 'EN' ? { FeatureImage } : {})
        });
      }
      // ✅ Save frequently used products for this language
      const productIds = req.body[`frequentlyUsedProductId_${lang}`] || [];
      const productTexts = req.body[`frequentlyUsedProductText_${lang}`] || [];
      frequentlyUsedProducts[lang] = [];

      for (let i = 0; i < productIds.length; i++) {
        if (productIds[i] && productTexts[i]) {
          frequentlyUsedProducts[lang].push({
            productId: productIds[i],
            text: productTexts[i]
          });
        }
      }

      languageData[lang] = [{
        slideTitle,
        slideSubTitle,
        slideDesc,
        introTitle,
        introDesc,
        features
      }];
    }

    // ✅ Check shared images if required
    if (!isDraft) {
      if (!slideImage && !industry.sharedImages?.slideImage) {
        validationErrors.push({ path: 'slideImage', msg: 'Slide Image is required.' });
      }
      if (!introImage && !industry.sharedImages?.introImage) {
        validationErrors.push({ path: 'introImage', msg: 'Intro Image is required.' });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(422).render('sellercompany/add-industry', {
        pageTitle: 'Edit Industry Page',
        path: '/admin/edit-industry',
        editing: true,
        hasError: true,
        errorMessage: 'Please fix the errors below.',
        validationErrors,
        industry: {
          _id: industryId,
          slug: slug,
          sharedImages: {
            slideImage: slideImage || industry.sharedImages.slideImage,
            introImage: introImage || industry.sharedImages.introImage
          },
          Language: languageData,
          frequentlyUsedProducts
        },
        allProducts,
        isAuthenticated: req.session.isLoggedIn
      });
    }

    // ✅ Update and save
    industry.slug = slugify(req.body['slideTitle_EN'] || 'industry', {
      lower: true,
      strict: true
    });

    industry.sharedImages.slideImage = slideImage || industry.sharedImages.slideImage;
    industry.sharedImages.introImage = introImage || industry.sharedImages.introImage;
    industry.Language = languageData;
    industry.frequentlyUsedProducts = frequentlyUsedProducts;
    industry.isDraft = isDraft;

    await industry.save();

    console.log('✅ Industry page updated successfully.');
    res.redirect('/admin/industry-pages');

  } catch (err) {
    console.error('❌ Error updating Industry Page:', err.message);
    res.status(500).send('Internal Server Error');
  }
};



exports.getMyIndustriesPage = async (req, res) => {
  try {
    const industries = await IndustryPage.find().sort({ createdAt: -1 });
    res.render('sellercompany/my-industries', {
      pageTitle: 'My Industries',
      path: '/admin/industry-pages',
      industries,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error('❌ Failed to load industries:', err.message);
    res.status(500).render('500', {
      pageTitle: 'Error',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    });
  }
};



exports.postDeleteIndustry = async (req, res) => {
  const industryId = req.body.industryId;

  try {
    const industry = await IndustryPage.findById(industryId);
    if (!industry) {
      return res.status(404).redirect('/admin/industry-pages');
    }

    // 🧹 Delete images from Cloudinary (if you saved public_ids)
    const EN = industry.Language?.EN?.[0];
    if (EN?.slideImageId) await cloudinary.uploader.destroy(EN.slideImageId);
    if (EN?.heroImageId) await cloudinary.uploader.destroy(EN.heroImageId);

    // Delete from DB
    await IndustryPage.findByIdAndDelete(industryId);

    res.redirect('/admin/industry-pages');
  } catch (err) {
    console.error('❌ Error deleting industry:', err.message);
    res.status(500).redirect('/admin/industry-pages');
  }
};



exports.getNewsletterList = async (req, res, next) => {
  try {
    const PAGE_SIZE = 50;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const totalItems = await NewsletterSubscriber.countDocuments();
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const subscribers = await NewsletterSubscriber.find()
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    res.render('sellercompany/newsletter-list', {
      pageTitle: 'Newsletter Subscribers',
      path: '/admin/newsletter',
      subscribers,
      currentPage: page,
      totalPages,
      totalItems,
      baseUrl: '/admin/newsletter'
    });
  } catch (err) {
    next(err);
  }
};


const ExcelJS = require('exceljs');
const { all } = require('axios');

async function exportSubscribers(res, filter, markExtracted = false) {
  const subscribers = await NewsletterSubscriber.find(filter);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Subscribers');

  sheet.columns = [
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Language', key: 'language', width: 10 },
    { header: 'Subscribed At', key: 'subscribedAt', width: 25 },
    { header: 'IP Address', key: 'ipAddress', width: 20 },
    { header: 'Country', key: 'country', width: 15 },
    { header: 'City', key: 'city', width: 15 }
  ];

  subscribers.forEach(sub => {
    sheet.addRow({
      email: sub.email,
      language: sub.language,
      subscribedAt: sub.subscribedAt.toLocaleString(),
      ipAddress: sub.ipAddress || '-',
      country: sub.geoLocation?.country || '-',
      city: sub.geoLocation?.city || '-'
    });
  });

  if (markExtracted) {
    await NewsletterSubscriber.updateMany(filter, { isExtracted: true });
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=newsletter.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

exports.exportAllSubscribers = (req, res) => exportSubscribers(res, {});
exports.exportNewSubscribers = (req, res) => exportSubscribers(res, { isExtracted: false }, true);


// ─── User Management (admin only) ────────────────────────────────────────────

const bcrypt = require('bcryptjs');

exports.getUsersList = async (req, res, next) => {
    try {
        const PAGE_SIZE = 20;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const totalItems = await user.countDocuments();
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const users = await user.find()
            .select('-password -resetToken -resetTokenExpiration')
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .lean();
        const successMessage = req.flash('success')[0] || null;
        const errorMessage = req.flash('error')[0] || null;
        res.render('sellercompany/users-list', {
            path: '/admin/users',
            pageTitle: 'User Management',
            isAuthenticated: true,
            isAdmin: req.user.role === 'admin',
            users,
            currentUserId: req.user._id.toString(),
            successMessage,
            errorMessage,
            currentPage: page,
            totalPages,
            totalItems,
            baseUrl: '/admin/users'
        });
    } catch (err) {
        next(err);
    }
};

exports.getAddUserForm = (req, res, next) => {
    const errorMessage = req.flash('error')[0] || null;
    res.render('sellercompany/add-user', {
        path: '/admin/users/add',
        pageTitle: 'Add User',
        isAuthenticated: true,
        isAdmin: req.user.role === 'admin',
        errorMessage,
        oldInput: { name: '', email: '', phoneNumber: '', role: 'subAdmin' },
        validationErrors: []
    });
};

exports.postAddUser = async (req, res, next) => {
    const { name, email, phoneNumber, password, confirmPassword, role } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const msgs = errors.array().map(e => e.msg).join(', ');
        return res.status(422).render('sellercompany/add-user', {
            path: '/admin/users/add',
            pageTitle: 'Add User',
            isAuthenticated: true,
            isAdmin: req.user.role === 'admin',
            errorMessage: msgs,
            oldInput: { name, email, phoneNumber, role },
            validationErrors: errors.array()
        });
    }

    if (password !== confirmPassword) {
        return res.status(422).render('sellercompany/add-user', {
            path: '/admin/users/add',
            pageTitle: 'Add User',
            isAuthenticated: true,
            isAdmin: req.user.role === 'admin',
            errorMessage: 'Passwords do not match.',
            oldInput: { name, email, phoneNumber, role },
            validationErrors: []
        });
    }

    try {
        const existing = await user.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(422).render('sellercompany/add-user', {
                path: '/admin/users/add',
                pageTitle: 'Add User',
                isAuthenticated: true,
                isAdmin: req.user.role === 'admin',
                errorMessage: 'A user with this email already exists.',
                oldInput: { name, email, phoneNumber, role },
                validationErrors: []
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new user({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phoneNumber: phoneNumber.trim(),
            role: role === 'admin' ? 'admin' : 'subAdmin'
        });
        await newUser.save();
        req.flash('success', `User "${name}" created successfully.`);
        res.redirect('/admin/users');
    } catch (err) {
        next(err);
    }
};

exports.getEditUser = async (req, res, next) => {
    try {
        const targetUser = await user.findById(req.params.id).select('-password -resetToken -resetTokenExpiration').lean();
        if (!targetUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/admin/users');
        }
        const errorMessage = req.flash('error')[0] || null;
        const successMessage = req.flash('success')[0] || null;
        res.render('sellercompany/edit-user', {
            path: '/admin/users',
            pageTitle: 'Edit User',
            isAuthenticated: true,
            isAdmin: req.user.role === 'admin',
            targetUser,
            errorMessage,
            successMessage,
            validationErrors: []
        });
    } catch (err) {
        next(err);
    }
};

exports.postEditUser = async (req, res, next) => {
    const { name, email, phoneNumber, role } = req.body;
    const userId = req.params.id;

    try {
        const targetUser = await user.findById(userId);
        if (!targetUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/admin/users');
        }

        // Check email uniqueness (excluding current user)
        const emailConflict = await user.findOne({ email: email.toLowerCase().trim(), _id: { $ne: userId } });
        if (emailConflict) {
            return res.status(422).render('sellercompany/edit-user', {
                path: '/admin/users',
                pageTitle: 'Edit User',
                isAuthenticated: true,
                isAdmin: req.user.role === 'admin',
                targetUser: { ...targetUser.toObject(), name, email, phoneNumber, role },
                errorMessage: 'A user with this email already exists.',
                successMessage: null,
                validationErrors: []
            });
        }

        targetUser.name = name.trim();
        targetUser.email = email.toLowerCase().trim();
        targetUser.phoneNumber = phoneNumber.trim();
        targetUser.role = role === 'admin' ? 'admin' : 'subAdmin';
        await targetUser.save();

        req.flash('success', 'User info updated successfully.');
        res.redirect('/admin/users/edit/' + userId);
    } catch (err) {
        next(err);
    }
};

exports.postDeleteUser = async (req, res, next) => {
    const userId = req.params.id;

    if (userId === req.user._id.toString()) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/admin/users');
    }

    try {
        await user.findByIdAndDelete(userId);
        req.flash('success', 'User deleted successfully.');
        res.redirect('/admin/users');
    } catch (err) {
        next(err);
    }
};

exports.postChangeUserPassword = async (req, res, next) => {
    const { newPassword, confirmNewPassword } = req.body;
    const userId = req.params.id;

    if (!newPassword || newPassword.length < 8) {
        req.flash('error', 'Password must be at least 8 characters.');
        return res.redirect('/admin/users/edit/' + userId);
    }

    if (newPassword !== confirmNewPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/admin/users/edit/' + userId);
    }

    try {
        const targetUser = await user.findById(userId);
        if (!targetUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/admin/users');
        }
        targetUser.password = await bcrypt.hash(newPassword, 12);
        await targetUser.save();
        req.flash('success', 'Password changed successfully.');
        res.redirect('/admin/users/edit/' + userId);
    } catch (err) {
        next(err);
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: QUOTES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Builds two lookup maps for a given language:
 *   modelMap:   { [localizedModelName]   → englishModelName }
 *   productMap: { [localizedProductName] → englishProductName }
 * Returns empty maps when lang is 'EN' (no lookup needed).
 */
async function buildEnNameMaps(lang) {
  if (!lang || lang === 'EN') return { modelMap: {}, productMap: {} };
  const products = await Product.find(
    { isDraft: false },
    { [`Language.${lang}`]: 1, 'Language.EN': 1, [`Models.Language.${lang}`]: 1, 'Models.Language.EN': 1 }
  ).lean();

  const modelMap = {};
  const productMap = {};
  products.forEach(p => {
    const langProdName = p.Language?.[lang]?.[0]?.ProductName;
    const enProdName   = p.Language?.EN?.[0]?.ProductName;
    if (langProdName && enProdName && langProdName !== enProdName) {
      productMap[langProdName] = enProdName;
    }
    (p.Models || []).forEach(m => {
      const langName = m.Language?.[lang]?.[0]?.ModelName;
      const enName   = m.Language?.EN?.[0]?.ModelName;
      if (langName && enName && langName !== enName) {
        modelMap[langName] = enName;
      }
    });
  });
  return { modelMap, productMap };
}

exports.getAllQuotes = async (req, res) => {
  try {
    const statusFilter = req.query.status || '';
    const query = statusFilter ? { status: statusFilter } : {};
    const quotes = await Quote.find(query).sort({ createdAt: -1 }).lean();
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    res.render('sellercompany/all-quotes', {
      pageTitle: 'Quote Requests',
      path: '/admin/quotes',
      quotes,
      statusFilter,
      isAdmin,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getAllQuotes error:', err);
    res.status(500).send('Server error');
  }
};

exports.getQuoteDetail = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();
    if (!quote) return res.status(404).send('Quote not found');

    // Build EN-name lookup maps for non-English quotes
    const { modelMap, productMap } = await buildEnNameMaps(quote.lang);

    // Parse model lines and attach English names
    const modelLines = quote.productModel
      ? quote.productModel.split('\n').map(l => {
          const parts = l.split(' × ');
          const name = parts[0] ? parts[0].trim() : l.trim();
          const qty  = parts[1] ? parts[1].trim() : '1';
          return { name, qty, enName: modelMap[name] || null };
        }).filter(r => r.name)
      : [];

    // Enrich product category names with English equivalents
    const productCategoryEN = quote.productCategory
      ? quote.productCategory.split(', ').map(n => productMap[n.trim()] || null).filter(Boolean).join(', ')
      : null;

    res.render('sellercompany/quote-details', {
      pageTitle: 'Quote Details',
      path: '/admin/quotes',
      quote,
      modelLines,
      productCategoryEN: productCategoryEN || null,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getQuoteDetail error:', err);
    res.status(500).send('Server error');
  }
};

exports.postUpdateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Quote.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/quotes/' + req.params.id);
  } catch (err) {
    console.error('postUpdateQuoteStatus error:', err);
    res.status(500).send('Server error');
  }
};

exports.getQuotePdf = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();
    if (!quote) return res.status(404).send('Quote not found');

    const PRIMARY  = '#293C95';
    const DARK     = '#1a2e4a';
    const GREY     = '#7f8c8d';
    const LIGHT_BG = '#F4F6FB';

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `Quote_${quote.companyName.replace(/[^a-z0-9]/gi, '_')}_${quote._id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    /* ── Register Unicode fonts (supports Turkish, German, French, etc.) ── */
    const fontDir = require('path').resolve(__dirname, '../Front-end/assets/fonts');
    doc.registerFont('Regular',  `${fontDir}/Aptos.ttf`);
    doc.registerFont('Bold',     `${fontDir}/Aptos-Bold.ttf`);
    doc.registerFont('SemiBold', `${fontDir}/Aptos-SemiBold.ttf`);

    const pageW = doc.page.width - 100; // usable width (margins 50 each side)
    const COL_QTY = 55; // fixed width for the quantity column
    const COL_NAME = pageW - COL_QTY - 10; // name column width

    /* ── Header ── */
    doc.rect(0, 0, doc.page.width, 70).fill(PRIMARY);
    doc.fillColor('#ffffff').font('Bold').fontSize(20)
       .text('DragLab GmbH', 50, 22);
    doc.fillColor('rgba(255,255,255,0.75)').font('Regular').fontSize(10)
       .text('www.drag-lab.de', 50, 46);
    doc.fillColor('#ffffff').font('Bold').fontSize(13)
       .text('QUOTE REQUEST', 50, 26, { align: 'right' });
    doc.fillColor('rgba(255,255,255,0.75)').font('Regular').fontSize(9)
       .text(`ID: ${quote._id}`, 50, 45, { align: 'right' });

    /* ── Meta row ── */
    doc.y = 90;
    const submitted = new Date(quote.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.fillColor(GREY).font('Regular').fontSize(9)
       .text(`Submitted: ${submitted}   |   Language: ${quote.lang}   |   Status: ${quote.status.toUpperCase()}`,
             50, doc.y, { align: 'right', width: pageW });
    doc.moveDown(0.6);
    doc.moveTo(50, doc.y).lineTo(50 + pageW, doc.y).strokeColor('#dee2e6').lineWidth(1).stroke();
    doc.moveDown(1);

    /* ── Section title helper ── */
    function sectionTitle(label) {
      doc.moveDown(0.3);
      const sy = doc.y;
      doc.rect(50, sy, pageW, 22).fill(LIGHT_BG);
      doc.fillColor(PRIMARY).font('Bold').fontSize(10)
         .text(label.toUpperCase(), 58, sy + 6, { width: pageW - 16 });
      doc.moveDown(0.9);
    }

    /* ── Customer Information ── */
    sectionTitle('Customer Information');

    doc.fillColor(GREY).font('Bold').fontSize(8).text('COMPANY');
    doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.companyName);
    doc.moveDown(0.3);

    doc.fillColor(GREY).font('Bold').fontSize(8).text('COUNTRY');
    doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.country || '—');
    doc.moveDown(0.3);

    if (quote.industry) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('INDUSTRY');
      doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.industry);
      doc.moveDown(0.3);
    }

    doc.fillColor(GREY).font('Bold').fontSize(8).text('CONTACT NAME');
    doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.contactName || '—');
    doc.moveDown(0.3);

    doc.fillColor(GREY).font('Bold').fontSize(8).text('EMAIL');
    doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.email);
    doc.moveDown(0.3);

    if (quote.phone) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('PHONE');
      doc.fillColor(DARK).font('Regular').fontSize(10).text(quote.phone);
      doc.moveDown(0.3);
    }

    /* ── Products & Models ── */
    doc.moveDown(0.8);
    sectionTitle('Products & Models Requested');

    // Build EN name maps for non-English quotes
    const { modelMap: pdfModelMap, productMap: pdfProductMap } = await buildEnNameMaps(quote.lang);

    if (quote.productCategory) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('SELECTED PRODUCTS');
      const catEN = quote.productCategory.split(', ')
        .map(n => pdfProductMap[n.trim()] ? `${n.trim()} (${pdfProductMap[n.trim()]})` : n.trim())
        .join(', ');
      doc.fillColor(DARK).font('Regular').fontSize(10).text(catEN, { width: pageW });
      doc.moveDown(0.6);
    }

    const modelLines = quote.productModel
      ? quote.productModel.split('\n').map(l => {
          const parts = l.split(' × ');
          const name = (parts[0] || l).trim();
          return { name, qty: (parts[1] || '1').trim(), enName: pdfModelMap[name] || null };
        }).filter(r => r.name)
      : [];

    if (modelLines.length) {
      /* Table header */
      const tY = doc.y;
      doc.rect(50, tY, pageW, 22).fill(PRIMARY);
      doc.fillColor('#ffffff').font('Bold').fontSize(9)
         .text('MODEL', 58, tY + 6, { width: COL_NAME });
      doc.fillColor('#ffffff').font('Bold').fontSize(9)
         .text('QTY', 50 + COL_NAME + 10, tY + 6, { width: COL_QTY, align: 'center' });
      doc.y = tY + 22;

      /* Table rows — dynamic height based on text wrap */
      const ROW_PAD_V = 6; // top+bottom padding inside each row
      const ROW_FONT_SIZE = 10;

      modelLines.forEach((row, i) => {
        const displayName = row.enName ? `${row.name}  (${row.enName})` : row.name;

        // Calculate how tall this row needs to be
        doc.font('Regular').fontSize(ROW_FONT_SIZE);
        const textH = doc.heightOfString(displayName, { width: COL_NAME - 8 });
        const rowH  = textH + ROW_PAD_V * 2;

        const rowY = doc.y;

        // Stripe background
        if (i % 2 === 0) doc.rect(50, rowY, pageW, rowH).fill('#f4f6fb');

        // Model name — allowed to wrap
        doc.fillColor(DARK).font('Regular').fontSize(ROW_FONT_SIZE)
           .text(displayName, 58, rowY + ROW_PAD_V, { width: COL_NAME - 8, lineBreak: true });

        // Quantity — vertically centred in the row
        const qtyY = rowY + (rowH - ROW_FONT_SIZE) / 2 - 1;
        doc.fillColor(PRIMARY).font('Bold').fontSize(ROW_FONT_SIZE)
           .text(row.qty, 50 + COL_NAME + 10, qtyY, { width: COL_QTY, align: 'center' });

        // Thin bottom border
        doc.moveTo(50, rowY + rowH).lineTo(50 + pageW, rowY + rowH)
           .strokeColor('#e0e4ef').lineWidth(0.5).stroke();

        doc.y = rowY + rowH;
      });
      doc.moveDown(0.5);
    } else {
      doc.fillColor(GREY).font('Regular').fontSize(10).text('No models selected.');
    }

    /* ── Request Details ── */
    doc.moveDown(0.5);
    sectionTitle('Request Details');

    if (quote.deliveryDeadline) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('DELIVERY DEADLINE');
      doc.fillColor(DARK).font('Regular').fontSize(10)
         .text(new Date(quote.deliveryDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }));
      doc.moveDown(0.4);
    }

    if (quote.message) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('MESSAGE / REQUIREMENTS');
      doc.moveDown(0.2);
      const msgY = doc.y;
      const msgText = quote.message;
      doc.font('Regular').fontSize(10);
      const msgH = doc.heightOfString(msgText, { width: pageW - 16 }) + 16;
      doc.rect(50, msgY, pageW, msgH).fill(LIGHT_BG);
      doc.fillColor(DARK).font('Regular').fontSize(10)
         .text(msgText, 58, msgY + 8, { width: pageW - 16 });
      doc.y = msgY + msgH;
      doc.moveDown(0.6);
    }

    if (quote.fileAttachment) {
      doc.fillColor(GREY).font('Bold').fontSize(8).text('ATTACHED SPECIFICATION FILE');
      doc.fillColor(PRIMARY).font('Regular').fontSize(9)
         .text(quote.fileAttachment, { link: quote.fileAttachment, underline: true });
      doc.moveDown(0.4);
    }

    /* ── Footer (flows after content — never forces an extra page) ── */
    doc.moveDown(1.5);
    doc.moveTo(50, doc.y).lineTo(50 + pageW, doc.y).strokeColor('#dee2e6').lineWidth(0.5).stroke();
    doc.moveDown(0.4);
    doc.fillColor(GREY).font('Regular').fontSize(8)
       .text('DragLab GmbH  ·  www.drag-lab.de  ·  info@drag-lab.de',
             { align: 'center', width: pageW });

    doc.end();
  } catch (err) {
    console.error('getQuotePdf error:', err);
    res.status(500).send('Could not generate PDF');
  }
};


// Admin only — toggle spam flag on a quote
exports.postMarkQuoteSpam = async (req, res) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.redirect('/admin/quotes');
    quote.isSpam = !quote.isSpam;
    await quote.save();
    res.redirect('/admin/quotes');
  } catch (err) {
    console.error('postMarkQuoteSpam error:', err);
    res.status(500).send('Server error');
  }
};

// Admin only — permanently delete a quote
exports.deleteQuote = async (req, res) => {
  try {
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));
    if (!isAdmin) return res.status(403).send('Forbidden');
    await Quote.findByIdAndDelete(req.params.id);
    res.redirect('/admin/quotes');
  } catch (err) {
    console.error('deleteQuote error:', err);
    res.status(500).send('Server error');
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: DISTRIBUTOR APPLICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

exports.getAllDistributorApplications = async (req, res) => {
  try {
    const statusFilter = req.query.status || '';
    const query = statusFilter ? { status: statusFilter } : {};
    const applications = await DistributorApplication.find(query).sort({ createdAt: -1 }).lean();
    res.render('sellercompany/all-distributor-applications', {
      pageTitle: 'Distributor Applications',
      path: '/admin/distributor-applications',
      applications,
      statusFilter,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getAllDistributorApplications error:', err);
    res.status(500).send('Server error');
  }
};

exports.getDistributorApplicationDetail = async (req, res) => {
  try {
    const application = await DistributorApplication.findById(req.params.id).lean();
    if (!application) return res.status(404).send('Application not found');
    res.render('sellercompany/distributor-application-details', {
      pageTitle: 'Distributor Application Details',
      path: '/admin/distributor-applications',
      application,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getDistributorApplicationDetail error:', err);
    res.status(500).send('Server error');
  }
};

exports.postUpdateDistributorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await DistributorApplication.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/distributor-applications/' + req.params.id);
  } catch (err) {
    console.error('postUpdateDistributorStatus error:', err);
    res.status(500).send('Server error');
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: FAQs
// ═══════════════════════════════════════════════════════════════════════════════

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ lang: 1, category: 1, order: 1 }).lean();
    res.render('sellercompany/all-faqs', {
      pageTitle: 'Manage FAQs',
      path: '/admin/faqs',
      faqs,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getAllFaqs error:', err);
    res.status(500).send('Server error');
  }
};

exports.getAddFaq = (req, res) => {
  res.render('sellercompany/add-faq', {
    pageTitle: 'Add FAQ',
    path: '/admin/faqs',
    editing: false,
    faq: null,
    nonce: res.locals.nonce
  });
};

exports.postAddFaq = async (req, res) => {
  try {
    const { question, answer, category, lang, status, relatedProducts, order, slug } = req.body;
    const faq = new FAQ({
      question, answer, category, lang: (lang || 'EN').toUpperCase(),
      status: status || 'draft',
      relatedProducts: relatedProducts ? relatedProducts.split(',').map(s => s.trim()).filter(Boolean) : [],
      order: order ? parseInt(order) : 0,
      slug: slug || question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    });
    await faq.save();
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('postAddFaq error:', err);
    res.status(500).send('Server error');
  }
};

exports.getEditFaq = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id).lean();
    if (!faq) return res.status(404).send('FAQ not found');
    res.render('sellercompany/add-faq', {
      pageTitle: 'Edit FAQ',
      path: '/admin/faqs',
      editing: true,
      faq,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getEditFaq error:', err);
    res.status(500).send('Server error');
  }
};

exports.postEditFaq = async (req, res) => {
  try {
    const { question, answer, category, lang, status, relatedProducts, order, slug } = req.body;
    await FAQ.findByIdAndUpdate(req.params.id, {
      question, answer, category, lang: (lang || 'EN').toUpperCase(),
      status: status || 'draft',
      relatedProducts: relatedProducts ? relatedProducts.split(',').map(s => s.trim()).filter(Boolean) : [],
      order: order ? parseInt(order) : 0,
      slug: slug || question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    });
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('postEditFaq error:', err);
    res.status(500).send('Server error');
  }
};

exports.postDeleteFaq = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('postDeleteFaq error:', err);
    res.status(500).send('Server error');
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: CASE STUDIES
// ═══════════════════════════════════════════════════════════════════════════════

exports.getAllCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 }).lean();
    res.render('sellercompany/all-case-studies', {
      pageTitle: 'Manage Case Studies',
      path: '/admin/case-studies',
      caseStudies,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getAllCaseStudies error:', err);
    res.status(500).send('Server error');
  }
};

exports.getAddCaseStudy = (req, res) => {
  res.render('sellercompany/add-case-study', {
    pageTitle: 'Add Case Study',
    path: '/admin/case-studies',
    editing: false,
    caseStudy: null,
    nonce: res.locals.nonce
  });
};

exports.postAddCaseStudy = async (req, res) => {
  try {
    const { slug, clientType, clientLocation, clientSize, industry, problem, solution, results, status } = req.body;
    const langs = ['en', 'es', 'de', 'tr', 'fr'];
    const translations = {};
    langs.forEach(l => {
      translations[l] = {
        title: req.body[`title_${l}`] || '',
        slug: req.body[`slug_${l}`] || '',
        clientProfile: req.body[`clientProfile_${l}`] || '',
        problem: req.body[`problem_${l}`] || '',
        solution: req.body[`solution_${l}`] || '',
        results: req.body[`results_${l}`] || '',
        summary: req.body[`summary_${l}`] || '',
        status: req.body[`status_${l}`] || 'draft'
      };
    });
    const cs = new CaseStudy({
      title: translations.en.title || req.body.title_en,
      slug: slug || (translations.en.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      clientType, clientLocation, clientSize, industry, problem, solution, results,
      status: status || 'draft',
      translations
    });
    await cs.save();
    res.redirect('/admin/case-studies');
  } catch (err) {
    console.error('postAddCaseStudy error:', err);
    res.status(500).send('Server error');
  }
};

exports.getEditCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id).lean();
    if (!caseStudy) return res.status(404).send('Case study not found');
    res.render('sellercompany/add-case-study', {
      pageTitle: 'Edit Case Study',
      path: '/admin/case-studies',
      editing: true,
      caseStudy,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getEditCaseStudy error:', err);
    res.status(500).send('Server error');
  }
};

exports.postEditCaseStudy = async (req, res) => {
  try {
    const { slug, clientType, clientLocation, clientSize, industry, problem, solution, results, status } = req.body;
    const langs = ['en', 'es', 'de', 'tr', 'fr'];
    const translations = {};
    langs.forEach(l => {
      translations[l] = {
        title: req.body[`title_${l}`] || '',
        slug: req.body[`slug_${l}`] || '',
        clientProfile: req.body[`clientProfile_${l}`] || '',
        problem: req.body[`problem_${l}`] || '',
        solution: req.body[`solution_${l}`] || '',
        results: req.body[`results_${l}`] || '',
        summary: req.body[`summary_${l}`] || '',
        status: req.body[`status_${l}`] || 'draft'
      };
    });
    await CaseStudy.findByIdAndUpdate(req.params.id, {
      title: translations.en.title,
      slug: slug || (translations.en.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      clientType, clientLocation, clientSize, industry, problem, solution, results,
      status: status || 'draft',
      translations
    });
    res.redirect('/admin/case-studies');
  } catch (err) {
    console.error('postEditCaseStudy error:', err);
    res.status(500).send('Server error');
  }
};

exports.postDeleteCaseStudy = async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.redirect('/admin/case-studies');
  } catch (err) {
    console.error('postDeleteCaseStudy error:', err);
    res.status(500).send('Server error');
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GLOSSARY
// ═══════════════════════════════════════════════════════════════════════════════

exports.getAllGlossary = async (req, res) => {
  try {
    const terms = await Glossary.find().sort({ letter: 1, term: 1 }).lean();
    res.render('sellercompany/all-glossary', {
      pageTitle: 'Manage Glossary',
      path: '/admin/glossary',
      terms,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getAllGlossary error:', err);
    res.status(500).send('Server error');
  }
};

exports.getAddGlossary = (req, res) => {
  res.render('sellercompany/add-glossary', {
    pageTitle: 'Add Glossary Term',
    path: '/admin/glossary',
    editing: false,
    term: null,
    nonce: res.locals.nonce
  });
};

exports.postAddGlossary = async (req, res) => {
  try {
    const { term, definition, description, status, relatedProducts } = req.body;
    const slug = req.body.slug || term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const letter = term.charAt(0).toUpperCase();
    const langs = ['en', 'es', 'de', 'tr', 'fr'];
    const translations = {};
    langs.forEach(l => {
      translations[l] = {
        term: req.body[`term_${l}`] || '',
        definition: req.body[`definition_${l}`] || '',
        description: req.body[`description_${l}`] || '',
        status: req.body[`status_${l}`] || 'draft'
      };
    });
    const entry = new Glossary({
      term, slug, definition, description, letter,
      status: status || 'draft',
      relatedProducts: relatedProducts ? relatedProducts.split(',').map(s => s.trim()).filter(Boolean) : [],
      translations
    });
    await entry.save();
    res.redirect('/admin/glossary');
  } catch (err) {
    console.error('postAddGlossary error:', err);
    res.status(500).send('Server error');
  }
};

exports.getEditGlossary = async (req, res) => {
  try {
    const term = await Glossary.findById(req.params.id).lean();
    if (!term) return res.status(404).send('Term not found');
    res.render('sellercompany/add-glossary', {
      pageTitle: 'Edit Glossary Term',
      path: '/admin/glossary',
      editing: true,
      term,
      nonce: res.locals.nonce
    });
  } catch (err) {
    console.error('getEditGlossary error:', err);
    res.status(500).send('Server error');
  }
};

exports.postEditGlossary = async (req, res) => {
  try {
    const { term, definition, description, status, relatedProducts } = req.body;
    const slug = req.body.slug || term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const letter = term.charAt(0).toUpperCase();
    const langs = ['en', 'es', 'de', 'tr', 'fr'];
    const translations = {};
    langs.forEach(l => {
      translations[l] = {
        term: req.body[`term_${l}`] || '',
        definition: req.body[`definition_${l}`] || '',
        description: req.body[`description_${l}`] || '',
        status: req.body[`status_${l}`] || 'draft'
      };
    });
    await Glossary.findByIdAndUpdate(req.params.id, {
      term, slug, definition, description, letter,
      status: status || 'draft',
      relatedProducts: relatedProducts ? relatedProducts.split(',').map(s => s.trim()).filter(Boolean) : [],
      translations
    });
    res.redirect('/admin/glossary');
  } catch (err) {
    console.error('postEditGlossary error:', err);
    res.status(500).send('Server error');
  }
};

exports.postDeleteGlossary = async (req, res) => {
  try {
    await Glossary.findByIdAndDelete(req.params.id);
    res.redirect('/admin/glossary');
  } catch (err) {
    console.error('postDeleteGlossary error:', err);
    res.status(500).send('Server error');
  }
};
