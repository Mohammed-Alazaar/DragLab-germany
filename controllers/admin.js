const path = require('path'); // Add this line to import the path module
const Product = require('../models/product'); // Add this line to import the Product model
const Slideshow = require('../models/slideshow');
const CatalogCategory = require('../models/CatalogCategory');
const TechnicalService = require('../models/technicalService');
const WarrantyRegistration = require('../models/warrantyRegistration');
const ContactUs = require('../models/contactUs');
const Article = require('../models/articles');
const PDFDocument = require('pdfkit');
const cloudinary = require('../util/cloudinaryConfig'); // ✅ Import Cloudinary
const sanitize = require('sanitize-filename');

const exp = require('constants');
const express = require('express');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const fs = require('fs');

const languages = ['EN', 'ES', 'GR'];



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


exports.postAddProduct = async (req, res, next) => {
  try {
    // Extracting files from multer
    console.log('✅ Multer Files:', req.files);

    const productThumbnail = req.files['productThumbnail']?.[0]?.cloudinaryUrl || req.body.oldProductThumbnail || '';
    const productSketch = req.files['productSketch']?.[0]?.cloudinaryUrl || req.body.oldProductSketch || '';

    console.log('✅ Thumbnail Path:', productThumbnail);
    console.log('✅ Sketch Path:', productSketch);



    console.log('🖼️ Product Thumbnail Path:', productThumbnail);
    console.log('🖼️ Product Sketch Path:', productSketch);

    const languages = ['EN', 'ES', 'GR'];
    const languageData = {};
    const validationErrors = [];
    const isDraft = req.body.saveType === 'draft';

    // Step 1: Check if required images are missing
    if (!isDraft) {
      if (!productThumbnail) {
        validationErrors.push({
          path: 'ProductThumbnail',
          msg: 'Product Thumbnail is required.'
        });
      }
      if (!productSketch) {
        validationErrors.push({
          path: 'ProductSketch',
          msg: 'Product Sketch is required.'
        });
      }
    }

    // Step 2: Loop through each language and handle features
    languages.forEach(lang => {
      console.log(`➡️ Processing language: ${lang}`);

      const validateThisLanguage = (lang === 'EN');

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
          // Ensure we are getting the correct URL
          imagePath = file.cloudinaryUrl;
          if (!imagePath) {
            console.error(`❌ Cloudinary URL not found for FeatureImage_${lang}[${i}]`);
          } else {
            console.log(`✅ Feature Image found for ${lang} at index ${i}:`, imagePath);
          }
        } else if (lang !== 'EN') {
          const enImage = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
          if (enImage) {
            imagePath = enImage.cloudinaryUrl;
            console.log(`✅ Using EN version for ${lang} at index ${i}`);
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




      languageData[lang] = [{
        ProductName: productName,
        ProductNameDesc: productNameDesc,
        ProductDesc: productDesc,
        WhyProductDesc: whyProductDesc,
        features: features
      }];
    });

    // Step 3: Handle validation errors
    if (validationErrors.length > 0) {
      console.log('❌ Validation Errors Detected:', validationErrors);

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

    // Step 4: Save to the database
    const Product = require('../models/product');
    const product = new Product({
      ProductThumbnail: productThumbnail,
      ProductSketch: productSketch,
      Language: languageData,
      isDraft: isDraft
    });

    console.log("🔥 Attempting to save product to database...");
    await product.save();
    console.log("✅ Product successfully added!");
    res.redirect('/admin/Myproduct');

  } catch (err) {
    console.error('🔥 Internal Server Error:', err.message);
    console.error(err.stack);
    res.status(500).send(`🔥 Internal Server Error: ${err.message}`);
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
  const updatedProductThumbnail = req.files['productThumbnail']?.[0]?.cloudinaryUrl || req.body.oldProductThumbnail;
  const updatedProductSketch = req.files['productSketch']?.[0]?.cloudinaryUrl || req.body.oldProductSketch;


  if (!updatedProductThumbnail && req.body.oldProductThumbnail) {
    console.log("🗑️ Deleting old thumbnail from Cloudinary...");
    // You can add logic to delete the old image from Cloudinary if you want
  }
  if (!updatedProductSketch && req.body.oldProductSketch) {
    console.log("🗑️ Deleting old sketch from Cloudinary...");
    // You can add logic to delete the old image from Cloudinary if you want
  }


  // Debugging logs to verify
  console.log("✅ Updated Product Thumbnail Path:", updatedProductThumbnail);
  console.log("✅ Updated Product Sketch Path:", updatedProductSketch);


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
    const validateThisLanguage = (lang === 'EN');

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
        // ✅ Use Cloudinary URL
        imagePath = file.cloudinaryUrl;
      } else if (lang !== 'EN') {
        const enFile = req.files?.[`FeatureImage_EN[${i}]`]?.[0];
        if (enFile) {
          imagePath = enFile.cloudinaryUrl;
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
    return res.status(422).render('sellercompany/edit-product', {
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
      console.log('✅ Product Updated');
      res.redirect('/admin/Myproduct');
    })
    .catch(err => {
      console.error('🔥 Error updating product:', err.message);
      console.error(err.stack);
      if (!res.headersSent) next(err);
    });
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

// Controller for adding a model

const uploadToCloudinary = async (file, folder) => {
  const originalName = sanitize(file.originalname).slice(0, 50);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: `draglab/models/${folder}`,
        public_id: originalName,
      },
      (error, result) => {
        if (error) {
          console.error(`❌ Cloudinary upload error for ${originalName}:`, error.message);
          reject(error);
        } else {
          console.log(`✅ Successfully uploaded ${file.fieldname} to Cloudinary: ${result.secure_url}`);
          resolve(result.secure_url);
        }
      }
    ).end(file.buffer);
  });
};

exports.postAddModel = async (req, res) => {
  const productId = req.params.productId;
  const languages = ['EN', 'ES', 'GR'];
  const languageData = {};
  const isDraft = req.body.action === 'draft';

  try {
    // ✅ Cloudinary paths for images
    const ModelThumbnail = req.files?.ModelThumbnail?.[0]
      ? await uploadToCloudinary(req.files.ModelThumbnail[0], 'thumbnails')
      : '';

    const ModelPhotos = req.files?.ModelPhotos
      ? await Promise.all(req.files.ModelPhotos.map(file => uploadToCloudinary(file, 'photos')))
      : [];

    const overviewThumbnail = req.files?.overviewThumbnail?.[0]
      ? await uploadToCloudinary(req.files.overviewThumbnail[0], 'overview')
      : '';

    for (const lang of languages) {
      const overviewData = [];
      const industryData = [];
      const downloads = [];
      const technicalSpecifications = [];
      console.log('📝 Full Form Data:', req.body);

      // ✅ Overview
      // ✅ Overview
      for (let i = 0; i < 4; i++) {
        // 📝 Fetching the data properly from form body
        const overviewName = req.body.overview[lang]?.[i]?.overviewName || '';
        const overviewDesc = req.body.overview[lang]?.[i]?.overviewDesc || '';

        console.log(`📌 Overview Name: ${overviewName}, Description: ${overviewDesc}`);

        const overviewImage = req.files[`overviewImages_${lang}[${i}]`]?.[0]
          ? await uploadToCloudinary(req.files[`overviewImages_${lang}[${i}]`][0], `overview/${lang}`)
          : '';

        overviewData.push({
          overviewName,
          overviewDesc,
          overviewImage
        });
      }


      // ✅ Industry
      for (let i = 0; i < 3; i++) {
        // 📝 Correctly fetching data from form body
        const industryName = req.body.industry[lang]?.[i]?.industryName || '';

        console.log(`📌 Industry Name: ${industryName}`);

        const industryImage = req.files[`industryImages_${lang}[${i}]`]?.[0]
          ? await uploadToCloudinary(req.files[`industryImages_${lang}[${i}]`][0], `industry/${lang}`)
          : '';

        const industryLogo = req.files[`industryLogos_${lang}[${i}]`]?.[0]
          ? await uploadToCloudinary(req.files[`industryLogos_${lang}[${i}]`][0], `industry/${lang}`)
          : '';

        industryData.push({
          industryName,
          industryImage,
          industryLogo
        });
      }



      // ✅ Technical Specifications
      if (req.body.technicalSpecifications && req.body.technicalSpecifications[lang]) {
        req.body.technicalSpecifications[lang].forEach((section, index) => {
          const sectionTitle = section.sectionTitle;
          const rows = section.rows.map(row => ({
            title: row.title,
            value: row.value
          }));

          technicalSpecifications.push({
            sectionTitle,
            rows
          });
        });
      }

      // ✅ Downloads
      // ✅ Downloads
      if (req.files[`downloadFiles_${lang}`]) {
        const fileNames = req.body[`downloadFileNames_${lang}`] || [];
        const categories = req.body[`downloadCategories_${lang}`] || [];

        for (let i = 0; i < req.files[`downloadFiles_${lang}`].length; i++) {
          const file = req.files[`downloadFiles_${lang}`][i];
          const filePath = await uploadToCloudinary(file, `downloads/${lang}`);

          downloads.push({
            fileName: fileNames[i] || file.originalname,  // ✅ Use the custom name if available
            filePath,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            fileCategory: categories[i] || 'Uncategorized', // ✅ Use the category if available
          });
        }
      }


      languageData[lang] = [{
        ModelName: req.body[`ModelName_${lang}`],
        ModelNameDesc: req.body[`ModelNameDesc_${lang}`],
        ModelDesc: req.body[`ModelDesc_${lang}`],
        overview: overviewData,
        industry: industryData,
        technicalSpecifications,
        downloads
      }];
    }

    // ✅ Final model structure
    const model = {
      ModelThumbnail,
      ModelPhotos,
      overviewThumbnail,
      Language: languageData,
      isPublished: !isDraft
    };

    // ✅ Push to the product in MongoDB
    await Product.findByIdAndUpdate(productId, {
      $push: { Models: model }
    });

    console.log('✅ Model successfully added!');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('🔥 Error adding model:', err.message);
    res.redirect('/admin/Myproduct');
  }
};









// Controller for editing a model


// Controller for editing a model
// Controller for editing a model
// Controller for editing a model
// Controller for editing a model
// Controller for editing a model
exports.postEditModel = async (req, res) => {
  const { productId, modelId } = req.params;
  const languages = ['EN', 'ES', 'GR'];

  try {
    const product = await Product.findById(productId);
    if (!product) return res.redirect('/admin/Myproduct');

    const model = product.Models.id(modelId);
    if (!model) return res.redirect('/admin/Myproduct');

    // ✅ Helper function to upload to Cloudinary
    const uploadToCloudinary = async (file, folder) => {
      if (!file || !file.path) {
        console.log(`⚠️ Skipping Cloudinary upload for missing file.`);
        return null; // 🛑 Avoid upload if file is undefined
      }
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: folder,
          resource_type: file.mimetype.includes('image') ? 'image' : 'raw',
        });
        console.log(`✅ Successfully uploaded to Cloudinary: ${result.secure_url}`);
        return result.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error.message);
        return null;
      }
    };

    // ✅ Update main images (if they exist)
    model.ModelThumbnail = req.files?.ModelThumbnail?.[0]
      ? await uploadToCloudinary(req.files.ModelThumbnail[0], `DragLab/products/${productId}`)
      : model.ModelThumbnail || req.body.oldModelThumbnail;

    model.ModelPhotos = req.files?.ModelPhotos
      ? await Promise.all(req.files.ModelPhotos.map(file => uploadToCloudinary(file, `DragLab/products/${productId}`)))
      : model.ModelPhotos;

    model.overviewThumbnail = req.files?.overviewThumbnail?.[0]
      ? await uploadToCloudinary(req.files.overviewThumbnail[0], `DragLab/products/${productId}`)
      : model.overviewThumbnail || req.body.oldOverviewThumbnail;

    model.modelcapacity = req.body.modelcapacity || model.modelcapacity;

    // ✅ Loop through languages and process images
