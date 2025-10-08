const path = require('path'); // Add this line to import the path module
const Product = require('../models/product'); // Add this line to import the Product model
const Slideshow = require('../models/slideshow');
const user = require('../models/user');
const CatalogCategory = require('../models/CatalogCategory');
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
    const validationErrors = [];

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
          Language: languageData
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





exports.getMyproduct = (req, res, next) => {
  Product.find()
    // .select('ProductName Productprice productThumbnail description warranty quantity InternalMemory Company deliveryTimeFrom deliveryTimeTo category feature1 featureDetail1 feature2 featureDetail2 userId')
    // .populate('userId', 'name')

    .then(products => {
      res.render('sellercompany/my-products', {
        pageTitle: 'My Product',
        path: '/admin/Myproduct',
        prods: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });

};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('sellercompany/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        validationErrors: [],
        errorMessage: null,
        isAuthenticated: req.session.isLoggedIn,
        isDraft: product.isDraft,
        languages: allanguages  // <-- optional convenience

        // ❌ no categories anymore
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const languages = allanguages;
    const languageData = {};
    const validationErrors = [];

    // who is editing?
    const isAdmin = !!(req.user && (req.user.role === 'admin' || req.user.isAdmin === true));

    // Pull existing for publish fallback (non-admin) and old values
    const existing = await Product.findById(productId)
      .select('Language ProductThumbnail ProductSketch isDraft')
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
      // - EN always when publishing (even if EN isn’t toggled)
      // - Any other lang only if its publish is toggled
      const validateThisLanguage = anyLangPublished && (lang === 'EN' || effectivePublish);

      const productName = (req.body[`ProductName_${lang}`] || '').trim();
      const productNameDesc = (req.body[`ProductNameDesc_${lang}`] || '').trim();
      const productDesc = (req.body[`ProductDesc_${lang}`] || '').trim();
      const whyProductDesc = (req.body[`WhyProductDesc_${lang}`] || '').trim();

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
          ProductSketch: updatedProductSketch
        }
      });
    }

    // ✅ Update DB
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    product.Language = languageData;
    product.ProductThumbnail = updatedProductThumbnail;
    product.ProductSketch = updatedProductSketch;

    // CRUCIAL: If nothing is published, mark draft so Mongoose "required" won’t fire later.
    product.isDraft = !anyLangPublished;

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
  Product.findById(productId).then(product => {
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
      errorMessage: null
    });
  }).catch(err => next(err));
};

