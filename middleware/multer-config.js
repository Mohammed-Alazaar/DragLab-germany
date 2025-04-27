const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const access = util.promisify(fs.access);
const sanitize = require('sanitize-filename'); // ✅ Move this up here!

// Configure multer storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder;
        if (req.body.uuid) {
            folder = `./uploads/products/${req.body.uuid}`;
        } else {
            req.body.uuid = uuidv4();
            folder = `./uploads/products/${req.body.uuid}`;
        }

        if (file.fieldname === 'textureFiles') {
            folder = `${folder}/textures`;
        }

        mkdirp.sync(folder);
        cb(null, folder);
    },

    filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const cleanName = sanitize(originalName).slice(0, 50); // limit to 50 chars
        const finalName = `${Date.now()}-${cleanName}${extension}`;
        cb(null, finalName);
    }

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // Limit file size to 50MB
        fieldSize: 50 * 1024 * 1024
    }
});

exports.uploadSingle = upload.single('productThumbnail');
exports.uploadMultiple = upload.array('productPhotos', 5);

// Dynamic field generation for multiple languages
const languages = ['EN', 'ES', 'GR'];

const uploadFields = [
    { name: 'productThumbnail', maxCount: 1 },
    { name: 'productPhotos', maxCount: 10 },
    { name: 'productSketch', maxCount: 1 },
    { name: 'modelFile', maxCount: 1 },
    { name: 'ModelThumbnail', maxCount: 1 },
    { name: 'ModelPhotos', maxCount: 10 },
    { name: 'overviewThumbnail', maxCount: 1 },
    { name: `overviewImages_EN[]`, maxCount: 20 },
    { name: `industryImages_ES[]`, maxCount: 20 },
    { name: `industryLogos_GR[]`, maxCount: 20 },
    { name: 'downloadFiles_EN', maxCount: 10 },
    { name: 'downloadFiles_ES', maxCount: 10 },
    { name: 'downloadFiles_GR', maxCount: 10 },
    { name: 'catalogFile', maxCount: 1 }, // ✅ ADD THIS


];
// Support fixed 4 features per language
languages.forEach(lang => {
    for (let i = 0; i < 4; i++) {
        uploadFields.push({ name: `FeatureImage_EN[${i}]`, maxCount: 1 });
        uploadFields.push({ name: `FeatureImage_ES[${i}]`, maxCount: 1 });
        uploadFields.push({ name: `FeatureImage_GR[${i}]`, maxCount: 1 });
        uploadFields.push({ name: 'slideshowImage', maxCount: 1 });
        uploadFields.push({ name: 'thumbnail', maxCount: 1 });

    }

});

const maxCount = 10;

languages.forEach(lang => {
    for (let i = 0; i < maxCount; i++) {
        uploadFields.push({ name: `overviewImages_${lang}[${i}]`, maxCount: 1 });
        uploadFields.push({ name: `industryImages_${lang}[${i}]`, maxCount: 1 });
        uploadFields.push({ name: `industryLogos_${lang}[${i}]`, maxCount: 1 });
    }
    uploadFields.push({ name: `downloadFiles_${lang}`, maxCount: 20 });
});




const uploadMixed = upload.fields(uploadFields);
exports.uploadMixed = uploadMixed;

// Combined upload + compression middleware
exports.uploadProductImages = [
    uploadMixed,
    compressImages
];

// Image compression middleware
async function compressImages(req, res, next) {
    if (!req.files) return next();
    

    const processImage = async (file, maxSize) => {
        const filepath = path.join(file.destination, file.filename);
        const outputPath = filepath.replace(/\.(jpg|jpeg|png|webp)$/i, '') + '-optimized.webp';
    
        try {
            let buffer = await sharp(filepath)
                .toFormat('webp')
                .webp({ quality: 90 })
                .toBuffer();
    
            while (buffer.length > maxSize) {
                buffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
            }
    
            await sharp(buffer).toFile(outputPath);
            return { original: filepath, optimized: outputPath };
        } catch (err) {
            console.warn(`⚠️ Skipping compression: ${filepath} - ${err.message}`);
            return { original: filepath, optimized: filepath }; // skip compression if failed
        }
    };
    

    const filesToDelete = [];

    try {
        const fieldGroups = [

            'ModelThumbnail',
            'ModelPhotos',
            'overviewThumbnail',
            // Newly added multilingual model fields
            'overviewImages_EN',
            'overviewImages_ES',
            'overviewImages_GR',
            'industryImages_EN',
            'industryImages_ES',
            'industryImages_GR',
            'industryLogos_EN',
            'industryLogos_ES',
            'industryLogos_GR'
        ];
        languages.forEach(lang => {
            for (let i = 0; i < 4; i++) {
                fieldGroups.push(`FeatureImage_${lang}[${i}]`);
            }
        });


        for (const field of fieldGroups) {
            const files = req.files[field];
            if (!files) continue;

            for (let i = 0; i < files.length; i++) {
                const { original, optimized } = await processImage(files[i], 10 * 1024 * 1024);
                files[i].path = optimized.replace(/\\/g, '/');
                filesToDelete.push(original);
            }
        }
    } catch (err) {
        console.error('Error processing images:', err);
        return res.status(500).send('Error processing images');
    }

    for (const filepath of filesToDelete) {
        try {
            await access(filepath, fs.constants.F_OK); // Check only if file exists
            fs.unlinkSync(filepath);
            console.log(`Deleted original file: ${filepath}`);
        } catch (err) {
            console.error(`Failed to delete file: ${filepath}`, err);
        }
    }


    next();
}

exports.compressImages = compressImages;

// Middleware to compress base64 images inside HTML (used if needed for inline images)
exports.compressDescriptionImages = async (req, res, next) => {
    if (!req.body.description) return next();

    const $ = cheerio.load(req.body.description);
    const images = $('img');

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const src = $(img).attr('src');

        if (src && src.startsWith('data:image/')) {
            try {
                const buffer = Buffer.from(src.split(',')[1], 'base64');
                let optimizedBuffer = await sharp(buffer)
                    .toFormat('webp')
                    .webp({ quality: 90 })
                    .toBuffer();

                while (optimizedBuffer.length > 10 * 1024 * 1024) {
                    optimizedBuffer = await sharp(optimizedBuffer)
                        .webp({ quality: 85 })
                        .toBuffer();
                }

                const optimizedBase64 = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
                $(img).attr('src', optimizedBase64);
            } catch (err) {
                console.error('Error compressing description images:', err);
                return res.status(500).send('Error compressing description images');
            }
        }
    }

    req.body.description = $.html();
    next();
};