for (const lang of languages) {
  const overviewData = [];
  
  // 📝 Fetch all the files for this language
  const newFiles = req.files[`overviewImages_${lang}`] || [];

  for (let i = 0; i < 4; i++) {
    console.log(`🗂️ Looking for: overviewImages_${lang}[${i}]`);

    // 🔄 Try to get the file from the array
    const newFile = newFiles[i];

    // 🔄 Fetch old file path correctly now:
    const oldFile = req.body[`oldOverviewImages_${lang}_${i}`];
    const modelFile = model.Language[lang][0].overview[i]?.overviewImage;

    console.log(`🔍 New File Detected:`, newFile);
    console.log(`🔍 Old File Detected:`, oldFile);
    console.log(`🔍 Model File Detected:`, modelFile);

    // 🔄 Corrected logic:
    const overviewImage = newFile 
      ? await uploadToCloudinary(newFile, `DragLab/products/${productId}`)
      : oldFile || modelFile || '';

    console.log(`📌 Final Overview Image Path [${lang}] [${i}]:`, overviewImage);

    overviewData.push({
      overviewName: req.body.overview[lang]?.[i]?.overviewName || model.Language[lang][0].overview[i]?.overviewName,
      overviewDesc: req.body.overview[lang]?.[i]?.overviewDesc || model.Language[lang][0].overview[i]?.overviewDesc,
      overviewImage
    });
  }

  // 🔄 Update the language object with new overview data
  model.Language[lang] = [{
    ModelName: req.body[`ModelName_${lang}`],
    ModelNameDesc: req.body[`ModelNameDesc_${lang}`],
    ModelDesc: req.body[`ModelDesc_${lang}`],
    overview: overviewData,
  }];
}





    await product.save();
    console.log('✅ Model successfully updated!');
    res.redirect('/admin/Myproduct');
  } catch (err) {
    console.error('Error updating model:', err.message);
    res.redirect('/admin/Myproduct');
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
  try {
    const { title, desc, language } = req.body;
    
    console.log('📝 Received form data:', req.body);
    console.log('🗂️ Files received:', req.files);

    if (!req.files) {
      console.error("❌ No files found in request.");
      return res.status(400).send('No files uploaded');
    }

    // 📝 Fetch the image file from Multer
    const file = req.files.slideshowImage?.[0];

    if (!file) {
      console.error("❌ slideshowImage not found in req.files");
      console.log('🗂️ Files structure:', req.files);
      return res.status(400).send('Image is required');
    }

    console.log("🌐 Uploading image to Cloudinary...");
    const image = await uploadToCloudinary(file, 'slideshow');

    if (!image) {
      console.error("❌ Failed to upload image to Cloudinary.");
      return res.status(500).send('Failed to upload image');
    }

    console.log("✅ Image Path from Cloudinary:", image);

    // ✅ Save to database
    const newSlide = new Slideshow({ title, desc, image, language });

    await newSlide.save();
    console.log('✅ Slide added successfully!');
    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('🔥 Error adding slide:', err.message);
    console.error(err.stack); // <-- This will give you the stack trace of the error
    res.status(500).send('Internal Server Error');
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
  const { title, desc, language } = req.body;
  const image = req.files?.slideshowImage?.[0]?.cloudinaryUrl;

  try {
    // ✅ Fetch the slide from the database
    const slide = await Slideshow.findById(req.params.id);

    if (!slide) {
      console.error('❌ Slide not found!');
      return res.status(404).send('Slide not found');
    }

    // ✅ Update text fields
    slide.title = title;
    slide.desc = desc;
    slide.language = language;

    console.log("📝 Form Data Received:", req.body);
    console.log("🗂️ Files Received:", req.files);

    // ✅ If there is a new image file in the form
    if (req.files?.slideshowImage?.[0]) {
      console.log("🌐 Uploading new image to Cloudinary...");
      const newImageUrl = await uploadToCloudinary(req.files.slideshowImage[0], 'slideshow');

      if (newImageUrl) {
        console.log("✅ New Image URL:", newImageUrl);

        // ✅ Delete old image from Cloudinary if it exists
        if (slide.image) {
          // Extract the **publicId** correctly
          const publicId = slide.image
            .split('/draglab/models/slideshow/')[1] // Extract after the folder path
            .split('.')[0];                        // Remove the extension

          console.log("🗑️ Deleting old image from Cloudinary:", publicId);

          try {
            const result = await cloudinary.uploader.destroy(`draglab/models/slideshow/${publicId}`);
            console.log('✅ Old image deleted from Cloudinary:', result);
          } catch (err) {
            console.error('❌ Failed to delete old image from Cloudinary:', err.message);
          }
        }

        // ✅ Replace with the new image
        slide.image = newImageUrl;
      } else {
        console.error("❌ Failed to upload new image to Cloudinary.");
      }
    } else {
      console.log("⚠️ No new image provided for upload.");
    }

    // ✅ Mark the slide as modified
    slide.markModified('image');
    slide.markModified('title');
    slide.markModified('desc');
    slide.markModified('language');

    // ✅ Save the changes
    const updatedSlide = await slide.save();
    console.log('✅ Slide updated successfully:', updatedSlide);

    res.redirect('/admin/slideshow');
  } catch (err) {
    console.error('❌ Error updating slide:', err.message);
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
  const { title, author, body, language } = req.body;
  const file = req.files?.thumbnail?.[0];
  let thumbnail = '';

  // ✅ Upload to Cloudinary if file exists
  if (file) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'draglab/articles',
            public_id: file.originalname.split('.')[0],
            format: 'webp',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(file.buffer);
      });

      thumbnail = result;
      console.log('Cloudinary URL:', thumbnail);
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      return res.status(500).send('Failed to upload thumbnail');
    }
  }

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
  const { title, author, body, language } = req.body;
  const file = req.files?.thumbnail?.[0];

  Article.findById(req.params.articleId)
    .then(async (article) => {
      if (!article) return res.redirect('/admin/articles');

      article.title = title;
      article.author = author;
      article.body = body;
      article.language = language;

      if (file) {
        // ✅ Delete the old thumbnail from Cloudinary
        if (article.thumbnail) {
          const publicId = article.thumbnail.split('/draglab/articles/')[1].replace('.webp', '');
          try {
            const result = await cloudinary.uploader.destroy(`draglab/articles/${publicId}`);
            console.log('Old thumbnail deleted from Cloudinary:', result);
          } catch (err) {
            console.error('Failed to delete old image:', err.message);
          }
        }

        // ✅ Upload new thumbnail to Cloudinary
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'image',
                folder: 'draglab/articles',
                public_id: file.originalname.split('.')[0],
                format: 'webp',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            ).end(file.buffer);
          });

          article.thumbnail = result;
        } catch (err) {
          console.error('Cloudinary upload error:', err.message);
          return res.status(500).send('Failed to upload new thumbnail');
        }
      }

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