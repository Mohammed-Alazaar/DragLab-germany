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
        .catch(err => next(err));
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
                res.render(path.join(__dirname, '..', 'HTML', 'customer', 'products-page'), {
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
                        res.render(path.join(__dirname, '..', 'HTML', 'customer', 'products-page'), {
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
                return res.render(path.join(__dirname, '..', 'HTML', 'customer', 'product-details'), {
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
                    res.render(path.join(__dirname, '..','HTML', 'customer', 'product-details'), {
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
            console.log(err);
        });
};


exports.search = async (req, res) => {
    const query = req.query.q;
    if (!query || query.length < 3) {
        return res.json([]); // Return empty if less than 3 letters
    }

    try {
        const productResults = await Product.find({
            name: { $regex: query, $options: 'i' },
            isDraft: false
        }).limit(5); // Limit results for performance

        // Search inside product models too
        const modelResults = [];
        productResults.forEach(product => {
            product.Models.forEach(model => {
                if (model.modelname.toLowerCase().includes(query.toLowerCase())) {
                    modelResults.push({
                        type: 'model',
                        name: model.modelname,
                        id: model._id,
                        productId: product._id
                    });
                }
            });
        });

        const articleResults = await Article.find({
            title: { $regex: query, $options: 'i' }
        }).limit(5);

        const results = [
            ...productResults.map(product => ({
                type: 'product',
                name: product.name,
                id: product._id
            })),
            ...modelResults,
            ...articleResults.map(article => ({
                type: 'article',
                name: article.title,
                id: article._id
            }))
        ];

        res.json(results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductDetails = (req, res, next) => {
    const { productId, lang } = req.params;
    const supportedLangs = ['EN', 'ES', 'GR'];
    const selectedLang = supportedLangs.includes(lang) ? lang : 'EN';

    Product.findById(productId)
        .then(product => {
            if (!product) return res.redirect(`/${selectedLang}`);

            // 🔄 Fetch all products for navbar
            return Product.find().then(allProducts => {
                const publishedProducts = allProducts.map(prod => {
                    const publishedModels = prod.Models.filter(model => model.isPublished);
                    return {
                        ...prod.toObject(), // flatten mongoose document
                        Models: publishedModels
                    };
                });

                res.render(path.join(__dirname, '..','HTML', 'customer', 'product-details.ejs'), {
                    product,
                    lang: selectedLang,
                    translation: product.Language[selectedLang]?.[0] || product.Language['EN'][0],
                    models: product.Models.filter(m => m.isPublished),
                    products: publishedProducts, // use publishedProducts here
                    req // ✅ Don't forget to pass req if you use req.query.success/error inside the page
                });
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};


exports.getModelDetailsPage = (req, res, next) => {
    const { productId, modelId, lang } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) return res.redirect('/');
            const model = product.Models.id(modelId);
            if (!model || model.isPublished === false) return res.redirect('/');


            const currentLangData = model.Language[lang]?.[0];
            const englishLangData = model.Language['EN']?.[0];

            if (!currentLangData) return res.redirect('/');

            // ✅ Fetch all products for the navbar
            return Product.find().then(allProducts => {
                res.render(path.join(__dirname, '..', 'HTML', 'customer', 'model-details'), {
                    pageTitle: currentLangData.ModelName || "Model Details",
                    overview: (currentLangData.overview?.length ? currentLangData.overview : englishLangData.overview || []).map((o, i) => {
                        const base = o.toObject ? o.toObject() : o;
                        return {
                            ...base,
                            overviewImage: englishLangData?.overview?.[i]?.overviewImage || ''
                        };
                    }),

                    industry: (currentLangData.industry?.length ? currentLangData.industry : englishLangData.industry || []).map((ind, i) => {
                        const base = ind.toObject ? ind.toObject() : ind;
                        return {
                            ...base,
                            industryImage: englishLangData?.industry?.[i]?.industryImage || '',
                            industryLogo: englishLangData?.industry?.[i]?.industryLogo || ''
                        };
                    }),

                    specs: currentLangData.technicalSpecifications,
                    downloads: currentLangData.downloads || [],
                    modelThumbnail: model.ModelThumbnail,
                    overviewThumbnail: model.overviewThumbnail,
                    modelPhotos: model.ModelPhotos,
                    lang: lang,
                    products: allProducts // ✅ Pass this to EJS for the navbar
                });
            });
        })
        .catch(err => next(err));
};


exports.getContactus = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..', 'HTML', 'customer', 'contact-us.ejs'), {
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
            res.redirect('/');
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
            res.render(path.join(__dirname, '..', 'HTML', 'customer', 'technical-service.ejs'), {
                pageTitle: 'technical service',
                path: '/technical-service',
                products: products,
                categories: [], // Pass an empty array for categories if not needed
                lang, // <- pass it to EJS
                req // 👈 pass full request to access query params in EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
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
                res.render('customer/support', {
                pageTitle: 'support',
                path: '/support',
                products: products,
                categories: [], // Pass an empty array for categories if not needed
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });

};
// exports.getaboutus = (req, res, next) => {
//     const lang = req.params.lang || 'EN'; // ✅ Correct: use params

//     Product.find()
//         .then(products => {
//             res.render(path.join('customer', 'about-us.ejs'), { // ✅ render using view name only if you set views correctly
//                 pageTitle: 'aboutus',
//                 path: '/aboutus',
//                 products: products,
//                 lang
//             });
//         })
//         .catch(err => {
//             console.error(err);
//             res.redirect('/');
//         });
// };
exports.getaboutus = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..' , 'HTML', 'customer', 'about-us'), {
                pageTitle: 'aboutus',
                path: '/aboutus',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
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

        res.render(path.join(__dirname, '..',  'HTML', 'customer', 'articles'), {
            articles,
            lang,
            products: allProducts // ✅ Now navbar will work
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

exports.getArticleDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findById(id);
        if (!article) return res.redirect('/');

        const lang = article.language; // ✅ Use the actual language of the opened article

        const recentArticles = await Article.find({
            _id: { $ne: id },
            language: lang // ✅ Match only the same language
        }).sort({ createdAt: -1 }).limit(4);

        const allProducts = await Product.find(); // For navbar

        res.render(path.join(__dirname, '..',  'HTML', 'customer', 'article-details'), {
            article,
            recentArticles,
            lang,
            products: allProducts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

exports.getDownloads = async (req, res, next) => {
    const lang = req.params.lang || 'EN'; // e.g. /Downloads/GR

    try {
        const products = await Product.find({});
        const catalogCategories = await CatalogCategory.find({});

        const downloads = [];
        const productNamesSet = new Set();
        const catalogCategoryNamesSet = new Set();

        // 🧩 1. Add Model-based downloads
        for (const product of products) {
            const productLang = product.Language?.[lang]?.[0] || product.Language?.EN?.[0];
            if (!productLang) continue;

            const productName = productLang.ProductName || 'Unnamed Product';
            productNamesSet.add(productName); // ✅ always add it here

            for (const model of product.Models) {
                const modelLang = model.Language?.[lang]?.[0] || model.Language?.EN?.[0];
                if (!modelLang || !Array.isArray(modelLang.downloads)) continue;

                for (const file of modelLang.downloads) {
                    downloads.push({
                        fileName: file.fileName,
                        filePath: file.filePath,
                        fileSize: file.fileSize,
                        fileCategory: file.fileCategory?.toLowerCase(),
                        fileProductCategory: file.fileProductCategory?.toLowerCase(),
                        productName,
                        modelName: modelLang.ModelName || 'Unnamed Model',
                        lang,
                        type: 'model'
                    });
                }
            }
        }


        // 🧩 2. Add CatalogCategory uploaded files
        for (const category of catalogCategories) {
            for (const file of category.files) {
                if (file.language !== lang) continue; // ✅ skip if not same language

                downloads.push({
                    fileName: file.fileName,
                    filePath: file.filePath,
                    fileSize: file.fileSize,
                    fileCategory: category.categoryKey.toLowerCase(), // filter key
                    productName: category.categoryName,
                    modelName: '-', // no model name
                    lang,
                    type: 'catalog'
                });

                catalogCategoryNamesSet.add(category.categoryName); // ✅ include for filter
            }
        }

        const productNames = Array.from(productNamesSet);
        const catalogCategoryNames = Array.from(catalogCategoryNamesSet);

        res.render(path.join(__dirname, '..',  'HTML', 'customer', 'Downloads'), {
            pageTitle: 'Downloads',
            path: '/Downloads',
            downloads,
            productNames,
            catalogCategoryNames,
            lang,
            products // ✅ include for navbar if needed
        });
    } catch (err) {
        console.error('Error loading downloads:', err);
        res.redirect('/');
    }
};





exports.getTearmCondition = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..',  'HTML', 'customer', 'tearmCondition'), {
                pageTitle: 'Terms and Conditions',
                path: '/TermCondition',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });

};
exports.getPrivacyPolicy = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..',  'HTML', 'customer', 'PrivacyPolicy'), {
                pageTitle: 'Privacy Policy',
                path: '/PrivacyPolicy',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });

};

exports.getQualitypolicy = (req, res, next) => {
    const lang = req.query.lang || 'EN'; // <- 🔄 language detection

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..',  'HTML', 'customer', 'quality-policy'), {
                pageTitle: 'quality Policy',
                path: '/quality policy',
                products: products,
                lang // <- pass it to EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });

};

exports.getWarrantyRegistration = (req, res) => {
    const lang = req.params.lang || 'EN';

    Product.find()
        .then(products => {
            res.render(path.join(__dirname, '..', 'HTML', 'customer', 'WarrantyRegistration.ejs'), {
                pageTitle: 'Warranty Registration',
                products,
                lang,
                req // 👈 pass full request to access query params in EJS
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
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