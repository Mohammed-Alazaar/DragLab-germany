const multer = require('multer');
const sharp = require('sharp');
const sanitize = require('sanitize-filename');
const cheerio = require('cheerio');
const cloudinary = require('../util/cloudinaryConfig');
const { file } = require('pdfkit');

// ✅ Use memoryStorage (no need for destination or filename)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024
  }
});

exports.uploadSingle = upload.single('productThumbnail');
exports.uploadMultiple = upload.array('productPhotos', 5);

// Dynamic field generation
const languages = ['EN', 'ES', 'GR'];

const uploadFields = [
  // Product fields
  { name: 'productThumbnail', maxCount: 1 },
  { name: 'productSketch', maxCount: 1 },
  { name: 'modelFile', maxCount: 1 },
  { name: 'ModelThumbnail', maxCount: 1 },
  { name: 'ModelPhotos', maxCount: 10 },
  { name: 'overviewThumbnail', maxCount: 1 },
  { name: 'slideshowImage', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'catalogFile', maxCount: 1 },

  

];

languages.forEach(lang => {
  for (let i = 0; i < 4; i++) {
    uploadFields.push({ name: `FeatureImage_${lang}[${i}]`, maxCount: 1 });
  }
});

for (let lang of languages) {
  for (let i = 0; i < 10; i++) {
    uploadFields.push({ name: `overviewImages_${lang}[${i}]`, maxCount: 1 });
    uploadFields.push({ name: `industryImages_${lang}[${i}]`, maxCount: 1 });
    uploadFields.push({ name: `industryLogos_${lang}[${i}]`, maxCount: 1 });
  }
  uploadFields.push({ name: `downloadFiles_${lang}`, maxCount: 20 });
}

const uploadMixed = upload.fields(uploadFields);
exports.uploadMixed = uploadMixed;


// Cloudinary upload helper
const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'draglab/products',
        public_id: filename,
        format: 'webp',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// ✅ Cloudinary upload helper for raw files (e.g., PDFs, DOCX, ZIP)
const uploadToCloudinaryRaw = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'draglab/downloads',
        public_id: filename,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};



// ✅ Image upload to Cloudinary without compression
async function uploadToCloudinaryDirectly(req, res, next) {
  if (!req.files) return next();
  // Ensure these fields are processed
const fieldsToUpload = ['productThumbnail', 'productSketch'];

for (const field of fieldsToUpload) {
  const files = req.files[field];
  if (files && files.length > 0) {
    const file = files[0];
    const originalName = sanitize(file.originalname).slice(0, 50);

    try {
      console.log(`📌 Uploading ${field} to Cloudinary...`);
      const cloudUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'draglab/products',
            public_id: originalName,
          },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload error for ${originalName}:`, error.message);
              reject(error);
            } else {
              console.log(`✅ Successfully uploaded ${field} to Cloudinary: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        ).end(file.buffer);
      });

      // ✅ Set the URL for usage in postEditProduct
      file.cloudinaryUrl = cloudUrl;
    } catch (err) {
      console.warn(`⚠ Skipping upload: ${originalName} - ${err.message}`);
    }
  }
}


  const processImage = async (file) => {
    const originalName = sanitize(file.originalname).slice(0, 50);
    try {
      console.log(`📌 Uploading image to Cloudinary: ${file.fieldname}`);
      
      // ✅ Directly upload the buffer to Cloudinary without Sharp
      const cloudUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'draglab/products',
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

      file.cloudinaryUrl = cloudUrl;
      return cloudUrl;
    } catch (err) {
      console.warn(`⚠ Skipping upload: ${originalName} - ${err.message}`);
      return '';
    }
  };

  try {
    // ✅ Handle multilingual feature images
    const languages = ['EN', 'ES', 'GR'];
    for (const lang of languages) {
      for (let i = 0; i < 4; i++) {
        const files = req.files[`FeatureImage_${lang}[${i}]`];
        if (files && files.length > 0) {
          const file = files[0];
          const cloudUrl = await processImage(file);
          if (cloudUrl) {
            console.log(`✅ Successfully uploaded ${file.fieldname}: ${cloudUrl}`);
            file.cloudinaryUrl = cloudUrl;
          } else {
            console.error(`❌ Cloudinary URL missing for ${file.fieldname}`);
          }
        }
      }
    }

    next();
  } catch (err) {
    console.error('🔥 Error processing images:', err.message);
    return res.status(500).send('Error processing images');
  }
}




const uploadProductImages = [uploadMixed, uploadToCloudinaryDirectly]; // ✅ Corrected here

// ✅ Export the functions
module.exports = {
  uploadToCloudinary,
  uploadToCloudinaryRaw,
  uploadToCloudinaryDirectly,
  uploadMixed,
  uploadProductImages // ✅ Now it is properly defined
};
