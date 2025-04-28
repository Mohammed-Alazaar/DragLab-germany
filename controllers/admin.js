const path = require('path'); // Add this line to import the path module
const Product = require('../models/product'); // Add this line to import the Product model
const Slideshow = require('../models/slideshow');
const CatalogCategory = require('../models/CatalogCategory');
const TechnicalService = require('../models/technicalService');
const WarrantyRegistration = require('../models/warrantyRegistration');
const ContactUs = require('../models/contactUs');
const Article = require('../models/articles');
const PDFDocument = require('pdfkit');

const exp = require('constants');
const express = require('express');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const fs = require('fs');




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
        GR: [{
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
        }]
      }
    },
    validationErrors: [],
    errorMessage: null,
    isAuthenticated: req.session.isLoggedIn,
    languages: ['EN', 'ES', 'GR'],
    isDraft: false // because it's new
  });
};

exports.postAddProduct = (req, res, next) => {
  const productThumbnail = req.files['productThumbnail']?.[0]?.path.replace(/\\/g, '/') || req.body.oldProductThumbnail || '';
  const productSketch = req.files['productSketch']?.[0]?.path.replace(/\\/g, '/') || req.body.oldProductSketch || '';

  const languages = ['EN', 'ES', 'GR'];
  const languageData = {};
  const validationErrors = [];
  const isDraft = req.body.saveType === 'draft';
  if (!isDraft) {
    if (!productThumbnail) {
      validationErrors.push({
        path: `ProductThumbnail`,
        msg: `Product Thumbnail is required.`
      });
    }
    if (!productSketch) {
      validationErrors.push({
        path: `ProductSketch`,
        msg: `Product Sketch is required.`
      });
    }
  }

  languages.forEach(lang => {
    const validateThisLanguage = (lang === 'EN'); // ✅ Only validate EN

    const productName = req.body[`ProductName_${lang}`];
    const productNameDesc = req.body[`ProductNameDesc_${lang}`];
    const productDesc = req.body[`ProductDesc_${lang}`];
    const whyProductDesc = req.body[`WhyProductDesc_${lang}`];

    const names = req.body[`FeatureName_${lang}`] || [];
    const descs = req.body[`FeatureDesc_${lang}`] || [];
    const oldImages = req.body[`OldFeatureImage_${lang}`] || [];

    const features = [];

    for (let i = 0; i < 4; i++) {
      const featureName = names[i]?.trim() || '';
      const featureDesc = descs[i]?.trim() || '';

      let imagePath = '';
      const file = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0];

      if (file) {
        imagePath = file.path.replace(/\\/g, '/');
      } else if (lang !== 'EN') {
        const enImage = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
        if (enImage) {
          imagePath = enImage.path.replace(/\\/g, '/');
        }
      }

      if (!imagePath && oldImages[i]) {
        imagePath = oldImages[i];
      }

      if (!isDraft && validateThisLanguage) {
        if (!featureName) {
          validationErrors.push({
            path: `FeatureName_${lang}_${i}`,
            msg: `Feature Name ${i + 1} (${lang}) is required.`
          });
        }
        if (!imagePath) {
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

    if (!isDraft && validateThisLanguage) {
      if (!productName) {
        validationErrors.push({ path: `ProductName_${lang}`, msg: `Product Name (${lang}) is required.` });
      }
      if (!productNameDesc) {
        validationErrors.push({ path: `ProductNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
      }
      if (!productDesc) {
        validationErrors.push({ path: `ProductDesc_${lang}`, msg: `Product Description (${lang}) is required.` });
      }
      if (!whyProductDesc) {
        validationErrors.push({ path: `WhyProductDesc_${lang}`, msg: `Why Product Description (${lang}) is required.` });
      }
    }

    languageData[lang] = [{
      ProductName: productName,
      ProductNameDesc: productNameDesc,
      ProductDesc: productDesc,
      WhyProductDesc: whyProductDesc,
      features: features
    }];
  });




  if (validationErrors.length > 0) {
    // Ensure feature images are preserved when there's an error
    languages.forEach(lang => {
      const oldImages = req.body[`OldFeatureImage_${lang}`];

      if (oldImages) {
        const arr = Array.isArray(oldImages) ? oldImages : [oldImages];
        arr.forEach((imgPath, i) => {
          if (!languageData[lang][0].features[i].FeatureImage) {
            languageData[lang][0].features[i].FeatureImage = imgPath;
          }
        });
      }
    });

    return res.status(422).render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'edit-product'), {
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



  const Product = require('../models/product');
  const product = new Product({
    ProductThumbnail: productThumbnail,
    ProductSketch: productSketch,
    Language: languageData,
    isDraft: isDraft // ✅ save it to DB

  });

  if (isDraft) {
    product.validate().then(() => {
      return product.save({ validateBeforeSave: false }); // ⛳️ bypass required fields for draft
    }).then(() => {
      console.log('Draft saved without validation');
      res.redirect('/admin/Myproduct');
    }).catch(err => {
      console.error('Draft save error:', err);
      next(err);
    });
  } else {
    product.save()
      .then(() => {
        console.log('Product Added');
        res.redirect('/admin/Myproduct');
      })
      .catch(err => {
        console.error('Error saving product:', err);
        next(err);
      });
  }

};


exports.getMyproduct = (req, res, next) => {
  Product.find()
    // .select('ProductName Productprice productThumbnail description warranty quantity InternalMemory Company deliveryTimeFrom deliveryTimeTo category feature1 featureDetail1 feature2 featureDetail2 userId')
    // .populate('userId', 'name')

    .then(products => {
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'my-products'), {
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
      
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'edit-product.ejs'), {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        validationErrors: [],
        errorMessage: null,
        isAuthenticated: req.session.isLoggedIn,
        isDraft: product.isDraft
        // ❌ no categories anymore
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
};


exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const languages = ['EN', 'ES', 'GR'];
  const languageData = {};
  const validationErrors = [];

  // ✅ Assign only once at the top
  const updatedProductThumbnail = req.files['productThumbnail']
    ? req.files['productThumbnail'][0].path.replace(/\\/g, '/')
    : req.body.oldProductThumbnail;

  const updatedProductSketch = req.files['productSketch']
    ? req.files['productSketch'][0].path.replace(/\\/g, '/')
    : req.body.oldProductSketch;

  // 🔸 Global thumbnail/sketch validation
  if (!updatedProductThumbnail) {
    validationErrors.push({
      path: `ProductThumbnail`,
      msg: `Product Thumbnail is required.`
    });
  }
  if (!updatedProductSketch) {
    validationErrors.push({
      path: `ProductSketch`,
      msg: `Product Sketch is required.`
    });
  }

  languages.forEach(lang => {
    const validateThisLanguage = (lang === 'EN'); // ✅ Only validate EN

    const productName = req.body[`ProductName_${lang}`];
    const productNameDesc = req.body[`ProductNameDesc_${lang}`];
    const productDesc = req.body[`ProductDesc_${lang}`];
    const whyProductDesc = req.body[`WhyProductDesc_${lang}`];

    if (validateThisLanguage) {
      if (!productName) {
        validationErrors.push({ path: `ProductName_${lang}`, msg: `Product Name (${lang}) is required.` });
      }
      if (!productNameDesc) {
        validationErrors.push({ path: `ProductNameDesc_${lang}`, msg: `Short Description (${lang}) is required.` });
      }
      if (!productDesc) {
        validationErrors.push({ path: `ProductDesc_${lang}`, msg: `Product Description (${lang}) is required.` });
      }
      if (!whyProductDesc) {
        validationErrors.push({ path: `WhyProductDesc_${lang}`, msg: `Why Product Description (${lang}) is required.` });
      }
    }

    const names = req.body[`FeatureName_${lang}`] || [];
    const descs = req.body[`FeatureDesc_${lang}`] || [];
    const oldImages = req.body[`OldFeatureImage_${lang}`] || [];
    const features = [];

    for (let i = 0; i < 4; i++) {
      const featureName = names[i]?.trim() || '';
      const featureDesc = descs[i]?.trim() || '';

      let imagePath = '';
      const file = req.files?.[`FeatureImage_${lang}[${i}]`]?.[0];

      if (file) {
        imagePath = file.path.replace(/\\/g, '/');
      } else if (lang !== 'EN') {
        const enFile = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
        if (enFile) {
          imagePath = enFile.path.replace(/\\/g, '/');
        } else if (Array.isArray(oldImages)) {
          imagePath = oldImages[i] || '';
        } else {
          imagePath = oldImages || '';
        }
      } else {
        imagePath = Array.isArray(oldImages) ? oldImages[i] || '' : oldImages || '';
      }

      if (validateThisLanguage) {
        if (!featureName) {
          validationErrors.push({
            path: `FeatureName_${lang}_${i}`,
            msg: `Feature Name ${i + 1} (${lang}) is required.`
          });
        }
        if (!imagePath) {
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
      features: features
    }];
  });

  if (validationErrors.length > 0) {
    return res.status(422).render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'edit-product.ejs'), {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: 'Please fix the highlighted errors.',
      validationErrors,
      isAuthenticated: req.session.isLoggedIn,
      isDraft: req.body.isDraft,
      product: {
        _id: productId,
        Language: languageData,
        ProductThumbnail: updatedProductThumbnail,
        ProductSketch: updatedProductSketch
      }
    });
  }

  // ✅ Update database
  Product.findById(productId)
    .then(product => {
      if (!product) return res.redirect('/admin/Myproduct');
      product.Language = languageData;
      product.ProductThumbnail = updatedProductThumbnail;
      product.ProductSketch = updatedProductSketch;
      product.isDraft = false;
      return product.save();
    })
    .then(() => {
      console.log('Product Updated');
      res.redirect('/admin/Myproduct');
    })
    .catch(err => {
      console.error('Error updating product:', err);
      if (!res.headersSent) next(err);
    });
};









exports.postDeleteModel = async (req, res, next) => {
  const { productId, modelId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    const model = product.Models.id(modelId);
    if (!model) return res.redirect('/admin/Myproduct');

    // 🧹 1. Delete static fields
    ['ModelThumbnail', 'overviewThumbnail'].forEach(field => {
      if (model[field]) {
        const fullPath = path.join('public', model[field]);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    // 🧹 2. Delete ModelPhotos
    if (Array.isArray(model.ModelPhotos)) {
      model.ModelPhotos.forEach(photo => {
        const fullPath = path.join('public', photo);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // 🧹 3. Delete multilingual files
    const languages = Object.keys(model.Language || {});
    languages.forEach(lang => {
      const langData = model.Language[lang]?.[0];
      if (!langData) return;

      // Delete downloads
      langData.downloads?.forEach(file => {
        const filePath = path.join('public', file.filePath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      // Delete overview images
      langData.overview?.forEach(o => {
        const filePath = path.join('public', o.overviewImage || '');
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      // Delete industry images and logos
      langData.industry?.forEach(i => {
        [i.industryImage, i.industryLogo].forEach(img => {
          const filePath = path.join('public', img || '');
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
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




exports.getAddModel = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).then(product => {
    if (!product) return res.redirect('/admin/Myproduct');
    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-model'), {
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
    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-model'), {
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

exports.postAddModel = (req, res, next) => {
  const productId = req.params.productId;
  const languages = ['EN', 'ES', 'GR'];
  const languageData = {};
  const isDraft = req.body.action === 'draft';
  const validationErrors = [];

  Product.findById(productId)
    .then(product => {
      if (!product) return res.redirect('/admin/Myproduct');

      if (!isDraft) {
        if (!req.body.modelcapacity) {
          validationErrors.push({ path: 'modelcapacity', msg: 'Model Capacity is required.' });
        }

        if (!req.files?.ModelThumbnail?.[0] && !req.body.oldModelThumbnail) {
          validationErrors.push({ path: 'ModelThumbnail', msg: 'Model Thumbnail is required.' });
        }

        if (!req.files?.overviewThumbnail?.[0] && !req.body.oldOverviewThumbnail) {
          validationErrors.push({ path: 'overviewThumbnail', msg: 'Overview Thumbnail is required.' });
        }
      }

      languages.forEach(lang => {
        const modelName = req.body[`ModelName_${lang}`];
        const shortDesc = req.body[`ModelNameDesc_${lang}`];
        const desc = req.body[`ModelDesc_${lang}`];

        const validateThisLanguage = (lang === 'EN'); // ✅ only validate English

        if (!isDraft && validateThisLanguage && !modelName) {
          validationErrors.push({ path: `ModelName_${lang}`, msg: `${lang} Model Name is required.` });
        }
        if (!isDraft && validateThisLanguage && !shortDesc) {
          validationErrors.push({ path: `ModelNameDesc_${lang}`, msg: `${lang} Short Description is required.` });
        }
        if (!isDraft && validateThisLanguage && !desc) {
          validationErrors.push({ path: `ModelDesc_${lang}`, msg: `${lang} Description is required.` });
        }

        const overviewData = [];
        const industryData = [];

        for (let i = 0; i < 4; i++) {
          const name = req.body.overview?.[lang]?.[i]?.overviewName;
          const description = req.body.overview?.[lang]?.[i]?.overviewDesc;

          if (!isDraft && validateThisLanguage && (!name || !description)) {
            validationErrors.push({ path: `overview_${lang}_${i}`, msg: `${lang} Overview ${i + 1} is incomplete.` });
          }

          overviewData.push({
            overviewName: name || '',
            overviewDesc: description || '',
            overviewImage: lang === 'EN'
              ? (req.files?.[`overviewImages_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || req.body[`oldOverviewImages_${i}`])
              : undefined
          });
        }

        for (let i = 0; i < 3; i++) {
          const industryName = req.body.industry?.[lang]?.[i]?.industryName;

          if (!isDraft && validateThisLanguage && !industryName) {
            validationErrors.push({ path: `industry_${lang}_${i}`, msg: `${lang} Industry ${i + 1} name is required.` });
          }

          industryData.push({
            industryName: industryName || '',
            industryImage: lang === 'EN'
              ? (req.files?.[`industryImages_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || req.body[`oldIndustryImage_${i}`])
              : undefined,
            industryLogo: lang === 'EN'
              ? (req.files?.[`industryLogos_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || req.body[`oldIndustryLogo_${i}`])
              : undefined
          });
        }

        const specRaw = req.body.technicalSpecifications?.[lang] || {};
        const specSections = Object.keys(specRaw).map(sectionKey => {
          const section = specRaw[sectionKey];
          const rows = section.rows ? Object.keys(section.rows).map(rowKey => section.rows[rowKey]) : [];

          if (!isDraft && validateThisLanguage && !section.sectionTitle) {
            validationErrors.push({ path: `techspec_section_${lang}_${sectionKey}`, msg: `${lang} Tech section title is required.` });
          }
          if (!isDraft && validateThisLanguage && !rows.length) {
            validationErrors.push({ path: `techspec_rows_${lang}_${sectionKey}`, msg: `${lang} Tech section must have at least one row.` });
          }

          return {
            sectionTitle: section.sectionTitle,
            rows: rows
          };
        });

        const downloads = [];
        const uploadedFiles = req.files[`downloadFiles_${lang}`];
        const fileNames = req.body[`downloadFileNames_${lang}`] || [];
        const categories = req.body[`downloadCategories_${lang}`] || [];

        if (uploadedFiles) {
          const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
          const namesArray = Array.isArray(fileNames) ? fileNames : [fileNames];
          const categoriesArray = Array.isArray(categories) ? categories : [categories];

          fileArray.forEach((file, i) => {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            downloads.push({
              fileName: namesArray[i],
              filePath: file.path.replace(/\\/g, '/'),
              fileSize: sizeInMB,
              fileCategory: categoriesArray[i],
              fileProductCategory: product?.Language?.EN?.[0]?.ProductName || 'Unknown'
            });
          });
        }

        const existingDownloadsRaw = req.body[`existingDownloads_${lang}`];
        const existingDownloads = [];
        if (existingDownloadsRaw) {
          const arr = Array.isArray(existingDownloadsRaw) ? existingDownloadsRaw : [existingDownloadsRaw];
          arr.forEach(d => {
            try {
              existingDownloads.push(JSON.parse(d));
            } catch (_) { }
          });
        }

        if (!isDraft && validateThisLanguage && downloads.length + existingDownloads.length === 0) {
          validationErrors.push({ path: `downloads_${lang}`, msg: `${lang} Downloads required.` });
        }

        languageData[lang] = [{
          ModelName: modelName,
          ModelNameDesc: shortDesc,
          ModelDesc: desc,
          overview: overviewData,
          industry: industryData,
          technicalSpecifications: specSections,
          downloads: [...existingDownloads, ...downloads]
        }];
      });


      if (!isDraft && validationErrors.length > 0) {
        const reshapedModel = {
          ModelThumbnail: req.files?.ModelThumbnail?.[0]?.path || req.body.oldModelThumbnail,
          ModelPhotos: req.files?.ModelPhotos?.map(f => f.path) || [],
          overviewThumbnail: req.files?.overviewThumbnail?.[0]?.path || req.body.oldOverviewThumbnail,
          modelcapacity: req.body.modelcapacity,
          Language: languageData
        };

        return res.status(422).render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-model'), {
          pageTitle: 'Add Model',
          path: '/admin/add-model',
          product,
          model: reshapedModel,
          editing: false,
          productId,
          validationErrors,
          hasError: true,
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: 'Please fill in all required fields.'
        });
      }

      const model = {
        ModelThumbnail: req.files?.ModelThumbnail?.[0]?.path || req.body.oldModelThumbnail,
        ModelPhotos: req.files?.ModelPhotos?.map(f => f.path) || [],
        overviewThumbnail: req.files?.overviewThumbnail?.[0]?.path || req.body.oldOverviewThumbnail,
        modelcapacity: req.body.modelcapacity,
        Language: languageData,
        isPublished: !isDraft
      };

      product.Models.push(model);
      return product.save().then(() => {
        return res.redirect('/admin/Myproduct'); // ✅ wrapped inside
      });

    })
};






