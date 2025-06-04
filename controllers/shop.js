const path = require('path');
const Product = require('../models/product');
const express = require('express');
const User = require('../models/user');
const Article = require('../models/articles');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const TechnicalService = require('../models/technicalService'); // make sure path is correct
const ContactUs = require('../models/contactUs');

const CatalogCategory = require('../models/CatalogCategory'); // Add this line to import the order model

const Slideshow = require('../models/slideshow'); // ✅ Make sure this is imported at the top


exports.getHomePage = (req, res, next) => {
    const lang = req.params.lang || req.query.lang || 'EN';

    Promise.all([
        Product.find({ isDraft: false }),
        Slideshow.find({
            $or: [
                { language: lang.toUpperCase() },
                { language: 'ALL' }
            ]
        }),
        Article.find({
            $or: [
                { language: lang.toUpperCase() },
                { language: 'ALL' }
            ]
        }).sort({ createdAt: -1 }).limit(10) // limit to 10 latest
    ])
        .then(([products, slides, articles]) => {
            res.render('customer/Home-page', {
                pageTitle: 'Home',
                path: '/',
                products,
                slides,
                articles, // ✅ include here
                categories: [],
                lang
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });


};





exports.getProducts = (req, res, next) => {
    const filters = {};

    if (req.query.Company && req.query.Company !== 'all') {
        filters.Company = req.query.Company;
    }

    if (req.query.color && req.query.color !== 'all') {
        filters.color = req.query.color;
    }

    if (req.query.category && req.query.category !== 'all') {
        filters.category = req.query.category;
    }

    if (req.query.InternalMemory && req.query.InternalMemory !== 'all') {
        filters.InternalMemory = req.query.InternalMemory;
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filters.Productprice = {};
        if (req.query.minPrice) {
            filters.Productprice.$gte = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            filters.Productprice.$lte = parseFloat(req.query.maxPrice);
        }
    }

    let query = Product.find(filters).select('ProductName Productprice productThumbnail quantity Company color');

    if (req.query.sort) {
        if (req.query.sort === 'price-asc') {
            query = query.sort({ Productprice: 1 });
        } else if (req.query.sort === 'price-desc') {
            query = query.sort({ Productprice: -1 });
        }
    }

    Promise.all([
        query.exec(),
        Category.find().exec()
    ])
        .then(([products, categories]) => {
            let cartItemCount = 0;
            if (req.user) {
                cartItemCount = req.user.cart.items.reduce((count, item) => count + item.quantity, 0);
            }

            if (!req.user) {
                res.render('customer/products-page', {
                    prods: products,
                    categories: categories,
                    cartItemCount: cartItemCount,
                    pageTitle: 'Products',
                    path: '/Products',
                    isAuthenticated: null,
                });
            } else {
                req.user.populate('likedItems')
                    .then(user => {
                        res.render('customer/products-page', {
                            prods: products,
                            categories: categories, // Pass categories to the view
                            pageTitle: 'Products',
                            cartItemCount: cartItemCount,
                            path: '/Products',
                            role: user.role,
                            likedItems: user.likedItems.map(item => item._id.toString()), // Pass liked item IDs as an array of strings
                            isAuthenticated: req.session.isLoggedIn,
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            next(err);
            res.redirect('/EN');
        });
};




exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            let cartItemCount = 0;
            if (req.user) {
                cartItemCount = req.user.cart.items.reduce((count, item) => count + item.quantity, 0);
            }
            if (!req.user) {
                // If the user is not authenticated, render the page without the role
                return res.render('customer/product-details', {
                    product: product,
                    cartItemCount: cartItemCount,
                    pageTitle: product.ProductName,
                    path: '/products',
                    role: null,
                    isAuthenticated: null
                });
            }
            return req.user.populate('role')
                .then(user => {
                    res.render('customer/product-details', {
                        product: product,
                        cartItemCount: cartItemCount,
                        pageTitle: product.ProductName,
                        path: '/products',
                        role: user.role,
                        isAuthenticated: req.session.isLoggedIn
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};

const Fuse = require('fuse.js');
const normalize = str => str?.toLowerCase().replace(/\s+/g, '') || '';

exports.search = async (req, res) => {
    const query = req.query.q?.trim();
    const lang = req.query.lang || 'EN';

    if (!query || query.length < 2) return res.json([]);

    try {
        const products = await Product.find({ isDraft: false });
        const articles = await Article.find({ language: lang });

        const searchableData = [];

        // Prepare Products & Models
        for (const product of products) {
            const pLang = product.Language?.[lang]?.[0] || product.Language?.EN?.[0];
            searchableData.push({
                type: 'product',
                name: pLang?.ProductName,
                url: `/${lang}/products/${product.slug}`
            });

            for (const model of product.Models || []) {
                if (!model.isPublished) continue;
                const mLang = model.Language?.[lang]?.[0] || model.Language?.EN?.[0];
                searchableData.push({
                    type: 'model',
                    name: mLang?.ModelName,
                    url: `/${lang}/products/${product.slug}/${model.slug}`
                });
            }
        }

        // Prepare Articles
        articles.forEach(article => {
            searchableData.push({
                type: 'article',
                name: article.title,
                url: `/${lang}/articles/${article.slug}`
            });
        });

        // Fuse.js config
        const fuse = new Fuse(searchableData, {
            keys: ['name'],
            threshold: 0.4, // lower = stricter match (try 0.3–0.5)
            includeScore: true
        });

        // Run search
        const results = fuse.search(query)
            .sort((a, b) => a.score - b.score) // low score = better match
            .map(r => r.item);

        // Optional: limit per type
        const grouped = { product: [], model: [], article: [] };
        for (const item of results) {
            if (grouped[item.type].length < 5) {
                grouped[item.type].push(item);
            }
        }

        return res.json([...grouped.product, ...grouped.model, ...grouped.article]);
    } catch (err) {
        console.error('🔴 Fuse.js Search Error:', err);
        res.status(500).json({ message: 'Search error' });
    }
};






exports.getProductDetails = (req, res, next) => {
    const { lang, productSlug } = req.params;
    const supportedLangs = ['EN', 'ES', 'GR'];
    const selectedLang = supportedLangs.includes(lang) ? lang : 'EN';

    Product.findOne({ slug: productSlug })
        .then(product => {
            if (!product) return res.redirect(`/${selectedLang}`);

            return Product.find().then(allProducts => {
                const publishedProducts = allProducts.map(prod => {
                    const publishedModels = prod.Models.filter(model => model.isPublished);
                    return {
                        ...prod.toObject(),
                        Models: publishedModels
                    };
                });

                res.render('customer/product-details.ejs', {
                    product,
                    lang: selectedLang,
                    translation: product.Language[selectedLang]?.[0] || product.Language['EN'][0],
                    models: product.Models.filter(m => m.isPublished),
                    products: publishedProducts,
                    req
                });
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};


exports.getModelDetailsPage = async (req, res, next) => {
    const { lang, productSlug, modelSlug } = req.params;
    const supportedLangs = ['EN', 'ES', 'GR'];
    const selectedLang = supportedLangs.includes(lang) ? lang : 'EN';

    try {
        // ✅ 1. Find product by slug
        const product = await Product.findOne({ slug: productSlug });
        if (!product) return res.redirect(`/${selectedLang}`);

        // ✅ 2. Find model by slug inside the product
        const model = product.Models.find(m => m.slug === modelSlug);
        if (!model || model.isPublished === false) return res.redirect(`/${selectedLang}`);

        // ✅ 3. Handle language fallback
        const currentLangData = model.Language[selectedLang]?.[0];
        const englishLangData = model.Language['EN']?.[0];

        if (!currentLangData) return res.redirect(`/${selectedLang}`);

        // ✅ 4. Fetch all products for the navbar
        const allProducts = await Product.find();

        const productLangData = product.Language[selectedLang]?.[0] || product.Language['EN']?.[0];

        res.render('customer/Model-details', {
            pageTitle: currentLangData.ModelName || "Model Details",
            ModelName: currentLangData.ModelName || englishLangData.ModelName || "No Name",
            ModelNameDesc: currentLangData.ModelNameDesc || englishLangData.ModelNameDesc || "No Description",
            ModelDesc: currentLangData.ModelDesc || englishLangData.ModelDesc || "No Details",
            overview: (currentLangData.overview?.length ? currentLangData.overview : englishLangData.overview || []).map((o, i) => ({
                ...(o.toObject ? o.toObject() : o),
                overviewImage: englishLangData?.overview?.[i]?.overviewImage || ''
            })),
            industry: (currentLangData.industry?.length ? currentLangData.industry : englishLangData.industry || []).map((ind, i) => ({
                ...(ind.toObject ? ind.toObject() : ind),
                industryImage: englishLangData?.industry?.[i]?.industryImage || '',
                industryLogo: englishLangData?.industry?.[i]?.industryLogo || ''
            })),
            specs: currentLangData.technicalSpecifications,
            downloads: currentLangData.downloads || [],
            modelThumbnail: model.ModelThumbnail,
            overviewThumbnail: model.overviewThumbnail,
            modelPhotos: model.ModelPhotos,
            lang: selectedLang,
            products: allProducts,
            productId: product._id, // might still be needed in forms
            modelId: model._id,
            productName: productLangData?.ProductName || "Unknown Product"
        });

    } catch (err) {
        console.error(err);
        res.redirect('/EN');
    }
};




exports.getContactus = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/contact-us.ejs', {
                pageTitle: 'Contact Us',
                path: '/Contact-us',
                products: products,
                categories: [], // Pass an empty array for categories if not needed
                lang,
                req //
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};

exports.postContactUs = async (req, res, next) => {
    try {
        const { firstName, lastName, subject, email, message, lang } = req.body;

        await new ContactUs({
            firstName,
            lastName,
            subject,
            email,
            message
        }).save();

        res.redirect(`/Contactus/EN?&success=true`);
    } catch (err) {
        console.error(err);
        res.redirect(`/Contactus/EN?&success=true`);
    }
};
exports.geTechnicalservice = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/technical-service', {
                pageTitle: 'technical service',
                path: '/technical-service',
                products: products,
                categories: [], // Pass an empty array for categories if not needed
                lang, // <- pass it to EJS
                req //  pass full request to access query params in EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};

exports.postTechnicalService = async (req, res) => {
    try {
        const {
            infoType, company, department, salutation, firstName, lastName,
            postalTown, street, country, telephone, telefax, email,
            failureDate, deviceCategory, deviceModel, serialNo, note
        } = req.body;

        const lang = req.query.lang || 'EN'; // ✅ Define lang before using

        await TechnicalService.create({
            infoType,
            company,
            department,
            salutation,
            firstName,
            lastName,
            postalTown,
            street,
            country,
            telephone,
            telefax,
            email,
            failureDate,
            deviceCategory,
            deviceModel,
            serialNo,
            note,
            lang: req.query.lang || 'EN'
        });

        // ✅ Redirect with a success flag in query string
        res.redirect(`/technical-service/${lang}?success=true`);
    } catch (error) {
        console.error('Error saving technical service request:', error);
        res.redirect(`/technical-service/${lang}?error=true`);
    }
};

exports.getSupport = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/Support', {
                pageTitle: 'support',
                path: '/support',
                products: products,
                categories: [], // Pass an empty array for categories if not needed
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};

exports.getaboutus = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/about-us', {
                pageTitle: 'aboutus',
                path: '/aboutus',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};

exports.getArticles = async (req, res) => {
    const lang = req.params.lang || 'EN';

    try {
        const articles = await Article.find({
            $or: [
                { language: lang },
                { language: 'ALL' }
            ]
        }).sort({ createdAt: -1 });

        const allProducts = await Product.find(); // ✅ Used by navbar

        res.render('customer/Articles', {
            articles,
            lang,
            products: allProducts // ✅ Now navbar will work
        });
    } catch (err) {
        console.error(err);
        res.redirect('/EN');
    }
};

exports.getArticleDetails = async (req, res) => {
    const { slug } = req.params;

    try {
        const article = await Article.findOne({ slug });
        if (!article) return res.redirect('/');

        const lang = article.language; // ✅ Use the actual language of the opened article

        const recentArticles = await Article.find({
            slug: { $ne: slug },
            language: lang // ✅ Match only the same language
        }).sort({ createdAt: -1 }).limit(4);

        const allProducts = await Product.find(); // For navbar

        res.render('customer/article-details', {
            article,
            recentArticles,
            lang,
            products: allProducts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/EN');
    }
};

exports.getDownloads = async (req, res, next) => {
    const lang = req.params.lang || 'EN'; // e.g. /Downloads/GR

    try {
        const products = await Product.find({});
        const catalogCategories = await CatalogCategory.find({});

        if (!products || products.length === 0) {
            console.error("No products found in the database.");
        }

        if (!catalogCategories || catalogCategories.length === 0) {
            console.error("No catalog categories found in the database.");
        }

        const downloads = [];
        const productNamesSet = new Set();
        const catalogCategoryNamesSet = new Set();

        // ✅ Model-based Downloads
        for (const product of products) {
            const productLang = product.Language?.[lang]?.[0] || product.Language?.EN?.[0];
            if (!productLang) continue;

            const productName = productLang.ProductName || 'Unnamed Product';
            productNamesSet.add(productName);

            for (const model of product.Models) {
                const modelLang = model.Language?.[lang]?.[0] || model.Language?.EN?.[0];
                if (!modelLang || !Array.isArray(modelLang.downloads)) continue;

                for (const file of modelLang.downloads) {
                    if (!file.filePath) continue;

                    downloads.push({
                        fileName: file.fileName,
                        filePath: file.filePath,
                        fileSize: file.fileSize,
                        fileCategory: (file.fileCategory || 'general').toLowerCase().replace(/\s+/g, '-'),
                        fileProductCategory: (file.fileProductCategory || productName).toLowerCase().replace(/\s+/g, '-'),
                        productName,
                        modelName: modelLang.ModelName || 'Unnamed Model',
                        lang,
                        type: 'model'
                    });

                }
            }
        }

        // ✅ Add CatalogCategory uploaded files
        for (const category of catalogCategories) {
            if (!Array.isArray(category.files)) continue;

            for (const file of category.files) {
                if (file.language !== lang) continue;
                if (!file.filePath) continue;

                downloads.push({
                    fileName: file.fileName,
                    filePath: file.filePath,
                    fileSize: file.fileSize,
                    fileCategory: category.categoryKey.toLowerCase().replace(/\s+/g, '-'),
                    fileProductCategory: category.categoryName.toLowerCase().replace(/\s+/g, '-'),
                    productName: category.categoryName,
                    modelName: '-',
                    lang,
                    type: 'catalog'
                });

                catalogCategoryNamesSet.add(category.categoryName.toLowerCase().replace(/\s+/g, '-'));
            }
        }

        const productNames = Array.from(productNamesSet);
        const catalogCategoryNames = Array.from(catalogCategoryNamesSet);

        // ✅ Render safely with fallback if empty
        res.render('customer/Downloads', {
            pageTitle: 'Downloads',
            path: '/Downloads',
            downloads,
            productNames: productNames.length ? productNames : ["No Products Available"],
            catalogCategoryNames: catalogCategoryNames.length ? catalogCategoryNames : ["No Categories Available"],
            lang,
            products
        });
    } catch (err) {
        console.error('Error loading downloads:', err.message);
        console.error(err.stack); // Log the stack trace
        return res.status(500).render('500', { errorMessage: err.message });
    }
};






exports.getTearmCondition = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/tearmCondition', {
                pageTitle: 'Terms and Conditions',
                path: '/TermCondition',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};
exports.getPrivacyPolicy = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/PrivacyPolicy', {
                pageTitle: 'Privacy Policy',
                path: '/PrivacyPolicy',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};
exports.getDataProtection = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/Data-Protection.ejs', {
                pageTitle: 'DataProtection',
                path: '/Data-Protection',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};
exports.getimprint = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/imprint.ejs', {
                pageTitle: 'imprint',
                path: '/imprint',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};
exports.getCodeofEthics = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/CodeofEthics.ejs', {
                pageTitle: 'Code of Ethics',
                path: '/CodeofEthics',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};

exports.getQualitypolicy = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render('customer/quality-policy', {
                pageTitle: 'quality Policy',
                path: '/quality policy',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};

exports.getWarrantyRegistration = (req, res) => {
    const lang = req.params.lang || 'EN';

    Product.find()
        .then(products => {
            res.render('customer/WarrantyRegistration', {
                pageTitle: 'Warranty Registration',
                products,
                lang,
                req // 👈 pass full request to access query params in EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};



exports.postWarrantyRegistration = async (req, res) => {
    try {
        const {
            name, email, datePurchased,
            deviceCategory, deviceModel, serialNo, message, lang
        } = req.body;

        await new WarrantyRegistration({
            name, email, datePurchased,
            deviceCategory, deviceModel, serialNo, message, lang: req.body.lang
        }).save();

        res.redirect(`/WarrantyRegistration/${lang}?success=true`);
    } catch (err) {
        console.error(err);
        res.redirect(`/WarrantyRegistration/${lang}?error=true`);
    }
};

