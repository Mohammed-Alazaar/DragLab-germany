const multer = require('multer');
const sanitize = require('sanitize-filename');
const cheerio = require('cheerio');
const cloudinary = require('../util/cloudinaryConfig');
const { file } = require('pdfkit');
const path = require('path');


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
const languages = ['EN', 'ES', 'DE' , 'TR', 'FR'];

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
  { name: 'slideImage', maxCount: 1 },    // ✅ NEW
  { name: 'introImage', maxCount: 1 }


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
const uploadToCloudinary = async (file, folder) => {
  if (!file || !file.buffer) {
    console.warn(`⚠️ No file provided for upload.`);
    return null;
  }

  const ext = path.extname(file.originalname).toLowerCase(); // e.g., '.jpg'
  const baseName = sanitize(path.basename(file.originalname, ext))
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .slice(0, 40);
  const uniqueId = `${baseName}-${Date.now()}-${uuidv4()}`;

  const isImage = ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  const isPdf = ext === '.pdf';

  const uploadOptions = {
    folder: folder,
    public_id: uniqueId,
    use_filename: false,
    unique_filename: false,
    resource_type: isPdf ? 'raw' : 'image',
  };

  // Add compression and webp format only for JPEG/PNG
  if (isImage) {
    uploadOptions.format = 'webp';
    uploadOptions.quality = 'auto'; // Let Cloudinary optimize compression
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error(`❌ Cloudinary upload error for ${uniqueId}:`, error.message);
        reject(error);
      } else {
        console.log(`✅ Uploaded ${uniqueId}: ${result.secure_url}`);
        resolve(result.secure_url);
      }
    }).end(file.buffer);
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

  // 🔼 Moved here to avoid reference error
  const processImage = async (file) => {
    const originalName = sanitize(file.originalname).slice(0, 50); // ✅ ADD THIS LINE
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = sanitize(path.basename(file.originalname, ext))
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\.(jpg|jpeg|png)$/i, '')  // <- remove .jpg/.png
      .slice(0, 40);

    const isJpgOrPng = ['.jpg', '.jpeg', '.png'].includes(ext);

    try {
      console.log(`📌 Uploading image to Cloudinary: ${file.fieldname}`);

      const cloudUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'draglab/products',
            public_id: baseName,
            ...(isJpgOrPng && {
              format: 'webp',
              quality: 'auto'
            })
          },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload error for ${originalName}:`, error.message); // ✅ FIXED
              reject(error);
            } else {
              console.log(`✅ Successfully uploaded ${file.fieldname}: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        ).end(file.buffer);
      });

      file.cloudinaryUrl = cloudUrl;
      return cloudUrl;
    } catch (err) {
      console.warn(`⚠ Skipping upload: ${originalName} - ${err.message}`); // ✅ FIXED
      return '';
    }
  };


  // ✅ Upload common fields like productSketch and productThumbnail
  const fieldsToUpload = ['productThumbnail', 'productSketch', 'slideImage', 'introImage'];
  for (const field of fieldsToUpload) {
    const files = req.files[field];
    if (files && files.length > 0) {
      const file = files[0];
      const cloudUrl = await processImage(file);
      if (cloudUrl) {
        console.log(`✅ Successfully uploaded ${field}: ${cloudUrl}`);
        file.cloudinaryUrl = cloudUrl;
      } else {
        console.warn(`⚠️ Failed to upload ${field}`);
      }
    }
  }

  // ✅ Upload multilingual FeatureImage fields
  const languages = ['EN', 'ES', 'DE', 'TR', 'FR'];
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