exports.postEditModel = (req, res, next) => {
  const { productId, modelId } = req.params;
  const languages = ['EN', 'ES', 'GR'];
  const languageData = {};
  const isDraft = req.body.action === 'draft';
  const validationErrors = [];

  Product.findById(productId)
    .then(product => {
      if (!product) return res.redirect('/admin/Myproduct');

      const model = product.Models.id(modelId);
      if (!model) return res.redirect('/admin/Myproduct');

      // Validate shared fields
      if (!isDraft) {
        if (!req.body.modelcapacity) {
          validationErrors.push({ path: 'modelcapacity', msg: 'Model Capacity is required.' });
        }

        if (!req.files?.ModelThumbnail?.[0] && !req.body.oldModelThumbnail && !model.ModelThumbnail) {
          validationErrors.push({ path: 'ModelThumbnail', msg: 'Model Thumbnail is required.' });
        }

        if (!req.files?.overviewThumbnail?.[0] && !req.body.oldOverviewThumbnail && !model.overviewThumbnail) {
          validationErrors.push({ path: 'overviewThumbnail', msg: 'Overview Thumbnail is required.' });
        }
      }

      languages.forEach(lang => {
        const existingLangData = model.Language?.[lang]?.[0] || {};
        const validateThisLanguage = (lang === 'EN'); // ✅ only validate English

        const modelName = req.body[`ModelName_${lang}`];
        const shortDesc = req.body[`ModelNameDesc_${lang}`];
        const desc = req.body[`ModelDesc_${lang}`];

        if (!isDraft && validateThisLanguage && !modelName) {
          validationErrors.push({ path: `ModelName_${lang}`, msg: `${lang} Model Name is required.` });
        }
        if (!isDraft && validateThisLanguage && !shortDesc) {
          validationErrors.push({ path: `ModelNameDesc_${lang}`, msg: `${lang} Short Description is required.` });
        }
        if (!isDraft && validateThisLanguage && !desc) {
          validationErrors.push({ path: `ModelDesc_${lang}`, msg: `${lang} Description is required.` });
        }

        const overviewData = [];
        const industryData = [];

        for (let i = 0; i < 4; i++) {
          const name = req.body.overview?.[lang]?.[i]?.overviewName;
          const desc = req.body.overview?.[lang]?.[i]?.overviewDesc;
          let img = existingLangData.overview?.[i]?.overviewImage;

          if (lang === 'EN') {
            img = req.files?.[`overviewImages_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || img;
            if (!isDraft && validateThisLanguage && !img) {
              validationErrors.push({ path: `overviewImage_${lang}_${i}`, msg: `Overview image ${i + 1} (${lang}) is required.` });
            }
          }

          if (!isDraft && validateThisLanguage && (!name || !desc)) {
            validationErrors.push({ path: `overview_${lang}_${i}`, msg: `Overview ${i + 1} (${lang}) is incomplete.` });
          }

          overviewData.push({
            overviewName: name || '',
            overviewDesc: desc || '',
            overviewImage: lang === 'EN' ? img : undefined
          });
        }

        for (let i = 0; i < 3; i++) {
          const name = req.body.industry?.[lang]?.[i]?.industryName;
          let img = existingLangData.industry?.[i]?.industryImage;
          let logo = existingLangData.industry?.[i]?.industryLogo;

          if (lang === 'EN') {
            img = req.files?.[`industryImages_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || img;
            logo = req.files?.[`industryLogos_${lang}[${i}]`]?.[0]?.path?.replace(/\\/g, '/') || logo;
            if (!isDraft && validateThisLanguage && (!img || !logo)) {
              validationErrors.push({ path: `industryImage_${lang}_${i}`, msg: `Industry image/logo ${i + 1} (${lang}) is required.` });
            }
          }

          if (!isDraft && validateThisLanguage && !name) {
            validationErrors.push({ path: `industryName_${lang}_${i}`, msg: `Industry name ${i + 1} (${lang}) is required.` });
          }

          industryData.push({
            industryName: name || '',
            industryImage: lang === 'EN' ? img : undefined,
            industryLogo: lang === 'EN' ? logo : undefined
          });
        }

        const specSections = [];
        const specs = req.body.technicalSpecifications?.[lang];

        if (specs) {
          for (const [sectionIndex, section] of Object.entries(specs)) {
            const rows = [];

            if (section.rows) {
              for (const row of Object.values(section.rows)) {
                rows.push({
                  title: row.title,
                  value: row.value
                });
              }
            }

            if (!isDraft && validateThisLanguage && !section.sectionTitle) {
              validationErrors.push({ path: `techspec_section_${lang}_${sectionIndex}`, msg: `${lang} Spec section title is required.` });
            }
            if (!isDraft && validateThisLanguage && !rows.length) {
              validationErrors.push({ path: `techspec_rows_${lang}_${sectionIndex}`, msg: `${lang} Spec section must have at least one row.` });
            }

            specSections.push({
              sectionTitle: section.sectionTitle,
              rows
            });
          }
        }

        let downloads = [];
        let existingDownloads = [];
        const existingRaw = req.body[`existingDownloads_${lang}`];
        if (existingRaw) {
          const rawArr = Array.isArray(existingRaw) ? existingRaw : [existingRaw];
          existingDownloads = rawArr.map(r => JSON.parse(r));
        }

        const deleted = req.body[`deletedDownloads_${lang}`] || [];
        const deletedPaths = Array.isArray(deleted) ? deleted : [deleted];
        existingDownloads = existingDownloads.filter(d => !deletedPaths.includes(d.filePath));

        deletedPaths.forEach(p => {
          try {
            fs.unlinkSync(p);
          } catch (err) {
            console.error('Delete failed:', err);
          }
        });

        const uploaded = req.files[`downloadFiles_${lang}`] || [];
        const fileNames = req.body[`downloadFileNames_${lang}`] || [];
        const categories = req.body[`downloadCategories_${lang}`] || [];

        uploaded.forEach((file, i) => {
          downloads.push({
            fileName: fileNames[i],
            filePath: file.path.replace(/\\/g, '/'),
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            fileCategory: categories[i],
            fileProductCategory: product?.Language?.EN?.[0]?.ProductName || 'Unknown'
          });
        });

        const allDownloads = [...existingDownloads, ...downloads];
        if (!isDraft && validateThisLanguage && allDownloads.length === 0) {
          validationErrors.push({ path: `downloads_${lang}`, msg: `${lang} Downloads required.` });
        }

        languageData[lang] = [{
          ModelName: modelName,
          ModelNameDesc: shortDesc,
          ModelDesc: desc,
          overview: overviewData,
          industry: industryData,
          technicalSpecifications: specSections,
          downloads: allDownloads
        }];
      });


      if (!isDraft && validationErrors.length > 0) {
        res.status(422).render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-model'), {
          pageTitle: 'Edit Model',
          path: '/admin/edit-model',
          product,
          modelId,
          productId,
          model: {
            ...model.toObject(),
            modelcapacity: req.body.modelcapacity,
            Language: languageData,
            overviewThumbnail: req.body.oldOverviewThumbnail,
            ModelThumbnail: req.body.oldModelThumbnail,
            ModelPhotos: model.ModelPhotos
          },
          validationErrors,
          hasError: true,
          editing: true,
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: 'Please fix the errors before saving.'
        });

        return Promise.reject('Validation Failed'); // ✅ stop chain
      }


      // Save
      model.ModelThumbnail = req.files?.ModelThumbnail?.[0]?.path || req.body.oldModelThumbnail;
      model.ModelPhotos = req.files?.ModelPhotos?.map(f => f.path) || model.ModelPhotos;
      model.overviewThumbnail = req.files?.overviewThumbnail?.[0]?.path || model.overviewThumbnail;
      model.modelcapacity = req.body.modelcapacity;
      model.Language = languageData;
      model.isPublished = !isDraft;

      return product.save();

    })
    .then(() => res.redirect('/admin/Myproduct'))
    .catch(err => next(err));
};