exports.getEditModel = (req, res, next) => {
  const { productId, modelId } = req.params;
  Product.findById(productId).then(product => {
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
      errorMessage: null
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




exports.postAddModel = async (req, res) => {
  const productId = req.params.productId;
  const languages = allanguages; // ['EN','ES','DE',...]
  const languageData = {};
  const validationErrors = [];

  const requestedPublish = Object.fromEntries(
    languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
  );
  const shouldValidate = Object.values(requestedPublish).some(Boolean);
  const mustValidateLang = (lang) => shouldValidate && (lang === 'EN' || requestedPublish[lang]);

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


      // Industry (3)
      const industry = [];
      for (let i = 0; i < 3; i++) {
        const industryName = clean(req.body.industry?.[lang]?.[i]?.industryName);

        const imageFile = req.files?.[`industryImages_${lang}[${i}]`] && req.files[`industryImages_${lang}[${i}]`][0];
        const logoFile = req.files?.[`industryLogos_${lang}[${i}]`] && req.files[`industryLogos_${lang}[${i}]`][0];

        const oldIndImg = req.body[`oldIndustryImage_${i}`] || '';
        const oldIndLogo = req.body[`oldIndustryLogo_${i}`] || '';

        const industryImage = imageFile
          ? (await uploadToCloudinary(imageFile, {
            folder: `draglab/models/industry/${lang}`,
            desiredFileName: `${modelSlug}-industry-image-${i + 1}`,
            treatAsDownload: false,
          }))?.url || ''
          : (lang === 'EN' ? oldIndImg : '');

        const industryLogo = logoFile
          ? (await uploadToCloudinary(logoFile, {
            folder: `draglab/models/industry/${lang}`,
            desiredFileName: `${modelSlug}-industry-logo-${i + 1}`,
            treatAsDownload: false,
          }))?.url || ''
          : (lang === 'EN' ? oldIndLogo : '');

        // ...validation for EN...
        industry.push({ industryName, industryImage, industryLogo });
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
        industry,
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
        model: {
          slug: modelSlug,
          ModelThumbnail,
          ModelPhotos,
          overviewThumbnail,
          modelcapacity: req.body.modelcapacity || '',
          Language: languageData,
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
      isPublished: shouldValidate
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
          Language: languageData
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

  // publish intent: if any lang checked => publishing => validate; else draft
  const requestedPublish = Object.fromEntries(
    languages.map(l => [l, req.body[`publish_${l}`] === 'on'])
  );
  const shouldValidate = Object.values(requestedPublish).some(Boolean);
  const mustValidateLang = (lang) => shouldValidate && (lang === 'EN' || requestedPublish[lang]);

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

      // ---- Industry (3)
      const industry = [];
      for (let i = 0; i < 3; i++) {
        const industryName = clean(req.body.industry?.[lang]?.[i]?.industryName) || prev.industry?.[i]?.industryName || '';

        const newImageFile = req.files?.[`industryImages_${lang}[${i}]`]?.[0];
        const newLogoFile  = req.files?.[`industryLogos_${lang}[${i}]`]?.[0];

        const industryImage = newImageFile
          ? (await uploadToCloudinary(newImageFile, {
              folder: `draglab/models/industry/${lang}`,
              desiredFileName: `${modelSlug}-industry-image-${i + 1}`,
              treatAsDownload: false,
            }))?.url || ''
          : (prev.industry?.[i]?.industryImage || '');

        const industryLogo = newLogoFile
          ? (await uploadToCloudinary(newLogoFile, {
              folder: `draglab/models/industry/${lang}`,
              desiredFileName: `${modelSlug}-industry-logo-${i + 1}`,
              treatAsDownload: false,
            }))?.url || ''
          : (prev.industry?.[i]?.industryLogo || '');

        if (validateThis && lang === 'EN') {
          if (!industryName)  validationErrors.push({ path: `industry_${lang}_${i}_name`,  msg: `Industry ${i + 1} name (${lang}) is required.` });
          if (!industryImage) validationErrors.push({ path: `industry_${lang}_${i}_image`, msg: `Industry ${i + 1} image (EN) is required.` });
          if (!industryLogo)  validationErrors.push({ path: `industry_${lang}_${i}_logo`,  msg: `Industry ${i + 1} logo (EN) is required.` });
        }

        industry.push({ industryName, industryImage, industryLogo });
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
        industry,
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
        model: {
          _id: modelId,
          slug: modelSlug,
          ModelThumbnail,
          overviewThumbnail,
          ModelPhotos,
          modelcapacity: req.body.modelcapacity || model.modelcapacity || '',
          Language: languageData
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






exports.getAllSlides = (req, res) => {
  Slideshow.find()
    .then(slides => {

      res.render('sellercompany/indexSlide', {
        path: '/admin/slideshow',
        slides,
        pageTitle: 'Slideshow',
        editing: false,
        validationErrors: [],
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null
      });
    })
    .catch(err => console.log(err));
};

exports.getAddSlideForm = (req, res) => {
  res.render('sellercompany/add-indexSlide', {

    path: '/admin/addslideshow',
    pageTitle: 'Slideshow',
    editing: false,
    validationErrors: [],
    hasError: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    slide: null



  });

};

exports.postAddSlide = async (req, res) => {
  const { title, desc, language } = req.body;
  const imageFile = req.files?.slideshowImage?.[0];

  console.log("📝 Received form data:", req.body);
  console.log("🗂️ Files received:", req.files);

  try {
    if (!imageFile) throw new Error("No image file uploaded.");

    console.log("🌐 Uploading image to Cloudinary...");
    const uploaded = await uploadToCloudinary(imageFile, {
      folder: 'slideshow'
    });

    // ✅ Set the returned Cloudinary URL
    const image = uploaded?.url;

    console.log("✅ Image Path from Cloudinary:", image);

    if (!image) throw new Error("Upload returned no URL");

    const slide = new Slideshow({
      title,
      desc,
      language,
      image, // ✅ Save actual image URL
    });

    await slide.save();
    console.log("✅ Slide saved successfully.");
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error("🔥 Error adding slide:", err);
    res.status(500).send("Error adding slide.");
  }
};





exports.getEditSlideForm = (req, res) => {
  Slideshow.findById(req.params.id)
    .then(slide => {
      res.render('sellercompany/add-indexSlide', {

        slide,
        pageTitle: 'Edit slide',
        path: '/admin/edit-slide',
        editing: true,
        validationErrors: [],
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null
      });
    })
    .catch(err => console.log(err));
};
exports.postEditSlide = async (req, res) => {
  try {
    const { title, desc, language } = req.body;

    // 1) Load the slide
    const slide = await Slideshow.findById(req.params.id);
    if (!slide) return res.status(404).send('Slide not found');

    // 2) Update text fields
    slide.title = title;
    slide.desc = desc;
    slide.language = language;

    // 3) If a new image was provided, upload & replace
    const newFile = req.files?.slideshowImage?.[0];
    if (newFile) {
      // Upload to Cloudinary (sets newFile.cloudinaryUrl)
      const uploaded = await uploadToCloudinary(newFile, {
        folder: 'slideshow'
      });

      if (!uploaded?.url) {
        console.error('❌ Upload returned no URL');
        return res.status(500).send('Failed to upload image');
      }

      // Optionally delete old image
      try {
        if (slide.image) {
          const last = slide.image.split('/').pop();
          const oldPublicId = last?.includes('.') ? last.split('.')[0] : last;
          await cloudinary.uploader.destroy(`draglab/slideshow/${oldPublicId}`);
        }
      } catch (e) {
        console.warn('⚠️ Failed to delete old Cloudinary asset:', e.message);
      }

      // ✅ Save new image URL
      slide.image = uploaded.url;
    }

    await slide.save();
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('❌ Error updating slide:', err);
    res.status(500).send('Internal Server Error');
  }
};






exports.deleteSlide = (req, res) => {
  Slideshow.findById(req.params.id)
    .then(async (slide) => {
      if (slide.image) {
        // ✅ Extract the publicId more dynamically
        const publicId = slide.image.split('/').pop().split('.')[0]; // Get only the last segment before `.webp`

        try {
          const result = await cloudinary.uploader.destroy(`draglab/slideshow/${publicId}`);
          console.log('✅ Image deleted from Cloudinary:', result);
        } catch (err) {
          console.error('❌ Failed to delete image from Cloudinary:', err.message);
        }
      }

      return Slideshow.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      console.log('✅ Slide deleted successfully!');
      res.redirect('/admin/slideshow');
    })
    .catch(err => {
      console.error('❌ Error deleting slide:', err.message);
      res.status(500).send('Internal Server Error');
    });
};




// Articles controllers 


// GET: All Articles
exports.getAllArticles = (req, res) => {
  Article.find()
    .then(articles => {
      res.render('sellercompany/all-articles', {
        path: '/admin/articles',
        pageTitle: 'Articles',
        articles,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

// GET: Add Article Form
exports.getAddArticle = (req, res) => {
  res.render('sellercompany/add-article', {
    path: '/admin/add-article',
    pageTitle: 'Add Article',
    editing: false,
    validationErrors: [],
    hasError: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    article: null
  });
};

// POST: Add New Article

exports.postAddArticle = async (req, res) => {
  const { title, author, body, language, summary, category } = req.body;
  // tags as comma-separated -> array
  const tags = (req.body.tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const slug = slugify(title || 'untitled-article', { lower: true, strict: true });

  const file = req.files?.thumbnail?.[0];
  let thumbnail = '';

  if (file) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'draglab/articles', public_id: file.originalname.split('.')[0], format: 'webp' },
          (error, r) => error ? reject(error) : resolve(r.secure_url)
        ).end(file.buffer);
      });
      thumbnail = result;
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      return res.status(500).send('Failed to upload thumbnail');
    }
  }

  try {
    const newArticle = new Article({ title, author, body, language, thumbnail, slug, summary, category, tags });
    await newArticle.save();
    res.redirect('/admin/articles');
  } catch (err) {
    console.error('Error adding article:', err);
    res.status(500).send('Error adding article');
  }
};

// GET: Edit Article Form
exports.getEditArticle = (req, res) => {
  Article.findById(req.params.articleId)
    .then(article => {
      if (!article) return res.redirect('/admin/articles');

      res.render('sellercompany/add-article', {
        article,
        pageTitle: 'Edit Article',
        path: '/admin/edit-article',
        editing: true,
        validationErrors: [],
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null
      });
    })
    .catch(err => console.log(err));
};

// POST: Edit Article
exports.postEditArticle = async (req, res) => {
  const { title, author, body, language, summary, category } = req.body;
  const tags = (req.body.tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  const file = req.files?.thumbnail?.[0];

  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.redirect('/admin/articles');

    article.title = title;
    article.author = author;
    article.body = body;
    article.language = language;
    article.summary = summary;
    article.category = category || article.category;
    article.tags = tags;

    if (file) {
      // delete old from Cloudinary
      if (article.thumbnail) {
        const publicId = article.thumbnail.split('/draglab/articles/')[1]?.replace('.webp', '');
        if (publicId) {
          try { await cloudinary.uploader.destroy(`draglab/articles/${publicId}`); } catch { }
        }
      }
      // upload new
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'draglab/articles', public_id: file.originalname.split('.')[0], format: 'webp' },
          (error, r) => error ? reject(error) : resolve(r.secure_url)
        ).end(file.buffer);
      });
      article.thumbnail = uploaded;
    }

    await article.save();
    res.redirect('/admin/articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating article');
  }
};


// POST: Delete Article
exports.postDeleteArticle = (req, res) => {
  Article.findById(req.params.articleId)
    .then(async (article) => {
      if (article.thumbnail) {
        const publicId = article.thumbnail.split('/draglab/articles/')[1].replace('.webp', '');

        try {
          const result = await cloudinary.uploader.destroy(`draglab/articles/${publicId}`);
          console.log('Thumbnail deleted from Cloudinary:', result);
        } catch (err) {
          console.error('Failed to delete image from Cloudinary:', err.message);
        }
      }

      return Article.findByIdAndDelete(req.params.articleId);
    })
    .then(() => {
      console.log('Article deleted');
      res.redirect('/admin/articles');
    })
    .catch(err => console.log(err));
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
    const requests = await TechnicalService.find()
      .populate('deviceCategory')
      .sort({ createdAt: -1 });

    // For each request, get the corresponding model name
    const requestsWithModelNames = await Promise.all(requests.map(async (req) => {
      let modelName = 'None';
      if (req.deviceCategory && req.deviceModel) {
        const product = await Product.findById(req.deviceCategory._id);
        const model = product?.Models?.id(req.deviceModel);
        modelName = model?.Language?.EN?.[0]?.ModelName || 'None';
      }

      return {
        ...req.toObject(),
        modelName
      };
    }));

    res.render('sellercompany/all-technical-service', {
      pageTitle: 'Technical Support Requests',
      path: '/admin/TechnicalRequests',
      requests: requestsWithModelNames,
      isAuthenticated: req.session.isLoggedIn
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
    const warranties = await WarrantyRegistration.find()
      .populate('deviceCategory')
      .sort({ createdAt: -1 });

    const withModelNames = await Promise.all(warranties.map(async (reg) => {
      const product = await Product.findById(reg.deviceCategory);
      const model = product?.Models?.id(reg.deviceModel);
      return {
        ...reg.toObject(),
        modelName: model?.Language?.EN?.[0]?.ModelName || 'None'
      };
    }));

    res.render('sellercompany/all-warranty-registrations', {
      warranties: withModelNames,
      pageTitle: 'Warranty Registrations',
      path: '/admin/warranty-registrations',
      isAuthenticated: req.session.isLoggedIn
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
exports.getAllContactUs = (req, res, next) => {
  ContactUs.find()
    .sort({ dateSubmitted: -1 })
    .then(messages => {
      res.render('sellercompany/contactUs-list', {
        pageTitle: 'Contact Messages',
        path: '/admin/contactUs-list',
        isAuthenticated: req.session.isLoggedIn,
        messages
      });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
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



exports.getNewsletterList = async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
  res.render('sellercompany/newsletter-list', {
    pageTitle: 'Newsletter Subscribers',
    path: '/admin/newsletter',
    subscribers
  });
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