exports.getAllSlides = (req, res) => {
  Slideshow.find()
    .then(slides => {

      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'indexSlide'), {
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
  res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-indexSlide'), {

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

exports.postAddSlide = (req, res) => {
  const { title, desc, language } = req.body;
  const image = req.files?.slideshowImage?.[0]?.path;

  const newSlide = new Slideshow({ title, desc, image, language });

  newSlide.save()
    .then(() => {
      console.log('Slide added successfully!');
      res.redirect('/admin/slideshow');
    })
    .catch(err => {
      console.error('Error adding slide:', err);
    });

};


exports.getEditSlideForm = (req, res) => {
  Slideshow.findById(req.params.id)
    .then(slide => {
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-indexSlide'), {

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

exports.postEditSlide = (req, res) => {
  const { title, desc, language } = req.body;
  const image = req.files?.slideshowImage?.[0]?.path;



  Slideshow.findById(req.params.id)
    .then(slide => {
      slide.title = title;
      slide.desc = desc;
      slide.language = language;
      if (image) slide.image = image;
      return slide.save();
    })
    .then(() => res.redirect('/admin/slideshow'))
    .catch(err => console.log(err));
};


exports.deleteSlide = (req, res) => {
  Slideshow.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/admin/slideshow'))
    .catch(err => console.log(err));
};




// Articles controllers 


// GET: All Articles
exports.getAllArticles = (req, res) => {
  Article.find()
    .then(articles => {
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'all-articles'), {
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
  res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-article'), {
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
exports.postAddArticle = (req, res) => {
  const { title, author, body, language } = req.body;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  const newArticle = new Article({ title, author, body, language, thumbnail });

  newArticle.save()
    .then(() => {
      console.log('Article added successfully!');
      res.redirect('/admin/articles');
    })
    .catch(err => console.error('Error adding article:', err));
};

// GET: Edit Article Form
exports.getEditArticle = (req, res) => {
  Article.findById(req.params.articleId)
    .then(article => {
      if (!article) return res.redirect('/admin/articles');

      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-article'), {
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
exports.postEditArticle = (req, res) => {
  const { title, author, body, language } = req.body;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  Article.findById(req.params.articleId)
    .then(article => {
      if (!article) return res.redirect('/admin/articles');

      article.title = title;
      article.author = author;
      article.body = body;
      article.language = language;
      if (thumbnail) article.thumbnail = thumbnail;

      return article.save();
    })
    .then(() => {
      console.log('Article updated successfully!');
      res.redirect('/admin/articles');
    })
    .catch(err => console.log(err));
};

// POST: Delete Article
exports.postDeleteArticle = (req, res) => {
  Article.findByIdAndDelete(req.params.articleId)
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


// Assuming getDashboard and getchart are in the admin controller

exports.getDashboard = async (req, res, next) => {
  try {
    const products = await Product.find(); // Await the completion of the find operation



    res.render('sellercompany/dashboard', {
      pageTitle: 'Dashboard',
      products: products,
      path: '/admin/Dashboard',
      isAuthenticated: req.session.isLoggedIn
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
  res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'add-category'), {
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
  res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'upload-file'), {

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

    const category = await CatalogCategory.findById(req.params.categoryId);
    if (!category) {
      console.error('⚠️ Category not found.');
      return res.redirect('/admin/catalogs?error=nocat');
    }

    category.files.push({
      fileName: req.body.fileName,
      filePath: file.path.replace('public/', ''),
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
  // Delete all files physically
  for (const file of category.files) {
    const fullPath = path.join('public', file.filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  await CatalogCategory.findByIdAndDelete(req.params.categoryId);
  res.redirect('/admin/catalogs');
};

exports.deleteFile = async (req, res) => {
  const { categoryId, fileId } = req.params;
  const category = await CatalogCategory.findById(categoryId);

  const file = category.files.id(fileId);
  const fullPath = path.join('public', file.filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

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

    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'all-technical-service'), {
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

    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'view-technical-request'), {
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

    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'all-warranty-registrations'), {
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

    res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'view-warranty-registration'), {
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
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'contactUs-list'), {
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
      res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'sellercompany', 'contactUs-detail'), {
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