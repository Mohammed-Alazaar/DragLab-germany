const path = require('path');
const Product = require('../models/product');
const express = require('express');
const User = require('../models/user');
const Article = require('../models/articles');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const TechnicalService = require('../models/technicalService'); // make sure path is correct
const ContactUs = require('../models/contactUs');
const Industry = require('../models/IndustryPage');

const CatalogCategory = require('../models/CatalogCategory'); // Add this line to import the order model

const Slideshow = require('../models/slideshow'); // ✅ Make sure this is imported at the top
const axios = require('axios'); // ✅ Import axios for HTTP requests

const allanguages = ['EN', 'ES', 'DE', 'TR', 'FR'];




const seoData = require('../util/seoData'); // adjust path based on your folder

exports.getStaticPage = (req, res) => {
    const slug = req.params.slug || 'index'; // e.g. 'contact', 'company', 'incubator-di120-touch-screen'
    const lang = req.query.lang?.toUpperCase() || 'EN';

    const meta = seoData[slug] || {
        title: 'DragLab | Laboratory Equipment',
        description: 'Manufacturer of high-quality incubators, ovens, and water stills for global laboratories.'
    };

    res.render('customer/page', {
        pageSlug: slug,
        lang,
        meta
    });
};





exports.getHomePage = async (req, res, next) => {
    try {
        const lang = (req.params.lang || req.query.lang || 'EN').toUpperCase();




        const t = {
            EN: {
                featured: "Featured Products",
                articles: "Articles",
                industries: "Industries",
                about: "About Us",
                vision: "Our Vision",
                mission: "Our Mission",
                values: "Our Values",
                tab1Title: "Innovative Excellence",
                tab1Subtitle: "Pushing technology with superior design.",
                tab1Desc: "We believe that the products and services we provide will enable our partners to be a global leader in laboratory and medical equipment, known for our innovation, quality, and customer-focused approach.",
                tab2Title: "Global Leadership",
                tab2Subtitle: "Innovation, quality, and customer-driven success.",
                tab2Desc: "We aim to empower professionals in science and healthcare with advanced, reliable, and user-friendly equipment, driving progress and improving outcomes.",
                tab3Title: "Integrity and Responsibility",
                tab3Subtitle: "Empowering change through ethical commitment.",
                tab3Desc: ` <b>Innovation:</b> Continuously pushing the boundaries of technology to create cutting-edge solutions.<br><b>Quality:</b> Upholding the highest standards in product design, manufacturing, and performance.`,
                industries: "Industries",
                industriesList: {
                    chemical: "Chemical industry",
                    food: "Food and Beverage Industry",
                    biotech: "Biotechnology and Life Sciences",
                    pharma: "Pharmaceutical industry"
                },
            },
            ES: {
                featured: "Productos Destacados",
                articles: "Artículos",
                industries: "Industrias",
                about: "Sobre Nosotros",
                vision: "Nuestra Visión",
                mission: "Nuestra Misión",
                values: "Nuestros Valores",
                tab1Title: "Excelencia Innovadora",
                tab1Subtitle: "Impulsando la tecnología con diseño superior.",
                tab1Desc: "Creemos que los productos y servicios que ofrecemos permitirán a nuestros socios ser líderes globales en equipos de laboratorio y médicos, reconocidos por nuestra innovación, calidad y enfoque en el cliente.",
                tab2Title: "Liderazgo Global",
                tab2Subtitle: "Innovación, calidad y éxito orientado al cliente.",
                tab2Desc: "Nuestro objetivo es empoderar a los profesionales de la ciencia y la salud con equipos avanzados, confiables y fáciles de usar, impulsando el progreso y mejorando los resultados.",
                tab3Title: "Integridad y Responsabilidad",
                tab3Subtitle: "Empoderando el cambio mediante el compromiso ético.",
                tab3Desc: `<b>Innovación:</b> Superar continuamente los límites de la tecnología para crear soluciones innovadoras.<br><b>Calidad:</b> Mantener los más altos estándares en el diseño, fabricación y rendimiento del producto.`,
                industries: "Industrias",
                industriesList: {
                    chemical: "Industria química",
                    food: "Industria alimentaria y de bebidas",
                    biotech: "Biotecnología y ciencias de la vida",
                    pharma: "Industria farmacéutica"
                },
            },
            DE: {
                featured: "Empfohlene Produkte",
                articles: "Artikel",
                industries: "Branchen",
                about: "Über Uns",
                vision: "Unsere Vision",
                mission: "Unsere Mission",
                values: "Unsere Werte",
                tab1Title: "Innovative Exzellenz",
                tab1Subtitle: "Technologie mit überragendem Design vorantreiben.",
                tab1Desc: "Wir glauben, dass unsere Produkte und Dienstleistungen unseren Partnern helfen, weltweit führend in Labor- und Medizintechnik zu werden – bekannt für Innovation, Qualität und Kundenorientierung.",
                tab2Title: "Globale Führung",
                tab2Subtitle: "Innovation, Qualität und kundengesteuerter Erfolg.",
                tab2Desc: "Unser Ziel ist es, Fachkräfte in Wissenschaft und Gesundheitswesen mit fortschrittlichen, zuverlässigen und benutzerfreundlichen Geräten auszustatten und Fortschritte zu fördern.",
                tab3Title: "Integrität und Verantwortung",
                tab3Subtitle: "Veränderung durch ethisches Engagement fördern.",
                tab3Desc: '<b>Innovation:</b> Continuously pushing the boundaries of technology to create cutting-edge solutions.<br><b>Quality:</b> Upholding the highest standards in product design, manufacturing, and performance.',
                industries: "Branchen",
                industriesList: {
                    chemical: "Chemische Industrie",
                    food: "Lebensmittel- und Getränkeindustrie",
                    biotech: "Biotechnologie und Lebenswissenschaften",
                    pharma: "Pharmazeutische Industrie"
                },
            },
            TR: {
                featured: "Öne Çıkan Ürünler",
                articles: "Makaleler",
                industries: "Endüstriler",
                about: "Hakkımızda",
                vision: "Vizyonumuz",
                mission: "Misyonumuz",
                values: "Değerlerimiz",
                tab1Title: "Yenilikçi Mükemmellik",
                tab1Subtitle: "Üstün tasarımla teknolojiyi ileriye taşıyoruz.",
                tab1Desc: "Ürün ve hizmetlerimizin, ortaklarımızın yenilik, kalite ve müşteri odaklı yaklaşımıyla tanınan laboratuvar ve tıbbi ekipmanlarda küresel lider olmalarını sağlayacağına inanıyoruz.",
                tab2Title: "Küresel Liderlik",
                tab2Subtitle: "Yenilik, kalite ve müşteri odaklı başarı.",
                tab2Desc: "Bilim ve sağlık profesyonellerini gelişmiş, güvenilir ve kullanıcı dostu ekipmanlarla güçlendirerek ilerlemeyi teşvik etmeyi ve sonuçları iyileştirmeyi hedefliyoruz.",
                tab3Title: "Dürüstlük ve Sorumluluk",
                tab3Subtitle: "Etik taahhütle değişimi güçlendirmek.",
                tab3Desc: `<b>Yenilik:</b> Kesintisiz olarak teknolojinin sınırlarını zorlayarak öncü çözümler yaratmak.<br><b>Kalite:</b> Ürün tasarımı, üretimi ve performansında en yüksek standartları korumak.`,
                industries: "Endüstriler",
                industriesList: {
                    chemical: "Kimya Endüstrisi",
                    food: "Gıda ve İçecek Endüstrisi",
                    biotech: "Biyoteknoloji ve Yaşam Bilimleri",
                    pharma: "İlaç Endüstrisi"
                },
            },
            FR: {
                featured: "Produits en Vedette",
                articles: "Articles",
                industries: "Industries",
                about: "À Propos de Nous",
                vision: "Notre Vision",
                mission: "Notre Mission",
                values: "Nos Valeurs",
                tab1Title: "Excellence Innovante",
                tab1Subtitle: "Pousser la technologie avec un design supérieur.",
                tab1Desc: "Nous croyons que les produits et services que nous fournissons permettront à nos partenaires de devenir un leader mondial dans les équipements de laboratoire et médicaux, connus pour notre innovation, notre qualité et notre approche axée sur le client.",
                tab2Title: "Leadership Mondial",
                tab2Subtitle: "Innovation, qualité et succès axé sur le client.",
                tab2Desc: "Nous visons à autonomiser les professionnels de la science et des soins de santé avec des équipements avancés, fiables et conviviaux, stimulant le progrès et améliorant les résultats.",
                tab3Title: "Intégrité et Responsabilité",
                tab3Subtitle: "Favoriser le changement grâce à un engagement éthique.",
                tab3Desc: `<b>Innovation :</b> Repousser continuellement les limites de la technologie pour créer des solutions de pointe.<br><b>Qualité :</b> Maintenir les normes les plus élevées en matière de conception, de fabrication et de performance des produits.`,
                industries: "Industries",
                industriesList: {
                    chemical: "Industrie Chimique",
                    food: "Industrie Alimentaire et des Boissons",
                    biotech: "Biotechnologie et Sciences de la Vie",
                    pharma: "Industrie Pharmaceutique"
                }
            }
        };


        // Fetch all non-draft products; we'll filter by language publish below
        const [products, slides, articles] = await Promise.all([
            Product.find({ isDraft: false }).lean(),
            Slideshow.find({ $or: [{ language: lang }, { language: 'ALL' }] })
                .sort({ createdAt: -1 })
                .lean(),
            Article.find({ $or: [{ language: lang }, { language: 'ALL' }] })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
        ]);

        // Keep only products that are PUBLISHED in current language
        const publishedProducts = products.filter(p => {
            const langBlock = p?.Language?.[lang]?.[0];
            return !!(langBlock && langBlock.publish === true);
        });

        const rawIndustries = await Industry.find({ isDraft: false })
            .sort({ createdAt: 1 })
            .limit(4)
            .lean();

        const industryCards = rawIndustries.map(ind => {
            const langData = ind.Language?.[lang]?.[0] || {};
            return {
                slug: ind.slug,
                image: ind.sharedImages?.introImage || '/assets/Imgs/default.jpg',
                title: langData.slideTitle || ind.slug,
                description: langData.slideDesc || ''
            };
        });

        res.render('customer/Home-page', {
            pageTitle: 'Home',
            path: '/',
            products: publishedProducts,     // 🔴 pass filtered list
            slides,
            articles,
            lang,
            industryCards,
            t: t[lang] || t.EN
        });

    } catch (err) {
        console.error('Error loading home page:', err);
        res.redirect('/');
    }
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
            res.redirect('/');
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
            res.redirect('/');
        });
};

const Fuse = require('fuse.js');

// Normalize language access
const getLangBlock = (langObj, lang) => {
    if (!langObj || typeof langObj !== 'object') return undefined;
    const matchKey = Object.keys(langObj).find(k => k.toUpperCase() === lang.toUpperCase());
    return langObj[matchKey]?.[0]; // your schema stores each lang as [ { ... } ]
};

exports.search = async (req, res) => {
    const query = req.query.q?.trim();
    const lang = (req.query.lang || 'EN').toUpperCase(); // active page language

    if (!query || query.length < 2) return res.json([]);

    try {
        const products = await Product.find({ isDraft: false });
        const articles = await Article.find({ language: lang });

        const searchableData = [];

        for (const product of products) {
            const pLang = getLangBlock(product.Language, lang);
            console.log('🔍 LANG:', lang, '| Product Language Block:', Object.keys(product.Language || {}));
            console.log('➡️  Product Name:', pLang?.ProductName);
            if (pLang && pLang.ProductName) {
                searchableData.push({
                    type: 'product',
                    name: pLang.ProductName,
                    url: `/${lang}/products/${product.slug}`
                });
            }

            for (const model of product.Models || []) {
                if (!model.isPublished) continue;
                const mLang = getLangBlock(model.Language, lang);
                console.log('➡️  Model Name:', mLang?.ModelName);

                if (mLang && mLang.ModelName) {
                    searchableData.push({
                        type: 'model',
                        name: mLang.ModelName,
                        url: `/${lang}/products/${product.slug}/${model.slug}`
                    });
                }
            }
        }

        // Articles (already language-filtered)
        for (const article of articles) {
            searchableData.push({
                type: 'article',
                name: article.title,
                url: `/${lang}/articles/${article.slug}`
            });
        }

        // Optional debug to confirm structure
        if (searchableData.length === 0) {
            console.warn(`⚠️ No searchable items found for lang=${lang}`);
        }

        const fuse = new Fuse(searchableData, {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true
        });

        const results = fuse.search(query)
            .sort((a, b) => a.score - b.score)
            .map(r => r.item);

        const grouped = { product: [], model: [], article: [] };
        for (const item of results) {
            if (grouped[item.type].length < 5) {
                grouped[item.type].push(item);
            }
        }

        return res.json([...grouped.product, ...grouped.model, ...grouped.article]);
    } catch (err) {
        console.error('🔴 Fuse.js Search Error:', err);
        return res.status(500).json({ message: 'Search error' });
    }
};






exports.getProductDetails = async (req, res, next) => {
  try {
    const { productSlug } = req.params;

    // Normalize the language param to uppercase; fallback to EN
    const rawLang = req.params.lang || 'EN';
    const selectedLang = String(rawLang).toUpperCase();

    const supportedLangs = ['EN','ES','DE','TR','FR'];
    const langKey = supportedLangs.includes(selectedLang) ? selectedLang : 'EN';

    const product = await Product.findOne({ slug: productSlug }).lean();
    if (!product) {
      return res.status(404).render('404', {
        pageTitle: 'Not found',
        path: '/404',
        isAuthenticated: req.session?.isLoggedIn || false,
      });
    }

    const langData = product.Language?.[langKey]?.[0];
    const enData   = product.Language?.EN?.[0];

    // Languages where product is published
    const availableLangs = supportedLangs.filter(L => product?.Language?.[L]?.[0]?.publish === true);

    // If current language not published -> friendly switch page
    if (!langData || langData.publish !== true) {
      const sortedAvailable = availableLangs.sort((a, b) => (a === 'EN' ? -1 : b === 'EN' ? 1 : 0));
      const links = sortedAvailable.map(L => ({
        code: L,
        url: `/${L}/products/${product.slug}`,
        name: ({ EN:'English', ES:'Español', DE:'Deutsch', TR:'Türkçe', FR:'Français' }[L]) || L
      }));

      return res.status(200).render('customer/product-not-available', {
        pageTitle: 'Product Unavailable',
        lang: langKey,
        productSlug: product.slug,
        links,
        hasAny: links.length > 0,
        products: res.locals.navProducts || []
      });
    }

    // ✅ More-forgiving model filter:
    // show model if:
    // - current language's publish === true  OR
    // - EN publish === true                  OR
    // - model-level isPublished === true
    const modelsForLang = (product.Models || []).filter(m => {
      const langBlock = m?.Language?.[langKey]?.[0];
      const enBlock   = m?.Language?.EN?.[0];
      return (langBlock?.publish === true) || (enBlock?.publish === true) || (m?.isPublished === true);
    });

    // (Optional) quick debug in server logs
    console.debug('[ProductDetails] slug=%s lang=%s models=%d',
      product.slug, langKey, modelsForLang.length);

    const navProducts = res.locals.navProducts || [];

    return res.render('customer/product-details.ejs', {
      product,
      lang: langKey,
      translation: langData || enData,
      models: modelsForLang,
      products: navProducts,
      req
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/EN');
  }
};



exports.getModelDetailsPage = async (req, res, next) => {
    const { lang, productSlug, modelSlug } = req.params;
    const supportedLangs = allanguages; // e.g. ['EN','ES','DE','TR','FR']
    const selectedLang = supportedLangs.includes(lang) ? lang : 'EN';

    try {
        // 1) Product by slug
        const product = await Product.findOne({ slug: productSlug }).lean();
        if (!product) {
            return res.status(404).render('404', {
                pageTitle: 'Not found',
                path: '/404',
                isAuthenticated: req.session?.isLoggedIn || false,
            });
        }

        // 2) Model by slug
        const model = (product.Models || []).find(m => m.slug === modelSlug);
        if (!model || model.isPublished === false) {
            // model itself is not published at all -> genuine 404/redirect
            return res.status(404).render('404', {
                pageTitle: 'Not found',
                path: '/404',
                isAuthenticated: req.session?.isLoggedIn || false,
            });
        }

        // 3) Published languages for this model
        const availableLangs = (supportedLangs || []).filter(L =>
            model?.Language?.[L]?.[0]?.publish === true
        );

        // 4) Current language gate: if not published -> friendly page
        const currentLangData = model?.Language?.[selectedLang]?.[0];
        if (!currentLangData || currentLangData.publish !== true) {
            // EN first, then the rest
            const sortedAvailable = availableLangs.sort((a, b) =>
                a === 'EN' ? -1 : b === 'EN' ? 1 : 0
            );

            const langNames = {
                EN: 'English',
                ES: 'Español',
                DE: 'Deutsch',
                TR: 'Türkçe',
                FR: 'Français',
            };

            const links = sortedAvailable.map(L => ({
                code: L,
                url: `/${L}/products/${product.slug}/${model.slug}`,
                name: langNames[L] || L,
            }));

            return res.status(200).render('customer/model-not-available', {
                pageTitle: 'Model Unavailable',
                lang: selectedLang,
                productSlug: product.slug,
                modelSlug: model.slug,
                links,
                hasAny: links.length > 0,
                products: res.locals.navProducts || [], // keep navbar happy
            });
        }

        // 5) Normal render (language is published)
        const englishLangData = model.Language?.EN?.[0];
        const productLangData =
            product.Language?.[selectedLang]?.[0] || product.Language?.EN?.[0];

        const translations = {
            EN: {
                overviewTitle: 'Overview',
                industriesTitle: 'Industries',
                specsTitle: 'Technical Specifications',
                downloadsTitle: 'Downloads',
                noDownloads: 'No downloads available in this language.',
            },
            ES: {
                overviewTitle: 'Descripción general',
                industriesTitle: 'Industrias',
                specsTitle: 'Especificaciones técnicas',
                downloadsTitle: 'Descargas',
                noDownloads: 'No hay descargas disponibles en este idioma.',
            },
            DE: {
                overviewTitle: 'Überblick',
                industriesTitle: 'Branchen',
                specsTitle: 'Technische Daten',
                downloadsTitle: 'Downloads',
                noDownloads: 'Keine Downloads in dieser Sprache verfügbar.',
            },
            TR: {
                overviewTitle: 'Genel Bakış',
                industriesTitle: 'Sektörler',
                specsTitle: 'Teknik Özellikler',
                downloadsTitle: 'İndirmeler',
                noDownloads: 'Bu dilde mevcut indirme yok.',
            },
            FR: {
                overviewTitle: 'Aperçu',
                industriesTitle: 'Industries',
                specsTitle: 'Spécifications techniques',
                downloadsTitle: 'Téléchargements',
                noDownloads: 'Aucun téléchargement disponible dans cette langue.',
            },
        };

        const navProducts = res.locals.navProducts || [];

        return res.render('customer/Model-details', {
            pageTitle: currentLangData.ModelName || 'Model Details',
            ModelName: currentLangData.ModelName || englishLangData?.ModelName || 'No Name',
            ModelNameDesc:
                currentLangData.ModelNameDesc || englishLangData?.ModelNameDesc || 'No Description',
            ModelDesc: currentLangData.ModelDesc || englishLangData?.ModelDesc || 'No Details',

            // Use EN images when present, keep text from current language
            overview: (currentLangData.overview?.length
                ? currentLangData.overview
                : englishLangData?.overview || []
            ).map((o, i) => ({
                ...(o.toObject ? o.toObject() : o),
                overviewImage: englishLangData?.overview?.[i]?.overviewImage || '',
            })),

            industry: (currentLangData.industry?.length
                ? currentLangData.industry
                : englishLangData?.industry || []
            ).map((ind, i) => ({
                ...(ind.toObject ? ind.toObject() : ind),
                industryImage: englishLangData?.industry?.[i]?.industryImage || '',
                industryLogo: englishLangData?.industry?.[i]?.industryLogo || '',
            })),

            specs: currentLangData.technicalSpecifications || [],
            downloads: currentLangData.downloads || [],
            modelThumbnail: model.ModelThumbnail,
            overviewThumbnail: model.overviewThumbnail,
            modelPhotos: model.ModelPhotos,
            lang: selectedLang,
            products: navProducts,
            productId: product._id,
            modelId: model._id,
            t: translations[selectedLang],
            productName: productLangData?.ProductName || 'Unknown Product',
            productSlug,
            modelSlug,
            req,
        });
    } catch (err) {
        console.error(err);
        return res.redirect('/EN');
    }
};





exports.getContactus = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || req.query.lang?.toUpperCase() || 'EN';
    const CDN_BASE = 'https://www.drag-lab.de';
    const DEFAULT_OG = `${CDN_BASE}/assets/Imgs/SEO/contact-us.jpg`;

    const translations = {
        EN: {
            pageTitle: 'Contact Us - DragLab',
            metaDescription: 'Have a question or need help? Contact DragLab for fast support and expert assistance. We’re here to help you.',
            ogTitle: 'Contact Us | DragLab',
            ogDescription: 'Need assistance with laboratory equipment or service inquiries? Contact DragLab Technologies today.',
            ogImage: DEFAULT_OG,
            sectionHeading: 'Contact Us',
            sectionSub: 'Have a question or need help? Reach out!',
            successMessage: '✅ Thank you! We have received your message.',
            errorMessage: '❌ Something went wrong. Please try again later.',
            labels: {
                first: 'First Name',
                last: 'Last Name',
                subject: 'Subject',
                email: 'Email',
                message: 'Write your message...',
                send: 'Send Message',
                contactInfo: 'Contact Information',
            }
        },
        DE: {
            pageTitle: 'Kontaktieren Sie uns - DragLab',
            metaDescription: 'Haben Sie Fragen oder benötigen Sie Hilfe? Kontaktieren Sie DragLab für schnelle Unterstützung und kompetente Beratung.',
            ogTitle: 'Kontakt | DragLab',
            ogDescription: 'Benötigen Sie Hilfe mit Laborgeräten oder technischen Anfragen? Kontaktieren Sie DragLab Technologies noch heute.',
            ogImage: DEFAULT_OG,
            sectionHeading: 'Kontaktieren Sie uns',
            sectionSub: 'Haben Sie Fragen oder benötigen Sie Hilfe? Kontaktieren Sie uns!',
            successMessage: '✅ Vielen Dank! Wir haben Ihre Nachricht erhalten.',
            errorMessage: '❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es später noch einmal.',
            labels: {
                first: 'Vorname',
                last: 'Nachname',
                subject: 'Betreff',
                email: 'E-Mail',
                message: 'Schreiben Sie Ihre Nachricht...',
                send: 'Nachricht senden',
                contactInfo: 'Kontaktinformationen',
            }
        },
        ES: {
            pageTitle: 'Contáctanos - DragLab',
            metaDescription: '¿Tienes preguntas o necesitas ayuda? Contacta con DragLab para asistencia rápida y especializada.',
            ogTitle: 'Contacto | DragLab',
            ogDescription: '¿Necesitas soporte o tienes dudas sobre nuestros productos? Contáctanos y recibe asistencia inmediata.',
            ogImage: DEFAULT_OG,
            sectionHeading: 'Contáctanos',
            sectionSub: '¿Tienes preguntas o necesitas ayuda? ¡Escríbenos!',
            successMessage: '✅ ¡Gracias! Hemos recibido tu mensaje.',
            errorMessage: '❌ Algo salió mal. Intenta de nuevo más tarde.',
            labels: {
                first: 'Nombre',
                last: 'Apellido',
                subject: 'Asunto',
                email: 'Correo electrónico',
                message: 'Escribe tu mensaje...',
                send: 'Enviar mensaje',
                contactInfo: 'Información de contacto',
            }
        },
        TR: {
            pageTitle: 'Bize Ulaşın - DragLab',
            metaDescription: 'Sorularınız mı var veya yardıma mı ihtiyacınız var? Hızlı destek ve uzman yardımı için DragLab ile iletişime geçin.',
            ogTitle: 'İletişim | DragLab',
            ogDescription: 'Laboratuvar ekipmanları veya hizmet taleplerinizle ilgili yardıma mı ihtiyacınız var? Bugün DragLab Technologies ile iletişime geçin.',
            ogImage: DEFAULT_OG,
            sectionHeading: 'Bize Ulaşın',
            sectionSub: 'Sorularınız mı var veya yardıma mı ihtiyacınız var? Bizimle iletişime geçin!',
            successMessage: '✅ Teşekkürler! Mesajınızı aldık.',
            errorMessage: '❌ Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.',
            labels: {
                first: 'Ad',
                last: 'Soyad',
                subject: 'Konu',
                email: 'E-posta',
                message: 'Mesajınızı yazın...',
                send: 'Mesajı Gönder',
                contactInfo: 'İletişim Bilgileri',
            }
        },
        FR: {
            pageTitle: 'Contactez-nous - DragLab',
            metaDescription: 'Vous avez une question ou besoin d\'aide ? Contactez DragLab pour un support rapide et une assistance experte.',
            ogTitle: 'Contact | DragLab',
            ogDescription: 'Besoin d\'aide avec du matériel de laboratoire ou des demandes de service ? Contactez DragLab Technologies dès aujourd\'hui.',
            ogImage: DEFAULT_OG,
            sectionHeading: 'Contactez-nous',
            sectionSub: 'Vous avez une question ou besoin d\'aide ? Contactez-nous !',
            successMessage: '✅ Merci ! Nous avons bien reçu votre message.',
            errorMessage: '❌ Une erreur est survenue. Veuillez réessayer plus tard.',
            labels: {
                first: 'Prénom',
                last: 'Nom',
                subject: 'Sujet',
                email: 'E-mail',
                message: 'Écrivez votre message...',
                send: 'Envoyer le message',
                contactInfo: 'Informations de contact',
            }
        }
    };

    const t = translations[lang] || translations.EN;
    // ✅ compute noindex for “state” URLs like ?success=1 or ?error=1
    const noindex = !!(req.query && (req.query.success || req.query.error));

    // (optional) provide a canonical URL to keep logic out of the view
    const canonicalUrl = `${CDN_BASE}/${lang}/contactus`;
    // (optional) also send an X‑Robots‑Tag header for extra safety
    if (noindex) res.set('X-Robots-Tag', 'noindex, follow');

    Product.find()
        .then(products => {
            res.render('customer/contact-us.ejs', {
                ...t,
                labels: t.labels,
                lang,
                req,
                products,
                categories: [],
                path: `/${lang}/contactus`,
                noindex,
                canonicalUrl,
                ogImage: t.ogImage
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(303).redirect(`/${fallbackLang}/contactus?success=true`);
        });
};




exports.postContactUs = async (req, res) => {
    const lang = (req.body.lang || req.query.lang || 'EN').toUpperCase();

    try {
        // --- Optional reCAPTCHA (controlled by RECAPTCHA_ENABLED) ---
        const token = req.body['g-recaptcha-response'];
        if (RECAPTCHA_ENABLED) {
            if (!token) return res.redirect(`/${lang}/contactus?error=true`);
            const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
            const { data } = await axios.post(verifyUrl, null, {
                params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token }
            });
            if (!data?.success || Number(data?.score) < 0.5) {
                console.error('❌ reCAPTCHA verification failed (contact):', data);
                return res.redirect(`/${lang}/contactus?error=true`);
            }
        } else {
            console.warn('⚠️ reCAPTCHA disabled via RECAPTCHA_ENABLED=false (test mode)');
        }

        // --- Extract fields ---
        const { firstName, lastName, subject, email, message } = req.body;

        // --- Meta ---
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        const userAgent = req.get('User-Agent');

        // --- Persist submission ---
        const doc = await new ContactUs({
            firstName, lastName, subject, email, message, lang, ipAddress, userAgent
        }).save();

        // Human-friendly ticket (Contact Us)
        const ticketId = `CU-${doc._id.toString().slice(-6).toUpperCase()}`;

        // --- Flags for template i18n ---
        const flags = {
            isEN: lang === 'EN',
            isES: lang === 'ES',
            isDE: lang === 'DE',
            isTR: lang === 'TR',
            isFR: lang === 'FR'
        };

        // --- Customer confirmation (SendGrid -> FROM noreply@) ---
        await sendCustomerEmail({
            to: email,
            form: 'contactUs',
            data: {
                ...flags,
                year: new Date().getFullYear(),
                brandName: 'DragLab',
                supportEmail: 'info@drag-lab.de',  // what users see in the footer/contact line
                ticketId,
                fullName: `${firstName} ${lastName}`,
                contactSubject: subject,
                userMessage: message || '',
                helpCenterUrl: `https://www.drag-lab.de/${lang}/contactus`
            }
        });

        // --- Admin notification (SMTP -> info@) ---
        const subjectMap = {
            EN: `[Contact] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            ES: `[Contacto] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            DE: `[Kontakt] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            TR: `[İletişim] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            FR: `[Contact] ${firstName} ${lastName} — ${subject} (${ticketId})`
        };
        const internalSubject = subjectMap[lang] || subjectMap.EN;

        const bodyText =
            `New Contact Us submission

Ticket: ${ticketId}
Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message || '-'}

Meta:
- Language: ${lang}
- IP: ${ipAddress || '-'}
- User-Agent: ${userAgent || '-'}

Admin Link (optional): https://www.drag-lab.de/admin/contact-message/${doc._id}
`;

        await notifyInternal({
            to: 'info@drag-lab.de',
            subject: internalSubject,
            text: bodyText
        });

        return res.redirect(`/${lang}/contactus?success=true`);
    } catch (err) {
        console.error('❌ Error in Contact Us submission:', err);
        const fallback = (req.body.lang || req.query.lang || 'EN').toUpperCase();
        return res.redirect(`/${fallback}/contactus?error=true`);
    }
};




const RECAPTCHA_ENABLED = String(process.env.RECAPTCHA_ENABLED) === 'true';


exports.geTechnicalservice = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const translations = {
        EN: {
            dataLabel: 'I agree to the processing of my personal data in accordance with the',
            privacyPolicy: 'Privacy Policy',
            dataSuffix: 'for the purpose of handling my Warranty Registration request.',
            slideTitle: "Technical Support at Your Service.",
            slideSubtitle: "Quick and reliable solutions to your technical problems.",
            formTitle: "Technical Support Form",
            success: "✅ Your technical support request has been submitted successfully.",
            error: "❌ Something went wrong. Please try again.",
            userSectionTitle: "User Technical Support",
            aDEeeLabel: "I aDEee to the processing of my personal data in accordance with the Privacy Policy for the purpose of handling my technical support request.*",
            infoLabel: "Information info:",
            company: "Company",
            private: "Personal",
            salutationLabel: "Salutation:",
            mrs: "Mrs/Ms",
            mr: "Mr",
            firstName: "First Name",
            lastName: "Last Name",
            postalTown: "Postal/ ZIP code, Town",
            street: "Street",
            country: "Country",
            telephone: "Telephone",
            telefax: "Telefax",
            email: "Email",
            techSectionTitle: "Technical Question / Failure",
            failureDate: "Date of Failure",
            deviceCategory: "Device category*",
            deviceModel: "Device Model*",
            serialNo: "Serial No",
            note: "Note",
            notePlaceholder: "Write your Note...",
            sendBtn: "Send Message",
            selectOption: "Select"
        },
        ES: {
            dataLabel: 'Acepto el tratamiento de mis datos personales de acuerdo con la',
            privacyPolicy: 'Política de Privacidad',
            dataSuffix: 'para gestionar mi solicitud de registro de garantía.',
            slideTitle: "Soporte técnico a su servicio.",
            slideSubtitle: "Soluciones rápidas y fiables a sus problemas técnicos.",
            formTitle: "Formulario de soporte técnico",
            success: "✅ Su solicitud de soporte técnico se ha enviado correctamente.",
            error: "❌ Algo salió mal. Por favor, inténtelo de nuevo.",
            userSectionTitle: "Soporte técnico de usuario",
            infoLabel: "Tipo de información:",
            company: "Empresa",
            private: "Persona particular",
            salutationLabel: "Saludo:",
            mrs: "Sra/Srta",
            mr: "Sr",
            firstName: "Nombre",
            lastName: "Apellido",
            postalTown: "Código postal, ciudad",
            street: "Calle",
            country: "País",
            telephone: "Teléfono",
            telefax: "Fax",
            email: "Correo electrónico",
            techSectionTitle: "Pregunta técnica / Fallo",
            failureDate: "Fecha del fallo",
            deviceCategory: "Categoría del dispositivo*",
            deviceModel: "Modelo del dispositivo*",
            serialNo: "N.º de serie",
            note: "Nota",
            notePlaceholder: "Escriba su nota...",
            sendBtn: "Enviar mensaje",
            selectOption: "Seleccionar"
        },
        DE: {
            dataLabel: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der',
            privacyPolicy: 'Datenschutzerklärung',
            dataSuffix: 'zum Zweck der Bearbeitung meiner Garantieregistrierung.',
            slideTitle: "Technischer Support zu Ihren Diensten.",
            slideSubtitle: "Schnelle und zuverlässige Lösungen für Ihre technischen Probleme.",
            formTitle: "Technisches Support-Formular",
            success: "✅ Ihre Anfrage wurde erfolgreich übermittelt.",
            error: "❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
            userSectionTitle: "Technischer Support für Benutzer",
            infoLabel: "Informationstyp:",
            company: "Firma",
            private: "Privatperson",
            salutationLabel: "Anrede:",
            mrs: "Frau",
            mr: "Herr",
            firstName: "Vorname",
            lastName: "Nachname",
            postalTown: "PLZ / Ort",
            street: "Straße",
            country: "Land",
            telephone: "Telefon",
            telefax: "Telefax",
            email: "E-Mail",
            techSectionTitle: "Technische Frage / Fehler",
            failureDate: "Datum des Fehlers",
            deviceCategory: "Gerätekategorie*",
            deviceModel: "Gerätemodell*",
            serialNo: "Seriennummer",
            note: "Notiz",
            notePlaceholder: "Schreiben Sie Ihre Notiz...",
            sendBtn: "Nachricht senden",
            selectOption: "Auswählen"
        },
        TR: {
            dataLabel: 'Kişisel verilerimin işlenmesini kabul ediyorum',
            privacyPolicy: 'Gizlilik Politikası',
            dataSuffix: 'garanti kaydı talebimi yönetmek için.',
            slideTitle: "Teknik destek hizmetinizde.",
            slideSubtitle: "Teknik sorunlarınıza hızlı ve güvenilir çözümler.",
            formTitle: "Teknik Destek Formu",
            success: "✅ Teknik destek talebiniz başarıyla gönderildi.",
            error: "❌ Bir hata oluştu. Lütfen tekrar deneyin.",
            userSectionTitle: "Kullanıcı Teknik Desteği",
            infoLabel: "Bilgi Türü:",
            company: "Şirket",
            private: "Gerçek kişi",
            salutationLabel: "Selam:",
            mrs: "Bayan",
            mr: "Bay",
            firstName: "Ad",
            lastName: "Soyad",
            postalTown: "Posta kodu, şehir",
            street: "Sokak",
            country: "Ülke",
            telephone: "Telefon",
            telefax: "Faks",
            email: "E-posta",
            techSectionTitle: "Teknik Soru / Arıza",
            failureDate: "Arıza Tarihi",
            deviceCategory: "Cihaz Kategorisi*",
            deviceModel: "Cihaz Modeli*",
            serialNo: "Seri No",
            note: "Not",
            notePlaceholder: "Notunuzu yazın...",
            sendBtn: "Mesajı Gönder",
            selectOption: "Seç"
        },
        FR: {
            dataLabel: 'J\'accepte le traitement de mes données personnelles conformément à la',
            privacyPolicy: 'Politique de Confidentialité',
            dataSuffix: 'dans le but de traiter ma demande d\'enregistrement de garantie.',
            slideTitle: "Support technique à votre service.",
            slideSubtitle: "Des solutions rapides et fiables à vos problèmes techniques.",
            formTitle: "Formulaire de support technique",
            success: "✅ Votre demande de support technique a été soumise avec succès.",
            error: "❌ Une erreur s'est produite. Veuillez réessayer.",
            userSectionTitle: "Support technique utilisateur",
            infoLabel: "Type d'information :",
            company: "Entreprise",
            private: "Particulier",
            salutationLabel: "Salutation :",
            mrs: "Mme/Mlle",
            mr: "M.",
            firstName: "Prénom",
            lastName: "Nom",
            postalTown: "Code postal, ville",
            street: "Rue",
            country: "Pays",
            telephone: "Téléphone",
            telefax: "Télécopie",
            email: "E-mail",
            techSectionTitle: "Question technique / Panne",
            failureDate: "Date de la panne",
            deviceCategory: "Catégorie d'appareil*",
            deviceModel: "Modèle d'appareil*",
            serialNo: "N° de série",
            note: "Note",
            notePlaceholder: "Écrivez votre note...",
            sendBtn: "Envoyer le message",
            selectOption: "Sélectionner"
        }

    };

    Product.find()
        .then(products => {
            res.render('customer/technical-service', {
                pageTitle: translations[lang]?.formTitle || 'Technical Service',
                path: `/technical-service/${lang}`,
                products,
                categories: [],
                lang,
                t: translations[lang] || translations['EN'],
                translations: translations[lang] || translations['EN'],
                req,
                recaptchaEnabled: RECAPTCHA_ENABLED, // ✅ pass to EJS

            });
        })
        .catch(err => {
            console.error("🔴 ERROR in Product.find or rendering:", err);
            res.redirect('/EN');
        });
};


// controllers/technicalService.js
const { sendCustomerEmail, notifyInternal } = require('../services/email');

// controllers/technicalService.js

exports.postTechnicalService = async (req, res) => {
    const lang = req.query.lang?.toUpperCase() || 'EN';
    const token = req.body['g-recaptcha-response'];

    try {
        // -- reCAPTCHA (optional) -------------------------------------------------
        if (RECAPTCHA_ENABLED) {
            if (!token) return res.redirect(`/${lang}/technical-service/?error=true`);

            const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
            const { data } = await axios.post(verifyUrl, null, {
                params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token }
            });

            const { success, score } = data;
            if (!success || Number(score) < 0.5) {
                console.error('❌ reCAPTCHA verification failed:', data);
                return res.redirect(`/${lang}/technical-service/?error=true`);
            }
        } else {
            console.warn('⚠️ reCAPTCHA disabled via RECAPTCHA_ENABLED=false (test mode)');
        }

        // -- Extract submitted fields --------------------------------------------
        const {
            infoType, company, department, salutation, firstName, lastName,
            postalTown, street, country, telephone, telefax, email,
            failureDate, deviceCategory, deviceModel, serialNo, note,
            // (optional) if you kept the client hidden fields, we'll use ONLY as fallback
            deviceCategoryName, deviceModelName
        } = req.body;

        // -- Resolve readable names from DB (Product + embedded Model) -----------
        let productName = '';
        let modelName = '';

        try {
            const productDoc = await Product.findById(
                deviceCategory,
                { Language: 1, Models: 1 }
            ).lean();

            if (productDoc) {
                productName =
                    productDoc?.Language?.[lang]?.[0]?.ProductName ??
                    productDoc?.Language?.EN?.[0]?.ProductName ?? '';

                const modelSub = productDoc?.Models?.find(m => String(m._id) === String(deviceModel));
                if (modelSub) {
                    modelName =
                        modelSub?.Language?.[lang]?.[0]?.ModelName ??
                        modelSub?.Language?.EN?.[0]?.ModelName ?? '';
                }
            }
        } catch (e) {
            console.warn('⚠️ Product/Model name lookup failed:', e?.message || e);
        }

        // Fallbacks if lookup failed (optional: uses client-provided names, else IDs)
        if (!productName) productName = deviceCategoryName || deviceCategory;
        if (!modelName) modelName = deviceModelName || deviceModel;

        // -- Meta -----------------------------------------------------------------
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        const userAgent = req.get('User-Agent');

        // -- Persist submission (keep storing IDs) --------------------------------
        const doc = await TechnicalService.create({
            infoType, company, department, salutation, firstName, lastName,
            postalTown, street, country, telephone, telefax, email,
            failureDate, deviceCategory, deviceModel, serialNo, note, lang,
            ipAddress, userAgent
            // (optional) you can also persist resolved names:
            // productNameResolved: productName,
            // modelNameResolved: modelName
        });

        const ticketId = `TS-${doc._id.toString().slice(-6).toUpperCase()}`;

        // -- Customer email -------------------------------------------------------
        const flags = { isEN: lang === 'EN', isES: lang === 'ES', isDE: lang === 'DE', isTR: lang === 'TR', isFR: lang === 'FR' };

        await sendCustomerEmail({
            to: email,
            form: 'technicalSupport',
            data: {
                ...flags,
                year: new Date().getFullYear(),
                brandName: 'DragLab',
                supportEmail: 'info@drag-lab.de',
                ticketId,
                deviceCategory: productName,   // ✅ readable name
                deviceModel: modelName,        // ✅ readable name
                serialNumber: serialNo || '',
                dateOfFailure: failureDate || '',
                technicalQuestion: note || '',
                helpCenterUrl: `https://www.drag-lab.de/${lang}/technical-service`
            }
        });

        // -- Internal email -------------------------------------------------------
        const subjectMap = {
            EN: `[Tech Support] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
            ES: `[Soporte Técnico] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
            DE: `[Technischer Support] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
            TR: `[Teknik Destek] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
            FR: `[Support Technique] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`
        };
        const subject = subjectMap[lang] || subjectMap.EN;

        const bodyText =
            `New Technical Support submission

Ticket: ${ticketId}
Name: ${firstName} ${lastName}
Email: ${email}
Type: ${infoType || '-'}
Company: ${company || '-'}
Department: ${department || '-'}

Address:
- ${street || '-'}
- ${postalTown || '-'}
- ${country || '-'}

Contact:
- Telephone: ${telephone || '-'}
- Telefax: ${telefax || '-'}

Device:
- Category: ${productName || '-'}
- Model: ${modelName || '-'}
- Serial: ${serialNo || '-'}

Failure Date: ${failureDate || '-'}
Question/Note:
${note || '-'}

Meta:
- Language: ${lang}
- IP: ${ipAddress || '-'}
- User-Agent: ${userAgent || '-'}

Admin Link (optional): https://www.drag-lab.de/admin/technical-requests/${doc._id}
`;

        await notifyInternal({ to: 'info@drag-lab.de', subject, text: bodyText });

        return res.redirect(`/${lang}/technical-service/?success=true`);
    } catch (error) {
        console.error('❌ Error in TechnicalService submission:', error);
        return res.redirect(`/${lang}/technical-service/?error=true`);
    }
};




exports.getSupport = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const t = {
        EN: {
            pageTitle: 'Professional Support When You Need It',
            heroDesc: 'Comprehensive services to design the perfect solution and ensure long-term operation.',
            contactUs: 'Contact Us',
            qualificationTitle: 'Qualification & Validation',
            qualificationDesc: `Qualification ensures that DragLab product quality is satisfied and that proper procedures are in place for maintenance and operation.
                                We support you to ensure that production and testing processes run smoothly, and product quality remains high.`,
            qualificationCTA: 'Contact us for your IQ/OQ qualification plans.',

            calibrationTitle: 'Calibration & Adjustment',
            calibrationDesc: `Calibration is essential to validate laboratory equipment. We identify and document deviations and readjust unit settings as needed.
                              All results are documented in a calibration certificate, ensuring quality tests and processes.`,
            calibrationBenefits: ['Factory-standard calibration.', 'Certified measuring devices.'],
            calibrationCTA: 'Contact us for more details on calibration.',

            maintenanceTitle: 'Maintenance & Technical Support',
            maintenanceDesc: `DragLab devices are built with quality and reliability, but regular maintenance is essential for long-term operation.
                              Authorized technicians provide all maintenance work quickly and competently.`,
            maintenanceBenefits: ['Expert technical support.', 'Fast response to all requests.'],
            maintenanceCTA: 'Request technical support now.',

            trainingTitle: 'Training Courses & Seminars',
            trainingDesc: `The DragLab training program provides essential knowledge for users, partners, and service teams.
                          Learn how to operate and maintain equipment efficiently, with access to the latest technical topics.`,
            trainingBenefits: ['Tailored training sessions.', 'Scheduled programs for partners and users.'],
            trainingCTA: 'Contact us for upcoming training sessions.',

            downloadTitle: 'Download Area',
            downloadDesc: 'Explore our premium-quality solutions and have all the key arguments, features, and specifications at your fingertips.',
            downloadExplore: 'Explore Downloads',
            downloadOptions: ['Brochures', 'Flyers', 'Installation packages.']
        },
        ES: {
            pageTitle: 'Soporte profesional cuando lo necesite',
            heroDesc: 'Servicios integrales para diseñar la solución perfecta y garantizar un funcionamiento a largo plazo.',
            contactUs: 'Contáctanos',
            qualificationTitle: 'Calificación y Validación',
            qualificationDesc: `La calificación garantiza que la calidad del producto DragLab sea satisfactoria y que existan procedimientos adecuados para el mantenimiento y operación.`,
            qualificationCTA: 'Contáctanos para tus planes de calificación IQ/OQ.',

            calibrationTitle: 'Calibración y Ajuste',
            calibrationDesc: `La calibración es esencial para validar equipos de laboratorio. Identificamos y documentamos desviaciones y reajustamos configuraciones según sea necesario.`,
            calibrationBenefits: ['Calibración según estándares de fábrica.', 'Dispositivos de medición certificados.'],
            calibrationCTA: 'Contáctanos para más detalles sobre calibración.',

            maintenanceTitle: 'Mantenimiento y Soporte Técnico',
            maintenanceDesc: `Los dispositivos DragLab están construidos con calidad y confiabilidad, pero el mantenimiento regular es esencial para una operación duradera.`,
            maintenanceBenefits: ['Soporte técnico experto.', 'Respuesta rápida a todas las solicitudes.'],
            maintenanceCTA: 'Solicita soporte técnico ahora.',

            trainingTitle: 'Cursos y Seminarios',
            trainingDesc: `El programa de formación de DragLab proporciona conocimientos esenciales para usuarios, socios y equipos de servicio.`,
            trainingBenefits: ['Sesiones de formación personalizadas.', 'Programas programados para socios y usuarios.'],
            trainingCTA: 'Contáctanos para próximas sesiones de formación.',

            downloadTitle: 'Área de Descargas',
            downloadDesc: 'Explore nuestras soluciones de alta calidad y tenga todos los argumentos clave, funciones y especificaciones a su alcance.',
            downloadExplore: 'Explorar Descargas',
            downloadOptions: ['Folletos', 'Volantes', 'Paquetes de instalación.']
        },
        DE: {
            pageTitle: 'Professioneller Support, wann immer Sie ihn brauchen',
            heroDesc: 'Umfassende Dienstleistungen zur Entwicklung der perfekten Lösung und zur Sicherstellung eines langfristigen Betriebs.',
            contactUs: 'Kontaktieren Sie uns',
            qualificationTitle: 'Qualifizierung & Validierung',
            qualificationDesc: `Die Qualifizierung stellt sicher, dass die Produktqualität von DragLab erfüllt ist und dass geeignete Verfahren für Wartung und Betrieb vorhanden sind.`,
            qualificationCTA: 'Kontaktieren Sie uns für Ihre IQ/OQ-Qualifizierungspläne.',

            calibrationTitle: 'Kalibrierung & Anpassung',
            calibrationDesc: `Die Kalibrierung ist unerlässlich, um Laborausrüstung zu validieren. Wir identifizieren und dokumentieren Abweichungen und passen die Einstellungen bei Bedarf an.`,
            calibrationBenefits: ['Kalibrierung nach Werksstandard.', 'Zertifizierte Messgeräte.'],
            calibrationCTA: 'Kontaktieren Sie uns für weitere Informationen zur Kalibrierung.',

            maintenanceTitle: 'Wartung & Technischer Support',
            maintenanceDesc: `Geräte von DragLab sind für Qualität und Zuverlässigkeit gebaut, aber regelmäßige Wartung ist entscheidend für den langfristigen Betrieb.`,
            maintenanceBenefits: ['Fachkundige technische Unterstützung.', 'Schnelle Reaktion auf alle Anfragen.'],
            maintenanceCTA: 'Jetzt technischen Support anfordern.',

            trainingTitle: 'Schulungen & Seminare',
            trainingDesc: `Das Schulungsprogramm von DragLab vermittelt wichtiges Wissen für Benutzer, Partner und Serviceteams.`,
            trainingBenefits: ['Individuelle Schulungssitzungen.', 'Geplante Programme für Partner und Benutzer.'],
            trainingCTA: 'Kontaktieren Sie uns für bevorstehende Schulungen.',

            downloadTitle: 'Download-Bereich',
            downloadDesc: 'Entdecken Sie unsere hochwertigen Lösungen mit allen Argumenten, Funktionen und Spezifikationen auf einen Blick.',
            downloadExplore: 'Downloads durchsuchen',
            downloadOptions: ['Broschüren', 'Flyer', 'Installationspakete.']
        },
        TR: {
            pageTitle: 'Profesyonel Destek İhtiyacınız Olduğunda',
            heroDesc: 'Mükemmel çözümü tasarlamak ve uzun vadeli operasyonu sağlamak için kapsamlı hizmetler.',
            contactUs: 'Bize Ulaşın',
            qualificationTitle: 'Kalifikasyon & Doğrulama',
            qualificationDesc: `Kalifikasyon, DragLab ürün kalitesinin karşılandığını ve bakım ve işletme için uygun prosedürlerin uygulandığını garanti eder.`,
            qualificationCTA: 'IQ/OQ kalifikasyon planlarınız için bizimle iletişime geçin.',
            calibrationTitle: 'Kalibrasyon & Ayar',
            calibrationDesc: `Kalibrasyon, laboratuvar ekipmanlarını doğrulamak için esastır. Sapmaları tanımlar ve belgeler, gerektiğinde ünite ayarlarını yeniden ayarlar.`,
            calibrationBenefits: ['Fabrika standart kalibrasyonu.', 'Sertifikalı ölçüm cihazları.'],
            calibrationCTA: 'Kalibrasyon hakkında daha fazla bilgi için bizimle iletişime geçin.',
            maintenanceTitle: 'Bakım & Teknik Destek',
            maintenanceDesc: `DragLab cihazları kalite ve güvenilirlik ile üretilmiştir, ancak uzun vadeli operasyon için düzenli bakım esastır.`,
            maintenanceBenefits: ['Uzman teknik destek.', 'Tüm taleplere hızlı yanıt.'],
            maintenanceCTA: 'Şimdi teknik destek talep edin.',
            trainingTitle: 'Eğitim Kursları & Seminerler',
            trainingDesc: `DragLab eğitim programı, kullanıcılar, ortaklar ve servis ekipleri için temel bilgiler sağlar.`,
            trainingBenefits: ['Özel eğitim oturumları.', 'Ortaklar ve kullanıcılar için planlanmış programlar.'],
            trainingCTA: 'Yaklaşan eğitim oturumları için bizimle iletişime geçin.',
            downloadTitle: 'İndirme Alanı',
            downloadDesc: 'Premium kaliteli çözümlerimizi keşfedin ve tüm önemli argümanlara, özelliklere ve teknik özelliklere parmaklarınızın ucunda sahip olun.',
            downloadExplore: 'İndirmeleri Keşfedin',
            downloadOptions: ['Broşürler', 'El ilanları', 'Kurulum paketleri.']
        },
        FR: {
            pageTitle: 'Support professionnel quand vous en avez besoin',
            heroDesc: 'Des services complets pour concevoir la solution parfaite et assurer un fonctionnement à long terme.',
            contactUs: 'Contactez-nous',
            qualificationTitle: 'Qualification & Validation',
            qualificationDesc: `La qualification garantit que la qualité du produit DragLab est satisfaisante et que des procédures appropriées sont en place pour la maintenance et l'exploitation.`,
            qualificationCTA: 'Contactez-nous pour vos plans de qualification IQ/OQ.',
            calibrationTitle: 'Étalonnage & Ajustement',
            calibrationDesc: `L'étalonnage est essentiel pour valider les équipements de laboratoire. Nous identifions et documentons les écarts et réajustons les paramètres de l'unité si nécessaire.`,
            calibrationBenefits: ['Étalonnage selon les normes dusine.', 'Appareils de mesure certifiés.'],
            calibrationCTA: "Contactez-nous pour plus de détails sur l'étalonnage.",
            maintenanceTitle: 'Maintenance & Support Technique',
            maintenanceDesc: `Les appareils DragLab sont fabriqués avec qualité et fiabilité, mais un entretien régulier est essentiel pour un fonctionnement à long terme.`,
            maintenanceBenefits: ['Support technique expert.', 'Réponse rapide à toutes les demandes.'],
            maintenanceCTA: 'Demandez un support technique maintenant.',
            trainingTitle: 'Cours de Formation & Séminaires',
            trainingDesc: `Le programme de formation DragLab fournit des informations de base pour les utilisateurs, les partenaires et les équipes de service.`,
            trainingBenefits: ['Sessions de formation personnalisées.', 'Programmes planifiés pour les partenaires et les utilisateurs.'],
            trainingCTA: 'Contactez-nous pour les prochaines sessions de formation.',
            downloadTitle: 'Zone de Téléchargement',
            downloadDesc: 'Découvrez nos solutions de qualité supérieure et ayez tous les arguments clés, fonctionnalités et spécifications à portée de main.',
            downloadExplore: 'Explorer les Téléchargements',
            downloadOptions: ['Brochures', 'Flyers', 'Packages d\'installation.']
        }

    };

    const content = t[lang] || t.EN;

    Product.find()
        .then(products => {
            res.render('customer/Support', {
                pageTitle: 'Support',
                path: '/support',
                products,
                lang,
                content
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};


exports.getaboutus = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const translations = {
        EN: {
            pageTitle: 'About Us - DragLab',
            metaDescription: 'Learn about DragLab’s vision, mission, and values. Explore our innovative lab equipment and commitment to quality and sustainability.',
            ogTitle: 'About Us | DragLab',
            ogDescription: 'Discover how DragLab leads the lab equipment market with innovation, integrity, and customer focus.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/about-us.jpg',
            sectionHeading: 'About Us',
            featuresTitle: 'Feature Points',
            tabs: {
                vision: {
                    title: 'Vision',
                    sectionHeading: 'Global Leadership',
                    subtitle: `Innovation, quality, and customer-driven success.`,
                    desc: 'To be the global partner of choice for laboratories by delivering innovative, high-quality, and cost-effective equipment where advanced technology meets modern design, with customer-focused approach across a diverse range of laboratory devices and medical equipment, driving scientific progress worldwide.'
                },
                mission: {
                    title: 'Mission',
                    sectionHeading: 'Innovative Excellence',
                    subtitle: 'Innovation, quality, and customer-driven success.',
                    desc: 'We aim to empower professionals in science and healthcare with advanced, reliable, and user-friendly equipment, driving progress and improving outcomes.'
                },
                values: {
                    title: 'Value',
                    sectionHeading: 'Integrity and Responsibility',
                    subtitle: 'Empowering change through ethical commitment.',
                    desc: 'Integrity is upheld, innovation is driven, responsive support is provided, sustainability is prioritized, customer needs are carefully addressed, excellence is ensured, and an inclusive, collaborative culture is enriched all along with keeping the highest standards met.'
                }
            },
            features: [

                {
                    title: 'Ethics and Integrity',
                    text: 'We are committed to upholding the highest ethical standards in all aspects of our business, with transparent communication, to strengthen trust and practice integrity with employees, customers, suppliers, competitors, and investors.',
                    icon: 'Ethics-and-Integrity.svg',
                    alt: 'Ethics and Integrity icon'
                },
                {
                    title: 'Innovation and Relentless Development ',
                    text: 'Innovation is about creating the highest value by transforming advancements in technology into our products and services to satisfy our customers. Our professional expertise drives innovation to serve our customer focused approach. We offer better solutions for an enhanced experience through our products and services.',
                    icon: 'Innovation-and-Relentless-Development.svg',
                    alt: 'Innovation and Relentless Development icon'
                },
                {
                    title: 'Fast and Perfect Response',
                    text: 'DragLab is committed to responding quickly and reliably to the needs of our customers and partners through our multiple communication channels. Our commitment to providing tailored solutions through our team of professionals ensures minimal downtime, and convenient solutions for your needs.',
                    icon: 'response.png',
                    alt: 'Fast and Perfect Response icon'
                },
                {
                    title: 'Responsibility and Sustainability',
                    text: 'DragLab integrates sustainability into its operations by responsibly managing resources, adhering to ISO 14001 and EU standards, and contributing to a better, high-quality future for generations to come.',
                    icon: 'SustainableEnvironment.png',
                    alt: 'Responsibility and Sustainability icon'
                },
                {
                    title: 'Customer Focus and Service',
                    text: 'We place customers at the heart of our business by adopting a customer-focused approach, listening carefully to their needs, and providing innovative solutions with exceptional service. Through trust-based, lasting partnerships.',
                    icon: 'Customer-Focus-and-Service.svg',
                    alt: 'Customer Focus and Service icon'
                },
                {
                    title: 'Quality and Excellence',
                    text: 'We stick to the highest standards of quality and excellence in all aspects of our business. Each of our products and services are rigorously tested and refined to satisfy and exceed customer expectations.',
                    icon: 'Quality.png',
                    alt: 'Eco-friendly technology icon'
                },
                {
                    title: 'Teamwork and Inclusive Culture',
                    text: 'We highly value teamwork throughout our culture where every voice is heard. By collaborating across all levels and embracing diversity, we empower our people to contribute their best, driving innovation and collective success.',
                    icon: 'Teamwork-and-Inclusive-Culture.svg',
                    alt: 'Teamwork and Inclusive Culture icon'
                }
            ]
        },

        DE: {
            pageTitle: 'Über uns - DragLab',
            metaDescription: 'Erfahren Sie mehr über die Vision, Mission und Werte von DragLab. Entdecken Sie unsere innovativen Laborgeräte und unser Engagement für Qualität und Nachhaltigkeit.',
            ogTitle: 'Über uns | DragLab',
            ogDescription: 'Erfahren Sie, wie DragLab den Markt für Laborgeräte mit Innovation, Integrität und Kundenorientierung anführt.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/about-us.jpg',
            sectionHeading: 'Über uns',
            featuresTitle: 'Besonderheiten',
            tabs: {
                vision: {
                    title: 'Vision',
                    sectionHeading: 'Globale Führungsrolle',
                    subtitle: 'Technologie vorantreiben mit überlegener Gestaltung.',
                    desc: 'Unser Ziel ist es, der bevorzugte globale Partner für Labore zu sein – durch die Bereitstellung innovativer, hochwertiger und kosteneffizienter Geräte, bei denen fortschrittliche Technologie auf modernes Design trifft. Mit einem kundenorientierten Ansatz über ein vielfältiges Spektrum an Labor- und Medizingeräten treiben wir den wissenschaftlichen Fortschritt weltweit voran.'
                },
                mission: {
                    title: 'Mission',
                    sectionHeading: 'Innovative Spitzenleistung',
                    subtitle: 'Technologie vorantreiben mit herausragendem Design.',
                    desc: 'Fachkräfte in Laboren und verschiedensten Branchen – von der Chemie- und Lebensmittelindustrie bis hin zur Pharma-, Biotechnologie- und Umweltbranche – in Europa, dem Nahen Osten und Asien zu stärken, indem wir hochwertige, in Europa hergestellte Laborausrüstung mit innovativem, modernem Design und fortschrittlicher Technologie liefern – unterstützt durch wettbewerbsfähige Preise und engagierten Kundensupport.'
                },
                values: {
                    title: 'Werte',
                    sectionHeading: 'Integrität und Verantwortung',
                    subtitle: 'Veränderung fördern durch ethisches Engagement.',
                    desc: 'Integrität wird gewahrt, Innovation gefördert, ein reaktionsschneller Support bereitgestellt, Nachhaltigkeit priorisiert, Kundenbedürfnisse sorgfältig berücksichtigt, Exzellenz sichergestellt und eine inklusive, kooperative Unternehmenskultur gestärkt – stets unter Einhaltung höchster Standards.'
                }
            },
            features: [
                {
                    title: 'Ethik und Integrität',
                    text: 'Wir verpflichten uns, in allen Bereichen unseres Geschäfts die höchsten ethischen Standards einzuhalten und durch transparente Kommunikation Vertrauen zu stärken sowie Integrität gegenüber Mitarbeitenden, Kunden, Lieferanten, Wettbewerbern und Investoren zu wahren.',
                    icon: 'innovation.png',
                    alt: 'Ethik und Integrität'
                },
                {
                    title: 'Innovation und Stetige Weiterentwicklung',
                    text: 'Innovation bedeutet, den höchsten Mehrwert zu schaffen, indem technologische Fortschritte in unsere Produkte und Dienstleistungen integriert werden, um die Bedürfnisse unserer Kunden zu erfüllen. Unser professionelles Fachwissen treibt Innovation voran und unterstützt unseren kundenorientierten Ansatz. Wir bieten bessere Lösungen für ein optimiertes Erlebnis durch unsere Produkte und Dienstleistungen.',
                    icon: 'Quality.png',
                    alt: 'Qualitätssicherungs-Icon'
                },
                {
                    title: 'Schnelle und Perfekte Reaktion',
                    text: 'DragLab verpflichtet sich, schnell und zuverlässig auf die Bedürfnisse unserer Kunden und Partner über unsere vielfältigen Kommunikationskanäle zu reagieren. Unser Engagement für maßgeschneiderte Lösungen durch unser professionelles Team sorgt für minimale Ausfallzeiten und komfortable Lösungen für Ihre Anforderungen.',
                    icon: 'Certification.png',
                    alt: 'Zertifizierungsicon'
                },
                {
                    title: 'Verantwortung und Nachhaltigkeit',
                    text: 'DragLab integriert Nachhaltigkeit in seine Geschäftstätigkeit durch einen verantwortungsvollen Umgang mit Ressourcen, die Einhaltung der ISO 14001 und EU-Normen und leistet damit einen Beitrag zu einer besseren und qualitativ hochwertigen Zukunft für kommende Generationen.',
                    icon: 'response.png',
                    alt: 'Schnelle Kundenreaktion Icon'
                },
                {
                    title: 'Kundenorientierung und Service',
                    text: 'Wir stellen unsere Kunden in den Mittelpunkt unseres Handelns, indem wir einen kundenorientierten Ansatz verfolgen, aufmerksam auf ihre Bedürfnisse hören und innovative Lösungen mit erstklassigem Service bieten. Dies erreichen wir durch vertrauensbasierte, langfristige Partnerschaften.',
                    icon: 'WarrantyAfterSales.png',
                    alt: 'Garantie Icon'
                },
                {
                    title: 'Qualität und Exzellenz',
                    text: 'Wir halten uns in allen Bereichen unseres Unternehmens an die höchsten Standards für Qualität und Exzellenz. Jedes unserer Produkte und Dienstleistungen wird streng geprüft und optimiert, um die Erwartungen unserer Kunden zu erfüllen und zu übertreffen.',
                    icon: 'SustainableEnvironment.png',
                    alt: 'Umweltschutz Icon'
                },
                {
                    title: 'Teamarbeit und Inklusive Unternehmenskultur',
                    text: 'Wir schätzen Teamarbeit als festen Bestandteil unserer Unternehmenskultur, in der jede Stimme zählt. Durch Zusammenarbeit auf allen Ebenen und die Wertschätzung von Vielfalt befähigen wir unsere Mitarbeitenden, ihr Bestes beizutragen – für Innovation und gemeinsamen Erfolg.',
                    icon: 'Safety.png',
                    alt: 'Sicherheitsicon'
                }
            ]
        },
        ES: {
            pageTitle: 'Sobre Nosotros - DragLab',
            metaDescription: 'Conozca la visión, misión y valores de DragLab. Descubra nuestro equipamiento de laboratorio innovador y nuestro compromiso con la calidad y la sostenibilidad.',
            ogTitle: 'Sobre Nosotros | DragLab',
            ogDescription: 'Descubra cómo DragLab lidera el mercado de equipos de laboratorio con innovación, integridad y enfoque en el cliente.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/about-us.jpg',
            sectionHeading: 'Sobre Nosotros',
            featuresTitle: 'Puntos Destacados',
            tabs: {
                vision: {
                    title: 'Visión',
                    sectionHeading: 'Liderazgo Global',
                    subtitle: 'Impulsando la tecnología con diseño superior.',
                    desc: 'Ser el socio global preferido por los laboratorios, ofreciendo equipos innovadores, de alta calidad y rentables, donde la tecnología avanzada se une con el diseño moderno. Nuestra orientación al cliente abarca una amplia gama de dispositivos de laboratorio y equipos médicos, impulsando el progreso científico en todo el mundo.'
                },
                mission: {
                    title: 'Misión',
                    sectionHeading: 'Excelencia Innovadora',
                    subtitle: 'Impulsando la tecnología con un diseño superior.',
                    desc: 'Empoderar a los profesionales en laboratorios e industrias diversas —desde la química y alimentos y bebidas hasta la farmacéutica, biotecnología y medio ambiente— en Europa, Oriente Medio y Asia, mediante el suministro de equipos de laboratorio de alta calidad fabricados en Europa, con un diseño moderno e innovador y tecnología avanzada, respaldados por precios competitivos y un compromiso sólido con la atención al cliente.'
                },
                values: {
                    title: 'Valores',
                    sectionHeading: 'Integridad y Responsabilidad',
                    subtitle: 'Impulsando el cambio a través del compromiso ético.',
                    desc: 'Se mantiene la integridad, se impulsa la innovación, se brinda un soporte ágil, se prioriza la sostenibilidad, se atienden cuidadosamente las necesidades del cliente, se garantiza la excelencia y se enriquece una cultura inclusiva y colaborativa, todo ello cumpliendo con los más altos estándares.'
                }
            },
            features: [
                {
                    title: 'Ética e Integridad',
                    text: 'Estamos comprometidos a mantener los más altos estándares éticos en todos los aspectos de nuestro negocio, con una comunicación transparente, para fortalecer la confianza y practicar la integridad con empleados, clientes, proveedores, competidores e inversores.',
                    icon: 'innovation.png',
                    alt: 'Icono de innovación de laboratorio'
                },
                {
                    title: 'Innovación y Desarrollo Constante',
                    text: 'La innovación consiste en crear el máximo valor transformando los avances tecnológicos en nuestros productos y servicios para satisfacer a nuestros clientes. Nuestra experiencia profesional impulsa la innovación para respaldar nuestro enfoque centrado en el cliente. Ofrecemos mejores soluciones para una experiencia mejorada a través de nuestros productos y servicios.',
                    icon: 'Quality.png',
                    alt: 'Icono de garantía de calidad'
                },
                {
                    title: 'Respuesta Rápida y Perfecta',
                    text: 'DragLab está comprometido a responder de manera rápida y confiable a las necesidades de nuestros clientes y socios a través de nuestros múltiples canales de comunicación. Nuestro compromiso de ofrecer soluciones personalizadas mediante nuestro equipo de profesionales garantiza un tiempo de inactividad mínimo y soluciones convenientes para sus necesidades.',
                    icon: 'Certification.png',
                    alt: 'Icono de cumplimiento de certificaciones'
                },
                {
                    title: 'Responsabilidad y Sostenibilidad',
                    text: 'DragLab integra la sostenibilidad en sus operaciones mediante una gestión responsable de los recursos, el cumplimiento de la norma ISO 14001 y los estándares de la UE, y contribuyendo a un futuro mejor y de alta calidad para las generaciones venideras.',
                    icon: 'response.png',
                    alt: 'Icono de respuesta rápida al cliente'
                },
                {
                    title: 'Enfoque en el Cliente y Servicio',
                    text: 'Colocamos a los clientes en el centro de nuestro negocio mediante un enfoque centrado en sus necesidades, escuchándolos atentamente y ofreciendo soluciones innovadoras con un servicio excepcional. Todo ello a través de asociaciones duraderas basadas en la confianza.',
                    icon: 'WarrantyAfterSales.png',
                    alt: 'Icono de garantía y servicio'
                },
                {
                    title: 'Calidad y Excelencia',
                    text: 'Nos adherimos a los más altos estándares de calidad y excelencia en todos los aspectos de nuestro negocio. Cada uno de nuestros productos y servicios es rigurosamente probado y perfeccionado para satisfacer y superar las expectativas de nuestros clientes.',
                    icon: 'SustainableEnvironment.png',
                    alt: 'Icono de tecnología ecológica'
                },
                {
                    title: 'Trabajo en Equipo y Cultura Inclusiva',
                    text: 'Valoramos profundamente el trabajo en equipo dentro de nuestra cultura, donde cada voz es escuchada. Al colaborar en todos los niveles y abrazar la diversidad, empoderamos a nuestra gente para que aporte lo mejor de sí misma, impulsando la innovación y el éxito colectivo.',
                    icon: 'Safety.png',
                    alt: 'Icono de estándares de seguridad'
                }
            ]
        },
        TR: {
            pageTitle: 'Hakkımızda - DragLab',
            metaDescription: 'DragLab’ın vizyonu, misyonu ve değerleri hakkında bilgi edinin. Yenilikçi laboratuvar ekipmanlarımızı ve kalite ve sürdürülebilirliğe olan bağlılığımızı keşfedin.',
            ogTitle: 'Hakkımızda | DragLab',
            ogDescription: 'DragLab’ın yenilik, bütünlük ve müşteri odaklılık ile laboratuvar ekipmanları pazarına nasıl liderlik ettiğini keşfedin.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/about-us.jpg',
            sectionHeading: 'Hakkımızda',
            featuresTitle: 'Özellik Noktaları',
            tabs: {
                vision: {
                    title: 'Vizyon',
                    sectionHeading: 'Küresel Liderlik',
                    subtitle: 'Üstün tasarımla teknolojiyi ilerletmek.',
                    desc: 'Gelişmiş teknolojinin modern tasarımla buluştuğu yenilikçi, yüksek kaliteli ve maliyet etkin ekipmanlar sunarak laboratuvarların tercih ettiği küresel ortak olmaktır. Müşteri odaklı yaklaşımımızla çeşitli laboratuvar cihazları ve tıbbi ekipman yelpazesiyle dünya çapında bilimsel ilerlemeyi destekliyoruz.'
                },
                mission: {
                    title: 'Misyon',
                    sectionHeading: 'Yenilikçi Mükemmellik',
                    subtitle: 'Üstün tasarımla teknolojiyi ilerletmek.',
                    desc: 'Avrupa, Orta Doğu ve Asya’da kimya ve gıda ve içecekten ilaç, biyoteknoloji ve çevreye kadar çeşitli endüstrilerdeki profesyonelleri, yenilikçi, modern tasarımlı ve gelişmiş teknolojiye sahip yüksek kaliteli, Avrupa yapımı laboratuvar ekipmanları sağlayarak güçlendirmek – rekabetçi fiyatlandırma ve müşteri hizmetlerine güçlü bir bağlılıkla desteklenmektedir.'
                },
                values: {
                    title: 'Değerler',
                    sectionHeading: 'Dürüstlük ve Sorumluluk',
                    subtitle: 'Etik taahhütle değişimi güçlendirmek.',
                    desc: 'Dürüstlük korunur, yenilik teşvik edilir, duyarlı destek sağlanır, sürdürülebilirlik önceliklendirilir, müşteri ihtiyaçları dikkatle ele alınır, mükemmellik sağlanır ve en yüksek standartlara uyularak kapsayıcı, işbirlikçi bir kültür zenginleştirilir.'
                }
            },
            features: [
                {
                    title: 'Etik ve Dürüstlük',
                    text: 'İşimizin her alanında en yüksek etik standartları korumaya, şeffaf iletişimle güveni güçlendirmeye ve çalışanlar, müşteriler, tedarikçiler, rakipler ve yatırımcılarla dürüstlük uygulamaya kararlıyız.',
                    icon: 'innovation.png',
                    alt: 'Laboratuvar inovasyon simgesi'
                },
                {
                    title: 'Yenilik ve Sürekli Gelişim',
                    text: 'Yenilik, teknolojideki ilerlemeleri ürünlerimize ve hizmetlerimize dönüştürerek müşterilerimizin ihtiyaçlarını karşılamak için en yüksek değeri yaratmaktır. Profesyonel uzmanlığımız, müşteri odaklı yaklaşımımızı desteklemek için yeniliği yönlendirir. Ürünlerimiz ve hizmetlerimiz aracılığıyla geliştirilmiş bir deneyim için daha iyi çözümler sunuyoruz.',
                    icon: 'Quality.png',
                    alt: 'Kalite güvencesi simgesi'
                },
                {
                    title: 'Hızlı ve Mükemmel Yanıt',
                    text: 'DragLab, çoklu iletişim kanallarımız aracılığıyla müşterilerimizin ve ortaklarımızın ihtiyaçlarına hızlı ve güvenilir bir şekilde yanıt vermeye kararlıdır. Profesyonel ekibimiz aracılığıyla özelleştirilmiş çözümler sunma taahhüdümüz, minimum kesinti süresi ve ihtiyaçlarınız için uygun çözümler sağlar.',
                    icon: 'Certification.png',
                    alt: 'Sertifikasyon uyumluluğu simgesi'
                },
                {
                    title: 'Sorumluluk ve Sürdürülebilirlik',
                    text: 'DragLab, kaynakları sorumlu bir şekilde yöneterek, ISO 14001 ve AB standartlarına uyarak ve gelecek nesiller için daha iyi, yüksek kaliteli bir geleceğe katkıda bulunarak sürdürülebilirliği operasyonlarına entegre eder.',
                    icon: 'response.png',
                    alt: 'Hızlı müşteri yanıt simgesi'
                },
                {
                    title: 'Müşteri Odaklılık ve Hizmet',
                    text: 'Müşterileri işimizin merkezine koyuyoruz, müşteri odaklı bir yaklaşım benimseyerek, ihtiyaçlarını dikkatle dinleyerek ve olağanüstü hizmetle yenilikçi çözümler sunarak. Güvene dayalı, kalıcı ortaklıklar aracılığıyla.',
                    icon: 'WarrantyAfterSales.png',
                    alt: 'Garanti ve hizmet simgesi'
                },
                {
                    title: 'Kalite ve Mükemmellik',
                    text: 'İşimizin her alanında en yüksek kalite ve mükemmellik standartlarına bağlıyız. Ürünlerimizin ve hizmetlerimizin her biri, müşteri beklentilerini karşılamak ve aşmak için titizlikle test edilir ve iyileştirilir.',
                    icon: 'SustainableEnvironment.png',
                    alt: 'Çevre dostu teknoloji simgesi'
                },
                {
                    title: 'Takım Çalışması ve Kapsayıcı Kültür',
                    text: 'Her sesin duyulduğu kültürümüzde takım çalışmasına büyük değer veriyoruz. Tüm seviyelerde işbirliği yaparak ve çeşitliliği kucaklayarak, insanlarımızın en iyisini katkıda bulunmalarını sağlıyor, yeniliği ve kolektif başarıyı teşvik ediyoruz.',
                    icon: 'Safety.png',
                    alt: 'Güvenlik standartları simgesi'
                }
            ]


        },
        FR: {
            pageTitle: 'À Propos de Nous - DragLab',
            metaDescription: 'Découvrez la vision, la mission et les valeurs de DragLab. Explorez nos équipements de laboratoire innovants et notre engagement envers la qualité et la durabilité.',
            ogTitle: 'À Propos de Nous | DragLab',
            ogDescription: 'Découvrez comment DragLab mène le marché des équipements de laboratoire avec innovation, intégrité et orientation client.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/about-us.jpg',
            sectionHeading: 'À Propos de Nous',
            featuresTitle: 'Points Forts',
            tabs: {
                vision: {
                    title: 'Vision',
                    sectionHeading: 'Leadership Mondial',
                    subtitle: 'Faire progresser la technologie avec un design supérieur.',
                    desc: 'Être le partenaire mondial de choix pour les laboratoires en fournissant des équipements innovants, de haute qualité et rentables, où la technologie avancée rencontre un design moderne. Avec une approche axée sur le client à travers une gamme diversifiée d\'appareils de laboratoire et d\'équipements médicaux, nous stimulons le progrès scientifique dans le monde entier.'
                },
                mission: {
                    title: 'Mission',
                    sectionHeading: 'Excellence Innovante',
                    subtitle: 'Faire progresser la technologie avec un design supérieur.',
                    desc: 'Nous visons à autonomiser les professionnels de la science et des soins de santé avec des équipements avancés, fiables et conviviaux, stimulant le progrès et améliorant les résultats.'
                },
                values: {
                    title: 'Valeurs',
                    sectionHeading: 'Intégrité et Responsabilité',
                    subtitle: 'Favoriser le changement par un engagement éthique.',
                    desc: 'L\'intégrité est maintenue, l\'innovation est encouragée, un support réactif est fourni, la durabilité est priorisée, les besoins des clients sont soigneusement pris en compte, l\'excellence est assurée et une culture inclusive et collaborative est enrichie tout en respectant les normes les plus élevées.'
                }
            },
            features: [
                {
                    title: 'Éthique et Intégrité',
                    text: 'Nous nous engageons à respecter les normes éthiques les plus élevées dans tous les aspects de notre entreprise, avec une communication transparente, pour renforcer la confiance et pratiquer l\'intégrité avec les employés, les clients, les fournisseurs, les concurrents et les investisseurs.',
                    icon: 'innovation.png',
                    alt: 'Icône d\'éthique et d\'intégrité'
                },
                {
                    title: 'Innovation et Développement Continu',
                    text: 'L\'innovation consiste à créer la plus grande valeur en transformant les avancées technologiques en nos produits et services pour satisfaire nos clients. Notre expertise professionnelle stimule l\'innovation pour soutenir notre approche axée sur le client. Nous offrons de meilleures solutions pour une expérience améliorée grâce à nos produits et services.',
                    icon: 'Quality.png',
                    alt: 'Icône d\'innovation et de développement continu'
                },
                {
                    title: 'Réponse Rapide et Parfaite',
                    text: 'DragLab s\'engage à répondre rapidement et de manière fiable aux besoins de nos clients et partenaires via nos multiples canaux de communication. Notre engagement à fournir des solutions sur mesure grâce à notre équipe de professionnels garantit un temps d\'arrêt minimal et des solutions pratiques pour vos besoins.',
                    icon: 'response.png',
                    alt: 'Icône de réponse rapide et parfaite'
                },
                {
                    title: 'Responsabilité et Durabilité',
                    text: 'DragLab intègre la durabilité dans ses opérations en gérant les ressources de manière responsable, en respectant la norme ISO 14001 et les normes de l\'UE, et en contribuant à un avenir meilleur et de haute qualité pour les générations à venir.',
                    icon: 'SustainableEnvironment.png',
                    alt: 'Icône de responsabilité et de durabilité'
                },

                {
                    title: 'Orientation Client et Service',
                    text: 'Nous plaçons les clients au cœur de notre entreprise en adoptant une approche axée sur le client, en écoutant attentivement leurs besoins et en fournissant des solutions innovantes avec un service exceptionnel. Grâce à des partenariats durables basés sur la confiance.',
                    icon: 'Customer-Focus-and-Service.svg',
                    alt: 'Icône d\'orientation client et de service'
                },
                {
                    title: 'Qualité et Excellence',
                    text: 'Nous adhérons aux normes les plus élevées de qualité et d\'excellence dans tous les aspects de notre entreprise. Chacun de nos produits et services est rigoureusement testé et affiné pour satisfaire et dépasser les attentes des clients.',
                    icon: 'Quality.png',
                    alt: 'Icône de qualité et d\'excellence'
                },
                {
                    title: 'Travail d\'Équipe et Culture Inclusive',
                    text: 'Nous valorisons grandement le travail d\'équipe dans toute notre culture où chaque voix est entendue. En collaborant à tous les niveaux et en embrassant la diversité, nous permettons à nos collaborateurs de donner le meilleur d\'eux-mêmes, stimulant l\'innovation et le succès collectif.',
                    icon: 'Teamwork-and-Inclusive-Culture.svg',
                    alt: 'Icône de travail d\'équipe et de culture inclusive'
                }
            ]
        }

    };

    const t = translations[lang] || translations['EN'];

    Product.find()
        .then(products => {
            res.render('customer/about-us', {
                pageTitle: t.pageTitle,
                metaDescription: t.metaDescription,
                ogTitle: t.ogTitle,
                ogDescription: t.ogDescription,
                ogImage: t.ogImage,
                sectionHeading: t.sectionHeading,
                featuresTitle: t.featuresTitle,
                products,
                lang,
                tabs: t.tabs,
                features: t.features,
                req
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });
};



exports.getArticles = async (req, res) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const seoTranslations = {
        EN: {
            pageTitle: 'Articles - DragLab',
            metaDescription: 'Explore insights, innovations, and expert knowledge in lab technology through DragLab’s latest articles.'
        },
        ES: {
            pageTitle: 'Artículos - DragLab',
            metaDescription: 'Explore conocimientos, innovaciones y experiencia en tecnología de laboratorio a través de los artículos de DragLab.'
        },
        DE: {
            pageTitle: 'Artikel - DragLab',
            metaDescription: 'Entdecken Sie Einblicke, Innovationen und Fachwissen über Labortechnologie in den neuesten Artikeln von DragLab.'
        },
        TR: {
            pageTitle: 'Makaleler - DragLab',
            metaDescription: 'DragLab’ın en son makaleleri aracılığıyla laboratuvar teknolojisindeki içgörüler, yenilikler ve uzman bilgilerini keşfedin.'
        },
        FR: {
            pageTitle: 'Articles - DragLab',
            metaDescription: 'Explorez les idées, les innovations et l\'expertise en technologie de laboratoire à travers les derniers articles de DragLab.'
        }
    };

    const t = seoTranslations[lang] || seoTranslations['EN'];

    try {
        const articles = await Article.find({
            $or: [
                { language: lang },
                { language: 'ALL' }
            ]
        }).sort({ createdAt: -1 });

        const allProducts = await Product.find();

        res.render('customer/Articles', {
            articles,
            lang,
            products: allProducts,
            pageTitle: t.pageTitle,
            metaDescription: t.metaDescription
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
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
        res.redirect('/');
    }
};

exports.getDownloads = async (req, res, next) => {
    const lang = req.params.lang || 'EN'; // e.g. /Downloads/DE
    const translations = {
        EN: {
            pageTitle: 'Downloads',
            heroTitle: 'Downloads',
            heroIntro: 'Find catalogs, manuals, certificates, and technical documents for DragLab Products.',
            noProducts: 'No Products Available',
            noCategories: 'No Categories Available',
            allLabel: 'All',
        },
        ES: {
            pageTitle: 'Descargas',
            heroTitle: 'Descargas',
            heroIntro: 'Encuentra catálogos, manuales, certificados y documentos técnicos para productos DragLab.',
            noProducts: 'No hay productos disponibles',
            noCategories: 'No hay categorías disponibles',
            allLabel: 'Todos',
        },
        DE: {
            pageTitle: 'Downloads',
            heroTitle: 'Downloads',
            heroIntro: 'Finden Sie Kataloge, Handbücher, Zertifikate und technische Dokumente für DragLab-Produkte.',
            noProducts: 'Keine Produkte verfügbar',
            noCategories: 'Keine Kategorien verfügbar',
            allLabel: 'Alle',
        },
        TR: {
            pageTitle: 'İndirilenler',
            heroTitle: 'İndirilenler',
            heroIntro: 'DragLab Ürünleri için kataloglar, kılavuzlar, sertifikalar ve teknik belgeler bulun.',
            noProducts: 'Mevcut Ürün Yok',
            noCategories: 'Mevcut Kategori Yok',
            allLabel: 'Tümü',
        },
        FR: {
            pageTitle: 'Téléchargements',
            heroTitle: 'Téléchargements',
            heroIntro: 'Trouvez des catalogues, manuels, certificats et documents techniques pour les produits DragLab.',
            noProducts: 'Aucun produit disponible',
            noCategories: 'Aucune catégorie disponible',
            allLabel: 'Tous',
        }
    };

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
            translations: translations[lang] || translations.EN,

            products
        });
    } catch (err) {
        console.error('Error loading downloads:', err.message);
        console.error(err.stack); // Log the stack trace
        return res.status(500).render('500', { errorMessage: err.message });
    }
};






exports.getTearmCondition = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const content = {
        EN: {
            pageTitle: 'General Terms and Conditions of Sale',
            metaDescription: 'Read the full Terms and Conditions of NanoDrag including legal definitions, pricing, warranties, and liability terms.',
            heroTitle: 'General Terms and Conditions of Sale',
            sections: [
                {
                    "title": "Definitions",
                    "body": "<strong>Nanodrag</strong> means Nanodrag technology GmbH the company supplying the goods or services, or a subsidiary.<br><strong>Customer</strong> means the individual, company or other party with whom the seller contracts.<br><strong>Contract</strong> means the contract order for the purchase of goods or services."
                },
                {
                    "title": "1. General",
                    "body": "1.1 Any delivery of goods and services by Nanodrag as the seller to the customer ('Customer') shall be subject to the Terms and Conditions set forth herein to the extent no other agreements have been explicitly made. The Customer’s general terms and conditions that are inconsistent with the Terms and Conditions set forth herein shall only be applicable to the extent Nanodrag has explicit approved in writing.<br>1.2 Any claims held against Nanodrag may not be assigned to third parties. Section 354a of the German Commercial Code (HGB) shall remain unaffected.<br>1.3 The sale, resale and the disposal of goods and services including any associated technology or documentation may be governed by German, EU, US export control regulations as well as by the export control regulations of further countries. Any resale of goods to embargoed countries or to denied persons or persons that use or may use the goods for military purposes, ABC weapons or nuclear technology is subject to an official license. Customer declares with his order the conformity with such statutes and regulations and that the goods will not directly or indirectly delivered into countries that prohibit or restrict the import of such goods. Customer declares to have obtained all licenses required for export and import."
                },
                {
                    "title": "2. Information, Consultancy",
                    "body": "Information and consultancy in relation to Nanodrag’ goods and services is provided as deemed appropriate from existing experience. Any values quoted as part thereof, especially performance data, represent average values which have been determined through experiments under standard laboratory conditions. Nanodrag cannot assume any commitment for its products to precisely meet the quoted values and areas of application. Section 10 of these Terms and Conditions governs any issues of liability."
                },
                {
                    "title": "3. Prices",
                    "body": "3.1 The prices quoted in the order confirmation of Nanodrag shall solely apply. Additional services will be invoiced separately.<br>3.2 All prices are quoted as net prices and do not include value added tax, which is to be paid additionally by the Customer in the amount specified by applicable law.<br>3.3 Unless otherwise expressly agreed, the prices are quoted ex works of the Nanodrag company using these Terms and Conditions. The Customer shall bear all additional freight costs, packing costs in excess of standard packing, public fees (including withholding taxes) and duties."
                },
                {
                    "title": "4. Delivery",
                    "body": "4.1 Unless otherwise expressly agreed, Nanodrag shall deliver ex works (EXW INCOTERMS 2010) of the Nanodrag company using these Terms and Conditions.<br>4.2 Delivery periods shall only be binding if expressly agreed in writing. Delivery periods shall begin on the date of the order confirmation by Nanodrag, however, in no case prior to settlement of all details relating to an order including the furnishing of any required official certificates. Delivery periods shall be deemed to be met on timely notification of readiness to ship if the goods cannot be dispatched in time through no fault of Nanodrag.<br>4.3 With respect to delivery periods and dates, which are not expressly defined as fixed in the order confirmation, the Customer may – two weeks after expiry of such a delivery period or date – set an adequate grace period for delivery. Nanodrag may only be deemed to be in default after expiry of such a grace period.<br>4.4 Without prejudicing Nanodrag’ rights from Customer’s default, delivery periods and dates shall be deemed to be extended by the period of time during which the Customer fails to comply with his obligations towards Nanodrag. In case Nanodrag does not comply with its obligations Nanodrag shall only be liable for all types of damages in accordance with section 10 of these Terms and Conditions.<br>4.5 Nanodrag reserves the right to carry out a delivery using its own delivery organization.<br>4.6 Nanodrag may perform partial deliveries and render partial services if such action would not unreasonably affect the Customer.<br>4.7 The Customer may rescind the contract after two unsuccessful grace periods unless the hindrance is merely temporary in nature and a delay would not unreasonably affect the Customer.<br>4.8 Any contractual or statutory right of a Customer to rescind the contract, which the Customer fails to exercise within a reasonable period of time set by Nanodrag, shall be forfeited."
                },
                {
                    "title": "5. Shipment, Passing of Risk",
                    "body": "5.1. Unless otherwise expressly agreed, shipment shall always be carried out at the Customer's risk. The risk shall pass to the Customer as soon as the goods have been handed over to the person executing the shipment.<br>5.2 If a shipment is delayed for reasons to be attributed to the Customer, the risk of accidental deterioration, loss and destruction shall pass to the Customer on notification of Nanodrag’ readiness to ship. Required storage costs after passing of risk shall be borne by the Customer. This shall not affect any other claims.<br>5.3 If the Customer defaults in accepting, Nanodrag shall be entitled to claim refund of any expenditure associated therewith and the risk of accidental deterioration, loss and destruction shall pass to the Customer."
                },
                {
                    "title": "6. Payment",
                    "body": "6.1 Payment shall be made in full within 30 days from the date of the invoice. Payment shall be considered to have been made on the day the payable sum is received by Nanodrag. Bills of exchange and cheques shall not be deemed payment until after they have been honored and will be accepted without any obligation to make timely presentation and timely protest.<br>6.2 Immediately upon default of payment – or from the due date if Customer is a merchant within the meaning of the German Commercial Code (HGB) – Nanodrag reserves the right to claim a higher actual damage.<br>6.3 Customers may only withhold or offset due payments against their own counter-claims if these are uncontested or have been found to be legally binding.<br>6.4 Any of Nanodrag’ receivables shall be immediately payable in the event of a default in payment, a notice given in protest against a bill of exchange or suspension of the Customer's payments, independent of the term of the bills of exchange which may have already been accepted. In any of these aforementioned cases, Nanodrag shall also be able to perform remaining deliveries only against advance payment or provision of security, and, if no such advance payment is made or security provided within a two-week time period, to cancel the contract without fixing another extension term. This shall not affect any further claims."
                },
                {
                    "title": "7. Retention of Title",
                    "body": "7.1 Delivered goods shall fully remain property of Nanodrag (goods sold subject to retention of title) until all receivables, on whatever legal grounds, have been fully paid up.<br>7.2 In case of processing, combining or mixing of goods subject to retention of title with goods of the Customer, Nanodrag shall be entitled to co-ownership of the new property inasmuch as the invoiced value of goods sold with retention of title relates to the value of the other involved goods. Where Nanodrag co-ownership becomes null and void due to processing, combining or mixing with other goods, the Customer immediately assigns to Nanodrag those of his rights of ownership in the new property or compound matter which correspond to the amount of the value of goods subject to retention of title by Nanodrag. Customer shall also be responsible for holding such rights in safe custody on the behalf of Nanodrag and at Customer’s own expense. Any rights to co-ownership created as a result of such processing, combining or mixing shall be subject to section 7.1 of these Terms and Conditions.<br>7.3 The Customer may resell, process, combine or mix with other property, or otherwise integrate goods under retention of title in normal business operations, as long as the Customer is not defaulting. The Customer shall be prohibited from taking any other disposition regarding goods for which Nanodrag retains title. Nanodrag shall be promptly notified about any hypothecation or other seizure of goods under retention of title through a third party. All intervention costs will be charged to the Customer if and to the extent that they cannot be collected from such third party. If the Customer grants his buyer additional time for payment of the sales price, Customer shall reserve title in goods resold with retention of Nanodrag’ title under the same terms which Nanodrag has applied when delivering such goods with retention of title. The Customer shall be prohibited from any other kind of resale.<br>7.4 The Customer shall immediately assign to Nanodrag any receivables resulting from a resale of goods initially sold with retention of Nanodrag’ title. These will be used to substitute the goods under retention of title as collateral of the equivalent amount. The Customer shall only be entitled and authorized to resell such goods if his receivables therefrom accrue to Nanodrag.<br>7.5 If the Customer resells goods under retention of our title together with goods from other suppliers at a certain total price, Customer shall assign to Nanodrag his receivables from such resale in the same amount as stated in the invoice for goods initially sold with retention of title by Nanodrag.<br>7.6 If an assigned receivable is included into a current account, the Customer immediately assigns to Nanodrag that part of the balance which is equivalent to the amount of such receivable, including the final balance from current account operations.<br>7.7 Until Nanodrag gives notice of revocation, the Customer shall be authorized to collect receivables assigned to Nanodrag. Nanodrag shall be entitled to such revocation if the Customer fails to meet his payment obligations under the business relationship with Nanodrag in due course. If the preconditions for exercising a revocation right are fulfilled, the Customer shall promptly notify Nanodrag of any assigned receivables with respective debtors, furnish all data required for collection of such receivables, hand over all related documentation and advise the debtors of such assignment. Nanodrag reserves the right to personally advise the debtors of such assignment.<br>7.8 If the value of the collateral deposited for the benefit of Nanodrag exceeds the amount of secured claims by a total of more than fifty (50) per cent, the Customer shall be entitled to demand that Nanodrag insofar release securities of the choice of Nanodrag.<br>7.9 If Nanodrag claims retention of title, this shall only be understood as rescind of the contract if expressly stated so by Nanodrag in writing. The Customer's right to possess goods under retention of title shall be null and void if he fails to meet his contractual obligations."
                },
                {
                    "title": "8. Warranty",
                    "body": "8.1 The goods claimed to be defective shall be returned to Nanodrag for examination in their original or equivalent packaging. Nanodrag shall remedy defects if the warranty claim is valid and within the warranty period. It is at Nanodrag’ discretion whether Nanodrag remedies the defect by repair or replacement. Nanodrag shall only bear the costs necessary to remedy the defect.<br>8.2 Nanodrag shall be entitled to refuse to remedy defects in accordance with Nanodrag’ statutory rights. Nanodrag may refuse to remedy defects if the Customer has not complied with Nanodrag’ request to return the goods claimed to be defective.<br>8.3 The Customer shall be entitled to rescind the contract or reduce the contract price in accordance with his statutory rights, however, the Customer shall not be entitled to rescind the contract or to reduce the contract price, unless the Customer has previously given Nanodrag twice a reasonable period to remedy the defect which Nanodrag has failed to observe, unless setting of such a period to remedy defects is dispensable. In the event of rescission, Customer shall be liable for any intentional or negligent actions that cause destruction or loss of the goods as well as for failure to derive benefits from the goods.<br>8.4 If Nanodrag maliciously withholds disclosure of a defect or gives a quality warranty in accordance with section 444 of the German Civil Code (a representation by the seller that the goods will have certain qualities at the time the risk passes and acceptance by seller of strict liability in the event that they do not), the Customer’s rights shall be governed exclusively by the statutory provisions.<br>8.5 Any rights of the Customer to receive damages or compensation shall be governed by the provisions in section 10 of these Terms and Conditions.<br>8.6 Specifications of Nanodrag’ goods, especially pictures, drawings, data about weight, measure and capacity contained in offers and brochures are to be considered as average data. Such specifications and data shall in no way constitute a quality warranty but merely a description or labelling of the goods.<br>8.7 Unless limits for variations have expressly been agreed in the order confirmation, such variations shall be admissible that are customary within the trade.<br>8.8 Nanodrag shall not accept any liability for defects in the goods supplied if they are caused by normal wear and tear. The Customer shall have no rights against Nanodrag in respect of defects in goods sold as lower-class or used goods.<br>8.9 Any warranty shall be void if operating or maintenance instructions are not observed, if changes are made to deliveries or services, if parts are replaced or materials used that are not in accordance with the original product specifications by Nanodrag, unless the Customer can show that the defect in question resulted from another cause.<br>8.10 Provided that the Customer is a merchant, the Customer shall be obliged to notify defects to Nanodrag in writing or via fax.<br>8.11 The limitation period for claims for defects shall be 12 months (24 months in case the Customer is a consumer). This shall not apply to Customer’s claims for damages based on damages of body or health caused by a defect for which Nanodrag is responsible or claims for damages based on intentional or grossly negligent conduct by Nanodrag."
                },
                {
                    "title": "9. Limited Liability",
                    "body": "9.1 In case of a breach of contractual obligations, defective deliveries or tortious acts, Nanodrag shall only be obliged to compensate damages or expenses – subject to any other contractual or statutory conditions for liability – if Nanodrag has acted intentionally or with gross negligence or in cases of minor negligence, if such negligence results in the breach of an essential contractual duty (a duty the breach of which puts the fulfilment of the purpose of the contract at risk). However, in case of minor negligence, Nanodrag’ liability shall be limited to typical damages which are foreseeable at the time of the conclusion of the contract.<br>9.2 The liability of Nanodrag for losses caused by late delivery due to minor negligence shall be limited to 5% of the agreed purchase price.<br>9.3 The exclusions and limitations of liability in sections 10.1 – 10.2 shall not apply in cases of a quality warranty in accordance with section 444 of the German Civil Code (see section 9.4), in cases where Nanodrag has maliciously failed to disclose a defect, in case of damages resulting from death, injury to health or physical injury or where the laws on product liability impose overriding liabilities which cannot be excluded.<br>9.4 The limitation period for claims against Nanodrag – based on whatever legal ground – shall be 12 months (24 months in case Customer is a consumer) from the date of delivery to the Customer and in case of tortious claims, 12 months (24 months in case Customer is a consumer) from the date the Customer becomes aware or could have become aware of the grounds giving rise to a claim and the liable person, had the Customer not been grossly negligent. The provisions in this clause shall neither apply in cases of intentional or gross negligent breaches of duty nor shall they apply in cases referred to in section 10.3 of these Terms and Conditions.<br>9.5 If the Customer is an intermediary seller of the goods obtained from Nanodrag and the final purchaser of the goods is a consumer, the limitation period for any action of recourse against Nanodrag by the Customer shall be the period specified by statute."
                },
                {
                    "title": "10. Industrial Property Rights, Copyrights",
                    "body": "10.1 In the event of claims against the Customer because of breach of an industrial property right or a copyright in using deliveries or services supplied by Nanodrag in accordance with the contractually defined manner, Nanodrag shall be responsible to obtain the right for the Customer to continue using such deliveries or services, provided that the Customer gives immediate written notice of such third-party claims and Nanodrag’ rights to take all appropriate defensive and out-of-court actions are reserved. If, despite such actions, it proves impossible to continue using the deliveries or services supplied by Nanodrag under reasonable economic conditions, it shall be understood as agreed that Nanodrag may, at the discretion of Nanodrag, modify or replace the particular delivery or service for removal of a legal deficiency, or take back such delivery or service with refunding of the sales price previously paid to Nanodrag less a certain deduction to account for the age of the delivery or service in question.<br>10.2 The Customer shall have no further claims alleging infringement of industrial property or copyrights provided Nanodrag has neither violated essential contractual duties nor intentionally or grossly negligently breached contractual duties. Nanodrag shall have no obligations in accordance with section 10.1 in case breaches of rights are caused by exploiting the deliveries or services supplied by Nanodrag in any other manner than contractually defined or by operating these together with any other than Nanodrag deliveries or services."
                },
                {
                    "title": "11. Confidentiality",
                    "body": "11.1 Unless otherwise expressly stipulated in writing, no information provided to Nanodrag in connection with orders shall be regarded as confidential, unless their confidential nature is obvious.<br>11.2 Nanodrag points out that personal data in relation to the contractual relationship may be stored by Nanodrag and may be transferred to companies associated with Nanodrag in the Nanodrag Group."
                }
            ]
        },
        ES: {
            pageTitle: 'Condiciones Generales de Venta',
            metaDescription: 'Lea los Términos y Condiciones completos de NanoDrag, incluidas las definiciones legales, precios, garantías y términos de responsabilidad.',
            heroTitle: 'Condiciones Generales de Venta',
            sections: [
                {
                    "title": "Definiciones",
                    "body": "<strong>Nanodrag</strong> significa Nanodrag Technology GmbH, la empresa que suministra los bienes o servicios, o una de sus filiales.<br><strong>Cliente</strong> significa la persona física, empresa u otra parte con la que el vendedor celebra el contrato.<br><strong>Contrato</strong> significa el pedido contractual para la compra de bienes o servicios."
                },
                {
                    "title": "1. General",
                    "body": "1.1 Cualquier entrega de bienes y servicios por parte de Nanodrag como vendedor al cliente (“Cliente”) estará sujeta a las Condiciones establecidas en este documento, salvo que se hayan hecho otros acuerdos explícitos. Las condiciones generales del Cliente que sean incompatibles con estas Condiciones solo serán aplicables en la medida en que Nanodrag las haya aprobado expresamente por escrito.<br>1.2 Las reclamaciones contra Nanodrag no podrán ser cedidas a terceros. El artículo 354a del Código de Comercio Alemán (HGB) no se verá afectado.<br>1.3 La venta, reventa y disposición de bienes y servicios, incluida cualquier tecnología o documentación asociada, puede estar sujeta a regulaciones de control de exportaciones alemanas, de la UE, de EE. UU. y de otros países. Cualquier reventa de bienes a países embargados o a personas denegadas o personas que utilicen o puedan utilizar los bienes con fines militares, armas ABC o tecnología nuclear está sujeta a una licencia oficial. El Cliente declara con su pedido que cumple con dichas leyes y regulaciones y que los bienes no se entregarán directa o indirectamente a países que prohíban o restrinjan la importación de dichos bienes. El Cliente declara haber obtenido todas las licencias necesarias para la exportación e importación."
                },
                {
                    "title": "2. Información y Consultoría",
                    "body": "La información y consultoría relacionada con los bienes y servicios de Nanodrag se proporciona según se considere apropiado a partir de la experiencia existente. Los valores citados, especialmente los datos de rendimiento, representan valores promedio determinados mediante ensayos en condiciones estándar de laboratorio. Nanodrag no asume ningún compromiso de que sus productos cumplan con exactitud los valores citados ni con las áreas de aplicación mencionadas. La sección 10 de estas Condiciones regula cualquier cuestión relativa a la responsabilidad."
                },
                {
                    "title": "3. Precios",
                    "body": "3.1 Solo serán aplicables los precios indicados en la confirmación del pedido de Nanodrag. Los servicios adicionales se facturarán por separado.<br>3.2 Todos los precios se indican como precios netos y no incluyen el impuesto sobre el valor añadido, que deberá ser abonado adicionalmente por el Cliente en la cuantía establecida por la legislación aplicable.<br>3.3 A menos que se acuerde expresamente lo contrario, los precios se cotizan franco fábrica (ex works) de la empresa Nanodrag que utiliza estas Condiciones. El Cliente asumirá todos los costes adicionales de transporte, costes de embalaje superiores al estándar, tasas públicas (incluidos impuestos retenidos) y derechos."
                },
                {
                    "title": "4. Entrega",
                    "body": "4.1 A menos que se acuerde expresamente lo contrario, Nanodrag entregará los productos ex works (EXW INCOTERMS 2010) desde la empresa Nanodrag que utiliza estas Condiciones.<br>4.2 Los plazos de entrega solo serán vinculantes si se acuerdan expresamente por escrito. Los plazos de entrega comenzarán en la fecha de la confirmación del pedido por parte de Nanodrag, pero nunca antes de haberse resuelto todos los detalles del pedido, incluida la presentación de los certificados oficiales necesarios. Los plazos de entrega se considerarán cumplidos si se notifica puntualmente la disposición para el envío, incluso si no se puede realizar el despacho de los bienes por causas no imputables a Nanodrag.<br>4.3 Con respecto a los plazos y fechas de entrega que no estén definidos expresamente como fijos en la confirmación del pedido, el Cliente podrá —dos semanas después del vencimiento de dicho plazo o fecha— fijar un plazo de gracia adecuado para la entrega. Nanodrag solo se considerará en mora tras el vencimiento de dicho plazo de gracia.<br>4.4 Sin perjuicio de los derechos de Nanodrag derivados del incumplimiento del Cliente, los plazos y fechas de entrega se entenderán prorrogados por el periodo en que el Cliente incumpla sus obligaciones frente a Nanodrag. En caso de que Nanodrag incumpla sus obligaciones, solo será responsable de los daños conforme a lo dispuesto en la sección 10 de estas Condiciones.<br>4.5 Nanodrag se reserva el derecho de efectuar la entrega utilizando su propia organización de transporte.<br>4.6 Nanodrag podrá realizar entregas y prestaciones parciales si ello no afecta de manera irrazonable al Cliente.<br>4.7 El Cliente podrá rescindir el contrato tras dos plazos de gracia fallidos, salvo que el impedimento sea meramente temporal y un retraso no afecte de manera irrazonable al Cliente.<br>4.8 Cualquier derecho contractual o legal del Cliente para rescindir el contrato que no se ejerza en un plazo razonable fijado por Nanodrag se considerará perdido."
                },
                {
                    "title": "5. Envío, Transmisión del Riesgo",
                    "body": "5.1 A menos que se acuerde expresamente lo contrario, el envío se realizará siempre por cuenta y riesgo del Cliente. El riesgo se transmitirá al Cliente tan pronto como los bienes se hayan entregado a la persona encargada del envío.<br>5.2 Si el envío se retrasa por causas imputables al Cliente, el riesgo de deterioro, pérdida y destrucción accidental se transmitirá al Cliente en el momento de la notificación de la disponibilidad de los bienes por parte de Nanodrag. Los costes de almacenamiento tras la transmisión del riesgo correrán a cargo del Cliente. Esto no afectará a otros posibles derechos.<br>5.3 Si el Cliente incurre en mora de aceptación, Nanodrag tendrá derecho a reclamar el reembolso de los gastos derivados, y el riesgo de deterioro, pérdida y destrucción accidental se transmitirá al Cliente."
                },
                {
                    "title": "6. Pago",
                    "body": "6.1 El pago deberá realizarse íntegramente en un plazo de 30 días a partir de la fecha de la factura. El pago se considerará efectuado el día en que Nanodrag reciba la cantidad correspondiente. Las letras de cambio y los cheques no se considerarán como pago hasta que hayan sido efectivamente cobrados y serán aceptados sin obligación de presentación o protesta oportuna.<br>6.2 Inmediatamente en caso de mora —o desde la fecha de vencimiento si el Cliente es un comerciante en el sentido del Código de Comercio Alemán (HGB)—, Nanodrag se reserva el derecho de reclamar un daño mayor real.<br>6.3 El Cliente solo podrá retener o compensar pagos vencidos con sus propias reclamaciones si estas no son controvertidas o han sido reconocidas legalmente.<br>6.4 Todas las cuentas por cobrar de Nanodrag serán exigibles de inmediato en caso de mora en el pago, protesta de una letra de cambio o suspensión de pagos del Cliente, independientemente del plazo de vencimiento de las letras de cambio previamente aceptadas. En cualquiera de estos casos, Nanodrag también podrá realizar las entregas restantes solo contra pago anticipado o prestación de garantía, y si no se realiza dicho pago o garantía dentro de un plazo de dos semanas, cancelar el contrato sin establecer otro plazo adicional. Esto no afecta otros posibles derechos adicionales."
                },
                {
                    "title": "7. Reserva de Dominio",
                    "body": "7.1 Los bienes entregados seguirán siendo propiedad de Nanodrag (bienes vendidos con reserva de dominio) hasta que se hayan pagado completamente todas las cuentas pendientes, sea cual sea el fundamento legal.<br>7.2 En caso de procesamiento, combinación o mezcla de bienes sujetos a reserva de dominio con bienes del Cliente, Nanodrag tendrá derecho a la copropiedad del nuevo bien en la medida en que el valor facturado de los bienes vendidos con reserva de dominio guarde proporción con el valor de los otros bienes involucrados. Si la copropiedad de Nanodrag quedara anulada debido al procesamiento, combinación o mezcla, el Cliente cede inmediatamente a Nanodrag sus derechos de propiedad sobre el nuevo bien o conjunto resultante en la medida correspondiente al valor de los bienes sujetos a reserva de dominio por parte de Nanodrag. El Cliente será responsable de conservar dichos derechos en nombre de Nanodrag y por su propia cuenta. Cualquier derecho de copropiedad creado como resultado del procesamiento, combinación o mezcla estará sujeto a la cláusula 7.1 de estas Condiciones.<br>7.3 El Cliente podrá revender, procesar, combinar o mezclar con otros bienes, o integrar de otro modo los bienes sujetos a reserva de dominio en operaciones comerciales normales, siempre que no incurra en mora. El Cliente no podrá disponer de otra forma sobre los bienes cuya titularidad conserva Nanodrag. Se deberá notificar de inmediato a Nanodrag cualquier embargo u otra incautación de los bienes por parte de terceros. Todos los costos de intervención correrán a cargo del Cliente si no pueden ser recuperados del tercero. Si el Cliente concede a su comprador un plazo adicional para el pago del precio de venta, deberá reservarse la propiedad de los bienes revendidos bajo las mismas condiciones que aplicó Nanodrag al entregar los bienes con reserva de dominio. El Cliente no podrá revender los bienes en otras condiciones.<br>7.4 El Cliente cede inmediatamente a Nanodrag los créditos derivados de la reventa de bienes inicialmente vendidos con reserva de dominio por Nanodrag. Estos servirán como garantía en sustitución de los bienes con reserva de dominio por el importe equivalente. El Cliente solo estará autorizado a revender dichos bienes si los créditos derivados de ello se transfieren a Nanodrag.<br>7.5 Si el Cliente revende los bienes sujetos a nuestra reserva de dominio junto con bienes de otros proveedores por un precio total determinado, cederá a Nanodrag los créditos de dicha reventa por el importe que figure en la factura de los bienes inicialmente vendidos con reserva de dominio por Nanodrag.<br>7.6 Si un crédito cedido se incluye en una cuenta corriente, el Cliente cederá inmediatamente a Nanodrag la parte del saldo correspondiente al importe de dicho crédito, incluido el saldo final de las operaciones en cuenta corriente.<br>7.7 Hasta que Nanodrag notifique su revocación, el Cliente estará autorizado a cobrar los créditos cedidos a Nanodrag. Nanodrag podrá ejercer dicha revocación si el Cliente no cumple puntualmente sus obligaciones de pago en la relación comercial con Nanodrag. Si se cumplen las condiciones para ejercer el derecho de revocación, el Cliente deberá informar de inmediato a Nanodrag sobre los créditos cedidos y sus respectivos deudores, facilitar todos los datos necesarios para su cobro, entregar toda la documentación relacionada y notificar a los deudores sobre la cesión. Nanodrag se reserva el derecho de informar directamente a los deudores sobre la cesión.<br>7.8 Si el valor de las garantías constituidas a favor de Nanodrag excede el importe de los créditos garantizados en más de un 50 %, el Cliente tendrá derecho a exigir a Nanodrag la liberación de garantías, a elección de Nanodrag.<br>7.9 Si Nanodrag hace valer la reserva de dominio, esto solo se considerará una rescisión del contrato si Nanodrag lo declara expresamente por escrito. El derecho del Cliente a poseer bienes sujetos a reserva de dominio quedará anulado si no cumple con sus obligaciones contractuales."
                },
                {
                    "title": "8. Garantía",
                    "body": "8.1 Los bienes reclamados como defectuosos deberán devolverse a Nanodrag para su examen en su embalaje original o equivalente. Nanodrag subsanará los defectos si la reclamación de garantía es válida y dentro del período de garantía. Nanodrag decidirá a su discreción si subsana el defecto mediante reparación o reemplazo. Nanodrag solo asumirá los costes necesarios para subsanar el defecto.<br>8.2 Nanodrag tendrá derecho a negarse a subsanar defectos conforme a sus derechos legales. Podrá negarse si el Cliente no ha cumplido con la solicitud de Nanodrag de devolver los bienes reclamados como defectuosos.<br>8.3 El Cliente tendrá derecho a rescindir el contrato o reducir el precio conforme a sus derechos legales. Sin embargo, no podrá hacerlo a menos que haya concedido previamente a Nanodrag dos plazos razonables para subsanar el defecto y estos hayan transcurrido sin éxito, salvo que no sea necesario fijar un plazo. En caso de rescisión, el Cliente será responsable por acciones intencionales o negligentes que causen la destrucción o pérdida de los bienes, así como por no aprovechar los beneficios de los mismos.<br>8.4 Si Nanodrag oculta maliciosamente un defecto o garantiza ciertas cualidades conforme al artículo 444 del Código Civil Alemán (una declaración de que los bienes tendrán ciertas cualidades en el momento de la transferencia del riesgo), los derechos del Cliente se regirán exclusivamente por las disposiciones legales.<br>8.5 Cualquier derecho del Cliente a recibir indemnización estará regulado por lo dispuesto en la sección 10 de estas Condiciones Generales.<br>8.6 Las especificaciones de los bienes de Nanodrag, en particular imágenes, dibujos, datos sobre peso, medida y capacidad incluidos en ofertas y folletos, deben considerarse datos promedio. Estas especificaciones no constituyen una garantía de calidad, sino únicamente una descripción o denominación de los bienes.<br>8.7 A menos que se acuerden expresamente límites de variación en la confirmación del pedido, se permitirán las variaciones habituales en el comercio.<br>8.8 Nanodrag no asumirá responsabilidad alguna por defectos derivados del desgaste normal. El Cliente no tendrá derechos contra Nanodrag respecto a bienes vendidos como de segunda clase o usados.<br>8.9 Toda garantía será inválida si no se observan las instrucciones de uso o mantenimiento, si se realizan modificaciones en las entregas o servicios, si se sustituyen piezas o se utilizan materiales no conformes con las especificaciones originales del producto de Nanodrag, salvo que el Cliente demuestre que el defecto se debió a otra causa.<br>8.10 Siempre que el Cliente sea un comerciante, estará obligado a notificar los defectos a Nanodrag por escrito o por fax.<br>8.11 El plazo de prescripción para reclamaciones por defectos será de 12 meses (24 meses si el Cliente es consumidor). Esto no se aplicará a las reclamaciones por daños corporales o a la salud causados por defectos cuya responsabilidad recae en Nanodrag ni a las reclamaciones por conductas dolosas o gravemente negligentes de Nanodrag."
                },
                {
                    "title": "9. Responsabilidad Limitada",
                    "body": "9.1 En caso de incumplimiento de obligaciones contractuales, entregas defectuosas o actos ilícitos, Nanodrag solo estará obligado a compensar daños o gastos –sujeto a otras condiciones contractuales o legales de responsabilidad– si ha actuado con dolo o negligencia grave, o en casos de negligencia leve cuando tal negligencia resulte en el incumplimiento de una obligación contractual esencial (una obligación cuyo incumplimiento pone en riesgo el cumplimiento del propósito del contrato). Sin embargo, en caso de negligencia leve, la responsabilidad de Nanodrag se limitará a los daños típicos previsibles al momento de la celebración del contrato.<br>9.2 La responsabilidad de Nanodrag por pérdidas causadas por retraso en la entrega debido a negligencia leve estará limitada al 5% del precio de compra acordado.<br>9.3 Las exclusiones y limitaciones de responsabilidad de las secciones 9.1 y 9.2 no se aplicarán en caso de una garantía de calidad conforme al artículo 444 del Código Civil Alemán (ver sección 9.4), ni en caso de ocultamiento doloso de un defecto, ni en caso de daños resultantes de fallecimiento, lesiones personales o daños a la salud, ni cuando la legislación sobre responsabilidad del producto imponga responsabilidades que no pueden ser excluidas.<br>9.4 El plazo de prescripción para reclamaciones contra Nanodrag –independientemente del fundamento legal– será de 12 meses (24 meses si el Cliente es consumidor) desde la fecha de entrega al Cliente, y en caso de reclamaciones extracontractuales, 12 meses (24 meses si el Cliente es consumidor) desde la fecha en que el Cliente tenga o podría haber tenido conocimiento de los hechos que dan lugar a la reclamación y de la persona responsable, a menos que haya actuado con negligencia grave. Estas disposiciones no se aplicarán en caso de incumplimiento intencionado o gravemente negligente ni en los casos contemplados en la sección 9.3.<br>9.5 Si el Cliente revende los bienes adquiridos a Nanodrag y el comprador final es un consumidor, el plazo de prescripción para cualquier acción de recurso contra Nanodrag será el establecido legalmente."
                },
                {
                    "title": "10. Derechos de Propiedad Industrial y Derechos de Autor",
                    "body": "10.1 En caso de que se presenten reclamaciones contra el Cliente por infracción de un derecho de propiedad industrial o de autor debido al uso de entregas o servicios suministrados por Nanodrag conforme al uso definido contractualmente, Nanodrag se responsabilizará de obtener el derecho para que el Cliente pueda continuar utilizando dichas entregas o servicios, siempre que el Cliente notifique inmediatamente por escrito dichas reclamaciones de terceros y se reserven los derechos de Nanodrag de adoptar todas las medidas defensivas y extrajudiciales adecuadas. Si, a pesar de estas medidas, resulta imposible continuar utilizando las entregas o servicios suministrados por Nanodrag en condiciones económicas razonables, se considerará acordado que Nanodrag, a su discreción, podrá modificar o reemplazar dicha entrega o servicio para eliminar la deficiencia legal, o bien retirar dicha entrega o servicio reembolsando el precio de venta previamente pagado a Nanodrag, deduciendo una cantidad razonable en función de la antigüedad del bien o servicio.<br>10.2 El Cliente no tendrá más reclamaciones por supuestas infracciones de derechos de propiedad industrial o de autor, salvo que Nanodrag haya incumplido obligaciones contractuales esenciales o haya actuado con dolo o negligencia grave. Nanodrag no tendrá obligaciones conforme a la sección 10.1 si las infracciones son causadas por el uso de las entregas o servicios de Nanodrag de forma distinta a la definida contractualmente o por su operación junto con productos o servicios no suministrados por Nanodrag."
                },
                {
                    "title": "11. Confidencialidad",
                    "body": "11.1 Salvo estipulación expresa por escrito en contrario, ninguna información proporcionada a Nanodrag en relación con pedidos será considerada confidencial, a menos que su naturaleza confidencial sea evidente.<br>11.2 Nanodrag señala que los datos personales relacionados con la relación contractual podrán ser almacenados por Nanodrag y transferidos a empresas asociadas del Grupo Nanodrag."
                }
            ]
        },
        DE: {
            pageTitle: 'Allgemeine Verkaufsbedingungen',
            metaDescription: 'Lesen Sie die vollständigen Allgemeinen Geschäftsbedingungen von NanoDrag mit rechtlichen Definitionen, Preisen, Garantien und Haftungshinweisen.',
            heroTitle: 'Allgemeine Verkaufsbedingungen',
            sections: [
                {
                    "title": "Begriffsbestimmungen",
                    "body": "<strong>Nanodrag</strong> bezeichnet die Nanodrag Technology GmbH, das Unternehmen, das die Waren oder Dienstleistungen liefert, oder eine Tochtergesellschaft.<br><strong>Kunde</strong> bezeichnet die natürliche oder juristische Person oder sonstige Partei, mit der der Verkäufer einen Vertrag schließt.<br><strong>Vertrag</strong> bezeichnet die vertragliche Bestellung zum Kauf von Waren oder Dienstleistungen."
                },
                {
                    "title": "1. Allgemeines",
                    "body": "1.1 Jede Lieferung von Waren und Dienstleistungen durch Nanodrag als Verkäufer an den Kunden („Kunde“) unterliegt den nachstehenden Allgemeinen Geschäftsbedingungen, sofern keine abweichenden Vereinbarungen ausdrücklich getroffen wurden. Allgemeinen Geschäftsbedingungen des Kunden, die von diesen Bedingungen abweichen, wird nur Geltung beigemessen, wenn Nanodrag diesen ausdrücklich schriftlich zugestimmt hat.<br>1.2 Ansprüche gegen Nanodrag dürfen nicht an Dritte abgetreten werden. § 354a HGB bleibt hiervon unberührt.<br>1.3 Der Verkauf, Weiterverkauf und die Entsorgung von Waren und Dienstleistungen einschließlich etwaiger zugehöriger Technologie oder Dokumentation kann den deutschen, EU- und US-amerikanischen Exportkontrollvorschriften sowie denen weiterer Länder unterliegen. Der Weiterverkauf in Embargoländer oder an gesperrte Personen oder an Personen, die die Waren für militärische Zwecke, ABC-Waffen oder Nukleartechnologie verwenden oder verwenden könnten, unterliegt einer behördlichen Genehmigung. Der Kunde erklärt mit seiner Bestellung die Einhaltung solcher Gesetze und Vorschriften und dass die Waren weder direkt noch indirekt in Länder geliefert werden, die deren Einfuhr verbieten oder einschränken. Der Kunde erklärt, alle für den Export und Import erforderlichen Genehmigungen eingeholt zu haben."
                },
                {
                    "title": "2. Informationen, Beratung",
                    "body": "Informationen und Beratungen in Bezug auf Waren und Dienstleistungen von Nanodrag erfolgen nach bestem Wissen und auf Grundlage bestehender Erfahrungen. Alle dabei angegebenen Werte, insbesondere Leistungsdaten, stellen Durchschnittswerte dar, die unter Standardlaborbedingungen ermittelt wurden. Nanodrag übernimmt keine Verpflichtung, dass die Produkte exakt den angegebenen Werten oder Anwendungsbereichen entsprechen. Fragen der Haftung regelt Abschnitt 10 dieser Bedingungen."
                },
                {
                    "title": "3. Preise",
                    "body": "3.1 Es gelten ausschließlich die in der Auftragsbestätigung von Nanodrag angegebenen Preise. Zusatzleistungen werden gesondert in Rechnung gestellt.<br>3.2 Alle Preise verstehen sich als Nettopreise und enthalten keine gesetzliche Mehrwertsteuer, die vom Kunden zusätzlich in gesetzlicher Höhe zu entrichten ist.<br>3.3 Sofern nicht ausdrücklich anders vereinbart, gelten die Preise ab Werk des Unternehmens Nanodrag, das diese Bedingungen verwendet. Der Kunde trägt sämtliche zusätzlichen Frachtkosten, Verpackungskosten über die Standardverpackung hinaus, öffentliche Abgaben (einschließlich Quellensteuer) und Zölle."
                },
                {
                    "title": "4. Lieferung",
                    "body": "4.1 Sofern nicht ausdrücklich anders vereinbart, liefert Nanodrag ab Werk (EXW INCOTERMS 2010) des Unternehmens Nanodrag, das diese Bedingungen verwendet.<br>4.2 Lieferfristen sind nur verbindlich, wenn sie ausdrücklich schriftlich vereinbart wurden. Die Fristen beginnen mit dem Datum der Auftragsbestätigung durch Nanodrag, jedoch niemals vor Klärung aller für die Bestellung relevanten Details, einschließlich der Vorlage etwaiger erforderlicher behördlicher Genehmigungen. Eine Lieferfrist gilt als eingehalten, wenn die Versandbereitschaft rechtzeitig mitgeteilt wird, selbst wenn die Ware aus von Nanodrag nicht zu vertretenden Gründen nicht rechtzeitig versendet werden kann.<br>4.3 Bei nicht ausdrücklich als fest vereinbarten Lieferfristen kann der Kunde zwei Wochen nach Ablauf der Lieferfrist eine angemessene Nachfrist setzen. Ein Verzug von Nanodrag liegt erst nach Ablauf dieser Nachfrist vor.<br>4.4 Unbeschadet der Rechte von Nanodrag aus einem Verzug des Kunden verlängern sich Lieferfristen und -termine um den Zeitraum, in dem der Kunde seinen Verpflichtungen gegenüber Nanodrag nicht nachkommt. Bei einem Versäumnis seitens Nanodrag haftet das Unternehmen nur im Rahmen von Abschnitt 10 dieser Bedingungen.<br>4.5 Nanodrag behält sich vor, Lieferungen mit eigenem Lieferservice durchzuführen.<br>4.6 Teillieferungen und Teilleistungen sind zulässig, sofern sie dem Kunden zumutbar sind.<br>4.7 Der Kunde kann nach zwei erfolglosen Nachfristen vom Vertrag zurücktreten, es sei denn, das Leistungshindernis ist nur vorübergehend und eine Verzögerung ist für den Kunden nicht unzumutbar.<br>4.8 Vertrags- oder gesetzliche Rücktrittsrechte des Kunden verfallen, wenn sie nicht innerhalb einer von Nanodrag gesetzten angemessenen Frist ausgeübt werden."
                },
                {
                    "title": "5. Versand, Gefahrübergang",
                    "body": "5.1 Sofern nicht ausdrücklich anders vereinbart, erfolgt der Versand stets auf Gefahr des Kunden. Die Gefahr geht auf den Kunden über, sobald die Ware der mit dem Versand beauftragten Person übergeben wurde.<br>5.2 Verzögert sich der Versand aus vom Kunden zu vertretenden Gründen, geht die Gefahr des zufälligen Untergangs, Verlusts oder der Verschlechterung der Ware mit Anzeige der Versandbereitschaft auf den Kunden über. Nach Gefahrübergang anfallende Lagerkosten trägt der Kunde. Weitere Ansprüche bleiben unberührt.<br>5.3 Gerät der Kunde in Annahmeverzug, ist Nanodrag berechtigt, Ersatz der durch die Verzögerung entstandenen Kosten zu verlangen. Auch in diesem Fall geht die Gefahr des zufälligen Untergangs, Verlusts oder der Verschlechterung auf den Kunden über."
                },
                {
                    "title": "6. Zahlung",
                    "body": "6.1 Die Zahlung ist innerhalb von 30 Tagen nach Rechnungsdatum vollständig zu leisten. Eine Zahlung gilt als erfolgt, sobald der fällige Betrag bei Nanodrag eingegangen ist. Wechsel und Schecks gelten erst nach Einlösung als Zahlung und werden ohne Verpflichtung zur rechtzeitigen Vorlage und Protestannahme akzeptiert.<br>6.2 Bei Zahlungsverzug – oder ab Fälligkeit, wenn der Kunde Kaufmann im Sinne des HGB ist – ist Nanodrag berechtigt, einen höheren tatsächlichen Verzugsschaden geltend zu machen.<br>6.3 Der Kunde darf fällige Zahlungen nur mit unbestrittenen oder rechtskräftig festgestellten Gegenforderungen aufrechnen oder zurückhalten.<br>6.4 Sämtliche Forderungen von Nanodrag werden sofort fällig, wenn sich der Kunde im Zahlungsverzug befindet, ein Wechselprotest vorliegt oder der Kunde seine Zahlungen einstellt, unabhängig von der Laufzeit etwaiger bereits akzeptierter Wechsel. In diesen Fällen ist Nanodrag berechtigt, ausstehende Lieferungen nur gegen Vorauszahlung oder Sicherheitsleistung durchzuführen. Erfolgt diese nicht innerhalb von zwei Wochen, kann Nanodrag vom Vertrag zurücktreten. Weitere Ansprüche bleiben unberührt."
                },
                {
                    "title": "7. Eigentumsvorbehalt",
                    "body": "7.1 Die gelieferten Waren bleiben bis zur vollständigen Bezahlung sämtlicher Forderungen aus der Geschäftsbeziehung Eigentum von Nanodrag.<br>7.2 Bei Verarbeitung, Verbindung oder Vermischung der unter Eigentumsvorbehalt stehenden Waren mit anderen, dem Kunden gehörenden Waren, steht Nanodrag ein Miteigentumsanteil an der neuen Sache zu, entsprechend dem Verhältnis des Rechnungswerts der Vorbehaltsware zum Wert der anderen verwendeten Waren. Erlischt das Miteigentum durch Verarbeitung, Verbindung oder Vermischung, überträgt der Kunde bereits jetzt die ihm zustehenden Eigentumsrechte an der neuen Sache in Höhe des Rechnungswerts der Vorbehaltsware an Nanodrag und verwahrt diese unentgeltlich für Nanodrag.<br>7.3 Der Kunde darf die Vorbehaltsware im ordentlichen Geschäftsgang weiterveräußern, verarbeiten oder vermischen, solange er nicht in Verzug ist. Andere Verfügungen über die Ware sind unzulässig. Verpfändungen oder Sicherungsübereignungen sind unzulässig. Der Kunde hat Nanodrag über Zwangsvollstreckungsmaßnahmen Dritter in die Vorbehaltsware unverzüglich schriftlich zu unterrichten. Der Kunde trägt alle Kosten, die zur Aufhebung des Zugriffs und zur Wiederbeschaffung der Ware aufgewendet werden müssen, soweit diese nicht von Dritten erstattet werden.<br>7.4 Der Kunde tritt sämtliche Forderungen aus der Weiterveräußerung der Vorbehaltsware schon jetzt in Höhe des Rechnungswerts der Vorbehaltsware an Nanodrag ab. Diese Abtretung dient der Sicherung in demselben Umfang wie die Vorbehaltsware.<br>7.5 Wird die Vorbehaltsware vom Kunden zusammen mit anderen, nicht Nanodrag gehörenden Waren zu einem Gesamtpreis veräußert, tritt der Kunde schon jetzt seine Forderung aus der Weiterveräußerung in Höhe des Anteils der Vorbehaltsware an Nanodrag ab.<br>7.6 Wird die abgetretene Forderung in ein Kontokorrent aufgenommen, tritt der Kunde seine Forderung aus dem Kontokorrentverhältnis in Höhe des Betrags ab, der dem ursprünglich abgetretenen Forderungsbetrag entspricht.<br>7.7 Der Kunde ist bis zum Widerruf durch Nanodrag berechtigt, die an Nanodrag abgetretenen Forderungen einzuziehen. Der Widerruf ist zulässig, wenn der Kunde seinen Zahlungsverpflichtungen nicht ordnungsgemäß nachkommt. Nach Widerruf hat der Kunde Nanodrag alle zur Geltendmachung der Forderung notwendigen Angaben zu machen, Unterlagen auszuhändigen und den Schuldnern die Abtretung mitzuteilen.<br>7.8 Übersteigt der realisierbare Wert der für Nanodrag bestehenden Sicherheiten die Forderungen von Nanodrag insgesamt um mehr als 50 %, ist Nanodrag auf Verlangen des Kunden zur Freigabe von Sicherheiten nach eigener Wahl verpflichtet.<br>7.9 Die Geltendmachung des Eigentumsvorbehalts durch Nanodrag gilt nur dann als Rücktritt vom Vertrag, wenn dies ausdrücklich schriftlich erklärt wird. Das Besitzrecht des Kunden an der Vorbehaltsware erlischt, wenn er seine vertraglichen Verpflichtungen nicht erfüllt."
                },
                {
                    "title": "8. Gewährleistung",
                    "body": "8.1 Die als mangelhaft beanstandeten Waren sind in der Originalverpackung oder einer gleichwertigen Verpackung an Nanodrag zur Prüfung zurückzusenden. Nanodrag wird Mängel beheben, sofern der Gewährleistungsanspruch berechtigt und innerhalb der Gewährleistungsfrist geltend gemacht wurde. Es liegt im Ermessen von Nanodrag, ob der Mangel durch Reparatur oder Ersatzlieferung behoben wird. Nanodrag übernimmt nur die zur Mängelbehebung erforderlichen Kosten.<br>8.2 Nanodrag ist berechtigt, die Mängelbeseitigung gemäß den gesetzlichen Vorschriften abzulehnen. Eine Mängelbeseitigung kann auch abgelehnt werden, wenn der Kunde der Aufforderung von Nanodrag zur Rücksendung der beanstandeten Ware nicht nachkommt.<br>8.3 Der Kunde ist berechtigt, vom Vertrag zurückzutreten oder den Kaufpreis zu mindern, soweit dies gesetzlich vorgesehen ist. Der Kunde ist jedoch nur dann zum Rücktritt oder zur Minderung berechtigt, wenn er Nanodrag zuvor zweimal eine angemessene Frist zur Mängelbeseitigung gesetzt hat und diese Fristen erfolglos verstrichen sind, es sei denn, eine Fristsetzung ist entbehrlich. Im Falle des Rücktritts haftet der Kunde für vorsätzliche oder fahrlässige Beschädigungen oder Verluste sowie für die unterlassene Nutzung der Ware.<br>8.4 Hat Nanodrag einen Mangel arglistig verschwiegen oder eine Beschaffenheitsgarantie gemäß § 444 BGB übernommen, richten sich die Rechte des Kunden ausschließlich nach den gesetzlichen Bestimmungen.<br>8.5 Etwaige Ansprüche des Kunden auf Schadensersatz oder Aufwendungsersatz richten sich nach den Bestimmungen in Abschnitt 9 dieser Allgemeinen Geschäftsbedingungen.<br>8.6 Angaben zu den Produkten von Nanodrag, insbesondere Abbildungen, Zeichnungen, Gewichts-, Maß- und Leistungsangaben in Angeboten und Broschüren, sind als Durchschnittswerte zu verstehen. Solche Angaben stellen keine zugesicherten Eigenschaften dar, sondern dienen lediglich der Beschreibung oder Kennzeichnung der Produkte.<br>8.7 Sofern im Auftrag nicht ausdrücklich Abweichungstoleranzen vereinbart wurden, sind handelsübliche Abweichungen zulässig.<br>8.8 Für Mängel, die durch normale Abnutzung entstehen, übernimmt Nanodrag keine Haftung. Bei als mindere Qualität oder gebrauchte Ware verkauften Produkten bestehen gegenüber Nanodrag keine Mängelansprüche.<br>8.9 Eine Gewährleistung entfällt, wenn Betriebs- oder Wartungsanweisungen nicht beachtet werden, Änderungen an den Lieferungen oder Leistungen vorgenommen werden, Teile ersetzt oder Materialien verwendet werden, die nicht den Originalspezifikationen von Nanodrag entsprechen, es sei denn, der Kunde weist nach, dass der Mangel nicht hierauf zurückzuführen ist.<br>8.10 Ist der Kunde Kaufmann, so hat er Mängel schriftlich oder per Fax anzuzeigen.<br>8.11 Die Verjährungsfrist für Mängelansprüche beträgt 12 Monate (bei Verbrauchern 24 Monate). Dies gilt nicht für Schadensersatzansprüche des Kunden wegen Verletzung von Leben, Körper oder Gesundheit infolge eines Mangels, für den Nanodrag verantwortlich ist, oder für Schadensersatzansprüche aufgrund vorsätzlichen oder grob fahrlässigen Verhaltens seitens Nanodrag."
                },
                {
                    "title": "9. Haftungsbeschränkung",
                    "body": "9.1 Bei Verletzungen vertraglicher Pflichten, mangelhafter Lieferung oder unerlaubter Handlung haftet Nanodrag – vorbehaltlich anderer vertraglicher oder gesetzlicher Haftungsvoraussetzungen – nur bei Vorsatz oder grober Fahrlässigkeit oder bei einfacher Fahrlässigkeit, wenn dadurch eine wesentliche Vertragspflicht verletzt wurde (eine Pflicht, deren Verletzung die Erreichung des Vertragszwecks gefährdet). Im Falle einfacher Fahrlässigkeit ist die Haftung von Nanodrag jedoch auf vorhersehbare, vertragstypische Schäden begrenzt.<br>9.2 Die Haftung von Nanodrag für Schäden aufgrund verspäteter Lieferung infolge einfacher Fahrlässigkeit ist auf 5 % des vereinbarten Kaufpreises begrenzt.<br>9.3 Die in Abschnitt 9.1 – 9.2 genannten Haftungsausschlüsse und -beschränkungen gelten nicht bei einer Beschaffenheitsgarantie im Sinne des § 444 BGB (siehe Abschnitt 9.4), bei arglistigem Verschweigen eines Mangels, bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie bei gesetzlich vorgeschriebener, nicht abdingbarer Produkthaftung.<br>9.4 Die Verjährungsfrist für Ansprüche gegen Nanodrag – gleich aus welchem Rechtsgrund – beträgt 12 Monate (bei Verbrauchern 24 Monate) ab Lieferung an den Kunden. Bei deliktischen Ansprüchen beträgt die Verjährungsfrist 12 Monate (bei Verbrauchern 24 Monate) ab dem Zeitpunkt, an dem der Kunde von den anspruchsbegründenden Umständen und der haftenden Person Kenntnis erlangt oder ohne grobe Fahrlässigkeit hätte erlangen müssen. Diese Regelung gilt nicht bei vorsätzlicher oder grob fahrlässiger Pflichtverletzung sowie in den in Abschnitt 9.3 genannten Fällen.<br>9.5 Ist der Kunde Zwischenhändler und erfolgt der Endverkauf an einen Verbraucher, so gelten für Rückgriffsansprüche des Kunden gegen Nanodrag die gesetzlichen Verjährungsfristen."
                },
                {
                    "title": "10. Gewerbliche Schutzrechte und Urheberrechte",
                    "body": "10.1 Wird der Kunde aufgrund der vertragsgemäßen Nutzung der von Nanodrag gelieferten Produkte oder Dienstleistungen wegen der Verletzung eines gewerblichen Schutzrechts oder Urheberrechts in Anspruch genommen, so wird Nanodrag dem Kunden das Recht zum weiteren Gebrauch verschaffen, sofern der Kunde Nanodrag unverzüglich schriftlich über derartige Ansprüche Dritter informiert und Nanodrag sämtliche Verteidigungsmaßnahmen – sowohl gerichtlich als auch außergerichtlich – vorbehalten bleiben. Ist es unter wirtschaftlich vertretbaren Bedingungen nicht möglich, die vertragsgemäße Nutzung der Lieferung oder Leistung aufrechtzuerhalten, ist Nanodrag berechtigt, die betroffene Lieferung oder Leistung nach eigener Wahl zu ändern oder zu ersetzen, um die Rechtsverletzung zu beseitigen, oder die Lieferung oder Leistung zurückzunehmen und den Kaufpreis abzüglich eines Nutzungsabschlags zu erstatten.<br>10.2 Weitere Ansprüche des Kunden wegen der Verletzung gewerblicher Schutzrechte oder Urheberrechte bestehen nicht, sofern Nanodrag keine wesentlichen Vertragspflichten vorsätzlich oder grob fahrlässig verletzt hat. Eine Haftung von Nanodrag gemäß Abschnitt 10.1 besteht insbesondere nicht, wenn die Rechtsverletzung durch eine nicht vertragsgemäße Nutzung der Lieferung oder Leistung oder durch deren Kombination mit anderen nicht von Nanodrag gelieferten Produkten oder Dienstleistungen verursacht wurde."
                },
                {
                    "title": "11. Vertraulichkeit",
                    "body": "11.1 Sofern nicht ausdrücklich schriftlich anders vereinbart, gelten Informationen, die dem Kunden im Zusammenhang mit Bestellungen an Nanodrag übermittelt werden, nicht als vertraulich, es sei denn, deren vertraulicher Charakter ist offensichtlich.<br>11.2 Nanodrag weist darauf hin, dass personenbezogene Daten im Zusammenhang mit der Vertragsbeziehung gespeichert und an mit Nanodrag verbundene Unternehmen innerhalb der Nanodrag-Gruppe übermittelt werden können."
                }
            ]
        },
        TR: {
            pageTitle: 'Genel Satış Koşulları',
            metaDescription: 'NanoDrag\'ın tam Genel İşletme Koşullarını yasal tanımlar, fiyatlandırma, garantiler ve sorumluluk beyanları ile okuyun.',
            heroTitle: 'Genel Satış Koşulları',
            sections: [
                {
                    "title": "Terimler",
                    "body": "<strong>Nanodrag</strong>, mal veya hizmetleri tedarik eden şirket olan Nanodrag Technology GmbH veya bağlı kuruluşunu ifade eder.<br><strong>Müşteri</strong>, satıcı ile sözleşme yapan gerçek veya tüzel kişi ya da diğer tarafı ifade eder.<br><strong>Sözleşme</strong>, mal veya hizmet satın almak için yapılan sözleşmeli siparişi ifade eder."
                },
                {
                    "title": "1. Genel Hükümler",
                    "body": "1.1 Nanodrag tarafından satıcı olarak müşteriye yapılan her türlü mal ve hizmet teslimatı, aksi açıkça kararlaştırılmadıkça, aşağıdaki Genel İşletme Koşullarına tabidir. Müşterinin bu koşullardan farklı olan genel işletme koşulları, ancak Nanodrag'ın yazılı onayıyla geçerlilik kazanır.<br>1.2 Nanodrag karşıtı talepler üçüncü kişilere devredilemez. HGB madde 354a bundan etkilenmez.<br>1.3 Mal ve hizmetlerin satışı, yeniden satışı ve bertarafı, ilgili Alman, AB ve ABD ihracat kontrol yasalarına ve diğer ülkelerin yasalarına tabi olabilir. Ambargo uygulanan ülkelere veya yasaklı kişilere veya malları askeri amaçlar, NBC silahları veya nükleer teknoloji için kullanan ya da kullanabilecek kişilere yeniden satış, resmi izne tabidir. Müşteri, bu tür yasa ve düzenlemelere uyacağını ve malların ithalatını yasaklayan veya kısıtlayan ülkelere doğrudan veya dolaylı olarak teslim edilmeyeceğini siparişle beyan eder. Müşteri, ihracat ve ithalat için gerekli tüm izinleri aldığını beyan eder."
                },
                {
                    "title": "2. Bilgi ve Danışmanlık",
                    "body": "Nanodrag'ın mal ve hizmetlerine ilişkin bilgi ve danışmanlık, en iyi bilgi ve mevcut deneyimlere dayanarak yapılır. Özellikle performans verileri olmak üzere belirtilen tüm değerler, standart laboratuvar koşullarında belirlenen ortalama değerlerdir. Nanodrag, ürünlerin belirtilen değerlere veya uygulama alanlarına tam olarak uymasını taahhüt etmez. Sorumluluk konuları bu koşulların 10. bölümünde düzenlenmiştir."
                },
                {
                    "title": "3. Fiyatlar",
                    "body": "3.1 Yalnızca Nanodrag'ın sipariş onayında belirtilen fiyatlar geçerlidir. Ek hizmetler ayrı olarak faturalandırılır.<br>3.2 Tüm fiyatlar net fiyatlardır ve yasal KDV'yi içermez; bu, müşterinin yasal oranlarda ayrıca ödemesi gereken bir tutardır.<br>3.3 Aksi açıkça kararlaştırılmadıkça, fiyatlar, bu koşulları kullanan Nanodrag şirketinin fabrikasından (EXW INCOTERMS 2010) geçerlidir. Müşteri, standart ambalajın ötesindeki tüm ek nakliye, ambalaj, kamu vergileri (kaynak vergisi dahil) ve gümrük masraflarını karşılar."
                },
                {
                    "title": "4. Teslimat",
                    "body": "4.1 Aksi açıkça kararlaştırılmadıkça, Nanodrag, bu koşulları kullanan Nanodrag şirketinin fabrikasından (EXW INCOTERMS 2010) teslimat yapar.<br>4.2 Teslimat süreleri, ancak yazılı olarak açıkça kararlaştırıldığında bağlayıcıdır. Süreler, Nanodrag'ın sipariş onayı tarihinden itibaren başlar, ancak siparişle ilgili tüm ayrıntıların, gerekli resmi izinlerin sunulması dahil, açıklığa kavuşturulmasından önce asla başlamaz. Teslimat süresi, malların zamanında gönderilememesi durumunda bile, nakliye hazır olduğunda yerine getirilmiş sayılır.<br>4.3 Açıkça sabitlenmiş teslimat süreleri hariç, müşteri, teslimat süresinin sona ermesinden iki hafta sonra Nanodrag'a makul bir ek süre vermelidir. Nanodrag'ın gecikmesi, bu ek sürenin sona ermesinden sonra gerçekleşir.<br>4.4 Müşterinin Nanodrag'a karşı yükümlülüklerini yerine getirmemesi durumunda, Nanodrag'ın hakları saklı kalmak kaydıyla, teslimat süreleri ve tarihleri, müşterinin yükümlülüklerini yerine getirmediği süre kadar uzar. Nanodrag'ın gecikmesi durumunda şirket yalnızca bu koşulların 10. bölümünde belirtilen kapsamda sorumludur.<br>4.5 Nanodrag, teslimatları kendi teslimat servisiyle gerçekleştirme hakkını saklı tutar.<br>4.6 Kısmi teslimatlar ve kısmi hizmetler, müşteri için makul olduğu sürece kabul edilebilir.<br>4.7 Müşteri, iki başarısız ek süreden sonra sözleşmeden çekilebilir; aksi takdirde sözleşmeden çekilme hakkı yoktur veya gecikme müşteri için makul değilse geçiciyse.<br>4.8 Müşterinin sözleşmeye veya yasal geri çekilme hakları, Nanodrag tarafından belirlenen makul bir süre içinde kullanılmadığı takdirde geçersiz olur."
                },
                {
                    "title": "5. Nakliye, Riskin Geçişi",
                    "body": "5.1 Aksi açıkça kararlaştırılmadıkça, nakliye her zaman müşterinin riski altındadır. Risk, malların nakliye için görevlendirilen kişiye teslim edilmesiyle müşteriye geçer.<br>5.2 Müşterinin neden olduğu gecikmeler nedeniyle nakliye gecikirse, malların tesadüfi kaybı, hasarı veya bozulması riski, nakliye hazır olduğunun bildirilmesiyle müşteriye geçer. Risk geçtikten sonra ortaya çıkan depolama maliyetleri müşteriye aittir. Diğer talepler saklıdır.<br>5.3 Müşteri kabul etmeme durumuna düşerse, Nanodrag, gecikmeden kaynaklanan masrafların tazminini talep etme hakkına sahiptir. Bu durumda da, tesadüfi kayıp, hasar veya bozulma riski müşteriye geçer."
                },
                {
                    "title": "6. Ödeme",
                    "body": "6.1 Ödeme, fatura tarihinden itibaren 30 gün içinde tam olarak yapılmalıdır. Ödeme, Nanodrag'a vadesi gelmiş tutarın ulaşmasıyla gerçekleşmiş sayılır. Poliçeler ve çekler, ancak tahsil edildikten sonra ödeme olarak kabul edilir ve zamanında sunulma ve protesto kabulü yükümlülüğü olmaksızın kabul edilir.<br>6.2 Ödeme gecikmesi durumunda – veya müşteri HGB anlamında bir tüccar ise vade tarihinde – Nanodrag, daha yüksek gerçek gecikme zararını talep etme hakkına sahiptir.<br>6.3 Müşteri, yalnızca tartışmasız veya kesinleşmiş karşı taleplerle ödemeleri mahsup edebilir veya alıkoyabilir.<br>6.4 Müşterinin ödeme gecikmesi, bir poliçe protestosu bulunması veya müşterinin ödemelerini durdurması durumunda, Nanodrag'ın tüm talepleri derhal vadesi gelir, kabul edilmiş poliçelerin süresine bakılmaksızın. Bu durumlarda, Nanodrag, bekleyen teslimatları yalnızca ön ödeme veya güvence karşılığında yapma hakkına sahiptir. Bu iki hafta içinde yapılmazsa, Nanodrag sözleşmeden çekilebilir. Diğer talepler saklıdır."
                },
                {
                    "title": "7. Mülkiyetin Korunması",
                    "body": "7.1 Teslim edilen mallar, iş ilişkilerinden kaynaklanan tüm talepler tam olarak ödenene kadar Nanodrag'ın mülkiyetinde kalır.<br>7.2 Müşteri, mülkiyetin korunması altındaki malları, müşteriye ait diğer mallarla işleme, bağlama veya karıştırma yoluyla kullanırsa, Nanodrag, yeni nesne üzerinde mülkiyet hakkının bir kısmına sahip olur; bu, mülkiyetin korunması altındaki malın fatura değeri ile kullanılan diğer malların değeri arasındaki orana göre belirlenir. İşleme, bağlama veya karıştırma yoluyla müşteriye ait olmayan mallar nedeniyle mülkiyet hakkı sona ererse, müşteri, Nanodrag'a işleme, bağlama veya karıştırma yoluyla yeni nesne üzerinde sahip olduğu mülkiyet haklarını, mülkiyetin korunması altındaki malın fatura değerine kadar şimdiden devreder ve bunları Nanodrag için ücretsiz olarak saklar.<br>7.3 Müşteri, gecikmede olmadığı sürece, mülkiyetin korunması altındaki malları normal iş akışında yeniden satabilir, işleyebilir veya karıştırabilir. Mallar üzerinde başka tasarruflar yasaktır. Rehinler veya teminat devri yasaktır. Müşteri, üçüncü kişilerin mülkiyetin korunması altındaki mallara yönelik zorla icra işlemleri hakkında Nanodrag'ı derhal yazılı olarak bilgilendirmelidir. Müşteri, bu tür müdahalelerin kaldırılması ve malın geri alınması için yapılan tüm masrafları, üçüncü kişiler tarafından tazmin edilmedikçe karşılar.<br>7.4 Müşteri, mülkiyetin korunması altındaki malların yeniden satışından kaynaklanan tüm talepleri, mülkiyetin korunması altındaki malın fatura değerine kadar Nanodrag'a şimdiden devreder. Bu devir, mülkiyetin korunması altındaki mallarla aynı kapsamda teminat sağlar.<br>7.5 Müşteri, mülkiyetin korunması altındaki malları, Nanodrag'a ait olmayan diğer mallarla birlikte toplam bir fiyat üzerinden satarsa, müşteri, yeniden satıştan kaynaklanan talebini, mülkiyetin korunması altındaki malın payı oranında Nanodrag'a şimdiden devreder.<br>7.6 Devredilen talep bir cari hesaba dahil edilirse, müşteri, cari hesap ilişkisinden kaynaklanan talebini, orijinal olarak devredilen talep tutarına eşit olan miktarda Nanodrag'a devreder.<br>7.7 Müşteri, Nanodrag tarafından geri çekilene kadar devredilen talepleri tahsil etme hakkına sahiptir. Geri çekilme, müşterinin ödeme yükümlülüklerini düzgün bir şekilde yerine getirmemesi durumunda mümkündür. Geri çekilmeden sonra müşteri, talebin geçerli kılınması için gerekli tüm bilgileri Nanodrag'a sağlamalı, belgeleri teslim etmeli ve borçlulara devri bildirmelidir.<br>7.8 Nanodrag için mevcut teminatların gerçekleşebilir değeri, Nanodrag'ın tüm taleplerini %50'den fazla aşıyorsa, Nanodrag, müşterinin talebi üzerine, kendi seçimine bağlı olarak teminatları serbest bırakmakla yükümlüdür.<br>7.9 Nanodrag'ın mülkiyetin korunmasını ileri sürmesi, sözleşmeden çekilme olarak kabul edilmez; bu, ancak açıkça yazılı olarak beyan edilirse geçerlidir. Müşterinin mülkiyetin korunması altındaki mallar üzerindeki mülkiyet hakkı, müşterinin sözleşmesel yükümlülüklerini yerine getirmemesi durumunda sona erer."
                },
                {
                    "title": "8. Garanti",
                    "body": "8.1 Kusurlu olduğu iddia edilen mallar, orijinal ambalajında veya eşdeğer bir ambalajda Nanodrag'a inceleme için iade edilmelidir. Nanodrag, garanti talebi haklı ve garanti süresi içinde yapıldığında kusurları giderecektir. Nanodrag, kusurun onarılması için gerekli olan masrafları üstlenir; kusurun onarılması için onarım veya ikame teslimatı yapılıp yapılmayacağı Nanodrag'ın takdirindedir.<br>8.2 Nanodrag, yasal düzenlemelere uygun olarak kusurun giderilmesini reddetme hakkına sahiptir. Müşteri, Nanodrag'ın kusurlu malların iadesi talebine uymaması durumunda da kusurun giderilmesini reddedebilir.<br>8.3 Müşteri, yasal olarak öngörüldüğü ölçüde sözleşmeden çekilme veya fiyat indirimi hakkına sahiptir. Ancak müşteri, Nanodrag'a iki kez makul bir süre tanıdıktan sonra ve bu süreler başarısız olduktan sonra sözleşmeden çekilme veya indirim hakkına sahiptir; süre belirleme gerekmiyorsa bu geçerli değildir. Sözleşmeden çekilme durumunda, müşteri, kasıtlı veya ihmalkar hasarlar ve malın kullanılmamasından kaynaklanan zararlar için sorumludur.<br>8.4 Nanodrag, bir kusuru kötü niyetle gizlemişse veya BGB madde 444'e göre bir kalite garantisi üstlenmişse, müşterinin hakları yalnızca yasal düzenlemelere tabidir.<br>8.5 Müşterinin tazminat veya masraf talebi varsa, bu talepler bu Genel İşletme Koşullarının 9. bölümündeki düzenlemelere tabidir.<br>8.6 Nanodrag ürünlerine ilişkin bilgiler, özellikle tekliflerde ve broşürlerdeki resimler, çizimler, ağırlık, boyut ve performans bilgileri ortalama değerler olarak anlaşılmalıdır. Bu tür bilgiler, özellikleri taahhüt etmez; yalnızca ürünlerin tanımlanması veya nitelendirilmesi amacıyla kullanılır.<br>8.7 Siparişte açıkça sapma toleransları kararlaştırılmamışsa, ticari sapmalar kabul edilebilir.<br>8.8 Normal aşınma nedeniyle ortaya çıkan kusurlar için Nanodrag sorumluluk kabul etmez. Daha düşük kalite veya kullanılmış mal olarak satılan ürünler için Nanodrag'a karşı kusur talepleri yoktur.<br>8.9 Garanti, işletme veya bakım talimatlarına uyulmaması, teslimat veya hizmetlerde değişiklik yapılması, parçaların değiştirilmesi veya orijinal Nanodrag spesifikasyonlarına uymayan malzemelerin kullanılması durumunda geçersiz olur; müşteri, kusurun bununla ilgili olmadığını kanıtlamadığı sürece.<br>8.10 Müşteri tüccar ise, kusurları yazılı olarak veya faksla bildirmelidir.<br>8.11 Kusur talepleri için zamanaşımı süresi 12 aydır (tüketiciler için 24 ay). Bu, hayat, beden veya sağlık zararları için tazminat talepleri ve Nanodrag'ın sorumluluğunda olan kusurlardan kaynaklanan tazminat talepleri için geçerli değildir; ayrıca kasıtlı veya ağır ihmal nedeniyle ortaya çıkan tazminat talepleri için de geçerli değildir."
                },
                {
                    "title": "9. Sorumluluk Sınırlaması",
                    "body": "9.1 Sözleşmesel yükümlülüklerin ihlali, kusurlu teslimat veya haksız fiil nedeniyle Nanodrag'ın sorumluluğu – diğer sözleşmesel veya yasal sorumluluk şartları saklı kalmak kaydıyla – yalnızca kasıt veya ağır ihmal durumunda veya basit ihmal durumunda, önemli bir sözleşmesel yükümlülüğün ihlal edilmesi durumunda (sözleşmenin amacını tehlikeye atan bir yükümlülük). Basit ihmal durumunda, Nanodrag'ın sorumluluğu, önceden öngörülebilir, sözleşmeye özgü zararlarla sınırlıdır.<br>9.2 Basit ihmal nedeniyle gecikmeli teslimat nedeniyle Nanodrag'ın sorumluluğu, anlaşmaya varılan satın alma fiyatının %5'i ile sınırlıdır.<br>9.3 Bölüm 9.1 – 9.2'de belirtilen sorumluluk hariç tutmaları ve sınırlamaları, BGB madde 444'e göre bir kalite garantisi durumunda (bölüm 9.4'e bakınız), kötü niyetle kusurun gizlenmesi durumunda, hayat, beden veya sağlık zararları için ve yasal olarak zorunlu, değiştirilemeyen ürün sorumluluğu durumunda geçerli değildir.<br>9.4 Nanodrag'a karşı tüm talepler – hangi yasal nedene dayanırsa dayansın – zamanaşımı süresi 12 aydır (tüketiciler için 24 ay) ve teslimattan itibaren başlar. Haksız fiil talepleri için zamanaşımı süresi 12 aydır (tüketiciler için 24 ay) ve müşteri, talep oluşturan koşullar ve sorumlu kişiyi öğrendiği veya öğrenmesi gerektiği andan itibaren başlar. Bu düzenleme, kasıtlı veya ağır ihmal nedeniyle ortaya çıkan yükümlülük ihlalleri ve bölüm 9.3'te belirtilen durumlar için geçerli değildir.<br>9.5 Müşteri aracı ise ve nihai satış bir tüketiciye yapılırsa, müşterinin Nanodrag'a karşı geri çekilme talepleri için yasal zamanaşımı süreleri geçerlidir."
                },
                {
                    "title": "10. Ticari Koruma Hakları ve Telif Hakları",
                    "body": "10.1 Müşteri, Nanodrag tarafından teslim edilen ürünlerin veya hizmetlerin sözleşmeye uygun kullanımı nedeniyle bir ticari koruma hakkı veya telif hakkının ihlali nedeniyle sorumlu tutulursa, Nanodrag, müşteriye kullanım hakkını sağlamayı taahhüt eder; müşteri, bu tür üçüncü taraf talepleri hakkında Nanodrag'ı derhal yazılı olarak bilgilendirir ve Nanodrag'a tüm savunma önlemlerini – hem yasal hem de yasal olmayan – saklı tutar. Sözleşmeye uygun kullanımın makul koşullar altında sürdürülmesi mümkün değilse, Nanodrag, ihlali ortadan kaldırmak için teslimatı veya hizmeti değiştirme veya değiştirme veya teslimatı veya hizmeti geri alma ve kullanım indirimi ile birlikte satın alma fiyatını iade etme hakkına sahiptir.<br>10.2 Müşterinin, Nanodrag'ın önemli sözleşmesel yükümlülüklerini kasıtlı veya ağır ihmalle ihlal etmemesi durumunda, ticari koruma hakları veya telif haklarının ihlali nedeniyle müşterinin başka talepleri yoktur. Bölüm 10.1'de belirtilen sorumluluk, özellikle teslimat veya hizmetin sözleşmeye uygun olmayan kullanımı veya Nanodrag tarafından teslim edilmeyen diğer ürünler veya hizmetlerle kombinasyonu nedeniyle ihlal edilmesi durumunda geçerli değildir."
                },
                {
                    "title": "11. Gizlilik",
                    "body": "11.1 Yazılı olarak açıkça farklı kararlaştırılmadıkça, müşteriye Nanodrag ile siparişler bağlamında iletilen bilgiler, gizli olarak kabul edilmez; gizli karakteri bariz değilse.<br>11.2 Nanodrag, sözleşme ilişkisi bağlamında kişisel verilerin saklandığını ve Nanodrag grubundaki bağlı şirketlere iletilebileceğini belirtir."
                }
            ]
        },
        FR: {
            pageTitle: 'Conditions Générales de Vente',
            metaDescription: 'Lisez les Conditions Générales Complètes de NanoDrag, y compris les définitions légales, la tarification, les garanties et les clauses de responsabilité.',
            heroTitle: 'Conditions Générales de Vente',
            sections: [
                {
                    "title": "Termes",
                    "body": "<strong>Nanodrag</strong> désigne la société Nanodrag Technology GmbH ou une de ses filiales, qui fournit des biens ou des services en tant que vendeur.<br><strong>Client</strong> désigne la personne physique ou morale ou toute autre partie contractante qui conclut un contrat avec le vendeur.<br><strong>Contrat</strong> désigne la commande contractuelle passée pour l'achat de biens ou de services."
                },
                {
                    "title": "1. Dispositions Générales",
                    "body": "1.1 Toutes les livraisons de biens et de services effectuées par Nanodrag en tant que vendeur au client sont soumises aux présentes Conditions Générales de Vente, sauf accord contraire explicite. Les conditions générales du client qui diffèrent de celles-ci ne sont valables qu'avec l'approbation écrite de Nanodrag.<br>1.2 Les réclamations du client contre Nanodrag ne peuvent être cédées à des tiers. L'article 354a du HGB n'est pas affecté.<br>1.3 La vente, la revente et l'élimination des biens et services peuvent être soumises aux lois d'exportation allemandes, de l'UE et des États-Unis ainsi qu'à d'autres lois nationales. La revente vers des pays sous embargo ou à des personnes ou entités interdites, ou à des personnes qui utilisent ou pourraient utiliser les biens à des fins militaires, des armes NBC ou de la technologie nucléaire, est soumise à une autorisation officielle. Le client déclare, par la présente commande, qu'il se conformera à ces lois et règlements et que les biens ne seront pas livrés directement ou indirectement à des pays qui interdisent ou restreignent l'importation, ni à des personnes qui utilisent ou pourraient utiliser les biens à des fins militaires, des armes NBC ou de la technologie nucléaire. Le client déclare qu'il a obtenu toutes les autorisations nécessaires pour l'exportation et l'importation."
                },
                {
                    "title": "2. Informations et Conseils",
                    "body": "Les informations et conseils concernant les biens et services de Nanodrag sont fournis au mieux des connaissances et de l'expérience actuelles. Toutes les valeurs indiquées, en particulier les données de performance, sont des valeurs moyennes déterminées dans des conditions de laboratoire standard. Nanodrag ne garantit pas que les produits correspondent exactement aux valeurs ou aux domaines d'application indiqués. Les questions de responsabilité sont régies par la section 10 des présentes conditions."
                },
                {
                    "title": "3. Prix",
                    "body": "3.1 Seuls les prix indiqués dans la confirmation de commande de Nanodrag sont valables. Les services supplémentaires sont facturés séparément.<br>3.2 Tous les prix sont des prix nets et n'incluent pas la TVA légale ; celle-ci est un montant que le client doit payer en sus au taux légal.<br>3.3 Sauf accord contraire explicite, les prix sont valables à partir de l'usine de la société Nanodrag utilisant ces conditions (EXW INCOTERMS 2010). Le client paie tous les frais supplémentaires de transport, d'emballage, de taxes publiques (y compris la retenue à la source) et de douane au-delà de l'emballage standard."
                },
                {
                    "title": "4. Livraison",
                    "body": "4.1 Sauf accord contraire explicite, Nanodrag effectue la livraison à partir de l'usine de la société Nanodrag utilisant ces conditions (EXW INCOTERMS 2010).<br>4.2 Les délais de livraison ne sont contraignants que s'ils ont été expressément convenus par écrit. Les délais commencent à partir de la date de la confirmation de commande de Nanodrag, mais ne commencent jamais avant que tous les détails relatifs à la commande, y compris la fourniture des autorisations officielles nécessaires, n'aient été clarifiés. Le délai de livraison est considéré comme respecté même si les marchandises ne peuvent pas être expédiées à temps.<br>4.3 Sauf pour les délais de livraison expressément fixés, le client doit accorder à Nanodrag un délai supplémentaire raisonnable deux semaines après l'expiration du délai de livraison."
                },
                {
                    "title": "5. Transport, Transfert de Risque",
                    "body": "5.1 Sauf accord contraire explicite, le transport est toujours aux risques du client. Le risque est transféré au client lorsque les marchandises sont remises à la personne chargée du transport.<br>5.2 Si le transport est retardé pour des raisons imputables au client, le risque de perte, de dommage ou de détérioration fortuite des marchandises est transféré au client dès que Nanodrag informe le client que les marchandises sont prêtes pour l'expédition. Les coûts de stockage survenant après le transfert du risque sont à la charge du client. Les autres réclamations restent réservées.<br>5.3 Si le client se trouve dans une situation de refus d'acceptation, Nanodrag a le droit de réclamer une indemnisation pour les frais résultant du refus d'acceptation."
                },
                {
                    "title": "6. Paiement",
                    "body": "6.1 Le paiement doit être effectué intégralement dans les 30 jours suivant la date de facturation. Le paiement est considéré comme effectué lorsque le montant dû parvient à Nanodrag. Les lettres de change et les chèques ne sont considérés comme un paiement qu'après encaissement et sont acceptés sans obligation de présentation ou d'acceptation en temps voulu.<br>6.2 En cas de retard de paiement, Nanodrag se réserve le droit de facturer des intérêts de retard au taux légal en vigueur. Les frais de recouvrement sont à la charge du client."
                },
                {
                    "title": "7. Responsabilité",
                    "body": "7.1 La responsabilité de Nanodrag est limitée aux dommages directs et prévisibles résultant d'une violation des obligations contractuelles. Nanodrag n'est pas responsable des dommages indirects, consécutifs ou accessoires, y compris, mais sans s'y limiter, la perte de profits, la perte d'exploitation ou la perte de données.<br>7.2 En cas de responsabilité de Nanodrag, celle-ci est limitée au montant total payé par le client pour les marchandises concernées, sauf en cas de faute intentionnelle ou de négligence grave de la part de Nanodrag."
                },
                {
                    "title": "8. Dispositions Finales",
                    "body": "8.1 Les présentes conditions générales de vente et toutes les relations entre Nanodrag et le client sont régies par le droit allemand, à l'exclusion de la Convention des Nations Unies sur les contrats de vente internationale de marchandises (CVIM).<br>8.2 Si une disposition des présentes conditions générales de vente est ou devient invalide ou inapplicable, cela n'affectera pas la validité des autres dispositions. La disposition invalide ou inapplicable sera remplacée par une disposition valide et applicable qui se rapproche le plus de l'intention économique de la disposition invalide ou inapplicable."
                },
                {
                    "title": "9. Juridiction Compétente",
                    "body": "Le tribunal compétent pour tous les litiges découlant de ou en relation avec les présentes conditions générales de vente est, si le client est un commerçant, le siège social de Nanodrag. Nanodrag a également le droit d'intenter une action contre le client à son siège social."
                },
                {
                    "title": "10. Protection des Données",
                    "body": "10.1 Sauf accord écrit contraire, les informations transmises au client dans le cadre des commandes avec Nanodrag ne sont pas considérées comme confidentielles, à moins que leur caractère confidentiel ne soit évident.<br>10.2 Nanodrag indique que des données personnelles sont stockées dans le cadre de la relation contractuelle et peuvent être transmises aux sociétés affiliées du groupe Nanodrag."
                },
                {
                    "title": "11. Confidentialité",
                    "body": "11.1 Sauf accord écrit contraire, les informations transmises au client dans le cadre des commandes avec Nanodrag ne sont pas considérées comme confidentielles, à moins que leur caractère confidentiel ne soit évident.<br>11.2 Nanodrag indique que des données personnelles sont stockées dans le cadre de la relation contractuelle et peuvent être transmises aux sociétés affiliées du groupe Nanodrag."
                }
            ]
        }
    };




    const langContent = content[lang] || content.EN;

    Product.find()
        .then(products => {
            res.render('customer/tearmCondition', {
                ...langContent,
                path: '/TermCondition',
                products,
                lang
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};

exports.getPrivacyPolicy = (req, res, next) => {
    const supportedLangs = allanguages;
    const rawLang = req.params.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';
    Product.find()
        .then(products => {
            const privacyPolicyContent = {
                EN: {
                    pageTitle: "Privacy Policy",
                    metaDescription: "Read DragLab's Data Protection and Privacy Policy. Learn how we collect, use, and protect your information.",
                    dataPolicyTitle: "Data Protection Policy",
                    status: "Status:",
                    statusDate: "02 - Last Updated: June 2025",
                    contactInfo: `
                            The responsible body, i.e. the data controller, within the meaning of the data protection laws
                            is:
                            <br>
                            NanoDrag Technology GmbH<br>
                             Alfred-Herrhausen-Allee 3-5<br>
                             D-65760 Eschborn Germany<br>
                            Tel: +49 6196 400816<br>
                            Fax: +49 6196 400910<br>
                            <span class="highlighted">Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a> <br>
                                Website: <a href="https://www.drag-lab.de">www.drag-lab.de</a><br></span>
                            Head office: Eschborn<br>
                            Registration court: Amtsgericht Eschborn - HRB 97258<br>
                            Legal Form: Gesellschaft mit Beschränkter Haftung<br>
                            Trade Register: Eschborn HRB 97258<br>
                            Place of Registration: Eschborn<br>
                           Alfred-Herrhausen-Allee 3-5<br>
                             D-65760 Eschborn Germany<br>
    `,
                    sections: [
                        {
                            title: "1. The collection of general information",
                            body: `When you visit our website, certain general information is automatically collected and stored in server log files. This may include:

                    <ul>
                        <li>
                            Browser type and version
                        </li>
                        <li>
                            Operating system used
                        </li>
                        <li>
                            Referrer URL
                        </li>
                        <li>
                            Host name of the accessing computer (IP address)
                        </li>
                        <li>
                            Date and time of the server request
                        </li>
                        <li>
                            Other similar data required for secure and stable website operation
                        </li>
                    </ul>
                    <br>
                    This information is technically necessary to ensure a smooth connection setup, system security, and proper delivery of our website content.

                    Although this data does not directly identify a specific individual, it may qualify as personal data under applicable data protection laws.

                    Legal basis: The processing of this data is based on Art. 6(1)(f) GDPR. Our legitimate interest lies in maintaining the functionality, security, and optimization of our website.

                    Storage duration: Log data is stored temporarily and automatically deleted after a maximum of 14 days, unless longer retention is required for security or legal purposes.`
                        },
                        {
                            title: "2. Cookies",
                            body: `   We use cookies on our website. Cookies are small text files that are stored on your device when you visit our site.
    They help us provide, improve, and personalize our services. <br>

    We differentiate between:
    <ul>
        <li>
            <span class="text-bold">Essential cookies:</span> Required for the basic functioning of the website (e.g. language
            settings, session management).

        </li>
        <li>
            <span class="text-bold">Analytics cookies:</span> Used to collect anonymized data on how users interact with the site
            (e.g. Google Analytics).

        </li>
        <li>
            <span class="text-bold">Marketing cookies:</span> Used by third parties to display personalized ads or track user
            behavior across websites.

        </li>
    </ul>
    <br>
  <span class="text-bold">Legal basis:</span>
    <br>
    <ul>
        <li>
            Essential cookies are processed based on our legitimate interest in ensuring the website’s functionality
            (Art.
            6(1)(f) GDPR).
        </li>
        <li>
            All other cookies (analytics, marketing) are processed only with your explicit consent (Art. 6(1)(a) GDPR),
            which
            you provide via our cookie banner.
        </li>
    </ul>





    You can manage or withdraw your consent at any time through the cookie settings link at the bottom of our website.

    Most browsers accept cookies by default. You can configure your browser to reject cookies or notify you before they
    are set. However, disabling cookies may affect the full functionality of this website.

    For more information, please see our [Cookie Policy].`
                        },

                        {
                            title: "3. Newsletter",
                            body: `If you subscribe to our newsletter, we will use the personal data you provide (typically your email address) exclusively to send you information about our company, products, services, and updates.
 <br>
 <span class="text-bold"> Subscription process: </span> <br>
We use a double opt-in procedure to verify your identity. After entering your email address, you will receive a confirmation email with a link to finalize your subscription. Only after confirmation will you be added to our mailing list.
 <br>
<span class="text-bold"> Legal basis: </span> <br>
The processing of your data is based on your consent (Art. 6(1)(a) GDPR). You can withdraw your consent at any time with effect for the future by clicking the unsubscribe link in any newsletter or contacting us directly at <a class="highlighted" href="mailto:info@drag-lab.de">info@drag-lab.de</a>.
 <br>
 <span class="text-bold"> Data storage & third-party services: </span> <br>
Your data is stored securely and will not be shared with third parties, except where we use an email service provider (e.g. Mailchimp, Brevo). These providers process data only on our behalf and in accordance with data protection agreements.
 <br>
 <span class="text-bold"> Optional analytics (if used): </span> <br>
Our newsletters may contain tracking pixels to help us understand user engagement. You can opt out at any time by unsubscribing.
`
                        },
                        {
                            title: "4. Data Collected Through Forms",
                            body: `Our website offers several forms through which you can contact us, request technical support, or register your
    product warranty. When you use these forms, we collect the personal data you provide in order to respond to your
    inquiry or process your request.
    <br>
    <span class="text-bold">The types of data collected may include:</span>
    <ul>
        <li>
            <span class="text-bold">Contact Form:</span> First name, last name, email address, subject, and message
        </li>
        <li>
            <span class="text-bold">Technical Support Form:</span> Contact type (individual/company), company name,
            department, salutation, full name, address details, phone, fax, email, date of failure, device category and
            model, serial number, and description of the issue
        </li>
        <li>
            <span class="text-bold">Warranty Registration Form:</span> Name, email address, date of purchase,
            device category and model, serial number, technical concern, and additional message
        </li>
    </ul>

    <span class="text-bold">Purpose of processing:</span>
    We use the data solely to process your inquiry, provide customer support, and manage warranty or service-related
    follow-ups.
    <br>
    <span class="text-bold">Legal basis:</span>
    Processing is carried out either:
    <ul>
        <li>
            Based on your consent (Art. 6(1)(a) GDPR), given when you submit the form; or
        </li>
        <li>
            Where applicable, for the performance of a contract or pre-contractual measures (Art. 6(1)(b) GDPR).
        </li>
    </ul>

    <br>
    <span class="text-bold">Data retention:</span>
    We retain your data only for as long as necessary to fulfill the purpose of the request, unless statutory retention
    obligations apply (e.g. legal, warranty, or tax-related documentation requirements).
    <br>
    <span class="text-bold"></span>Third-party processors:</span>
    Your data may be processed by authorized employees of DragLab or trusted service providers (e.g. hosting, email, or
    CRM platforms) bound by data protection agreements and confidentiality.`
                        }, {
                            title: "5. Use of Microsoft Clarity",
                            body: `
We use Microsoft Clarity, a user behavior analytics tool provided by: <br>

<span class="text-bold">Microsoft Corporation</span><br>
<span class="text-bold">One Microsoft Way, Redmond, WA 98052-6399, USA</span><br>

Clarity uses cookies and similar technologies to collect and process usage data such as mouse movements, page scrolls, click behavior, device information, and referring URLs. This helps us understand how users interact with our website and improve its usability and content structure. <br>

Microsoft may use the collected data for its own business purposes, as described in the <a class="highlighted" href="https://privacy.microsoft.com/" class="highlighted">Microsoft Privacy Statement</a>.

<span class="text-bold">Legal basis:</span>
The use of Microsoft Clarity is based on your consent under Art. 6(1)(a) GDPR, which you provide through our cookie banner. You may withdraw your consent at any time via the cookie settings link at the bottom of our site.

<span class="text-bold">Data transfer:</span>
Data may be transferred to servers in the United States. Microsoft is certified under the EU-U.S. Data Privacy Framework.

<span class="text-bold">Opt-out:</span>
You can control the collection of data by configuring your browser settings or managing your cookie preferences on our website.


`
                        },
                        {
                            title: "6. Use of Google Analytics",
                            body: `
This website uses Google Analytics, a web analytics service provided by: <br>

<span class="text-bold">Google Ireland Limited</span><br>
Gordon House, Barrow Street<br>
Dublin 4, Ireland<br>

Google Analytics uses cookies to analyze how users interact with our website. The information generated (e.g. IP address, user behavior, browser type) is generally transferred to a Google server in the United States and stored there. We have enabled IP anonymization on this website, which means that your IP address will be shortened within the European Union before being transmitted to Google. <br>

Google processes this data on our behalf under a data processing agreement (as per Art. 28 GDPR). You can learn more about how <a class="highlighted" href="https://policies.google.com/privacy">Google handles personal data here</a>
<br>
<span class="text-bold">Legal basis:</span> <br>
Analytics cookies and the use of Google Analytics are based on your explicit consent (Art. 6(1)(a) GDPR), which you provide through our cookie banner. You can withdraw your consent at any time via the [cookie settings] on our site.
<br>
<span class="text-bold">Retention:</span><br>
User-level and event-level data associated with cookies and user identifiers is retained for a maximum of 14 months, after which it is automatically deleted.
<br>
<span class="text-bold">Opt-out options:</span><br>
You can:<br>    

<ul>
    <li>
        Withdraw consent via our cookie settings        
    </li>
    <li>
        Install the official browser plugin: Google Analytics Opt-out Add-on
    </li>
    <li>
        Set your browser to block cookies
    </li>
</ul>

`
                        },
                        {
                            title: "7. Use of Google Ads Conversion Tracking",
                            body: `
    Our website uses the conversion tracking feature of Google Ads, a service provided by: <br>

<span class="text-bold"> Google Ireland Limited </span> <br>
Gordon House, Barrow Street<br>
Dublin 4, Ireland<br>

When you click on an ad served by Google, a cookie is placed on your device. This cookie enables us to track conversions — for example, whether you completed a form or visited a specific page. These cookies expire after 30 days and do not contain personally identifiable information.<br>

However, if you visit certain pages while the cookie is active, Google and we may recognize that you clicked on an ad and were redirected to our site. This allows Google to compile conversion statistics for us (e.g. total number of conversions). We do not receive any data that personally identifies users.

<span class="text-bold">Legal basis:</span><br>
The use of Google Ads and conversion tracking cookies is based on your explicit consent (Art. 6(1)(a) GDPR), provided through our cookie banner.

<span class="text-bold"></span>Data sharing and profiling:</span><br>
Google may associate your data with your Google account if you are signed in and may use it for personalized advertising purposes in accordance with their <a class="highlighted" href="https://policies.google.com/privacy">privacy policy </a> <br>

<span class="text-bold">Withdrawal and Opt-out:</span><br>
You can:
<ul>
    <li>
        Withdraw consent at any time through our [cookie settings]
    </li>
    <li>
        Disable interest-based advertising via your Google Ads settings
    </li>
    <li>
        Block cookies from the domain googleadservices.com in your browser
    </li>
</ul>
`
                        },
                        {
                            title: "8. Your Data Protection Rights",
                            body: `As a data subject under the General Data Protection Regulation (GDPR), you have the following rights with regard to your personal data:
<ul>
    <li>
      <span class="text-bold">Right of access (Art. 15 GDPR):</span> You have the right to request information about the personal data we hold about you.        
    </li>
    <li>
       <span class="text-bold">Right to rectification (Art. 16 GDPR):</span> You may request correction of inaccurate or incomplete personal data.
    </li>
    <li>
      <span class="text-bold"> Right to erasure (Art. 17 GDPR):</span> You may request the deletion of your personal data, provided there is no legal obligation for us to retain it.
    </li>
    <li>
       <span class="text-bold">Right to restriction of processing (Art. 18 GDPR):</span> You may request that we restrict the processing of your data under certain conditions.
    </li>
    <li>
       <span class="text-bold">Right to data portability (Art. 20 GDPR):</span> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit it to another controller.
    </li>
    <li>
       <span class="text-bold">Right to object (Art. 21 GDPR):</span> You may object to the processing of your personal data where processing is based on legitimate interests.
    </li>
    <li>
       <span class="text-bold">Right to withdraw consent (Art. 7(3) GDPR):</span> If processing is based on your consent, you may withdraw it at any time with future effect.
    </li>
</ul>
To exercise your rights, please contact our Data Protection Officer at: <br>
Email: <a class="highlighted" href="mailto:info@drag-lab.de">info@drag-lab.de</a> <br>
We may require verification of your identity before processing your request. <br>

You also have the right to lodge a complaint with a supervisory authority, such as: <br>
<a class="highlighted" href="https://datenschutz.hessen.de/">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</a>


`
                        },
                        {
                            title: "9. Changes to our Data Protection Policy",
                            body: `We may update this Privacy Policy from time to time to reflect changes in legal requirements, our services, or how we process personal data. <br>

When we make changes, we will update the “Effective Date” at the top of this page. If the changes are material, we may also notify you by prominently posting a notice on our website or, where appropriate, via email. <br>

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your personal data. <br>

The current version of this Privacy Policy is always available at <a class="highlighted" href="https://www.drag-lab.de/EN/PrivacyPolicy">privacy policy </a>`
                        },
                        {
                            title: "10.  Contacting Our Data Protection Officer",
                            body: `
                            If you have any questions regarding the processing of your personal data or wish to exercise your data protection rights, you may contact our Data Protection Officer directly: <br>

           <span class="text-bold">Data Protection Officer</span><br>
             <span class="text-bold"> DragLab Technology GmbH</span><br>
                            Email: <a class="highlighted" href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>

                You may also lodge a complaint with the relevant data protection supervisory authority: <br>

           <a class="highlighted" href="https://datenschutz.hessen.de/">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</a>   <br>
               <span class="text-bold"> Postal Address: </span> Postfach 3163, 65021 Wiesbaden, Germany <br>

                            If you have any questions regarding data protection, please contact:

                            Data Protection Officer of Nanodrag Technology GmbH<br>

                            You also have the right to contact the responsible supervisory authority at any time.`
                        }









                    ]
                },


                ES: {
                    pageTitle: "Política de Privacidad",
                    metaDescription: "Lea la política de privacidad de DragLab y descubra cómo recopilamos, usamos y protegemos su información.",
                    dataPolicyTitle: "Política de Protección de Datos",
                    status: "Estado:",
                    statusDate: "02 - Última actualización: junio de 2025",
                    contactInfo: `
                    DragLab Technology GmbH<br>
                    Mergenthalerallee 10-12<br>
                    D-65760 Eschborn, Alemania<br>
                    Tel: +49 6196 400816<br>
                    Fax: +49 6196 400910<br>
                    Correo electrónico: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>
                    Sitio web: <a href="https://www.drag-lab.de">www.drag-lab.de</a><br>
                    Oficina central: Eschborn<br>
                    Registro mercantil: Amtsgericht Eschborn - HRB 97258<br>
                    Forma jurídica: Sociedad de responsabilidad limitada (GmbH)<br>
                    Registro comercial: Eschborn HRB 97258<br>
                    Lugar de registro: Eschborn<br>
                    `,
                    sections: [
                        {
                            "title": "1. Recopilación de información general",
                            "body": "Cuando visitas nuestro sitio web, cierta información general se recopila y almacena automáticamente en archivos de registro del servidor. Esto puede incluir:\n<ul>\n<li>Tipo y versión del navegador</li>\n<li>Sistema operativo utilizado</li>\n<li>URL de referencia</li>\n<li>Nombre del host del ordenador que accede (dirección IP)</li>\n<li>Fecha y hora de la solicitud del servidor</li>\n<li>Otros datos similares necesarios para el funcionamiento seguro y estable del sitio web</li>\n</ul>\n<br>\nEsta información es técnicamente necesaria para garantizar una conexión fluida, la seguridad del sistema y la entrega adecuada del contenido del sitio.\n<br>\nAunque estos datos no identifican directamente a una persona específica, pueden considerarse datos personales según la legislación de protección de datos aplicable.\n<br><br>\n<strong>Base legal:</strong> El tratamiento de estos datos se basa en el Art. 6(1)(f) del RGPD. Nuestro interés legítimo radica en mantener la funcionalidad, seguridad y optimización de nuestro sitio web.\n<br><br>\n<strong>Duración del almacenamiento:</strong> Los datos de registro se almacenan temporalmente y se eliminan automáticamente después de un máximo de 14 días, a menos que se requiera una retención más prolongada por motivos de seguridad o legales."
                        },
                        {
                            "title": "2. Cookies",
                            "body": "Utilizamos cookies en nuestro sitio web. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio. Nos ayudan a ofrecer, mejorar y personalizar nuestros servicios.\n<br><br>\nDistinguimos entre:\n<ul>\n<li><span class=\"text-bold\">Cookies esenciales:</span> Requeridas para el funcionamiento básico del sitio web (por ejemplo, configuración de idioma, gestión de sesiones).</li>\n<li><span class=\"text-bold\">Cookies analíticas:</span> Utilizadas para recopilar datos anónimos sobre cómo los usuarios interactúan con el sitio (por ejemplo, Google Analytics).</li>\n<li><span class=\"text-bold\">Cookies de marketing:</span> Utilizadas por terceros para mostrar anuncios personalizados o rastrear el comportamiento del usuario en diferentes sitios web.</li>\n</ul>\n<br>\n<span class=\"text-bold\">Base legal:</span>\n<ul>\n<li>Las cookies esenciales se procesan en base a nuestro interés legítimo en garantizar la funcionalidad del sitio web (Art. 6(1)(f) RGPD).</li>\n<li>Las demás cookies (analíticas, marketing) se procesan solo con tu consentimiento explícito (Art. 6(1)(a) RGPD), que proporcionas a través de nuestro banner de cookies.</li>\n</ul>\n<br>\nPuedes gestionar o retirar tu consentimiento en cualquier momento mediante el enlace de configuración de cookies al final de nuestro sitio web.\n<br><br>\nLa mayoría de los navegadores aceptan cookies por defecto. Puedes configurar tu navegador para rechazarlas o notificarte antes de que se almacenen. Sin embargo, desactivar las cookies puede afectar la funcionalidad total del sitio.\n<br><br>\nPara más información, consulta nuestra [Política de Cookies]."
                        },
                        {
                            "title": "3. Boletín informativo",
                            "body": "Si te suscribes a nuestro boletín informativo, utilizaremos los datos personales que proporciones (normalmente tu dirección de correo electrónico) exclusivamente para enviarte información sobre nuestra empresa, productos, servicios y actualizaciones.\n<br><br>\n<span class=\"text-bold\">Proceso de suscripción:</span>\n<br>\nUtilizamos un procedimiento de doble confirmación (double opt-in) para verificar tu identidad. Después de introducir tu correo electrónico, recibirás un mensaje con un enlace de confirmación para finalizar tu suscripción. Solo después de confirmar serás añadido a nuestra lista de correo.\n<br><br>\n<span class=\"text-bold\">Base legal:</span>\n<br>\nEl tratamiento de tus datos se basa en tu consentimiento (Art. 6(1)(a) RGPD). Puedes retirar tu consentimiento en cualquier momento con efecto futuro haciendo clic en el enlace de cancelación de suscripción o escribiendo a <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a>.\n<br><br>\n<span class=\"text-bold\">Almacenamiento de datos y servicios de terceros:</span>\n<br>\nTus datos se almacenan de forma segura y no se comparten con terceros, salvo que utilicemos un proveedor de servicios de correo electrónico (por ejemplo, Mailchimp, Brevo). Estos proveedores procesan los datos exclusivamente en nuestro nombre y bajo acuerdos de protección de datos.\n<br><br>\n<span class=\"text-bold\">Análisis opcional (si se utiliza):</span>\n<br>\nNuestros boletines pueden contener píxeles de seguimiento para ayudarnos a comprender la interacción del usuario. Puedes darte de baja en cualquier momento para desactivar este seguimiento."
                        }, {
                            "title": "4. Datos recopilados a través de formularios",
                            "body": "Nuestro sitio web ofrece varios formularios mediante los cuales puedes contactarnos, solicitar soporte técnico o registrar la garantía de tu producto. Al utilizarlos, recopilamos los datos personales que proporciones para responder a tu solicitud.\n<br><br>\n<span class=\"text-bold\">Los tipos de datos recopilados pueden incluir:</span>\n<ul>\n<li><span class=\"text-bold\">Formulario de contacto:</span> Nombre, apellidos, dirección de correo electrónico, asunto y mensaje</li>\n<li><span class=\"text-bold\">Formulario de soporte técnico:</span> Tipo de contacto (particular/empresa), nombre de la empresa, departamento, tratamiento, nombre completo, dirección, teléfono, fax, correo electrónico, fecha del fallo, categoría y modelo del dispositivo, número de serie y descripción del problema</li>\n<li><span class=\"text-bold\">Formulario de registro de garantía:</span> Nombre, dirección de correo electrónico, fecha de compra, categoría y modelo del dispositivo, número de serie, problema técnico y mensaje adicional</li>\n</ul>\n<br>\n<span class=\"text-bold\">Finalidad del tratamiento:</span>\nUtilizamos los datos únicamente para procesar tu solicitud, ofrecer soporte al cliente y gestionar el seguimiento relacionado con garantías o servicios.\n<br><br>\n<span class=\"text-bold\">Base legal:</span>\n<ul>\n<li>Basado en tu consentimiento (Art. 6(1)(a) RGPD), otorgado al enviar el formulario; o</li>\n<li>Cuando sea aplicable, para la ejecución de un contrato o medidas precontractuales (Art. 6(1)(b) RGPD).</li>\n</ul>\n<br><br>\n<span class=\"text-bold\">Conservación de datos:</span>\nConservamos tus datos únicamente el tiempo necesario para cumplir con la finalidad de la solicitud, salvo que existan obligaciones legales de retención (por ejemplo, requisitos legales, de garantía o fiscales).\n<br><br>\n<span class=\"text-bold\">Procesadores externos:</span>\nTus datos pueden ser tratados por empleados autorizados de DragLab o por proveedores de servicios de confianza (por ejemplo, alojamiento, correo electrónico o plataformas CRM) que estén sujetos a acuerdos de protección de datos y confidencialidad."
                        },
                        {
                            "title": "5. Uso de Microsoft Clarity",
                            "body": "Utilizamos Microsoft Clarity, una herramienta de análisis del comportamiento del usuario proporcionada por:<br><br>\n<span class=\"text-bold\">Microsoft Corporation</span><br>\n<span class=\"text-bold\">One Microsoft Way, Redmond, WA 98052-6399, USA</span><br><br>\nClarity utiliza cookies y tecnologías similares para recopilar y procesar datos de uso como movimientos del ratón, desplazamientos en la página, clics, información del dispositivo y URL de referencia. Esto nos ayuda a entender cómo los usuarios interactúan con nuestro sitio web y mejorar su usabilidad y estructura de contenido.\n<br><br>\nMicrosoft puede utilizar los datos recopilados para sus propios fines, como se describe en la <a class=\"highlighted\" href=\"https://privacy.microsoft.com/\">Declaración de privacidad de Microsoft</a>.\n<br><br>\n<span class=\"text-bold\">Base legal:</span>\nEl uso de Microsoft Clarity se basa en tu consentimiento según el Art. 6(1)(a) RGPD, otorgado a través de nuestro banner de cookies. Puedes retirar tu consentimiento en cualquier momento mediante el enlace de configuración de cookies al pie de nuestra web.\n<br><br>\n<span class=\"text-bold\">Transferencia de datos:</span>\nLos datos pueden ser transferidos a servidores en Estados Unidos. Microsoft está certificado bajo el Marco de Privacidad de Datos UE-EE.UU.\n<br><br>\n<span class=\"text-bold\">Opción de exclusión:</span>\nPuedes controlar la recopilación de datos configurando tu navegador o administrando tus preferencias de cookies en nuestro sitio web."
                        },
                        {
                            "title": "6. Uso de Google Analytics",
                            "body": "Este sitio web utiliza Google Analytics, un servicio de análisis web proporcionado por:<br><br>\n<span class=\"text-bold\">Google Ireland Limited</span><br>\nGordon House, Barrow Street<br>\nDublín 4, Irlanda<br><br>\nGoogle Analytics utiliza cookies para analizar cómo interactúan los usuarios con nuestro sitio web. La información generada (por ejemplo, dirección IP, comportamiento del usuario, tipo de navegador) generalmente se transfiere a un servidor de Google en Estados Unidos y se almacena allí.\n<br><br>\nHemos activado la anonimización de IP en este sitio web, lo que significa que tu dirección IP será acortada dentro de la Unión Europea antes de ser transmitida a Google.\n<br><br>\nGoogle procesa estos datos en nuestro nombre bajo un acuerdo de procesamiento de datos (según el Art. 28 RGPD). Puedes obtener más información sobre cómo <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">Google maneja los datos personales aquí</a>.\n<br><br>\n<span class=\"text-bold\">Base legal:</span>\nLas cookies analíticas y el uso de Google Analytics se basan en tu consentimiento explícito (Art. 6(1)(a) RGPD), otorgado mediante nuestro banner de cookies. Puedes retirar tu consentimiento en cualquier momento desde la [configuración de cookies] de nuestro sitio.\n<br><br>\n<span class=\"text-bold\">Retención:</span>\nLos datos a nivel de usuario y evento asociados con cookies e identificadores se retienen por un máximo de 14 meses, tras lo cual se eliminan automáticamente.\n<br><br>\n<span class=\"text-bold\">Opciones de exclusión:</span>\n<ul>\n<li>Retirar el consentimiento desde nuestra configuración de cookies</li>\n<li>Instalar el complemento oficial del navegador: Google Analytics Opt-out Add-on</li>\n<li>Configurar tu navegador para bloquear cookies</li>\n</ul>"
                        },
                        {
                            "title": "7. Uso del seguimiento de conversiones de Google Ads",
                            "body": "Nuestro sitio web utiliza la función de seguimiento de conversiones de Google Ads, un servicio proporcionado por:<br><br>\n<span class=\"text-bold\">Google Ireland Limited</span><br>\nGordon House, Barrow Street<br>\nDublín 4, Irlanda<br><br>\nCuando haces clic en un anuncio servido por Google, se coloca una cookie en tu dispositivo. Esta cookie nos permite rastrear conversiones, por ejemplo, si completaste un formulario o visitaste una página específica. Estas cookies expiran después de 30 días y no contienen información personal identificable.\n<br><br>\nSin embargo, si visitas ciertas páginas mientras la cookie está activa, Google y nosotros podemos reconocer que hiciste clic en un anuncio y fuiste redirigido a nuestro sitio. Esto permite a Google compilar estadísticas de conversión (por ejemplo, número total de conversiones). No recibimos ningún dato que identifique personalmente a los usuarios.\n<br><br>\n<span class=\"text-bold\">Base legal:</span><br>\nEl uso de Google Ads y las cookies de seguimiento de conversiones se basa en tu consentimiento explícito (Art. 6(1)(a) RGPD), otorgado mediante nuestro banner de cookies.\n<br><br>\n<span class=\"text-bold\">Compartición de datos y elaboración de perfiles:</span><br>\nGoogle puede asociar tus datos con tu cuenta de Google si has iniciado sesión y utilizarlos con fines publicitarios personalizados de acuerdo con su <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">política de privacidad</a>.\n<br><br>\n<span class=\"text-bold\">Retirada y exclusión:</span><br>\n<ul>\n<li>Retirar el consentimiento en cualquier momento desde nuestra [configuración de cookies]</li>\n<li>Desactivar la publicidad basada en intereses en la configuración de anuncios de tu cuenta de Google</li>\n<li>Bloquear cookies del dominio googleadservices.com en tu navegador</li>\n</ul>"
                        },
                        {
                            "title": "8. Tus derechos de protección de datos",
                            "body": "Como interesado bajo el Reglamento General de Protección de Datos (RGPD), tienes los siguientes derechos con respecto a tus datos personales:\n<ul>\n<li><span class=\"text-bold\">Derecho de acceso (Art. 15 RGPD):</span> Puedes solicitar información sobre los datos personales que tenemos sobre ti.</li>\n<li><span class=\"text-bold\">Derecho de rectificación (Art. 16 RGPD):</span> Puedes solicitar la corrección de datos personales inexactos o incompletos.</li>\n<li><span class=\"text-bold\">Derecho de supresión (Art. 17 RGPD):</span> Puedes solicitar la eliminación de tus datos personales, siempre que no exista una obligación legal de conservarlos.</li>\n<li><span class=\"text-bold\">Derecho a la limitación del tratamiento (Art. 18 RGPD):</span> Puedes solicitar que limitemos el tratamiento de tus datos bajo ciertas condiciones.</li>\n<li><span class=\"text-bold\">Derecho a la portabilidad de los datos (Art. 20 RGPD):</span> Tienes derecho a recibir tus datos personales en un formato estructurado, de uso común y lectura mecánica, y a transmitirlos a otro responsable.</li>\n<li><span class=\"text-bold\">Derecho de oposición (Art. 21 RGPD):</span> Puedes oponerte al tratamiento de tus datos cuando este se base en intereses legítimos.</li>\n<li><span class=\"text-bold\">Derecho a retirar el consentimiento (Art. 7(3) RGPD):</span> Si el tratamiento se basa en tu consentimiento, puedes retirarlo en cualquier momento con efecto futuro.</li>\n</ul>\n<br>\nPara ejercer tus derechos, por favor contacta a nuestro Delegado de Protección de Datos en:<br>\nCorreo electrónico: <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a><br>\nPodemos requerir la verificación de tu identidad antes de procesar tu solicitud.<br><br>\nTambién tienes derecho a presentar una reclamación ante una autoridad de control, como:<br>\n<a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">El Comisionado de Protección de Datos y Libertad de Información de Hesse</a>"
                        },
                        {
                            "title": "9. Cambios en nuestra política de protección de datos",
                            "body": "Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en los requisitos legales, nuestros servicios o cómo tratamos los datos personales.\n<br><br>\nCuando realicemos cambios, actualizaremos la \"Fecha de vigencia\" en la parte superior de esta página. Si los cambios son significativos, también podemos notificarte mediante un aviso destacado en nuestro sitio web o, si procede, por correo electrónico.\n<br><br>\nTe recomendamos revisar esta Política de Privacidad periódicamente para estar informado sobre cómo protegemos tus datos personales.\n<br><br>\nLa versión actual de esta Política de Privacidad está siempre disponible en <a class=\"highlighted\" href=\"https://www.drag-lab.de/ES/PrivacyPolicy\">política de privacidad</a>"
                        },
                        {
                            "title": "10. Contacto con nuestro delegado de protección de datos",
                            "body": "Si tienes alguna pregunta relacionada con el tratamiento de tus datos personales o deseas ejercer tus derechos de protección de datos, puedes contactar directamente con nuestro Delegado de Protección de Datos:<br><br>\n<span class=\"text-bold\">Delegado de Protección de Datos</span><br>\n<span class=\"text-bold\">DragLab Technology GmbH</span><br>\nCorreo electrónico: <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a><br><br>\nTambién puedes presentar una reclamación ante la autoridad de control competente:<br>\n<a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">El Comisionado de Protección de Datos y Libertad de Información de Hesse</a><br><br>\n<span class=\"text-bold\">Dirección postal:</span> Postfach 3163, 65021 Wiesbaden, Alemania<br><br>\nSi tienes alguna pregunta sobre protección de datos, por favor contacta con:\n<br>Delegado de Protección de Datos de Nanodrag Technology GmbH<br><br>\nTambién tienes derecho a contactar con la autoridad de control competente en cualquier momento."
                        }




                    ] // will fill below
                },

                DE: {
                    pageTitle: "Datenschutzerklärung",
                    metaDescription: "Lesen Sie die Datenschutzerklärung von DragLab und erfahren Sie, wie wir Ihre Informationen sammeln, verwenden und schützen.",
                    dataPolicyTitle: "Datenschutzerklärung",
                    status: "Status:",
                    statusDate: "02 - Letzte Aktualisierung: Juni 2025",
                    contactInfo: `
                    DragLab Technology GmbH<br>
                    Mergenthalerallee 10-12<br>
                    D-65760 Eschborn, Deutschland<br>
                    Tel: +49 6196 400816<br>
                    Fax: +49 6196 400910<br>
                    E-Mail: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>
                    Website: <a href="https://www.drag-lab.de">www.drag-lab.de</a><br>
                    Hauptsitz: Eschborn<br>
                    Handelsregister: Amtsgericht Eschborn - HRB 97258<br>
                    Rechtsform: Gesellschaft mit beschränkter Haftung (GmbH)<br>
                    Handelsregister: Eschborn HRB 97258<br>
                        Ort der Registrierung: Eschborn<br>
                    `,
                    sections: [
                        {
                            "title": "1. Erhebung allgemeiner Informationen",
                            "body": "Wenn Sie unsere Website besuchen, werden bestimmte allgemeine Informationen automatisch erfasst und in Server-Logdateien gespeichert. Dazu können gehören:\n<ul>\n<li>Browsertyp und -version</li>\n<li>Verwendetes Betriebssystem</li>\n<li>Referrer-URL</li>\n<li>Hostname des zugreifenden Rechners (IP-Adresse)</li>\n<li>Datum und Uhrzeit der Serveranfrage</li>\n<li>Weitere ähnliche Daten, die für einen sicheren und stabilen Betrieb der Website erforderlich sind</li>\n</ul>\n<br>\nDiese Informationen sind technisch erforderlich, um eine reibungslose Verbindung, Systemsicherheit und die korrekte Auslieferung der Inhalte unserer Website zu gewährleisten.\n<br>\nAuch wenn diese Daten keine direkte Identifizierung einer bestimmten Person ermöglichen, können sie gemäß geltendem Datenschutzrecht als personenbezogene Daten gelten.\n<br><br>\n<strong>Rechtsgrundlage:</strong> Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der Aufrechterhaltung der Funktionalität, Sicherheit und Optimierung unserer Website.\n<br><br>\n<strong>Speicherdauer:</strong> Die Logdaten werden vorübergehend gespeichert und automatisch spätestens nach 14 Tagen gelöscht, es sei denn, eine längere Aufbewahrung ist aus Sicherheits- oder Rechtsgründen erforderlich."
                        },
                        {
                            "title": "2. Cookies",
                            "body": "Wir verwenden auf unserer Website Cookies. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns, unsere Dienste bereitzustellen, zu verbessern und zu personalisieren.\n<br><br>\nWir unterscheiden zwischen:\n<ul>\n<li><span class=\"text-bold\">Essenzielle Cookies:</span> Erforderlich für die grundlegende Funktionalität der Website (z. B. Spracheinstellungen, Sitzungsverwaltung).</li>\n<li><span class=\"text-bold\">Analyse-Cookies:</span> Dienen zur Erfassung anonymisierter Daten über die Nutzung der Website (z. B. Google Analytics).</li>\n<li><span class=\"text-bold\">Marketing-Cookies:</span> Werden von Dritten verwendet, um personalisierte Werbung anzuzeigen oder Nutzerverhalten über Websites hinweg zu verfolgen.</li>\n</ul>\n<br>\n<span class=\"text-bold\">Rechtsgrundlage:</span>\n<ul>\n<li>Essenzielle Cookies werden auf Grundlage unseres berechtigten Interesses an der Funktionsfähigkeit der Website verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).</li>\n<li>Alle anderen Cookies (Analyse, Marketing) werden nur mit Ihrer ausdrücklichen Einwilligung verarbeitet (Art. 6 Abs. 1 lit. a DSGVO), die Sie über unser Cookie-Banner erteilen.</li>\n</ul>\n<br>\nSie können Ihre Einwilligung jederzeit über den Cookie-Einstellungen-Link am Ende unserer Website verwalten oder widerrufen.\n<br><br>\nDie meisten Browser akzeptieren Cookies standardmäßig. Sie können Ihren Browser jedoch so einstellen, dass er Cookies ablehnt oder Sie benachrichtigt, bevor Cookies gesetzt werden. Das Deaktivieren von Cookies kann jedoch die vollständige Funktionalität der Website beeinträchtigen.\n<br><br>\nWeitere Informationen finden Sie in unserer [Cookie-Richtlinie]."
                        },
                        {
                            "title": "3. Newsletter",
                            "body": "Wenn Sie sich für unseren Newsletter anmelden, verwenden wir die von Ihnen bereitgestellten personenbezogenen Daten (in der Regel Ihre E-Mail-Adresse) ausschließlich, um Ihnen Informationen über unser Unternehmen, unsere Produkte, Dienstleistungen und Neuigkeiten zuzusenden.\n<br><br>\n<span class=\"text-bold\">Anmeldeverfahren:</span>\n<br>\nWir verwenden das Double-Opt-In-Verfahren zur Überprüfung Ihrer Identität. Nach Eingabe Ihrer E-Mail-Adresse erhalten Sie eine Bestätigungsmail mit einem Link, um Ihre Anmeldung abzuschließen. Erst nach Bestätigung werden Sie in unseren Verteiler aufgenommen.\n<br><br>\n<span class=\"text-bold\">Rechtsgrundlage:</span>\n<br>\nDie Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie den Abmeldelink in jedem Newsletter anklicken oder uns direkt unter <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a> kontaktieren.\n<br><br>\n<span class=\"text-bold\">Datenspeicherung & Drittanbieter-Dienste:</span>\n<br>\nIhre Daten werden sicher gespeichert und nicht an Dritte weitergegeben, außer wenn wir einen E-Mail-Dienstleister (z. B. Mailchimp, Brevo) verwenden. Diese Anbieter verarbeiten Daten nur in unserem Auftrag und im Einklang mit Datenschutzvereinbarungen.\n<br><br>\n<span class=\"text-bold\">Optionale Analysen (falls verwendet):</span>\n<br>\nUnsere Newsletter können Zählpixel enthalten, die uns helfen, das Nutzerverhalten besser zu verstehen. Sie können sich jederzeit abmelden, um dieses Tracking zu deaktivieren."
                        },
                        {
                            "title": "4. Über Formulare erhobene Daten",
                            "body": "Unsere Website bietet verschiedene Formulare, über die Sie mit uns Kontakt aufnehmen, technischen Support anfordern oder Ihre Produktgarantie registrieren können. Wenn Sie diese Formulare nutzen, erfassen wir die von Ihnen bereitgestellten personenbezogenen Daten, um Ihre Anfrage zu bearbeiten.\n<br><br>\n<span class=\"text-bold\">Die erhobenen Daten können Folgendes umfassen:</span>\n<ul>\n<li><span class=\"text-bold\">Kontaktformular:</span> Vorname, Nachname, E-Mail-Adresse, Betreff und Nachricht</li>\n<li><span class=\"text-bold\">Supportformular:</span> Kontaktart (Privatperson/Firma), Firmenname, Abteilung, Anrede, vollständiger Name, Adressdaten, Telefon, Fax, E-Mail, Fehlerdatum, Gerätekategorie und -modell, Seriennummer und Fehlerbeschreibung</li>\n<li><span class=\"text-bold\">Garantieregistrierung:</span> Name, E-Mail-Adresse, Kaufdatum, Gerätekategorie und -modell, Seriennummer, technische Anfrage und zusätzliche Nachricht</li>\n</ul>\n<br>\n<span class=\"text-bold\">Zweck der Verarbeitung:</span>\nDie Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage, zur Kundenbetreuung sowie für Garantie- oder Servicezwecke verwendet.\n<br><br>\n<span class=\"text-bold\">Rechtsgrundlage:</span>\n<ul>\n<li>Basierend auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie beim Absenden des Formulars erteilen; oder</li>\n<li>Gegebenenfalls zur Durchführung eines Vertrags oder vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).</li>\n</ul>\n<br><br>\n<span class=\"text-bold\">Speicherdauer:</span>\nWir speichern Ihre Daten nur so lange, wie es zur Bearbeitung Ihrer Anfrage erforderlich ist, es sei denn, gesetzliche Aufbewahrungspflichten bestehen (z. B. Garantie-, Steuer- oder Rechtsvorgaben).\n<br><br>\n<span class=\"text-bold\">Externe Dienstleister:</span>\nIhre Daten können durch autorisierte Mitarbeitende von DragLab oder beauftragte Dienstleister (z. B. Hosting-, E-Mail- oder CRM-Anbieter) verarbeitet werden, die vertraglich zur Vertraulichkeit und zum Datenschutz verpflichtet sind."
                        },
                        {
                            "title": "5. Einsatz von Microsoft Clarity",
                            "body": "Wir verwenden Microsoft Clarity, ein Tool zur Verhaltensanalyse von Nutzern, bereitgestellt von:<br><br>\n<span class=\"text-bold\">Microsoft Corporation</span><br>\n<span class=\"text-bold\">One Microsoft Way, Redmond, WA 98052-6399, USA</span><br><br>\nClarity verwendet Cookies und ähnliche Technologien, um Daten wie Mausbewegungen, Scrollverhalten, Klickverhalten, Geräteinformationen und Referrer-URLs zu erfassen und zu verarbeiten. Diese Daten helfen uns, das Nutzerverhalten besser zu verstehen und die Benutzerfreundlichkeit sowie den Aufbau unserer Website zu optimieren.\n<br><br>\nMicrosoft kann die erhobenen Daten auch zu eigenen Geschäftszwecken verwenden, wie in der <a class=\"highlighted\" href=\"https://privacy.microsoft.com/\">Datenschutzerklärung von Microsoft</a> beschrieben.\n<br><br>\n<span class=\"text-bold\">Rechtsgrundlage:</span><br>\nDie Nutzung von Microsoft Clarity basiert auf Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO, die Sie über unser Cookie-Banner erteilen. Sie können Ihre Einwilligung jederzeit über den Link zu den Cookie-Einstellungen am unteren Rand unserer Website widerrufen.\n<br><br>\n<span class=\"text-bold\">Datenübermittlung:</span><br>\nDie Daten können an Server in den USA übertragen werden. Microsoft ist nach dem EU-US Data Privacy Framework zertifiziert.\n<br><br>\n<span class=\"text-bold\">Opt-out:</span><br>\nSie können die Datenerfassung durch entsprechende Browsereinstellungen oder die Verwaltung Ihrer Cookie-Präferenzen auf unserer Website kontrollieren."
                        },
                        {
                            "title": "6. Einsatz von Google Analytics",
                            "body": "Diese Website nutzt Google Analytics, einen Webanalysedienst der:<br><br>\n<span class=\"text-bold\">Google Ireland Limited</span><br>\nGordon House, Barrow Street<br>\nDublin 4, Irland<br><br>\nGoogle Analytics verwendet Cookies, um die Interaktion der Nutzer mit unserer Website zu analysieren. Die erzeugten Informationen (z. B. IP-Adresse, Nutzerverhalten, Browsertyp) werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.\n<br><br>\nWir haben die IP-Anonymisierung auf dieser Website aktiviert, sodass Ihre IP-Adresse innerhalb der Europäischen Union gekürzt wird, bevor sie an Google übertragen wird.\n<br><br>\nGoogle verarbeitet diese Daten in unserem Auftrag auf Grundlage eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO. Weitere Informationen zum Umgang von Google mit personenbezogenen Daten finden Sie <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">hier</a>.\n<br><br>\n<span class=\"text-bold\">Rechtsgrundlage:</span>\nDie Verwendung von Analyse-Cookies und Google Analytics erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie über unser Cookie-Banner erteilen. Sie können Ihre Einwilligung jederzeit über die [Cookie-Einstellungen] widerrufen.\n<br><br>\n<span class=\"text-bold\">Speicherdauer:</span><br>\nDaten auf Nutzer- und Ereignisebene, die mit Cookies oder Nutzerkennungen verknüpft sind, werden maximal 14 Monate gespeichert und danach automatisch gelöscht.\n<br><br>\n<span class=\"text-bold\">Opt-out-Möglichkeiten:</span><br>\n<ul>\n<li>Widerruf der Einwilligung über unsere Cookie-Einstellungen</li>\n<li>Installation des offiziellen Browser-Add-ons: Google Analytics Opt-out</li>\n<li>Browserkonfiguration zur Blockierung von Cookies</li>\n</ul>"
                        },
                        {
                            "title": "7. Einsatz von Google Ads Conversion Tracking",
                            "body": `Unsere Website nutzt das Conversion-Tracking von Google Ads, einen Dienst der:<br><br>
                            <span class=\"text-bold\">Google Ireland Limited</span><br>
                            Gordon House, Barrow Street<br>
                            Dublin 4, Irland<br><br>
                            Wenn Sie auf eine von Google geschaltete Anzeige klicken, wird ein Cookie auf Ihrem Gerät gespeichert. Dieses Cookie ermöglicht es uns, zu verfolgen, ob bestimmte Aktionen durchgeführt wurden – zum Beispiel, ob ein Formular ausgefüllt oder eine bestimmte Seite besucht wurde. Diese Cookies sind 30 Tage gültig und enthalten keine personenbezogenen Daten.<br><br>
                            Wenn Sie bestimmte Seiten während der Gültigkeit des Cookies besuchen, können Google und wir erkennen, dass Sie auf eine Anzeige geklickt haben und auf unsere Website weitergeleitet wurden. Dies erlaubt Google, Conversion-Statistiken für uns zu erstellen. Wir erhalten jedoch keine Informationen, mit denen sich Nutzer persönlich identifizieren lassen.<br><br>
                            <strong>Rechtsgrundlage:</strong><br>
                            Die Verwendung von Google Ads und Conversion-Tracking-Cookies erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie über unser Cookie-Banner erteilen.<br><br>
                            <strong>Datenweitergabe und Profilbildung:</strong><br>
                            Google kann Ihre Daten mit Ihrem Google-Konto verknüpfen und diese für personalisierte Werbung gemäß der <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">Datenschutzerklärung von Google</a> verwenden.<br><br>
                            <strong>Widerruf und Opt-out:</strong><br>
                            <ul>
                            <li>Widerrufen Sie Ihre Einwilligung jederzeit über unsere [Cookie-Einstellungen]</li>
                            <li>Deaktivieren Sie interessenbezogene Werbung in Ihren Google Ads-Einstellungen</li>
                            <li>Blockieren Sie Cookies von der Domain googleadservices.com in Ihrem Browser</li>
                            </ul>`
                        },
                        {
                            "title": "8. Ihre Datenschutzrechte",
                            "body": `Als betroffene Person im Sinne der Datenschutz-Grundverordnung (DSGVO) haben Sie folgende Rechte in Bezug auf Ihre personenbezogenen Daten:
                            <ul>
                            <li><span class=\"text-bold\">Auskunftsrecht (Art. 15 DSGVO):</span> Sie haben das Recht, Auskunft über die von uns gespeicherten personenbezogenen Daten zu verlangen.</li>
                            <li><span class=\"text-bold\">Recht auf Berichtigung (Art. 16 DSGVO):</span> Sie können die Berichtigung unrichtiger oder unvollständiger personenbezogener Daten verlangen.</li>
                            <li><span class=\"text-bold\">Recht auf Löschung (Art. 17 DSGVO):</span> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzliche Aufbewahrungspflicht besteht.</li>
                            <li><span class=\"text-bold\">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</span> Sie können unter bestimmten Voraussetzungen die Einschränkung der Verarbeitung verlangen.</li>
                            <li><span class=\"text-bold\">Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</span> Sie haben das Recht, Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten und an einen anderen Verantwortlichen zu übermitteln.</li>
                            <li><span class=\"text-bold\">Widerspruchsrecht (Art. 21 DSGVO):</span> Sie können der Verarbeitung Ihrer personenbezogenen Daten widersprechen, sofern diese auf berechtigten Interessen beruht.</li>
                            <li><span class=\"text-bold\">Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</span> Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</li>
                            </ul>
                            Um Ihre Rechte auszuüben, wenden Sie sich bitte an unseren Datenschutzbeauftragten unter:<br>
                            E-Mail: <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a><br>
                            Zur Bearbeitung Ihrer Anfrage können wir einen Identitätsnachweis verlangen.<br><br>
                            Sie haben außerdem das Recht, sich bei einer Aufsichtsbehörde zu beschweren, z. B. bei:<br>
                            <a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</a>`
                        },
                        {
                            "title": "9. Änderungen unserer Datenschutzrichtlinie",
                            "body": `Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen, um geänderte rechtliche Anforderungen oder Änderungen unserer Dienste zu berücksichtigen.<br><br>
                            Wenn Änderungen vorgenommen werden, aktualisieren wir das \"Gültigkeitsdatum\" oben auf dieser Seite. Bei wesentlichen Änderungen informieren wir Sie gegebenenfalls durch einen Hinweis auf unserer Website oder per E-Mail.<br><br>
                            Wir empfehlen, diese Datenschutzrichtlinie regelmäßig zu lesen, um informiert zu bleiben, wie wir Ihre Daten schützen.<br><br>
                            Die jeweils aktuelle Version dieser Richtlinie finden Sie unter <a class=\"highlighted\" href=\"https://www.drag-lab.de/DE/PrivacyPolicy\">Datenschutzerklärung</a>.`
                        },
                        {
                            "title": "10. Kontakt zum Datenschutzbeauftragten",
                            "body": `Wenn Sie Fragen zur Verarbeitung Ihrer personenbezogenen Daten haben oder Ihre Datenschutzrechte ausüben möchten, können Sie sich direkt an unseren Datenschutzbeauftragten wenden:<br><br>
                            <span class=\"text-bold\">Datenschutzbeauftragter</span><br>
                            <span class=\"text-bold\">DragLab Technology GmbH</span><br>
                            E-Mail: <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a><br><br>
                            Sie haben auch das Recht, sich jederzeit an die zuständige Datenschutzaufsichtsbehörde zu wenden:<br>
                            <a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</a><br><br>
                            <span class=\"text-bold\">Postanschrift:</span> Postfach 3163, 65021 Wiesbaden, Deutschland<br><br>
                            Bei Fragen zum Datenschutz wenden Sie sich bitte an den Datenschutzbeauftragten der Nanodrag Technology GmbH.`}
                    ]

                },
                TR: {
                    pageTitle: "Gizlilik Politikası",
                    metaDescription: "DragLab'ın Gizlilik Politikasını okuyun ve bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin.",
                    dataPolicyTitle: "Veri Koruma Politikası",
                    status: "Durum:",
                    statusDate: "02 - Son Güncelleme: Haziran 2025",
                    contactInfo: `<br>  <span class=\"text-bold\">İletişim Bilgileri</span><br> <span class=\"text-bold\">DragLab Technology GmbH</span><br>    E-Mail: <a class=\"highlighted\" href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a><br><br>  DragLab Technology GmbH<br>    Mergenthalerallee 10-12<br>    D-65760 Eschborn, Almanya<br>    Tel: +49 6196 400816<br>    Fax: +49 6196 400910<br>    E-Mail: <a href=\"mailto:info@drag-lab.de\">info@drag-lab.de</a> <br>    Website: <a href=\"https://www.drag-lab.de\">www.drag-lab.de</a><br>    Merkez: Eschborn<br>    Ticaret Sicil No: Eschborn Ticaret Mahkemesi - HRB 97258<br>    Hukuki Form: Sınırlı Sorumluluk Şirketi (GmbH)<br>    Kayıt Yeri: Eschborn<br>`,
                    sections: [
                        {
                            "title": "1. Genel Bilgilerin Toplanması",
                            "body": "Web sitemizi ziyaret ettiğinizde, belirli genel bilgiler otomatik olarak toplanır ve sunucu günlük dosyalarında saklanır. Bunlar şunları içerebilir:\n<ul>\n<li>Tarayıcı türü ve sürümü</li>\n<li>Kullanılan işletim sistemi</li>\n<li>Yönlendiren URL</li>\n<li>Erişen bilgisayarın ana bilgisayar adı (IP adresi)</li>\n<li>Sunucu talebinin tarihi ve saati</li>\n<li>Web sitesinin güvenli ve istikrarlı çalışması için gerekli olan diğer benzer veriler</li>\n</ul>\n<br>\nBu bilgiler, sorunsuz bir bağlantı, sistem güvenliği ve web sitemizin içeriğinin doğru teslimatı için teknik olarak gereklidir.\n<br>\nBu veriler belirli bir kişinin doğrudan tanımlanmasını mümkün kılmasa da, geçerli veri koruma yasalarına göre kişisel veri olarak kabul edilebilir.\n<br><br>\n<strong>Hukuki Dayanak:</strong> Bu verilerin işlenmesi, DSGVO Madde 6(1)(f) uyarınca meşru menfaatimize dayanmaktadır. Meşru menfaatimiz, web sitemizin işlevselliğini, güvenliğini ve optimizasyonunu sağlamaktır.\n<br><br>\n<strong>Depolama Süresi:</strong> Günlük veriler geçici olarak saklanır ve en geç 14 gün sonra otomatik olarak silinir, ancak güvenlik veya yasal nedenlerle daha uzun süre saklanması gerekebilir."
                        },
                        {
                            "title": "2. Çerezler",
                            "body": "Web sitemizde çerezler kullanıyoruz. Çerezler, web sitemizi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır. Hizmetlerimizi sağlamak, iyileştirmek ve kişiselleştirmek için bize yardımcı olurlar.\n<br><br>\nŞunları ayırt ediyoruz:\n<ul>\n<li><span class=\"text-bold\">Temel Çerezler:</span> Web sitesinin temel işlevselliği için gereklidir (örneğin, dil ayarları, oturum yönetimi).</li>\n<li><span class=\"text-bold\">Analiz Çerezleri:</span> Web sitesinin kullanımına ilişkin anonimleştirilmiş veriler toplamak için kullanılır (örneğin, Google Analytics).</li>\n<li><span class=\"text-bold\">Pazarlama Çerezleri:</span> Üçüncü taraflar tarafından, kişiselleştirilmiş reklamlar göstermek veya web siteleri arasında kullanıcı davranışını izlemek için kullanılır.</li>\n</ul>\n<br>\n<span class=\"text-bold\">Hukuki Dayanak:</span>\n<ul>\n<li>Temel çerezler, web sitesinin işlevselliği konusundaki meşru menfaatimize dayanarak işlenir (DSGVO Madde 6(1)(f)).</li>\n<li>Diğer tüm çerezler (analiz, pazarlama) yalnızca açık rızanızla işlenir (DSGVO Madde 6(1)(a)), bu rıza çerez bildirimimiz aracılığıyla verilir.</li>\n</ul>\n<br>\nRızanızı, web sitemizin altındaki Çerez Ayarları bağlantısı aracılığıyla istediğiniz zaman yönetebilir veya geri çekebilirsiniz.\n<br><br>\nÇoğu tarayıcı çerezleri varsayılan olarak kabul eder. Ancak, tarayıcınızı çerezleri reddedecek veya çerezler ayarlanmadan önce sizi bilgilendirecek şekilde ayarlayabilirsiniz. Ancak, çerezlerin devre dışı bırakılması web sitesinin tam işlevselliğini etkileyebilir.\n<br><br>\nDaha fazla bilgi için lütfen [Çerez Politikamıza] bakın."
                        },
                        {
                            "title": "3. Bülten",
                            "body": "Bültenimize kaydolursanız, sağladığınız kişisel verileri (genellikle e-posta adresiniz) yalnızca şirketimiz, ürünlerimiz, hizmetlerimiz ve haberlerimiz hakkında bilgi göndermek için kullanıyoruz.\n<br><br>\n<span class=\\\"text-bold\\\">Kayıt Prosedürü:</span>\n<br>\nKimliğinizi doğrulamak için Çift Onaylama (Double-Opt-In) prosedürünü kullanıyoruz. E-posta adresinizi girdikten sonra, kaydınızı tamamlamak için bir bağlantı içeren bir onay e-postası alacaksınız. Onayladıktan sonra dağıtım listemize eklenirsiniz.\n<br><br>\n<span class=\\\"text-bold\\\">Hukuki Dayanak:</span>\n<br>\nVerilerinizin işlenmesi, verdiğiniz rızaya dayanmaktadır (DSGVO Madde 6(1)(a)). Rızanızı, bültenlerdeki abonelikten çıkış bağlantısına tıklayarak veya doğrudan <a class=\\\"highlighted\\\" href=\\\"mailto:info@drag-lab.de\\\">info@drag-lab.de</a> adresine e-posta göndererek geri çekebilirsiniz.\n<br><br>\n<span class=\\\"text-bold\\\">Veri Depolama ve Üçüncü Taraf Hizmet Sağlayıcılar:</span>\n<br>\nVerileriniz güvenli bir şekilde saklanır ve e-posta hizmet sağlayıcıları (örneğin, Mailchimp, Brevo) gibi üçüncü taraflara aktarılmaz, bu sağlayıcılar yalnızca bizim adımıza ve veri koruma anlaşmaları çerçevesinde verileri işler.\n<br><br>\n<span class=\\\"text-bold\\\">İsteğe Bağlı Analizler (varsa):</span>\n<br>\nBültenlerimiz, kullanıcı davranışını daha iyi anlamamıza yardımcı olan izleme pikselleri içerebilir. Bu izlemeyi devre dışı bırakmak için istediğiniz zaman abonelikten çıkabilirsiniz."
                        },
                        {
                            "title": "4. Formlar aracılığıyla toplanan veriler",
                            "body": "Web sitemiz, bizimle iletişime geçebileceğiniz, teknik destek talep edebileceğiniz veya ürün garantinizi kaydedebileceğiniz çeşitli formlar sunar. Bu formları kullandığınızda, talebinizi işlemek için sağladığınız kişisel verileri toplarız.\n<br><br>\n<span class=\"text-bold\">Toplanan veriler şunları içerebilir:</span>\n<ul>\n<li> <span class=\"text-bold\">İletişim Formu:</span> Ad, Soyad, E-posta Adresi, Konu ve Mesaj</li>\n<li><span class=\"text-bold\">Destek Formu:</span> İletişim Türü (Birey/Şirket), Şirket Adı, Departman, Hitap, Tam Ad, Adres Bilgileri, Telefon, Faks, E-posta, Hata Tarihi, Cihaz Kategorisi ve Modeli, Seri Numarası ve Hata Açıklaması</li>\n<li><span class=\"text-bold\">Garanti Kaydı:</span> İsim, E-posta Adresi, Satın Alma Tarihi, Cihaz Kategorisi ve Modeli, Seri Numarası, Teknik Sorgu ve Ek Mesaj</li>\n</ul>\n<br>\n<span class=\"text-bold\">İşleme Amacı:</span>\nVerileriniz yalnızca talebinizi işlemek, müşteri hizmetleri sağlamak ve garanti veya servis amaçları için kullanılır.\n<br><br>\n<span class=\"text-bold\">Hukuki Dayanak:</span>\n<ul>\n<li>Formu gönderirken verdiğiniz rızaya dayalı olarak (DSGVO Madde 6(1)(a)); veya</li>\n<li>Gerekirse bir sözleşmenin ifası veya sözleşme öncesi tedbirler için (DSGVO Madde 6(1)(b)).</li>\n</ul>\n<br><br>\n<span class=\"text-bold\">Depolama Süresi:</span>\nVerileriniz yalnızca talebinizi işlemek için gerekli olduğu sürece saklanır, yasal saklama yükümlülükleri (örneğin garanti, vergi veya yasal gereklilikler) olmadıkça.\n<br><br>\n<span class=\"text-bold\">Harici Hizmet Sağlayıcılar:</span>\nVerileriniz, gizlilik ve veri koruma taahhütlerine bağlı olan yetkili DragLab çalışanları veya görevlendirilmiş hizmet sağlayıcılar (örneğin barındırma, e-posta veya CRM sağlayıcıları) tarafından işlenebilir."
                        },
                        {
                            "title": "5. Microsoft Clarity'nin Kullanımı",
                            "body": "Kullanıcı davranış analiz aracı Microsoft Clarity'yi kullanıyoruz, sağlayıcısı:<br><br>\n<span class=\"text-bold\">Microsoft Corporation</span><br>\n<span class=\"text-bold\">One Microsoft Way, Redmond, WA 98052-6399, ABD</span><br><br>\nClarity, çerezler ve benzer teknolojiler kullanarak fare hareketleri, kaydırma davranışı, tıklama davranışı, cihaz bilgileri ve yönlendiren URL'ler gibi verileri toplar ve işler. Bu veriler, kullanıcı davranışını daha iyi anlamamıza ve web sitemizin kullanılabilirliğini ve yapısını optimize etmemize yardımcı olur.\n<br><br>\nMicrosoft ayrıca toplanan verileri kendi ticari amaçları için de kullanabilir; bu, <a class=\"highlighted\" href=\"https://privacy.microsoft.com/\">Microsoft'un Gizlilik Bildirimi</a>nde açıklanmıştır.\n<br><br>\n<span class=\"text-bold\">Hukuki Dayanak:</span><br>\nMicrosoft Clarity'nin kullanımı, Çerez Bildirimimiz aracılığıyla verdiğiniz rızaya dayanmaktadır (DSGVO Madde 6(1)(a)). Rızanızı, web sitemizin altındaki Çerez Ayarları bağlantısı aracılığıyla istediğiniz zaman geri çekebilirsiniz.\n<br><br>\n<span class=\"text-bold\">Veri Aktarımı:</span><br>\nVeriler ABD'deki sunuculara aktarılabilir. Microsoft, AB-ABD Veri Gizliliği Çerçevesi kapsamında sertifikalandırılmıştır.\n<br><br>\n<span class=\"text-bold\">Opt-out:</span><br>\nTarayıcı ayarlarınız veya web sitemizdeki çerez tercihlerinizi yöneterek veri toplama işlemini kontrol edebilirsiniz."
                        },
                        {
                            "title": "6. Google Analytics'in Kullanımı",
                            "body": "Bu web sitesi, bir web analiz hizmeti olan Google Analytics'i kullanmaktadır. Sağlayıcısı:<br><br>\n<span class=\"text-bold\">Google Ireland Limited</span><br>\nGordon House, Barrow Street<br>\nDublin 4, İrlanda<br><br>\nGoogle Analytics, web sitemizin kullanımını analiz etmek için çerezler kullanır. Oluşturulan bilgiler (örneğin IP adresi, kullanıcı davranışı, tarayıcı türü) genellikle ABD'deki bir Google sunucusuna iletilir ve orada saklanır.\n<br><br>\nWeb sitemizde IP anonimleştirmeyi etkinleştirdik, böylece IP adresiniz Avrupa Birliği içinde kısaltılır ve ardından Google'a iletilir.\n<br><br>\nGoogle, DSGVO Madde 28 uyarınca bir veri işleme sözleşmesi kapsamında bizim adımıza bu verileri işler. Google'ın kişisel verilerle nasıl başa çıktığına dair daha fazla bilgiye <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">buradan</a> ulaşabilirsiniz.\n<br><br>\n<span class=\"text-bold\">Hukuki Dayanak:</span>\nAnaliz çerezlerinin ve Google Analytics'in kullanımı, Çerez Bildirimimiz aracılığıyla verdiğiniz açık rızaya dayanmaktadır (DSGVO Madde 6(1)(a)). Rızanızı, [Çerez Ayarları] aracılığıyla istediğiniz zaman geri çekebilirsiniz.\n<br><br>\n<span class=\"text-bold\">Depolama Süresi:</span><br>\nÇerezler veya kullanıcı kimlikleriyle ilişkilendirilen kullanıcı ve olay düzeyindeki veriler en fazla 14 ay saklanır ve ardından otomatik olarak silinir.\n<br><br>\n<span class=\"text-bold\">Opt-out Seçenekleri:</span><br>\n<ul>\n<li>Rızanızı [Çerez Ayarları] aracılığıyla geri çekin</li>\n<li>Resmi tarayıcı eklentisi: Google Analytics Opt-out'u yükleyin</li>\n<li>Tarayıcınızı çerezleri engelleyecek şekilde yapılandırın</li>\n</ul>"
                        },
                        {
                            "title": "7. Google Ads Dönüşüm Takibinin Kullanımı",
                            "body": `Web sitemiz, bir hizmet olan Google Ads dönüşüm takibini kullanmaktadır:<br><br>
                            <span class=\"text-bold\">Google Ireland Limited</span><br>
                            Gordon House, Barrow Street<br>
                            Dublin 4, İrlanda<br><br>
                            Google tarafından yayınlanan bir reklama tıkladığınızda, cihazınıza bir çerez kaydedilir. Bu çerez, belirli işlemlerin gerçekleştirilip gerçekleştirilmediğini izlememizi sağlar - örneğin, bir formun doldurulup doldurulmadığını veya belirli bir sayfanın ziyaret edilip edilmediğini. Bu çerezler 30 gün geçerlidir ve kişisel veriler içermez.<br><br>
                            Çerezin geçerliliği süresi içinde belirli sayfaları ziyaret ederseniz, Google ve biz, bir reklama tıkladığınızı ve web sitemize yönlendirildiğinizi anlayabiliriz. Bu, Google'ın bizim için dönüşüm istatistikleri oluşturmasını sağlar. Ancak, kullanıcıları kişisel olarak tanımlamamıza olanak tanıyan hiçbir bilgi almayız.<br><br>
                            <strong>Hukuki Dayanak:</strong><br>
                            Google Ads ve dönüşüm takibi çerezlerinin kullanımı, Çerez Bildirimimiz aracılığıyla verdiğiniz açık rızaya dayanmaktadır (DSGVO Madde 6(1)(a)).<br><br>
                            <strong>Veri Paylaşımı ve Profil Oluşturma:</strong><br>
                            Google, verilerinizi Google Hesabınızla ilişkilendirebilir ve bunları Google'ın <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">Gizlilik Politikası</a> uyarınca kişiselleştirilmiş reklamlar için kullanabilir.<br><br>
                            <strong>Reddetme ve Opt-out:</strong><br>
                            Rızanızı [Çerez Ayarları] aracılığıyla geri çekebilir veya tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilirsiniz.<br><br>
                            <ul>
                            <li>Rızanızı [Çerez Ayarları] aracılığıyla istediğiniz zaman geri çekin</li>
                            <li>Resmi tarayıcı eklentisi: Google Analytics Opt-out'u yükleyin</li>
                            <li>Tarayıcınızı çerezleri engelleyecek şekilde yapılandırın</li>
                            </ul>`
                        },
                        {
                            "title": "8. Veri Koruma Haklarınız",
                            "body": `DSGVO uyarınca veri koruma haklarınız şunlardır:
                            <ul>    
                            <li>Erişim Hakkı: Kişisel verilerinize erişim talep etme hakkına sahipsiniz.</li>
                            <li>Düzeltme Hakkı: Yanlış veya eksik verilerin düzeltilmesini talep etme hakkına sahipsiniz.</li>
                            <li>Silme Hakkı: Kişisel verilerinizin silinmesini talep etme hakkına sahipsiniz.</li>
                            <li>İtiraz Hakkı: Verilerinizin işlenmesine itiraz etme hakkına sahipsiniz.</li>
                            <li>Veri Taşınabilirliği Hakkı: Verilerinizi başka bir hizmet sağlayıcıya aktarma hakkına sahipsiniz.</li>
                            </ul>
                            İşleme faaliyetlerimizle ilgili sorularınız veya veri koruma haklarınızı kullanmak isterseniz, lütfen veri koruma sorumlumuzla iletişime geçin:<br>
                            E-Mail: <a class=\"highlighted\" href=\"mailto:data.protection@draglab.com\">data.protection@draglab.com</a><br>
                            Kimlik doğrulaması için ek bilgiler talep edebiliriz.<br><br>
                            Ayrıca, ilgili veri koruma otoritesine şikayette bulunma hakkınız da vardır:<br>
                            <a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">Hessen Veri Koruma ve Bilgi Özgürlüğü Komiseri</a>`
                        },
                        {
                            "title": "9. Gizlilik Politikasındaki Değişiklikler",
                            "body": `Gizlilik politikamızda zaman zaman değişiklik yapma hakkını saklı tutuyoruz. Değişiklikler yapıldığında, güncellenmiş politikayı web sitemizde yayınlayacağız. Lütfen düzenli olarak bu sayfayı kontrol edin.
                            <br><br>
                            Son güncelleme: 01.01.2023`
                        },
                        {
                            "title": "10. Veri Koruma Sorumlusu ile İletişim",
                            "body": `Kişisel verilerinizin işlenmesi hakkında sorularınız varsa veya veri koruma haklarınızı kullanmak istiyorsanız, doğrudan veri koruma sorumlumuzla iletişime geçebilirsiniz:<br><br>
                            <span class=\"text-bold\">Veri Koruma Sorumlusu</span><br>
                            <span class=\"text-bold\">DragLab Technology GmbH</span><br>
                            E-Mail: <a class=\"highlighted\" href=\"mailto:data.protection@draglab.com\">data.protection@draglab.com</a><br><br>
                            Ayrıca, ilgili veri koruma otoritesine şikayette bulunma hakkınız da vardır:<br>
                            <a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">Hessen Veri Koruma ve Bilgi Özgürlüğü Komiseri</a><br><br>
                            <span class=\"text-bold\">Posta Adresi:</span> Postfach 3163, 65021 Wiesbaden, Almanya<br><br>
                            Veri koruma ile ilgili sorularınız için lütfen Nanodrag Technology GmbH'nin veri koruma sorumlusuna başvurun.`}
                    ]
                },
                FR: {
                    pageTitle: "Politique de Confidentialité",
                    metaDescription: "Lisez la Politique de Confidentialité de DragLab et découvrez comment nous collectons, utilisons et protégeons vos informations.",
                    dataPolicyTitle: "Politique de Protection des Données",
                    status: "Statut :",
                    statusDate: "02 - Dernière mise à jour : Juin 2025",
                    contactInfo: `<br>  <span class=\"text-bold\">Coordonnées</span><br> <span class=\"text-bold\">DragLab Technology GmbH</span><br>    E-Mail: <a class=\"highlighted\" href=\"mailto:data.protection@draglab.com\">data.protection@draglab.com</a><br><br>  DragLab Technology GmbH<br>    Mergenthalerallee 10-12<br>    D-65760 Eschborn, Allemagne<br>    Tel: +49 6196 400816<br>    Fax: +49 6196 400910<br>    E-Mail: <a href=\"mailto:data.protection@draglab.com\">data.protection@draglab.com</a> <br>    Site web: <a href=\"https://www.drag-lab.de\">www.drag-lab.de</a><br>    Siège social: Eschborn<br>    Numéro d'immatriculation au registre du commerce: Tribunal de commerce d'Eschborn - HRB 97258<br>    Forme juridique: Société à responsabilité limitée (GmbH)<br>    Lieu d'enregistrement: Eschborn<br>`,
                    sections: [
                        {
                            "title": "1. Collecte d'informations générales",
                            "body": "Lorsque vous visitez notre site web, certaines informations générales sont automatiquement collectées et stockées dans des fichiers journaux du serveur. Cela peut inclure:\n<ul>\n<li>Type et version du navigateur</li>\n<li>Système d'exploitation utilisé</li>\n<li>URL de référence</li>\n<li>Nom d'hôte de l'ordinateur accédant (adresse IP)</li>\n<li>Date et heure de la requête au serveur</li>\n<li>Données similaires nécessaires pour assurer le fonctionnement sécurisé et stable de notre site web</li>\n</ul>\n<br>\nCes informations sont techniquement nécessaires pour établir une connexion sans problème, assurer la sécurité du système et garantir la livraison correcte du contenu de notre site web.\n<br>\nBien que ces données ne permettent pas d'identifier directement une personne spécifique, elles peuvent être considérées comme des données personnelles selon les lois de protection des données en vigueur.\n<br><br>\n<strong>Base juridique :</strong> Le traitement de ces données est basé sur notre intérêt légitime conformément à l'article 6(1)(f) du DSGVO. Notre intérêt légitime est d'assurer la fonctionnalité, la sécurité et l'optimisation de notre site web.\n<br><br>\n<strong>Durée de stockage :</strong> Les données journalières sont stockées temporairement et supprimées automatiquement au plus tard après 14 jours, sauf si une conservation plus longue est nécessaire pour des raisons de sécurité ou légales."
                        },
                        {
                            "title": "2. Cookies",
                            "body": "Nous utilisons des cookies sur notre site web. Les cookies sont de petits fichiers texte enregistrés sur votre appareil lorsque vous visitez notre site web. Ils nous aident à fournir, améliorer et personnaliser nos services.\n<br><br>\nNous distinguons:\n<ul>\n<li><span class=\"text-bold\">Cookies essentiels :</span> Nécessaires pour les fonctions de base du site web (par exemple, paramètres de langue, gestion de session).</li>\n<li><span class=\"text-bold\">Cookies d'analyse :</span> Utilisés pour collecter des données anonymisées sur l'utilisation du site web (par exemple, Google Analytics).</li>\n<li><span class=\"text-bold\">Cookies marketing :</span> Utilisés par des tiers pour afficher des publicités personnalisées ou suivre le comportement des utilisateurs entre les sites web.</li>\n</ul>\n<br>\n<span class=\"text-bold\">Base juridique :</span>\n<ul>\n<li>Les cookies essentiels sont traités sur la base de notre intérêt légitime à assurer la fonctionnalité du site web (DSGVO article 6(1)(f)).</li>\n<li>Tous les autres cookies (analyse, marketing) sont traités uniquement avec votre consentement explicite (DSGVO article 6(1)(a)), ce consentement étant donné via notre notification de cookies.</li>\n</ul>\n<br>\nVous pouvez gérer ou retirer votre consentement à tout moment via le lien Paramètres des cookies en bas de notre site web.\n<br><br>\nLa plupart des navigateurs acceptent les cookies par défaut. Cependant, vous pouvez configurer votre navigateur pour refuser les cookies ou vous informer avant qu'ils ne soient définis. Veuillez noter que la désactivation des cookies peut affecter la fonctionnalité complète du site web.\n<br><br>\nPour plus d'informations, veuillez consulter notre [Politique de Cookies]."
                        },
                        {
                            "title": "3. Newsletter",
                            "body": "Si vous vous inscrivez à notre newsletter, nous utilisons les données personnelles que vous fournissez (généralement votre adresse e-mail) uniquement pour vous envoyer des informations sur notre entreprise, nos produits, nos services et nos actualités.\n<br><br>\n<span class=\\\"text-bold\\\">Procédure d'inscription :</span>\n<br>\nNous utilisons la procédure de double opt-in pour vérifier votre identité. Après avoir saisi votre adresse e-mail, vous recevrez un e-mail de confirmation contenant un lien pour finaliser votre inscription. Une fois confirmé, vous serez ajouté à notre liste de diffusion.\n<br><br>\n<span class=\\\"text-bold\\\">Base juridique :</span>\n<br>\nLe traitement de vos données est basé sur le consentement que vous avez donné (DSGVO article 6(1)(a)). Vous pouvez retirer votre consentement à tout moment en cliquant sur le lien de désabonnement dans les newsletters ou en envoyant un e-mail directement à <a class=\\\"highlighted\\\" href=\\\"mailto:data.protection@draglab.com\\\">data.protection@draglab.com</a>."
                        },
                        {
                            "title": "4. Données collectées via les formulaires",
                            "body": "Notre site web propose divers formulaires que vous pouvez utiliser pour nous contacter, demander une assistance technique ou enregistrer la garantie de votre produit. Lorsque vous utilisez ces formulaires, nous collectons les données personnelles que vous fournissez pour traiter votre demande.\n<br><br>\n<span class=\"text-bold\">Les données collectées peuvent inclure :</span>\n<ul>\n<li> <span class=\"text-bold\">Formulaire de contact :</span> Prénom, Nom, Adresse e-mail, Sujet et Message</li>\n<li><span class=\"text-bold\">Formulaire d'assistance :</span> Type de contact (Particulier/Entreprise), Nom de l'entreprise, Département, Civilité, Nom complet, Informations d'adresse, Téléphone, Fax, E-mail, Date de l'erreur, Catégorie et modèle de l'appareil, Numéro de série et Description de l'erreur</li>\n<li><span class=\"text-bold\">Enregistrement de garantie :</span> Nom, Adresse e-mail, Date d'achat, Catégorie et modèle de l'appareil, Numéro de série, Question technique et Message supplémentaire</li>\n</ul>\n<br>\n<span class=\"text-bold\">But du traitement :</span>\nVos données sont utilisées uniquement pour traiter votre demande, fournir un service client et à des fins de garantie ou de service.\n<br><br>\n<span class=\"text-bold\">Base juridique :</span>\n<ul>\n<li>Basée sur le consentement que vous donnez en soumettant le formulaire (DSGVO article 6(1)(a)); ou</li>\n<li>Si nécessaire pour l'exécution d'un contrat ou des mesures précontractuelles (DSGVO article 6(1)(b)).</li>\n</ul>\n<br><br>\n<span class=\"text-bold\">Durée de stockage :</span>\nVos données sont conservées uniquement aussi longtemps que nécessaire pour traiter votre demande, sauf si des obligations légales de conservation (par exemple, garanties, exigences fiscales ou légales) s'appliquent.\n<br><br>\n<span class=\"text-bold\">Fournisseurs de services externes :</span>\nVos données peuvent être traitées par des employés autorisés de DragLab liés par des engagements de confidentialité ou par des prestataires de services mandatés (par exemple, hébergement, e-mail ou fournisseurs CRM) qui traitent les données pour notre compte."
                        },
                        {
                            "title": "5. Utilisation de Microsoft Clarity",
                            "body": "Nous utilisons l'outil d'analyse du comportement des utilisateurs Microsoft Clarity, dont le fournisseur est:<br><br>\n<span class=\"text-bold\">Microsoft Corporation</span><br>\n<span class=\"text-bold\">One Microsoft Way, Redmond, WA 98052-6399, USA</span><br><br>\nClarity collecte et traite des données telles que les mouvements de la souris, le comportement de défilement, le comportement de clic, les informations sur l'appareil et les URL de référence en utilisant des cookies et des technologies similaires. Ces données nous aident à mieux comprendre le comportement des utilisateurs et à optimiser la convivialité et la structure de notre site web.\n<br><br>\nMicrosoft peut également utiliser les données collectées à des fins commerciales propres; cela est expliqué dans la <a class=\"highlighted\" href=\"https://privacy.microsoft.com/\">Déclaration de confidentialité de Microsoft</a>.\n<br><br>\n<span class=\"text-bold\">Base juridique :</span><br>\nL'utilisation de Microsoft Clarity est basée sur le consentement que vous avez donné via notre notification de cookies (DSGVO article 6(1)(a)). Vous pouvez retirer votre consentement à tout moment via le lien Paramètres des cookies en bas de notre site web.\n<br><br>\n<span class=\"text-bold\">Transfert de données :</span><br>\nLes données peuvent être transférées à des serveurs situés aux États-Unis. Microsoft est certifié dans le cadre du Bouclier de protection des données UE-États-Unis.\n<br><br>\n<span class=\"text-bold\">Opt-out :</span><br>\nVous pouvez contrôler le processus de collecte de données en configurant les paramètres de votre navigateur ou en gérant vos préférences de cookies sur notre site web."
                        },
                        {
                            "title": "6. Utilisation de Google Analytics",
                            "body": "Ce site web utilise Google Analytics, un service d'analyse web. Le fournisseur est:<br><br>\n<span class=\"text-bold\">Google Ireland Limited</span><br>\nGordon House, Barrow Street<br>\nDublin 4, Irlande<br><br>\nGoogle Analytics utilise des cookies pour analyser l'utilisation de notre site web. Les informations générées (par exemple, adresse IP, comportement des utilisateurs, type de navigateur) sont généralement transmises à un serveur Google aux États-Unis et y sont stockées.\n<br><br>\nNous avons activé l'anonymisation IP sur notre site web, de sorte que votre adresse IP est raccourcie au sein de l'Union européenne avant d'être transmise à Google.\n<br><br>\nGoogle traite ces données en notre nom dans le cadre d'un contrat de traitement des données conformément à l'article 28 du DSGVO. Pour plus d'informations sur la manière dont Google gère les données personnelles, veuillez consulter <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">ici</a>.\n<br><br>\n<span class=\"text-bold\">Base juridique :</span>\nL'utilisation des cookies d'analyse et de Google Analytics est basée sur votre consentement explicite via notre notification de cookies (DSGVO article 6(1)(a)). Vous pouvez retirer votre consentement à tout moment via [Paramètres des cookies].\n<br><br>\n<span class=\"text-bold\">Durée de stockage :</span><br>\nLes données au niveau des utilisateurs et des événements associées aux cookies ou aux identifiants utilisateur sont conservées pendant un maximum de 14 mois, puis supprimées automatiquement.\n<br><br>\n<span class=\"text-bold\">Options d'opt-out :</span><br>\n<ul>\n<li>Retirez votre consentement à tout moment via [Paramètres des cookies]</li>\n<li>Extension officielle du navigateur : installez le module complémentaire Google Analytics Opt-out</li>\n<li>Configurez votre navigateur pour bloquer les cookies</li>\n</ul>"
                        },
                        {
                            "title": "7. Utilisation du suivi des conversions Google Ads",
                            "body": `Notre site web utilise le suivi des conversions Google Ads, un service de :<br><br>
                            <span class=\"text-bold\">Google Ireland Limited</span><br>
                            Gordon House, Barrow Street<br>
                            Dublin 4, Irlande<br><br>   
                            Lorsque vous cliquez sur une publicité publiée par Google, un cookie est enregistré sur votre appareil. Ce cookie nous permet de suivre si certaines actions ont été effectuées - par exemple, si un formulaire a été rempli ou si une page spécifique a été visitée. Ces cookies sont valables pendant 30 jours et ne contiennent pas de données personnelles.<br><br>
                            Si vous visitez certaines pages dans la période de validité du cookie, Google et nous pouvons savoir que vous avez cliqué sur une publicité et que vous avez été redirigé vers notre site web. Cela permet à Google de créer des statistiques de conversion pour nous. Cependant, nous ne recevons aucune information qui nous permettrait d'identifier personnellement les utilisateurs.<br><br>
                            <strong>Base juridique :</strong><br>
                            L'utilisation de Google Ads et des cookies de suivi des conversions est basée sur votre consentement explicite via notre notification de cookies (DSGVO article 6(1)(a)).<br><br>
                            <strong>Partage de données et création de profils :</strong><br>
                            Google peut associer vos données à votre compte Google et les utiliser conformément à la <a class=\"highlighted\" href=\"https://policies.google.com/privacy\">Politique de confidentialité</a> de Google pour des publicités personnalisées.<br><br>
                            <strong>Refus et opt-out :</strong><br>
                            Vous pouvez retirer votre consentement via [Paramètres des cookies] ou refuser les cookies en modifiant les paramètres de votre navigateur.<br><br> 
                            <ul>
                            <li>Retirez votre consentement à tout moment via [Paramètres des cookies]</li>
                            <li>Extension officielle du navigateur : installez le module complémentaire Google Analytics Opt-out</li>
                            </ul>`
                        },
                        {
                            "title": "8. Vos droits en matière de protection des données",
                            "body": `Conformément au DSGVO, vous disposez des droits suivants en matière de protection des données :
                            <ul>
                            <li>Droit d'accès : Vous avez le droit de demander des informations sur les données personnelles que nous détenons à votre sujet.</li>
                            <li>Droit de rectification : Vous avez le droit de demander la correction de données personnelles inexactes ou incomplètes.</li>
                            <li>Droit à l'effacement : Vous avez le droit de demander la suppression de vos données personnelles, sous certaines conditions.</li>
                            <li>Droit à la limitation du traitement : Vous avez le droit de demander la limitation du traitement de vos données personnelles dans certaines situations.</li>
                            <li>Droit à la portabilité des données : Vous avez le droit de recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine.</li>
                            <li>Droit d'opposition : Vous avez le droit de vous opposer au traitement de vos données personnelles, sous certaines conditions.</li>
                            </ul>`
                        },
                        {
                            "title": "9. Modifications de la Politique de Confidentialité",
                            "body": `Nous nous réservons le droit de modifier notre politique de confidentialité de temps à autre. Lorsque des modifications sont apportées, nous publierons la politique mise à jour sur notre site web. Veuillez consulter cette page régulièrement.  `
                        }, {
                            "title": "10. Contact avec le Délégué à la Protection des Données",
                            "body": `Si vous avez des questions concernant le traitement de vos données personnelles ou si vous souhaitez exercer vos droits en matière de protection des données, vous pouvez contacter directement notre délégué à la protection des données :<br><br>
                            <span class=\"text-bold\">Délégué à la Protection des Données</span><br>
                            <span class=\"text-bold\">DragLab Technology GmbH</span><br>
                            E-Mail: <a class=\"highlighted\" href=\"mailto:dpo@draglab.de\">dpo@draglab.de</a><br>
                            Vous avez également le droit de déposer une plainte auprès de l'autorité de protection des données compétente :<br>
                            <a class=\"highlighted\" href=\"https://datenschutz.hessen.de/\">Commissariat à la Protection des Données et à la Liberté d'Information de Hesse</a><br>
                            <span class=\"text-bold\">Adresse postale :</span> Postfach 3163, 65021 Wiesbaden, Allemagne<br>
                            Pour toute question relative à la protection des données, veuillez contacter le délégué à la protection des données de Nanodrag Technology GmbH.`
                        }
                    ]
                }
            };



            res.render('customer/PrivacyPolicy', {
                lang,
                privacyPolicyContent,
                pageTitle: {
                    EN: 'Privacy Policy',
                    ES: 'Política de Privacidad',
                    DE: 'Datenschutzerklärung',
                    TR: 'Gizlilik Politikası',
                    FR: 'Politique de Confidentialité'

                }[lang],
                metaDescription: {
                    EN: 'Read DragLab’s Privacy Policy and learn how we handle your data.',
                    ES: 'Lea la Política de Privacidad de DragLab y conozca cómo manejamos sus datos.',
                    DE: 'Lesen Sie die Datenschutzrichtlinie von DragLab und erfahren Sie, wie wir mit Ihren Daten umgehen.',
                    TR: 'DragLab\'ın Gizlilik Politikasını okuyun ve bilgilerinizi nasıl işlediğimizi öğrenin.',
                    FR: 'Lisez la Politique de Confidentialité de DragLab et découvrez comment nous traitons vos données.'

                }[lang],
                products,
                lang,
                privacyPolicyContent

            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN');
        });

};
exports.getDataProtection = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || req.query.lang?.toUpperCase() || 'EN';

    const translations = {
        EN: {
            pageTitle: 'Data Protection Policy - DragLab',
            metaDescription: 'Learn how DragLab protects your personal data. Read our Data Protection Policy covering privacy, security, consent, and international data handling.',
            ogTitle: 'Data Protection Policy | DragLab',
            ogDescription: 'Your privacy matters. Learn how DragLab collects, uses, and safeguards your personal data in accordance with GDPR, CCPA, and international standards.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/dataprotection.jpg',
            sectionHeading: 'Data Protection Policy',
            content: [
                { title: 'Commitment to Privacy', text: 'At DragLab, we prioritize the protection of your personal data and are committed to ensuring its security and confidentiality. This includes any data that can identify you, such as your name, contact details, and any other information you provide to us. We handle your data with the utmost care, ensuring it is only used for legitimate purposes.' },
                { title: 'Data Collection and Usage', text: 'We collect only the data necessary to provide our products and services, improve our offerings, and communicate with you effectively. We are transparent about the types of data we collect, how it is used, and the legal basis for processing your information. Your data is used solely for the purposes it was collected for, and we do not sell or share your information with third parties without your consent.' },
                { title: 'Consent and Control', text: 'Your consent is paramount. We seek your explicit consent before collecting, using, or sharing your personal data. You have the right to withdraw your consent at any time, and we provide clear instructions on how to do so. Additionally, you have control over your personal information, including the right to access, correct, or delete your data.' },
                { title: 'Data Security', text: 'We employ advanced security measures to protect your personal data from unauthorized access, loss, or misuse. This includes encryption, secure servers, and regular security audits to ensure that your information remains safe.' },
                { title: 'Data Retention', text: 'We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, or resolve disputes. Once the data is no longer needed, it is securely deleted or anonymized.' },
                { title: 'Third-Party Data Sharing', text: 'We only share your personal data with trusted third parties when it is essential for providing our services or when required by law. These parties are contractually obligated to protect your data and use it solely for the intended purpose. We do not sell your data to third parties.' },
                { title: 'International Data Transfers', text: 'As a global company, DragLab may transfer your personal data to countries outside of your home jurisdiction. When we do so, we ensure your data is protected by appropriate safeguards in accordance with international standards.' },
                { title: 'Your Rights', text: 'You have several rights regarding your personal data, including the right to access, correct, update, or delete your information. You can also object to or restrict the processing of your data. We respond to these requests promptly and transparently.' },
                { title: 'Cookies and Tracking Technologies', text: 'We use cookies and similar technologies to enhance your experience, analyze usage, and support marketing efforts. You have control over your preferences and can choose to accept or decline cookies.' },
                { title: 'Data Breach Response', text: 'In the event of a data breach, we have a comprehensive response plan. We will notify affected individuals and authorities in compliance with legal requirements, and we will take steps to mitigate harm and prevent future incidents.' },
                { title: 'Employee Training and Awareness', text: 'Our employees are trained on data protection principles. We maintain a strong culture of privacy awareness and responsibility throughout our team.' },
                { title: 'Compliance with Laws and Regulations', text: 'We comply with all applicable data protection laws, including GDPR and CCPA. We are committed to maintaining the highest standards of data protection worldwide.' },
                { title: 'Children’s Privacy', text: 'Our services are not directed to children under 13, and we do not knowingly collect data from them. If we do collect such data, we delete it immediately.' },
                { title: 'Transparency and Communication', text: 'We are committed to transparency in our data handling practices. If you have any questions or concerns, we are available to assist you.' },
                { title: 'Policy Updates', text: 'We may update this policy to reflect changes in law or our practices. Significant updates will be communicated clearly and made readily available.' }
            ]
        },
        DE: {
            pageTitle: 'Datenschutzrichtlinie - DragLab',
            metaDescription: 'Erfahren Sie, wie DragLab Ihre persönlichen Daten schützt. Lesen Sie unsere Datenschutzrichtlinie über Sicherheit, Einwilligung und internationale Datenverarbeitung.',
            ogTitle: 'Datenschutz | DragLab',
            ogDescription: 'Ihre Privatsphäre ist uns wichtig. Erfahren Sie, wie DragLab personenbezogene Daten sammelt, verwendet und gemäß DSGVO schützt.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/dataprotection.jpg',
            sectionHeading: 'Datenschutzrichtlinie',
            content: [
                { title: 'Engagement für den Datenschutz', text: 'Bei DragLab steht der Schutz Ihrer personenbezogenen Daten an erster Stelle. Wir verpflichten uns zur Sicherheit und Vertraulichkeit Ihrer Daten, einschließlich Name, Kontaktdaten und anderer von Ihnen bereitgestellter Informationen. Ihre Daten werden nur zu legitimen Zwecken verwendet.' },
                { title: 'Datenerhebung und -verwendung', text: 'Wir erheben nur die Daten, die zur Bereitstellung unserer Produkte und Services erforderlich sind. Wir informieren Sie transparent über die Art der Daten, deren Verwendung und die rechtliche Grundlage. Ihre Daten werden nicht ohne Ihre Zustimmung verkauft oder an Dritte weitergegeben.' },
                { title: 'Einwilligung und Kontrolle', text: 'Ihre Zustimmung ist für uns entscheidend. Sie können Ihre Einwilligung jederzeit widerrufen. Darüber hinaus haben Sie das Recht auf Zugriff, Berichtigung und Löschung Ihrer Daten.' },
                { title: 'Datensicherheit', text: 'Wir setzen fortschrittliche Sicherheitsmaßnahmen ein, einschließlich Verschlüsselung und sicherer Server, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.' },
                { title: 'Datenspeicherung', text: 'Ihre Daten werden nur so lange gespeichert, wie sie für den jeweiligen Zweck notwendig sind oder gesetzliche Vorschriften dies erfordern. Danach werden sie sicher gelöscht oder anonymisiert.' },
                { title: 'Weitergabe an Dritte', text: 'Wir geben Ihre Daten nur an vertrauenswürdige Partner weiter, wenn dies zur Leistungserbringung notwendig ist oder gesetzlich vorgeschrieben. Diese Partner sind vertraglich zur Vertraulichkeit verpflichtet.' },
                { title: 'Internationale Datenübertragung', text: 'Als global tätiges Unternehmen übermitteln wir ggf. Daten in andere Länder. Dabei stellen wir sicher, dass Ihre Daten durch angemessene Sicherheitsvorkehrungen geschützt sind.' },
                { title: 'Ihre Rechte', text: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung sowie Widerspruch gegen die Verarbeitung Ihrer Daten. Wir reagieren transparent und zeitnah auf Ihre Anfragen.' },
                { title: 'Cookies und Tracking-Technologien', text: 'Wir verwenden Cookies, um Ihre Nutzererfahrung zu verbessern. Sie können Ihre Einstellungen jederzeit anpassen.' },
                { title: 'Reaktion bei Datenpannen', text: 'Im Falle eines Datenschutzvorfalls informieren wir betroffene Personen und Behörden gemäß den gesetzlichen Vorschriften und leiten Gegenmaßnahmen ein.' },
                { title: 'Mitarbeiterschulung und Bewusstsein', text: 'Unsere Mitarbeiter werden regelmäßig im Datenschutz geschult und sensibilisiert, um einen verantwortungsvollen Umgang mit Daten zu gewährleisten.' },
                { title: 'Rechtskonformität', text: 'Wir halten alle geltenden Datenschutzgesetze wie die DSGVO ein und gewährleisten höchste Standards im Datenschutz weltweit.' },
                { title: 'Datenschutz von Kindern', text: 'Unsere Dienstleistungen richten sich nicht an Kinder unter 13 Jahren. Sollte dennoch eine Datenerhebung erfolgen, löschen wir diese umgehend.' },
                { title: 'Transparenz und Kommunikation', text: 'Wir legen großen Wert auf Offenheit im Umgang mit Daten. Bei Fragen stehen wir Ihnen gerne zur Verfügung.' },
                { title: 'Aktualisierung der Richtlinie', text: 'Diese Richtlinie kann bei Bedarf angepasst werden. Wesentliche Änderungen werden transparent kommuniziert.' }
            ]

        },
        ES: {
            pageTitle: 'Política de Protección de Datos - DragLab',
            metaDescription: 'Conozca cómo DragLab protege sus datos personales. Lea nuestra Política de Protección de Datos sobre privacidad, seguridad y uso internacional.',
            ogTitle: 'Protección de Datos | DragLab',
            ogDescription: 'Su privacidad es importante. Descubra cómo DragLab recopila, utiliza y protege sus datos personales en cumplimiento de la RGPD y otras leyes.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/dataprotection.jpg',
            sectionHeading: 'Política de Protección de Datos',
            content: [
                { title: 'Compromiso con la privacidad', text: 'En DragLab priorizamos la protección de sus datos personales y nos comprometemos a garantizar su seguridad y confidencialidad. Esto incluye cualquier dato que pueda identificarle, como nombre, datos de contacto y cualquier otra información que nos proporcione.' },
                { title: 'Recopilación y uso de datos', text: 'Recopilamos solo los datos necesarios para brindar nuestros productos y servicios, mejorar nuestras ofertas y comunicarnos eficazmente con usted. No vendemos ni compartimos sus datos sin su consentimiento.' },
                { title: 'Consentimiento y control', text: 'Solicitamos su consentimiento explícito antes de recopilar, usar o compartir sus datos. Puede retirarlo en cualquier momento. Además, puede acceder, corregir o eliminar su información personal.' },
                { title: 'Seguridad de los datos', text: 'Implementamos medidas de seguridad avanzadas, como cifrado y servidores seguros, para proteger sus datos contra accesos no autorizados, pérdida o uso indebido.' },
                { title: 'Retención de datos', text: 'Conservamos sus datos solo el tiempo necesario para cumplir con el propósito para el cual fueron recopilados o según lo exija la ley. Luego, los eliminamos o anonimizamos de forma segura.' },
                { title: 'Compartir datos con terceros', text: 'Solo compartimos sus datos con terceros confiables cuando es esencial o por requerimiento legal. Estas entidades están obligadas a proteger sus datos y no los utilizarán para otros fines.' },
                { title: 'Transferencias internacionales de datos', text: 'Como empresa global, es posible que transfiramos sus datos a otros países. En esos casos, aplicamos salvaguardias adecuadas conforme a estándares internacionales.' },
                { title: 'Sus derechos', text: 'Usted tiene derecho a acceder, corregir, actualizar o eliminar su información, así como a oponerse o limitar su procesamiento. Respondemos a estas solicitudes de forma rápida y transparente.' },
                { title: 'Cookies y tecnologías de seguimiento', text: 'Usamos cookies para mejorar su experiencia y realizar análisis. Usted puede aceptar o rechazar el uso de cookies según sus preferencias.' },
                { title: 'Respuesta ante violaciones de datos', text: 'Contamos con un plan de respuesta ante incidentes. Notificamos a las autoridades y personas afectadas según la ley y tomamos medidas para mitigar cualquier daño.' },
                { title: 'Capacitación de empleados', text: 'Nuestros empleados reciben formación continua en protección de datos y fomentamos una cultura de privacidad responsable.' },
                { title: 'Cumplimiento legal', text: 'Cumplimos con todas las leyes de protección de datos aplicables, incluidas el RGPD y la CCPA, y mantenemos altos estándares de cumplimiento a nivel global.' },
                { title: 'Privacidad infantil', text: 'Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos conscientemente sus datos y, de hacerlo, los eliminamos de inmediato.' },
                { title: 'Transparencia y comunicación', text: 'Nos comprometemos a mantener una comunicación clara y abierta sobre nuestras prácticas de privacidad. Puede contactarnos ante cualquier duda.' },
                { title: 'Actualización de la política', text: 'Esta política puede modificarse conforme cambien las leyes o nuestras prácticas. Le informaremos de cualquier cambio importante.' }
            ]

        },
        TR: {
            pageTitle: 'Veri Koruma Politikası - DragLab',
            metaDescription: 'DragLab\'ın kişisel verilerinizi nasıl koruduğunu öğrenin. Gizlilik, güvenlik ve uluslararası veri işleme konularını kapsayan Veri Koruma Politikamızı okuyun.',
            ogTitle: 'Veri Koruma Politikası | DragLab',
            ogDescription: 'Gizliliğiniz önemlidir. DragLab\'ın kişisel verilerinizi GDPR, CCPA ve uluslararası standartlara uygun olarak nasıl topladığını, kullandığını ve koruduğunu öğrenin.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/dataprotection.jpg',
            sectionHeading: 'Veri Koruma Politikası',
            content: [
                { title: 'Gizliliğe Bağlılık', text: 'DragLab olarak, kişisel verilerinizin korunmasını önceliklendiriyoruz ve güvenliğini ve gizliliğini sağlamaya kararlıyız. Bu, adınız, iletişim bilgileriniz ve bize sağladığınız diğer bilgiler gibi sizi tanımlayabilecek herhangi bir veriyi içerir. Verileriniz yalnızca meşru amaçlar için kullanılır.' },
                { title: 'Veri Toplama ve Kullanımı', text: 'Ürün ve hizmetlerimizi sağlamak, tekliflerimizi iyileştirmek ve sizinle etkili bir şekilde iletişim kurmak için yalnızca gerekli verileri toplarız. Topladığımız veri türleri, nasıl kullanıldığı ve işleme için yasal dayanak hakkında şeffafız. Verileriniz, toplandığı amaçlar için yalnızca kullanılır ve izniniz olmadan satılmaz veya üçüncü taraflarla paylaşılmaz.' },
                { title: 'Rıza ve Kontrol', text: 'Kişisel verilerinizi toplamadan, kullanmadan veya paylaşmadan önce açık rızanızı talep ederiz. Rızanızı istediğiniz zaman geri çekme hakkına sahipsiniz ve bunu nasıl yapacağınız konusunda net talimatlar sağlıyoruz. Ayrıca, kişisel bilgileriniz üzerinde kontrol sahibisiniz; verilerinize erişme, düzeltme veya silme hakkınız vardır.' },
                { title: 'Veri Güvenliği', text: 'Kişisel verilerinizi yetkisiz erişim, kayıp veya kötüye kullanıma karşı korumak için gelişmiş güvenlik önlemleri uygularız. Bu, şifreleme, güvenli sunucular ve düzenli güvenlik denetimlerini içerir.' },
                { title: 'Veri Saklama', text: 'Kişisel verilerinizi yalnızca toplandığı amaçları yerine getirmek, yasal yükümlülüklere uymak veya anlaşmazlıkları çözmek için gerekli olduğu sürece saklarız. Veri artık gerekli olmadığında, güvenli bir şekilde silinir veya anonimleştirilir.' },
                { title: 'Üçüncü Taraf Veri Paylaşımı', text: 'Hizmetlerimizi sağlamak veya yasal olarak gerekli olduğunda, kişisel verilerinizi yalnızca güvenilir üçüncü taraflarla paylaşırız. Bu taraflar, verilerinizi korumak ve yalnızca amaçlanan amaç için kullanmakla yükümlüdür. Verileriniz üçüncü taraflara satılmaz.' },
                { title: 'Uluslararası Veri Aktarımları', text: 'Küresel bir şirket olarak, kişisel verilerinizi ikamet ettiğiniz yargı alanının dışındaki ülkelere aktarabiliriz. Bunu yaptığımızda, uluslararası standartlara uygun olarak verilerinizin uygun koruma önlemleriyle korunduğundan emin oluruz.' },
                { title: 'Haklarınız', text: 'Kişisel verilerinizle ilgili olarak erişim, düzeltme, güncelleme veya silme hakkınız vardır. Ayrıca, verilerinizin işlenmesine itiraz etme veya kısıtlama hakkınız da vardır. Bu taleplere hızlı ve şeffaf bir şekilde yanıt veririz.' },
                { title: 'Çerezler ve İzleme Teknolojileri', text: 'Deneyiminizi geliştirmek, kullanımı analiz etmek ve pazarlama çabalarını desteklemek için çerezler ve benzer teknolojiler kullanıyoruz. Tercihleriniz üzerinde kontrol sahibisiniz ve çerezleri kabul etmeyi veya reddetmeyi seçebilirsiniz.' },
                { title: 'Veri İhlali Yanıtı', text: 'Bir veri ihlali durumunda, kapsamlı bir yanıt planımız vardır. Etkilenen bireyleri ve yetkilileri yasal gerekliliklere uygun olarak bilgilendiririz ve zararı hafifletmek ve gelecekteki olayları önlemek için adımlar atarız.' },
                { title: 'Çalışan Eğitimi ve Farkındalığı', text: 'Çalışanlarımız veri koruma ilkeleri konusunda eğitilir. Ekibimiz genelinde güçlü bir gizlilik farkındalığı ve sorumluluk kültürü sürdürürüz.' },
                { title: 'Yasalara ve Düzenlemelere Uyum', text: 'GDPR ve CCPA dahil olmak üzere tüm geçerli veri koruma yasalarına uyarız. Dünya çapında en yüksek veri koruma standartlarını sürdürmeye kararlıyız.' },
                { title: 'Çocukların Gizliliği', text: 'Hizmetlerimiz 13 yaşın altındaki çocuklara yönelik değildir ve bilerek onlardan veri toplamayız. Böyle bir veri toplarsak, derhal sileriz.' },
                { title: 'Şeffaflık ve İletişim', text: 'Veri işleme uygulamalarımızda şeffaf olmaya kararlıyız. Herhangi bir sorunuz veya endişeniz varsa, size yardımcı olmak için buradayız.' },
                { title: 'Politika Güncellemeleri', text: 'Yasalar veya uygulamalarımızdaki değişiklikleri yansıtmak için bu politikayı güncelleyebiliriz. Önemli güncellemeler açıkça iletilecek ve kolayca erişilebilir olacaktır.' }
            ]
        },
        FR: {
            pageTitle: 'Politique de Protection des Données - DragLab',
            metaDescription: 'Découvrez comment DragLab protège vos données personnelles. Lisez notre Politique de Protection des Données couvrant la confidentialité, la sécurité, le consentement et la gestion internationale des données.',
            ogTitle: 'Politique de Protection des Données | DragLab',
            ogDescription: 'Votre vie privée est importante. Découvrez comment DragLab collecte, utilise et protège vos données personnelles conformément au RGPD, à la CCPA et aux normes internationales.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/dataprotection.jpg',
            sectionHeading: 'Politique de Protection des Données',
            content: [
                { title: 'Engagement envers la vie privée', text: 'Chez DragLab, nous accordons la priorité à la protection de vos données personnelles et nous nous engageons à garantir leur sécurité et leur confidentialité. Cela inclut toutes les données pouvant vous identifier, telles que votre nom, vos coordonnées et toute autre information que vous nous fournissez. Nous traitons vos données avec le plus grand soin, en veillant à ce qu\'elles ne soient utilisées qu\'à des fins légitimes.' },
                { title: 'Collecte et utilisation des données', text: 'Nous ne collectons que les données nécessaires pour fournir nos produits et services, améliorer nos offres et communiquer efficacement avec vous. Nous sommes transparents sur les types de données que nous collectons, la manière dont elles sont utilisées et la base juridique du traitement de vos informations. Vos données sont utilisées uniquement aux fins pour lesquelles elles ont été collectées, et nous ne vendons ni ne partageons vos informations avec des tiers sans votre consentement.' },
                { title: 'Consentement et contrôle', text: 'Votre consentement est primordial. Nous sollicitons votre consentement explicite avant de collecter, d\'utiliser ou de partager vos données personnelles. Vous avez le droit de retirer votre consentement à tout moment, et nous fournissons des instructions claires sur la manière de le faire. De plus, vous avez le contrôle de vos informations personnelles, y compris le droit d\'accéder, de corriger ou de supprimer vos données.' },
                { title: 'Sécurité des données', text: 'Nous employons des mesures de sécurité avancées pour protéger vos données personnelles contre tout accès non autorisé, perte ou mauvaise utilisation. Cela inclut le cryptage, des serveurs sécurisés et des audits de sécurité réguliers pour garantir que vos informations restent en sécurité.' },
                { title: 'Conservation des données', text: 'Nous ne conservons vos données personnelles que le temps nécessaire pour remplir les objectifs pour lesquels elles ont été collectées, pour nous conformer aux obligations légales ou pour résoudre des litiges. Une fois que les données ne sont plus nécessaires, elles sont supprimées en toute sécurité ou anonymisées.' },
                { title: 'Partage des données avec des tiers', text: 'Nous ne partageons vos données personnelles qu\'avec des tiers de confiance lorsque cela est essentiel à la fourniture de nos services ou lorsque la loi l\'exige. Ces parties sont contractuellement tenues de protéger vos données et de les utiliser uniquement à la fin prévue. Nous ne vendons pas vos données à des tiers.' },
                { title: 'Transferts internationaux de données', text: 'En tant qu\'entreprise mondiale, DragLab peut transférer vos données personnelles vers des pays en dehors de votre juridiction d\'origine. Lorsque nous le faisons, nous veillons à ce que vos données soient protégées par des garanties appropriées conformément aux normes internationales.' },
                { title: 'Vos droits', text: 'Vous disposez de plusieurs droits concernant vos données personnelles, notamment le droit d\'accéder, de corriger, de mettre à jour ou de supprimer vos informations. Vous pouvez également vous opposer ou restreindre le traitement de vos données. Nous répondons rapidement et de manière transparente à ces demandes.' },
                { title: 'Cookies et technologies de suivi', text: 'Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l\'utilisation et soutenir les efforts marketing. Vous avez le contrôle de vos préférences et pouvez choisir d\'accepter ou de refuser les cookies.' },
                { title: 'Réponse aux violations de données', text: 'En cas de violation de données, nous disposons d\'un plan de réponse complet. Nous informerons les personnes concernées et les autorités conformément aux exigences légales, et nous prendrons des mesures pour atténuer les dommages et prévenir les incidents futurs.' },
                { title: 'Formation et sensibilisation des employés', text: 'Nos employés sont formés aux principes de protection des données. Nous maintenons une forte culture de sensibilisation à la vie privée et de responsabilité au sein de notre équipe.' },
                { title: 'Conformité aux lois et réglementations', text: 'Nous respectons toutes les lois applicables en matière de protection des données, y compris le RGPD et la CCPA. Nous nous engageons à maintenir les normes les plus élevées en matière de protection des données dans le monde entier.' },
                { title: 'Confidentialité des enfants', text: 'Nos services ne s\'adressent pas aux enfants de moins de 13 ans, et nous ne collectons pas sciemment de données les concernant. Si nous collectons de telles données, nous les supprimons immédiatement.' },
                { title: 'Transparence et communication', text: 'Nous nous engageons à la transparence dans nos pratiques de gestion des données. Si vous avez des questions ou des préoccupations, nous sommes disponibles pour vous aider.' },
                { title: 'Mises à jour de la politique', text: 'Nous pouvons mettre à jour cette politique pour refléter les changements législatifs ou nos pratiques. Les mises à jour importantes seront communiquées clairement et rendues facilement accessibles.' }
            ]
        }
    };

    const t = translations[lang] || translations.EN;

    Product.find()
        .then(products => {
            res.render('customer/Data-Protection', {
                pageTitle: t.pageTitle,
                metaDescription: t.metaDescription,
                ogTitle: t.ogTitle,
                ogDescription: t.ogDescription,
                ogImage: t.ogImage,
                sectionHeading: t.sectionHeading,
                content: t.content,
                products,
                lang
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/EN/Data-Protection');
        });
};

exports.getimprint = async (req, res, next) => {
    try {
        const lang = (req.query.lang || req.params.lang || 'EN').toUpperCase();

        const translations = {
            EN: {
                companyName: "Company Name",
                location: "Location",
                representedBy: "Represented by",
                managingPartner: "Managing Partner",
                emailGeneral: "Email (General)",
                website: "Website",
                TrademarkOwnershipTitle: "Trademark Ownership",
                TrademarkOwnership: `Nanodrag Technology GmbH is the legal owner of the registered trademarks "DragLab" and/or "DragLab Technologies", including all associated intellectual property rights and usage.`,
                registrationCourt: "Registration Court",
                registrationNumber: "Registration Number",
                legalForm: "Legal Form",
                registrationPlace: "Place of Registration",
                vatHeading: "Sales tax identification number according to § 27a of the sales tax law",
                taxNumber: "Tax Number",
                contactDetails: "Contact Details",
                tel: "Tel",
                fax: "Fax",
                heroTitle: "Legal Notice (Imprint)",
                pageHeading: "Company Legal Information",
                Responsible: `Responsible for content according to § 55 Abs. 2 RStV:  <br>
                                NANODRAG TECHNOLOGY GmbH<br>
                                Alfred-Herrhausen-Allee 3-5  <br>
                                D-65760 Eschborn  <br>
                                Germany  <br>
                                `

            },
            ES: {
                companyName: "Nombre de la Empresa",
                location: "Ubicación",
                representedBy: "Representado por",
                managingPartner: "Socio Administrador",
                emailGeneral: "Correo electrónico (general)",
                website: "Sitio web",
                TrademarkOwnershipTitle: "Propiedad de la Marca Registrada",
                TrademarkOwnership: `Nanodrag Technology GmbH es el titular legal de las marcas registradas "DragLab" y/o "DragLab Technologies", incluyendo todos los derechos de propiedad intelectual y de uso asociados.`,
                registrationCourt: "Juzgado de Registro",
                registrationNumber: "Número de Registro",
                legalForm: "Forma jurídica",
                registrationPlace: "Lugar de Registro",
                vatHeading: "Número de identificación fiscal conforme al § 27a de la ley del IVA",
                taxNumber: "Número de Impuesto",
                contactDetails: "Datos de Contacto",
                tel: "Tel",
                fax: "Fax",
                heroTitle: "Aviso Legal",
                pageHeading: "Información Legal de la Empresa",
                Responsible: `Responsable del contenido según el § 55 párr. 2 RStV: <br> NANODRAG TECHNOLOGY GmbH<br> Alfred-Herrhausen-Allee 3-5 <br> D-65760 Eschborn <br> Alemania <br>
                                `
            },
            DE: {
                companyName: "Firmenname",
                location: "Standort",
                representedBy: "Vertreten durch",
                managingPartner: "Geschäftsführender Gesellschafter",
                emailGeneral: "E-Mail (Allgemein)",
                website: "Webseite",
                TrademarkOwnershipTitle: "Markeninhaberschaft",
                TrademarkOwnership: `Die Nanodrag Technology GmbH ist der rechtmäßige Inhaber der eingetragenen Marken „DragLab“ und/oder „DragLab Technologies“, einschließlich aller damit verbundenen Rechte an geistigem Eigentum und Nutzungsrechte.`,
                registrationCourt: "Registergericht",
                registrationNumber: "Handelsregisternummer",
                legalForm: "Rechtsform",
                registrationPlace: "Ort der Registrierung",
                vatHeading: "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz",
                taxNumber: "Steuernummer",
                contactDetails: "Kontaktinformationen",
                tel: "Tel",
                fax: "Fax",
                heroTitle: "Impressum",
                pageHeading: "Rechtliche Unternehmensinformationen",
                Responsible: `Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV: <br> NANODRAG TECHNOLOGY GmbH<br> Alfred-Herrhausen-Allee 3-5 <br> D-65760 Eschborn <br> Deutschland <br>`
            },
            TR: {
                companyName: "Şirket Adı",
                location: "Konum",
                representedBy: "Temsil Edilen",
                managingPartner: "Yönetici Ortak",
                emailGeneral: "E-posta (Genel)",
                website: "Web Sitesi",
                TrademarkOwnershipTitle: "Ticari Marka Sahipliği",
                TrademarkOwnership: `Nanodrag Technology GmbH, "DragLab" ve/veya "DragLab Technologies" tescilli markalarının yasal sahibidir ve tüm ilgili fikri mülkiyet hakları ve kullanım haklarına sahiptir.`,
                registrationCourt: "Kayıt Mahkemesi",
                registrationNumber: "Kayıt Numarası",
                legalForm: "Hukuki Biçim",
                registrationPlace: "Kayıt Yeri",
                vatHeading: "Katma Değer Vergisi Kimlik Numarası (§ 27a KDV Kanunu'na göre)",
                taxNumber: "Vergi Numarası",
                contactDetails: "İletişim Bilgileri",
                tel: "Tel",
                fax: "Fax",
                heroTitle: "Impressum",
                pageHeading: "Hukuki Şirket Bilgileri",
                Responsible: `İçerikten sorumlu kişi § 55 Abs. 2 RStV'ye göre: <br> NANODRAG TECHNOLOGY GmbH<br> Alfred-Herrhausen-Allee 3-5 <br> D-65760 Eschborn <br> Almanya <br>`
            },
            FR: {
                companyName: "Nom de l'Entreprise",
                location: "Emplacement",
                representedBy: "Représenté par",
                managingPartner: "Associé Gérant",
                emailGeneral: "E-mail (Général)",
                website: "Site Web",
                TrademarkOwnershipTitle: "Propriété de la Marque Déposée",
                TrademarkOwnership: `Nanodrag Technology GmbH est le propriétaire légal des marques déposées "DragLab" et/ou "DragLab Technologies", y compris tous les droits de propriété intellectuelle et d'utilisation associés.`,
                registrationCourt: "Tribunal d'Enregistrement",
                registrationNumber: "Numéro d'Enregistrement",
                legalForm: "Forme Juridique",
                registrationPlace: "Lieu d'Enregistrement",
                vatHeading: "Numéro d'identification à la TVA conformément au § 27a de la loi sur la TVA",
                taxNumber: "Numéro d'Imposition",
                contactDetails: "Coordonnées",
                tel: "Tél",
                fax: "Fax",
                heroTitle: "Impressum",
                pageHeading: "Hukuki Şirket Bilgileri",
                Responsible: `İçerikten sorumlu kişi § 55 Abs. 2 RStV'ye göre: <br> NANODRAG TECHNOLOGY GmbH<br> Alfred-Herrhausen-Allee 3-5 <br> D-65760 Eschborn <br> Almanya <br>`
            },
        };

        const meta = {
            EN: {
                title: "Legal Notice (Imprint) – DragLab",
                desc: "View DragLab’s legal disclosure, registration details, and contact information for Germany.",
                heroTitle: "Legal Notice (Imprint)",
                pageHeading: "Company Legal Information"
            },
            ES: {
                title: "Aviso Legal – DragLab",
                desc: "Consulta la divulgación legal, detalles de registro e información de contacto de DragLab en Alemania.",
                heroTitle: "Aviso Legal",
                pageHeading: "Información Legal de la Empresa"
            },
            DE: {
                title: "Impressum – DragLab",
                desc: "Rechtliche Hinweise, Handelsregistereintrag und Kontaktdaten von DragLab in Deutschland.",
                heroTitle: "Impressum",
                pageHeading: "Rechtliche Unternehmensinformationen"
            },
            TR: {
                title: "Yasal Uyarı (Impressum) – DragLab",
                desc: "DragLab'ın Almanya'daki yasal açıklamalarını, kayıt detaylarını ve iletişim bilgilerini görüntüleyin.",
                heroTitle: "Yasal Uyarı (Impressum)",
                pageHeading: "Şirket Hukuki Bilgileri"
            },
            FR: {
                title: "Mentions Légales – DragLab",
                desc: "Consultez les mentions légales, les détails d'enregistrement et les coordonnées de DragLab en Allemagne.",
                heroTitle: "Mentions Légales",
                pageHeading: "Informations Légales de l'Entreprise"
            }
        };

        const products = await Product.find();

        res.render('customer/imprint', {
            pageTitle: meta[lang].title,
            path: '/imprint',
            products,
            lang,
            t: translations[lang],
            meta: meta[lang]
        });
    } catch (err) {
        console.error('Error loading imprint page:', err);
        res.redirect('/');
    }
};

exports.getCodeofEthics = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN'; // 🔄 USE PARAM, not query

    const translations = {
        EN: {
            pageTitle: 'DragLab Code of Ethics',
            metaDescription: 'Read the DragLab Code of Ethics, outlining our values of integrity, sustainability, customer focus, and ethical responsibility.',
            ogTitle: 'Code of Ethics | DragLab ',
            ogDescription: 'Explore how DragLab commits to excellence, sustainability, fairness, and ethical practices across all business areas.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/codeofethics.jpg',
            sectionHeading: 'Code of Ethics',
            closingStatementBold: 'DragLab ’s Code of Ethics is more than a set of guidelines;',
            closingStatement: ' it is a reflection of who we are as a company. We are committed to upholding these principles in all our actions, ensuring that we remain a trusted and respected leader in our industry We encourage all employees, partners, and stakeholders to embrace these values and contribute to our mission of ethical excellence.',
            sections: [
                { title: '', text: 'At DragLab , we are committed to upholding the highest ethical standards in all aspects of our business. This Code of Ethics serves as a guide for our employees, partners, and stakeholders, ensuring that our actions reflect our core values of integrity, respect, and excellence.' },
                { title: 'Integrity and Honesty', text: 'We adhere to the highest standards of integrity, ensuring that our actions are honest and transparent. We build trust by consistently delivering on our commitments and maintaining open communication with all stakeholders.' },
                { title: 'Respect and Fairness', text: 'We treat all individuals with dignity, fostering an inclusive environment where everyone is valued. We are committed to fairness in all our interactions, providing equal opportunities regardless of race, gender, age, religion, or background.' },
                { title: 'Sustainability and Environmental Responsibility', text: 'DragLab is dedicated to sustainability, striving to minimize our environmental impact through responsible resource use, eco-friendly product design, and continuous innovation in sustainable practices.' },
                { title: 'Compliance with Laws and Regulations', text: 'We comply with all applicable laws and regulations in the regions where we operate. We expect all employees and partners to adhere to legal requirements and to conduct business in a manner that reflects our ethical values.' },
                { title: 'Confidentiality and Data Privacy', text: 'We respect the privacy and confidentiality of our customers, employees, and partners. We handle all sensitive information with the utmost care, ensuring that it is protected against unauthorized access and misuse.' },
                { title: 'Commitment to Excellence', text: 'We are committed to excellence in everything we do. Our focus on innovation, quality, and customer satisfaction drives us to continually improve our products and services, striving to exceed expectations.' },
                { title: 'Accountability', text: 'We take responsibility for our actions and their impact on our customers, employees, communities, and the environment. We maintain open channels for reporting unethical behavior and encourage transparency in all aspects of our business.' },
                { title: 'Conflict of Interest', text: 'We avoid conflicts of interest that could compromise our integrity or the trust placed in us by our customers and partners. Any potential conflicts are disclosed and managed appropriately to maintain our ethical standards.' },
                { title: 'Anti-Bribery and Corruption', text: 'DragLab has a zero-tolerance policy for bribery and corruption. We conduct all business transactions transparently and ethically, ensuring that we do not engage in or condone any form of corrupt practices.' },
                { title: 'Social Responsibility', text: 'We are committed to making a positive impact on society through our business activities. We support community initiatives, encourage volunteerism, and strive to be a responsible corporate citizen.' },
                { title: 'Health and Safety', text: 'We prioritize the health and safety of our employees, customers, and partners. We are committed to maintaining a safe and healthy work environment, adhering to all relevant safety regulations, and promoting wellness initiatives.' },
                { title: 'Innovation and Continuous Improvement', text: 'Innovation is at the heart of DragLab. We foster a culture of continuous improvement, encouraging creativity and experimentation while adhering to our ethical standards. We believe that innovation should always align with our commitment to ethical practices' },
                { title: 'Customer Focus', text: 'Our customers are central to our mission. We are dedicated to understanding their needs, delivering high-quality products and services, and ensuring customer satisfaction through ethical business practices and open communication.' },
                { title: 'Collaboration and Teamwork', text: 'We believe in the power of collaboration and teamwork. By working together, we can achieve our goals and create value for our customers and stakeholders. We foster a culture of mutual respect, trust, and shared success.' },
                { title: 'Ethical Marketing and Advertising', text: 'We are committed to honest and ethical marketing practices. Our advertising is truthful, non-deceptive, and reflects the quality and value of our products and services. We do not engage in misleading or exaggerated claims.' },
                { title: 'Supply Chain Responsibility', text: 'We expect our suppliers and partners to share our commitment to ethical practices. We work closely with them to ensure that our supply chain operates in a socially responsible and environmentally sustainable manner.' },
                { title: 'Intellectual Property', text: 'We respect intellectual property rights and expect others to do the same. We are committed to protecting our intellectual property and ensuring that our innovations are used in ways that align with our ethical standards.' },
                { title: 'Transparency and Disclosure', text: 'We believe in transparency in our business operations. We are committed to providing accurate and timely information to our stakeholders, ensuring that they are informed about our activities, performance, and ethical practices.' },
                { title: 'Employee Development', text: 'We invest in the growth and development of our employees. We provide opportunities for continuous learning, skill development, and career advancement, ensuring that our workforce is equipped to meet the challenges of tomorrow.' }
            ]
        },
        ES: {
            pageTitle: 'Código de Ética - DragLab',
            metaDescription: 'Descubra el Código de Ética de DragLab, que refleja nuestros valores de integridad, sostenibilidad, responsabilidad ética y enfoque en el cliente.',
            ogTitle: 'Código de Ética | DragLab',
            ogDescription: 'Explore cómo DragLab se compromete con la excelencia, la sostenibilidad, la equidad y las prácticas éticas en todas sus operaciones.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/codeofethics.jpg',
            sectionHeading: 'Código de Ética',
            closingStatement: 'El Código de Ética de DragLab es más que un conjunto de directrices; es un reflejo de quiénes somos como empresa. Estamos comprometidos a mantener estos principios en todas nuestras acciones, asegurando que sigamos siendo un líder confiable y respetado en nuestra industria.',
            sections: [
                { title: '', text: 'En DragLab, estamos comprometidos con los más altos estándares éticos en todos los aspectos de nuestro negocio. Este Código de Ética sirve como guía para nuestros empleados, socios y partes interesadas, asegurando que nuestras acciones reflejen nuestros valores fundamentales de integridad, respeto y excelencia.' },
                { title: 'Integridad y Honestidad', text: 'Nos adherimos a los más altos estándares de integridad, asegurando que nuestras acciones sean honestas y transparentes. Generamos confianza cumpliendo constantemente nuestros compromisos y manteniendo una comunicación abierta con todas las partes interesadas.' },
                { title: 'Respeto e Imparcialidad', text: 'Tratamos a todas las personas con dignidad, fomentando un entorno inclusivo donde todos sean valorados. Nos comprometemos con la equidad en todas nuestras interacciones, brindando igualdad de oportunidades sin importar raza, género, edad, religión u origen.' },
                { title: 'Sostenibilidad y Responsabilidad Ambiental', text: 'DragLab está comprometido con la sostenibilidad, buscando minimizar nuestro impacto ambiental mediante el uso responsable de recursos, el diseño ecológico de productos y la innovación continua en prácticas sostenibles.' },
                { title: 'Cumplimiento de Leyes y Normativas', text: 'Cumplimos con todas las leyes y regulaciones aplicables en las regiones donde operamos. Esperamos que todos los empleados y socios respeten los requisitos legales y actúen de acuerdo con nuestros valores éticos.' },
                { title: 'Confidencialidad y Privacidad de Datos', text: 'Respetamos la privacidad y confidencialidad de nuestros clientes, empleados y socios. Tratamos toda información sensible con el máximo cuidado, asegurando que esté protegida contra accesos no autorizados o usos indebidos.' },
                { title: 'Compromiso con la Excelencia', text: 'Estamos comprometidos con la excelencia en todo lo que hacemos. Nuestro enfoque en la innovación, la calidad y la satisfacción del cliente nos impulsa a mejorar continuamente nuestros productos y servicios.' },
                { title: 'Responsabilidad', text: 'Asumimos la responsabilidad por nuestras acciones y su impacto en los clientes, empleados, comunidades y el medio ambiente. Mantenemos canales abiertos para reportar conductas no éticas y fomentamos la transparencia en todas las áreas del negocio.' },
                { title: 'Conflicto de Interés', text: 'Evitamos los conflictos de interés que puedan comprometer nuestra integridad o la confianza depositada en nosotros. Cualquier conflicto potencial se debe comunicar y gestionar adecuadamente para mantener nuestros estándares éticos.' },
                { title: 'Anticorrupción y Antisoborno', text: 'DragLab aplica una política de tolerancia cero frente al soborno y la corrupción. Todas nuestras transacciones se realizan de forma transparente y ética.' },
                { title: 'Responsabilidad Social', text: 'Estamos comprometidos con generar un impacto positivo en la sociedad a través de nuestras actividades empresariales. Apoyamos iniciativas comunitarias, fomentamos el voluntariado y buscamos ser un ciudadano corporativo responsable.' },
                { title: 'Salud y Seguridad', text: 'Priorizamos la salud y seguridad de nuestros empleados, clientes y socios. Nos comprometemos a mantener un entorno de trabajo seguro y saludable, cumpliendo con todas las normativas vigentes.' },
                { title: 'Innovación y Mejora Continua', text: 'La innovación es el núcleo de DragLab. Fomentamos una cultura de mejora continua, creatividad y ética en cada paso del proceso de desarrollo.' },
                { title: 'Enfoque en el Cliente', text: 'Nuestros clientes están en el centro de nuestra misión. Nos dedicamos a comprender sus necesidades, ofrecer productos de alta calidad y garantizar su satisfacción mediante prácticas éticas.' },
                { title: 'Colaboración y Trabajo en Equipo', text: 'Creemos en el poder del trabajo colaborativo. Juntos alcanzamos nuestras metas, creando valor compartido para nuestros clientes y socios.' },
                { title: 'Marketing y Publicidad Éticos', text: 'Nos comprometemos con un marketing honesto y responsable. Nuestras campañas son claras, veraces y no engañosas.' },
                { title: 'Responsabilidad en la Cadena de Suministro', text: 'Esperamos que nuestros proveedores compartan nuestro compromiso ético. Trabajamos con ellos para garantizar prácticas responsables y sostenibles en toda la cadena de suministro.' },
                { title: 'Propiedad Intelectual', text: 'Respetamos los derechos de propiedad intelectual y esperamos el mismo respeto por parte de otros. Protegemos nuestras innovaciones según principios éticos.' },
                { title: 'Transparencia y Divulgación', text: 'Creemos en la transparencia. Proporcionamos información precisa y oportuna a nuestros grupos de interés sobre nuestras operaciones y valores.' },
                { title: 'Desarrollo de Empleados', text: 'Invertimos en el crecimiento profesional de nuestros empleados, ofreciendo oportunidades de aprendizaje continuo y avance en sus carreras.' }
            ]
        },
        DE: {
            pageTitle: 'Verhaltenskodex - DragLab',
            metaDescription: 'Lesen Sie den Verhaltenskodex von DragLab, der unsere Werte wie Integrität, Nachhaltigkeit, Kundenorientierung und ethische Verantwortung beschreibt.',
            ogTitle: 'Verhaltenskodex | DragLab',
            ogDescription: 'Erfahren Sie, wie sich DragLab für Exzellenz, Nachhaltigkeit, Fairness und ethisches Handeln in allen Unternehmensbereichen einsetzt.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/codeofethics.jpg',
            sectionHeading: 'Verhaltenskodex',
            closingStatement: 'Der Verhaltenskodex von DragLab ist mehr als nur eine Richtlinie; er ist Ausdruck unserer Identität als Unternehmen. Wir verpflichten uns, diese Grundsätze in allen Handlungen einzuhalten und ein vertrauenswürdiger Marktführer zu bleiben.',
            sections: [
                { title: '', text: 'Bei DragLab verpflichten wir uns zu höchsten ethischen Standards in allen Bereichen unseres Unternehmens. Dieser Verhaltenskodex dient als Leitfaden für unsere Mitarbeiter, Partner und Stakeholder und stellt sicher, dass unser Handeln unsere Werte Integrität, Respekt und Exzellenz widerspiegelt.' },
                { title: 'Integrität und Ehrlichkeit', text: 'Wir handeln ehrlich und transparent. Wir bauen Vertrauen auf, indem wir unsere Zusagen einhalten und offen mit allen Interessengruppen kommunizieren.' },
                { title: 'Respekt und Fairness', text: 'Wir behandeln alle Menschen mit Würde und fördern ein integratives Umfeld. Wir setzen uns für Fairness und Chancengleichheit ein – unabhängig von Herkunft, Geschlecht, Alter, Religion oder Hintergrund.' },
                { title: 'Nachhaltigkeit und Umweltverantwortung', text: 'DragLab engagiert sich für Nachhaltigkeit und bemüht sich, die Umweltbelastung durch verantwortungsvolle Ressourcennutzung, umweltfreundliches Produktdesign und innovative Verfahren zu minimieren.' },
                { title: 'Einhaltung von Gesetzen und Vorschriften', text: 'Wir halten uns an alle geltenden Gesetze und Vorschriften in den Regionen, in denen wir tätig sind. Unsere Mitarbeiter und Partner handeln im Einklang mit unseren ethischen Grundsätzen.' },
                { title: 'Vertraulichkeit und Datenschutz', text: 'Wir respektieren die Privatsphäre und Vertraulichkeit unserer Kunden, Mitarbeiter und Partner. Sensible Daten werden mit größter Sorgfalt behandelt und vor Missbrauch geschützt.' },
                { title: 'Streben nach Exzellenz', text: 'Wir streben nach Spitzenleistungen in allem, was wir tun. Durch Innovation und Qualität verbessern wir unsere Produkte und Dienstleistungen kontinuierlich.' },
                { title: 'Verantwortung', text: 'Wir übernehmen Verantwortung für unser Handeln und dessen Auswirkungen. Unethisches Verhalten kann jederzeit gemeldet werden – Offenheit und Transparenz sind uns wichtig.' },
                { title: 'Interessenkonflikte', text: 'Wir vermeiden Situationen, die unsere Integrität oder das Vertrauen unserer Partner gefährden könnten. Potenzielle Konflikte werden transparent offengelegt und verantwortungsvoll behandelt.' },
                { title: 'Antikorruption und Bestechung', text: 'DragLab hat eine Null-Toleranz-Politik gegenüber Korruption. Geschäftstransaktionen erfolgen stets transparent und ethisch korrekt.' },
                { title: 'Soziale Verantwortung', text: 'Wir tragen durch unsere Geschäftsaktivitäten positiv zur Gesellschaft bei. Wir fördern ehrenamtliches Engagement und unterstützen gemeinnützige Initiativen.' },
                { title: 'Gesundheit und Sicherheit', text: 'Die Gesundheit und Sicherheit unserer Mitarbeiter, Kunden und Partner hat höchste Priorität. Wir schaffen sichere Arbeitsumgebungen und fördern das Wohlbefinden.' },
                { title: 'Innovation und kontinuierliche Verbesserung', text: 'Innovation steht im Mittelpunkt unserer Arbeit. Wir fördern Kreativität und kontinuierliches Lernen im Einklang mit unseren ethischen Standards.' },
                { title: 'Kundenorientierung', text: 'Unsere Kunden stehen im Fokus. Wir verstehen ihre Bedürfnisse, liefern hochwertige Produkte und sorgen für ihre Zufriedenheit durch ethisches Verhalten.' },
                { title: 'Zusammenarbeit und Teamarbeit', text: 'Erfolg ist Teamarbeit. Wir fördern Respekt, Vertrauen und gemeinsames Wachstum.' },
                { title: 'Ethisches Marketing und Werbung', text: 'Unsere Werbung ist ehrlich, sachlich und nicht irreführend. Wir kommunizieren den wahren Wert unserer Produkte.' },
                { title: 'Verantwortung in der Lieferkette', text: 'Wir erwarten von unseren Lieferanten dieselben ethischen Standards. Wir arbeiten nur mit verantwortungsvollen Partnern zusammen.' },
                { title: 'Geistiges Eigentum', text: 'Wir respektieren geistiges Eigentum – sowohl unser eigenes als auch das anderer. Unsere Innovationen schützen wir verantwortungsvoll.' },
                { title: 'Transparenz und Offenlegung', text: 'Wir informieren unsere Stakeholder offen und zeitnah über unsere Leistungen, Werte und Ziele.' },
                { title: 'Mitarbeiterentwicklung', text: 'Wir investieren in unsere Mitarbeiter durch Weiterbildung und individuelle Entwicklungsmöglichkeiten.' }
            ]
        },
        TR: {
            pageTitle: 'Etik Kuralları - DragLab',
            metaDescription: 'DragLab Etik Kurallarını okuyun; dürüstlük, sürdürülebilirlik, müşteri odaklılık ve etik sorumluluk değerlerimizi özetler.',
            ogTitle: 'Etik Kuralları | DragLab',
            ogDescription: 'DragLab’ın tüm iş alanlarında mükemmeliyet, sürdürülebilirlik, adalet ve etik uygulamalara nasıl bağlı olduğunu keşfedin.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/codeofethics.jpg',
            sectionHeading: 'Etik Kuralları',
            closingStatement: 'DragLab’ın Etik Kuralları, bir dizi yönergeden daha fazlasıdır; kim olduğumuzun bir yansımasıdır. Bu ilkeleri tüm eylemlerimizde sürdürmeye kararlıyız ve sektörümüzde güvenilir ve saygın bir lider olmaya devam ediyoruz.',
            sections: [
                { title: '', text: 'DragLab olarak işimizin her alanında en yüksek etik standartları sürdürmeye kararlıyız. Bu Etik Kurallar, çalışanlarımız, ortaklarımız ve paydaşlarımız için bir rehber olarak hizmet eder ve eylemlerimizin dürüstlük, saygı ve mükemmeliyet gibi temel değerlerimizi yansıtmasını sağlar.' },
                { title: 'Dürüstlük ve Doğruluk', text: 'En yüksek dürüstlük standartlarına bağlıyız, eylemlerimizin dürüst ve şeffaf olmasını sağlıyoruz. Taahhütlerimizi tutarak ve tüm paydaşlarla açık iletişim kurarak güven inşa ediyoruz.' },
                { title: 'Saygı ve Adalet', text: 'Tüm bireylere saygı ile davranıyoruz, herkesin değerli olduğu kapsayıcı bir ortamı teşvik ediyoruz. Irk, cinsiyet, yaş, din veya geçmiş ne olursa olsun eşit fırsatlar sunarak tüm etkileşimlerimizde adalete bağlıyız.' },
                { title: 'Sürdürülebilirlik ve Çevresel Sorumluluk', text: 'DragLab, sürdürülebilirliğe kendini adamıştır ve sorumlu kaynak kullanımı, çevre dostu ürün tasarımı ve sürdürülebilir uygulamalarda sürekli yenilik yoluyla çevresel etkilerimizi en aza indirmeye çalışmaktadır.' },
                { title: 'Yasalara ve Düzenlemelere Uyum', text: 'Faaliyet gösterdiğimiz bölgelerde geçerli tüm yasa ve düzenlemelere uyuyoruz. Tüm çalışanlarımızın ve ortaklarımızın yasal gerekliliklere uymasını ve işlerini etik değerlerimizi yansıtan bir şekilde yürütmesini bekliyoruz.' },
                { title: 'Gizlilik ve Veri Koruma', text: 'Müşterilerimizin, çalışanlarımızın ve ortaklarımızın gizliliğine ve mahremiyetine saygı duyuyoruz. Tüm hassas bilgileri en üst düzeyde özenle ele alıyor ve yetkisiz erişim ve kötüye kullanıma karşı koruyoruz.' },
                { title: 'Mükemmeliyete Bağlılık', text: 'Yaptığımız her şeyde mükemmelliğe bağlıyız. Yenilik, kalite ve müşteri memnuniyetine odaklanmamız, ürünlerimizi ve hizmetlerimizi sürekli olarak iyileştirmemizi sağlar.' },
                { title: 'Hesap Verebilirlik', text: 'Eylemlerimiz ve bunların müşterilerimiz, çalışanlarımız, topluluklarımız ve çevre üzerindeki etkileri için sorumluluk alıyoruz. Etik olmayan davranışları bildirmek için açık kanallar tutuyor ve işimizin tüm yönlerinde şeffaflığı teşvik ediyoruz.' },
                { title: 'Çıkar Çatışması', text: 'Müşterilerimiz ve ortaklarımız tarafından bize duyulan güveni veya bütünlüğümüzü tehlikeye atabilecek çıkar çatışmalarından kaçınıyoruz. Potansiyel çatışmalar açıklanır ve etik standartlarımızı korumak için uygun şekilde yönetilir.' },
                { title: 'Rüşvet ve Yolsuzlukla Mücadele', text: 'DragLab, rüşvet ve yolsuzluğa karşı sıfır tolerans politikasına sahiptir. Tüm iş işlemlerimizi şeffaf ve etik bir şekilde yürütüyor, herhangi bir yolsuz uygulamaya dahil olmuyor veya onaylamıyoruz.' },
                { title: 'Sosyal Sorumluluk', text: 'İş faaliyetlerimiz aracılığıyla topluma olumlu bir katkıda bulunmaya kararlıyız. Topluluk girişimlerini destekliyor, gönüllülüğü teşvik ediyor ve sorumlu bir kurumsal vatandaş olmaya çalışıyoruz.' },
                { title: 'Sağlık ve Güvenlik', text: 'Çalışanlarımızın, müşterilerimizin ve ortaklarımızın sağlığı ve güvenliği önceliğimizdir. Tüm ilgili güvenlik düzenlemelerine uyarak güvenli ve sağlıklı bir çalışma ortamı sağlamaya kararlıyız.' },
                { title: 'Yenilik ve Sürekli İyileştirme', text: 'Yenilik, DragLab’ın kalbinde yer alır. Etik standartlarımıza bağlı kalarak yaratıcılığı ve deneyselliği teşvik eden sürekli iyileştirme kültürünü destekliyoruz.' },
                { title: 'Müşteri Odaklılık', text: 'Müşterilerimiz misyonumuzun merkezindedir. İhtiyaçlarını anlamaya, yüksek kaliteli ürünler ve hizmetler sunmaya ve etik iş uygulamaları ve açık iletişim yoluyla müşteri memnuniyetini sağlamaya kendimizi adadık.' },
                { title: 'İşbirliği ve Takım Çalışması', text: 'İşbirliği ve takım çalışmasının gücüne inanıyoruz. Birlikte çalışarak hedeflerimize ulaşabilir ve müşterilerimiz ve paydaşlarımız için değer yaratabiliriz.' },
                { title: 'Etik Pazarlama ve Reklam', text: 'Dürüst ve etik pazarlama uygulamalarına bağlıyız. Reklamlarımız doğru, yanıltıcı olmayan ve ürünlerimizin ve hizmetlerimizin kalitesini ve değerini yansıtıyor.' },
                { title: 'Tedarik Zinciri Sorumluluğu', text: 'Tedarikçilerimizin ve ortaklarımızın etik uygulamalara olan bağlılığımızı paylaşmasını bekliyoruz. Tedarik zincirimizin sosyal olarak sorumlu ve çevresel olarak sürdürülebilir bir şekilde işlemesini sağlamak için onlarla yakın çalışıyoruz.' },
                { title: 'Fikri Mülkiyet', text: 'Fikri mülkiyet haklarına saygı duyuyoruz ve başkalarının da aynı saygıyı göstermesini bekliyoruz. Fikirlerimizin etik standartlarımıza uygun şekilde kullanılmasını sağlamak için yeniliklerimizi koruyoruz.' },
                { title: 'Şeffaflık ve Açıklama', text: 'İş operasyonlarımızda şeffaflığa inanıyoruz. Faaliyetlerimiz, performansımız ve etik uygulamalarımız hakkında paydaşlarımıza doğru ve zamanında bilgi sağlamaya kararlıyız.' },
                { title: 'Çalışan Gelişimi', text: 'Çalışanlarımızın büyümesine ve gelişimine yatırım yapıyoruz. Sürekli öğrenme, beceri geliştirme ve kariyer ilerlemesi için fırsatlar sunarak iş gücümüzün yarının zorluklarıyla başa çıkmasını sağlıyoruz.' }
            ]
        },
        FR: {
            pageTitle: 'Code d\'éthique - DragLab',
            metaDescription: 'Lisez le Code d\'éthique de DragLab, qui reflète nos valeurs d\'intégrité, de durabilité, de centration client et de responsabilité éthique.',
            ogTitle: 'Code d\'éthique | DragLab',
            ogDescription: 'Découvrez comment DragLab s\'engage pour l\'excellence, la durabilité, l\'équité et les pratiques éthiques dans tous ses domaines d\'activité.',
            ogImage: 'https://yourdomain.com/assets/Imgs/SEO/codeofethics.jpg',
            sectionHeading: 'Code d\'éthique',
            closingStatement: 'Le Code d\'éthique de DragLab est plus qu\'un ensemble de directives ; il reflète qui nous sommes en tant qu\'entreprise. Nous nous engageons à respecter ces principes dans toutes nos actions, assurant ainsi que nous restons un leader de confiance et respecté dans notre secteur.',
            closingStatementBold: 'Le Code d\'éthique de DragLab est plus qu\'un ensemble de directives ;',
            sections: [
                { title: '', text: 'Chez DragLab, nous nous engageons à respecter les normes éthiques les plus élevées dans tous les aspects de notre activité. Ce Code d\'éthique sert de guide pour nos employés, partenaires et parties prenantes, garantissant que nos actions reflètent nos valeurs fondamentales d\'intégrité, de respect et d\'excellence.' },
                { title: 'Intégrité et honnêteté', text: 'Nous adhérons aux normes les plus élevées d\'intégrité, veillant à ce que nos actions soient honnêtes et transparentes. Nous bâtissons la confiance en respectant constamment nos engagements et en maintenant une communication ouverte avec toutes les parties prenantes.' },
                { title: 'Respect et équité', text: 'Nous traitons tous les individus avec dignité, favorisant un environnement inclusif où chacun est valorisé. Nous nous engageons à l\'équité dans toutes nos interactions, offrant des opportunités égales indépendamment de la race, du sexe, de l\'âge ou de toute autre caractéristique personnelle.' },
                { title: 'Durabilité et responsabilité environnementale', text: 'DragLab est dédié à la durabilité, s\'efforçant de minimiser notre impact environnemental grâce à une utilisation responsable des ressources, à la conception de produits écologiques et à une innovation continue dans les pratiques durables.' },
                { title: 'Conformité aux lois et réglementations', text: 'Nous respectons toutes les lois et réglementations applicables dans les régions où nous opérons. Nous attendons de tous nos employés et partenaires qu\'ils respectent les exigences légales et qu\'ils mènent leurs activités d\'une manière qui reflète nos valeurs éthiques.' },
                { title: 'Confidentialité et protection des données', text: 'Nous respectons la vie privée et la confidentialité de nos clients, employés et partenaires. Nous traitons toutes les informations sensibles avec le plus grand soin, en veillant à ce qu\'elles soient protégées contre tout accès ou usage non autorisé.' },
                { title: 'Engagement envers l\'excellence', text: 'Nous nous engageons à l\'excellence dans tout ce que nous faisons. Notre concentration sur l\'innovation, la qualité et la satisfaction client nous pousse à améliorer continuellement nos produits et services.' },
                { title: 'Responsabilité', text: 'Nous assumons la responsabilité de nos actions et de leur impact sur nos clients, employés, communautés et l\'environnement. Nous maintenons des canaux ouverts pour signaler les comportements non éthiques et encourageons la transparence dans tous les aspects de notre entreprise.' },
                { title: 'Conflit d\'intérêts', text: 'Nous évitons les conflits d\'intérêts qui pourraient compromettre notre intégrité ou la confiance placée en nous par nos clients et partenaires. Tout conflit potentiel est divulgué et géré de manière appropriée pour maintenir nos normes éthiques.' },
                { title: 'Lutte contre la corruption et la fraude', text: 'DragLab applique une politique de tolérance zéro envers la corruption. Nous menons toutes nos transactions commerciales de manière transparente et éthique, en veillant à ne pas nous engager dans des pratiques corrompues.' },
                { title: 'Responsabilité sociale', text: 'Nous nous engageons à avoir un impact positif sur la société à travers nos activités commerciales. Nous soutenons les initiatives communautaires, encourageons le bénévolat et nous efforçons d\'être un citoyen corporatif responsable.' },
                { title: 'Santé et sécurité', text: 'Nous priorisons la santé et la sécurité de nos employés, clients et partenaires. Nous nous engageons à maintenir un environnement de travail sûr et sain, en respectant toutes les réglementations de sécurité pertinentes et en promouvant des initiatives de bien-être.' },
                { title: 'Innovation et amélioration continue', text: 'L\'innovation est au cœur de DragLab. Nous favorisons une culture d\'amélioration continue, encourageant la créativité et l\'expérimentation tout en respectant nos normes éthiques.' },
                { title: 'Centration client', text: 'Nos clients sont au centre de notre mission. Nous nous consacrons à comprendre leurs besoins, à fournir des produits et services de haute qualité, et à assurer leur satisfaction grâce à des pratiques commerciales éthiques et une communication ouverte.' },
                { title: 'Collaboration et travail d\'équipe', text: 'Nous croyons au pouvoir de la collaboration et du travail d\'équipe. En travaillant ensemble, nous pouvons atteindre nos objectifs et créer de la valeur pour nos clients et parties prenantes. Nous favorisons une culture de respect mutuel, de confiance et de succès partagé.' },
                { title: 'Marketing et publicité éthiques', text: 'Nous nous engageons à des pratiques de marketing honnêtes et éthiques. Notre publicité est véridique, non trompeuse et reflète la qualité et la valeur de nos produits et services.' },
                { title: 'Responsabilité dans la chaîne d\'approvisionnement', text: 'Nous attendons de nos fournisseurs et partenaires qu\'ils partagent notre engagement envers les pratiques éthiques. Nous travaillons en étroite collaboration avec eux pour garantir que notre chaîne d\'approvisionnement fonctionne de manière socialement responsable et durable sur le plan environnemental.' },
                { title: 'Propriété intellectuelle', text: 'Nous respectons les droits de propriété intellectuelle et attendons des autres qu\'ils fassent de même. Nous nous engageons à protéger notre propriété intellectuelle et à veiller à ce que nos innovations soient utilisées de manière conforme à nos normes éthiques.' },
                { title: 'Transparence et divulgation', text: 'Nous croyons en la transparence dans nos opérations commerciales. Nous nous engageons à fournir des informations précises et opportunes à nos parties prenantes, en veillant à ce qu\'elles soient informées de nos activités, de nos performances et de nos pratiques éthiques.' },
                { title: 'Développement des employés', text: 'Nous investissons dans la croissance et le développement de nos employés. Nous offrons des opportunités d\'apprentissage continu, de développement des compétences et d\'avancement professionnel, garantissant que notre personnel est équipé pour relever les défis de demain.' }
            ]
        }

    };

    const t = translations[lang] || translations['EN'];

    Product.find()
        .then(products => {
            res.render('customer/CodeofEthics', {
                pageTitle: t.pageTitle,
                metaDescription: t.metaDescription,
                ogTitle: t.ogTitle,
                ogDescription: t.ogDescription,
                ogImage: t.ogImage,
                sectionHeading: t.sectionHeading,
                sections: t.sections,
                closingStatement: t.closingStatement,
                closingStatementBold: t.closingStatementBold,
                products,
                lang
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};

exports.getQualitypolicy = async (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || 'EN';

    const translations = {
        EN: {
            pageTitle: 'Quality Policy',
            metaDescription: 'Discover DragLab’s commitment to product excellence and continuous improvement. Read our comprehensive Quality Policy.',
            ogTitle: 'Quality Policy | DragLab',
            ogDescription: 'Explore our dedication to quality, compliance, sustainability, and customer satisfaction through our quality practices.',
            heroTitle: 'Quality Policy',
            heading: 'Our Quality Policy',
            intro: `At <strong>DragLab</strong>, our Quality Policy reflects our commitment to excellence, reliability, and continuous improvement across all aspects of our operations. Our goal is to consistently provide products and services that meet or exceed customer expectations.`,
            sections: [
                {
                    title: "Customer Focus",
                    body: "Understanding and meeting customer needs is our top priority. We strive to build long-lasting relationships based on trust, performance, and satisfaction."
                },
                {
                    title: "Compliance and Standards",
                    body: "We adhere to all relevant industry standards and regulatory requirements, ensuring that our products are safe, effective, and reliable."
                },
                {
                    title: "Continuous Improvement",
                    body: "Through regular reviews, feedback mechanisms, and innovation, we continuously enhance our processes, products, and services. We embrace new technologies to stay at the forefront of the laboratory equipment industry."
                },
                {
                    title: "Employee Involvement",
                    body: "Our team is our greatest asset. We invest in ongoing training and professional development to empower our employees to actively contribute to our quality objectives."
                },
                {
                    title: "Supplier Relationships",
                    body: "We work closely with our suppliers to ensure that all materials and components meet our stringent quality standards, supporting the excellence of our final products."
                },
                {
                    title: "Sustainability",
                    body: "We are committed to sustainable practices across all operations, minimizing environmental impact while maintaining the highest quality standards."
                }
            ],
            implementationTitle: "Implementation and Monitoring",
            implementationList: [
                {
                    title: "Quality Management System:",
                    value: "Robust system aligned with ISO and CE standards."
                },
                {
                    title: "Audits and Inspections:",
                    value: "Regular internal and external evaluations for compliance and improvements."
                },
                {
                    title: "Customer Feedback:",
                    value: "Active collection and application of customer feedback to drive excellence."
                }
            ],
            commitmentTitle: "Commitment to Excellence",
            commitmentBody: `At DragLab, maintaining the highest standards of quality is the foundation of everything we do. Our Quality Policy supports our mission to deliver superior laboratory products and services that our customers can trust. We thank you for your confidence in DragLab and look forward to serving you with the highest levels of quality and innovation.`
        },
        ES: {
            pageTitle: 'Política de Calidad',
            metaDescription: 'Descubra el compromiso de DragLab con la excelencia de productos y la mejora continua. Lea nuestra Política de Calidad.',
            ogTitle: 'Política de Calidad | DragLab',
            ogDescription: 'Explore nuestra dedicación a la calidad, cumplimiento, sostenibilidad y satisfacción del cliente a través de nuestras prácticas de calidad.',
            heroTitle: 'Política de Calidad',
            heading: 'Nuestra Política de Calidad',
            intro: `En <strong>DragLab</strong>, nuestra Política de Calidad refleja nuestro compromiso con la excelencia, la fiabilidad y la mejora continua en todos los aspectos de nuestras operaciones. Nuestro objetivo es proporcionar constantemente productos y servicios que cumplan o superen las expectativas del cliente.`,
            sections: [
                {
                    title: "Enfoque en el cliente",
                    body: "Comprender y satisfacer las necesidades del cliente es nuestra principal prioridad. Nos esforzamos por construir relaciones duraderas basadas en la confianza, el rendimiento y la satisfacción."
                },
                {
                    title: "Cumplimiento y normas",
                    body: "Cumplimos con todas las normas del sector y requisitos reglamentarios pertinentes, garantizando que nuestros productos sean seguros, eficaces y fiables."
                },
                {
                    title: "Mejora continua",
                    body: "Mediante revisiones periódicas, mecanismos de retroalimentación e innovación, mejoramos continuamente nuestros procesos, productos y servicios. Adoptamos nuevas tecnologías para mantenernos a la vanguardia de la industria de equipos de laboratorio."
                },
                {
                    title: "Participación de los empleados",
                    body: "Nuestro equipo es nuestro mayor activo. Invertimos en formación continua y desarrollo profesional para capacitar a nuestros empleados a contribuir activamente a nuestros objetivos de calidad."
                },
                {
                    title: "Relaciones con proveedores",
                    body: "Colaboramos estrechamente con nuestros proveedores para garantizar que todos los materiales y componentes cumplan con nuestros estrictos estándares de calidad, apoyando así la excelencia de nuestros productos finales."
                },
                {
                    title: "Sostenibilidad",
                    body: "Estamos comprometidos con prácticas sostenibles en todas nuestras operaciones, minimizando el impacto ambiental mientras mantenemos los más altos estándares de calidad."
                }
            ],
            implementationTitle: "Implementación y seguimiento",
            implementationList: [
                {
                    title: "Sistema de gestión de calidad:",
                    value: "Sistema robusto alineado con las normas ISO y CE."
                },
                {
                    title: "Auditorías e inspecciones:",
                    value: "Evaluaciones internas y externas regulares para garantizar el cumplimiento y detectar mejoras."
                },
                {
                    title: "Comentarios de los clientes:",
                    value: "Recogida activa y aplicación de comentarios de los clientes para impulsar la excelencia."
                }
            ],
            commitmentTitle: "Compromiso con la excelencia",
            commitmentBody: `En DragLab, mantener los más altos estándares de calidad es la base de todo lo que hacemos. Nuestra Política de Calidad respalda nuestra misión de ofrecer productos y servicios de laboratorio superiores en los que nuestros clientes puedan confiar. Gracias por confiar en DragLab; esperamos poder servirle con los más altos niveles de calidad e innovación.`
        },
        DE: {
            pageTitle: 'Qualitätspolitik',
            metaDescription: 'Erfahren Sie mehr über DragLabs Engagement für Produktqualität und kontinuierliche Verbesserung. Lesen Sie unsere Qualitätspolitik.',
            ogTitle: 'Qualitätspolitik | DragLab',
            ogDescription: 'Erfahren Sie mehr über unser Engagement für Qualität, Konformität, Nachhaltigkeit und Kundenzufriedenheit durch unsere Qualitätspolitik.',
            heroTitle: 'Qualitätspolitik',
            heading: 'Unsere Qualitätspolitik',
            intro: `Bei <strong>DragLab</strong> spiegelt unsere Qualitätspolitik unser Engagement für Exzellenz, Zuverlässigkeit und kontinuierliche Verbesserung in allen Bereichen unseres Unternehmens wider. Unser Ziel ist es, stets Produkte und Dienstleistungen zu liefern, die die Erwartungen unserer Kunden erfüllen oder übertreffen.`,
            sections: [
                {
                    title: "Kundenorientierung",
                    body: "Das Verständnis und die Erfüllung der Kundenbedürfnisse stehen für uns an erster Stelle. Wir streben langfristige Beziehungen an, die auf Vertrauen, Leistung und Zufriedenheit basieren."
                },
                {
                    title: "Normen und Vorschriften",
                    body: "Wir halten alle relevanten Branchenstandards und gesetzlichen Anforderungen ein und stellen sicher, dass unsere Produkte sicher, wirksam und zuverlässig sind."
                },
                {
                    title: "Kontinuierliche Verbesserung",
                    body: "Durch regelmäßige Überprüfungen, Feedbackmechanismen und Innovation verbessern wir kontinuierlich unsere Prozesse, Produkte und Dienstleistungen. Wir nutzen neue Technologien, um in der Laborgerätebranche führend zu bleiben."
                },
                {
                    title: "Mitarbeiterengagement",
                    body: "Unser Team ist unser wertvollstes Kapital. Wir investieren in kontinuierliche Schulungen und berufliche Weiterentwicklung, damit unsere Mitarbeitenden aktiv zu unseren Qualitätszielen beitragen können."
                },
                {
                    title: "Lieferantenbeziehungen",
                    body: "Wir arbeiten eng mit unseren Lieferanten zusammen, um sicherzustellen, dass alle Materialien und Komponenten unseren strengen Qualitätsstandards entsprechen und die Exzellenz unserer Endprodukte unterstützen."
                },
                {
                    title: "Nachhaltigkeit",
                    body: "Wir verpflichten uns zu nachhaltigen Praktiken in allen Bereichen unseres Unternehmens, um die Umweltbelastung zu minimieren und gleichzeitig höchste Qualitätsstandards zu wahren."
                }
            ],
            implementationTitle: "Umsetzung und Überwachung",
            implementationList: [
                {
                    title: "Qualitätsmanagementsystem:",
                    value: "Robustes System nach ISO- und CE-Standards."
                },
                {
                    title: "Audits und Inspektionen:",
                    value: "Regelmäßige interne und externe Bewertungen zur Sicherstellung der Einhaltung und Verbesserung."
                },
                {
                    title: "Kundenfeedback:",
                    value: "Aktive Sammlung und Umsetzung von Kundenfeedback zur Förderung der Exzellenz."
                }
            ],
            commitmentTitle: "Engagement für Exzellenz",
            commitmentBody: `Bei DragLab ist die Einhaltung höchster Qualitätsstandards die Grundlage all unserer Aktivitäten. Unsere Qualitätspolitik unterstützt unsere Mission, hochwertige Laborprodukte und -dienstleistungen zu liefern, auf die sich unsere Kunden verlassen können. Vielen Dank für Ihr Vertrauen in DragLab – wir freuen uns darauf, Sie mit höchster Qualität und Innovation zu bedienen.`
        },
        TR: {
            pageTitle: 'Kalite Politikası',
            metaDescription: 'DragLab’ın ürün mükemmeliyeti ve sürekli iyileştirme taahhüdünü keşfedin. Kapsamlı Kalite Politikamızı okuyun.',
            ogTitle: 'Kalite Politikası | DragLab',
            ogDescription: 'Kalite uygulamalarımız aracılığıyla kalite, uyumluluk, sürdürülebilirlik ve müşteri memnuniyetine olan bağlılığımızı keşfedin.',
            heroTitle: 'Kalite Politikası',
            heading: 'Kalite Politikamız',
            intro: `<strong>DragLab</strong> olarak, Kalite Politikamız operasyonlarımızın tüm yönlerinde mükemmeliyet, güvenilirlik ve sürekli iyileştirme taahhüdümüzü yansıtır. Amacımız, müşteri beklentilerini karşılayan veya aşan ürün ve hizmetler sunmaktır.`,
            sections: [
                {
                    title: "Müşteri Odaklılık",
                    body: "Müşteri ihtiyaçlarını anlamak ve karşılamak en önemli önceliğimizdir. Güven, performans ve memnuniyete dayalı uzun vadeli ilişkiler kurmaya çalışıyoruz."
                },
                {
                    title: "Uyumluluk ve Standartlar",
                    body: "Ürünlerimizin güvenli, etkili ve güvenilir olmasını sağlamak için ilgili tüm endüstri standartlarına ve yasal gerekliliklere uyuyoruz."
                },
                {
                    title: "Sürekli İyileştirme",
                    body: "Düzenli incelemeler, geri bildirim mekanizmaları ve yenilik yoluyla süreçlerimizi, ürünlerimizi ve hizmetlerimizi sürekli olarak geliştiriyoruz. Laboratuvar ekipmanları endüstrisinde öncü olmak için yeni teknolojileri benimsiyoruz."
                },
                {
                    title: "Çalışan Katılımı",
                    body: "Ekibimiz en büyük varlığımızdır. Çalışanlarımızın kalite hedeflerimize aktif olarak katkıda bulunmalarını sağlamak için sürekli eğitim ve profesyonel gelişime yatırım yapıyoruz."
                },
                {
                    title: "Tedarikçi İlişkileri",
                    body: "Tüm malzeme ve bileşenlerin sıkı kalite standartlarımıza uygun olmasını sağlamak için tedarikçilerimizle yakın çalışıyoruz ve nihai ürünlerimizin mükemmelliğini destekliyoruz."
                },
                {
                    title: "Sürdürülebilirlik",
                    body: "Tüm operasyonlarımızda sürdürülebilir uygulamalara bağlıyız, en yüksek kalite standartlarını korurken çevresel etkiyi en aza indiriyoruz."
                }
            ],
            implementationTitle: "Uygulama ve İzleme",
            implementationList: [
                {
                    title: "Kalite Yönetim Sistemi:",
                    value: "ISO ve CE standartlarıyla uyumlu sağlam sistem."
                },
                {
                    title: "Denetimler ve İncelemeler:",
                    value: "Uyumluluk ve iyileştirmeler için düzenli iç ve dış değerlendirmeler."
                },
                {
                    title: "Müşteri Geri Bildirimi:",
                    value: "Mükemmelliği artırmak için müşteri geri bildirimlerinin aktif olarak toplanması ve uygulanması."
                }
            ],
            commitmentTitle: "Mükemmelliğe Bağlılık",
            commitmentBody: `DragLab olarak, en yüksek kalite standartlarını korumak yaptığımız her şeyin temelidir. Kalite Politikamız, müşterilerimizin güvenebileceği üstün laboratuvar ürünleri ve hizmetleri sunma misyonumuzu destekler. DragLab’a duyduğunuz güven için teşekkür eder, en yüksek kalite ve yenilik seviyeleriyle size hizmet etmeyi dört gözle bekleriz.`
        },
        FR: {
            pageTitle: 'Politique de Qualité',
            metaDescription: 'Découvrez l\'engagement de DragLab envers l\'excellence des produits et l\'amélioration continue. Lisez notre Politique de Qualité complète.',
            ogTitle: 'Politique de Qualité | DragLab',
            ogDescription: 'Explorez notre dévouement à la qualité, à la conformité, à la durabilité et à la satisfaction client à travers nos pratiques de qualité.',
            heroTitle: 'Politique de Qualité',
            heading: 'Notre Politique de Qualité',
            intro: `Chez <strong>DragLab</strong>, notre Politique de Qualité reflète notre engagement envers l'excellence, la fiabilité et l'amélioration continue dans tous les aspects de nos opérations. Notre objectif est de fournir constamment des produits et services qui répondent ou dépassent les attentes des clients.`,
            sections: [
                {
                    title: "Orientation Client",
                    body: "Comprendre et répondre aux besoins des clients est notre priorité absolue. Nous nous efforçons de construire des relations durables basées sur la confiance, la performance et la satisfaction."
                },
                {
                    title: "Conformité et Normes",
                    body: "Nous respectons toutes les normes industrielles pertinentes et les exigences réglementaires, garantissant que nos produits sont sûrs, efficaces et fiables."
                },
                {
                    title: "Amélioration Continue",
                    body: "Grâce à des examens réguliers, des mécanismes de retour d'information et de l'innovation, nous améliorons continuellement nos processus, produits et services. Nous adoptons de nouvelles technologies pour rester à la pointe de l'industrie des équipements de laboratoire."
                },
                {
                    title: "Implication des Employés",
                    body: "Notre équipe est notre plus grand atout. Nous investissons dans la formation continue et le développement professionnel pour permettre à nos employés de contribuer activement à nos objectifs de qualité."
                },
                {
                    title: "Relations avec les Fournisseurs",
                    body: "Nous travaillons en étroite collaboration avec nos fournisseurs pour garantir que tous les matériaux et composants répondent à nos normes de qualité strictes, soutenant ainsi l'excellence de nos produits finis."
                },
                {
                    title: "Durabilité",
                    body: "Nous nous engageons à adopter des pratiques durables dans toutes nos opérations, minimisant l'impact environnemental tout en maintenant les normes de qualité les plus élevées."
                }
            ],
            implementationTitle: "Mise en Œuvre et Suivi",
            implementationList: [
                {
                    title: "Système de Gestion de la Qualité :",
                    value: "Système robuste aligné sur les normes ISO et CE."
                },
                {
                    title: "Audits et Inspections :",
                    value: "Évaluations internes et externes régulières pour assurer la conformité et les améliorations."
                },
                {
                    title: "Retour d'Information Client :",
                    value: "Collecte active et application des retours clients pour stimuler l'excellence."
                }
            ],
            commitmentTitle: "Engagement envers l'Excellence",
            commitmentBody: `Chez DragLab, le maintien des normes de qualité les plus élevées est la base de tout ce que nous faisons. Notre Politique de Qualité soutient notre mission de fournir des produits et services de laboratoire supérieurs en lesquels nos clients peuvent avoir confiance. Nous vous remercions de votre confiance en DragLab et sommes impatients de vous servir avec les plus hauts niveaux de qualité et d'innovation.`

        }
    };

    try {
        const t = translations[lang] || translations.EN;

        res.render('customer/quality-policy', {
            lang,
            products: await Product.find(),
            pageTitle: t.pageTitle,
            metaDescription: t.metaDescription,
            ogTitle: t.ogTitle,
            ogDescription: t.ogDescription,
            heroTitle: t.heroTitle,
            heading: t.heading,
            intro: t.intro,
            sections: t.sections,
            implementationTitle: t.implementationTitle,
            implementationList: t.implementationList,
            commitmentTitle: t.commitmentTitle,
            commitmentBody: t.commitmentBody,
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

exports.getWarrantyRegistration = (req, res) => {
    const supportedLangs = allanguages;
    const rawLang = req.params.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    const t = {
        EN: {
            pageTitle: 'Warranty Registration',
            metaDescription: 'Register your DragLab product warranty for quick technical support and secure service.',
            ogTitle: 'Warranty Registration | DragLab',
            ogDescription: 'Fill out the warranty registration form to activate support and service for your DragLab product.',
            heroTitle: 'Warranty Registration',
            heroDesc: 'Quick and reliable solutions to your technical problems.',
            formTitle: 'Warranty Registration Form',
            dataLabel: 'I agree to the processing of my personal data in accordance with the',
            privacyPolicy: 'Privacy Policy',
            dataSuffix: 'for the purpose of handling my Warranty Registration request.',
            name: 'Name*',
            namePlaceholder: 'Name',
            datePurchased: 'Date Purchased*',
            email: 'Email*',
            techHeader: 'Technical Question / Failure',
            deviceCategory: 'Device Category*',
            deviceModel: 'Device Model*',
            serialNo: 'Serial No*',
            message: 'Message',
            messagePlaceholder: 'Write your message...',
            select: 'Select',
            submit: 'Send Message',
            successMessage: '✅ Your warranty has been successfully registered.',
            errorMessage: '❌ Something went wrong. Please try again later.'
        },
        ES: {
            pageTitle: 'Registro de Garantía',
            metaDescription: 'Registra la garantía de tu producto DragLab para recibir soporte técnico rápido y un servicio seguro.',
            ogTitle: 'Registro de Garantía | DragLab',
            ogDescription: 'Rellena el formulario de registro de garantía para activar el soporte de tu producto DragLab.',
            heroTitle: 'Registro de Garantía',
            heroDesc: 'Soluciones rápidas y confiables para tus problemas técnicos.',
            formTitle: 'Formulario de Registro de Garantía',
            dataLabel: 'Acepto el tratamiento de mis datos personales de acuerdo con la',
            privacyPolicy: 'Política de Privacidad',
            dataSuffix: 'para gestionar mi solicitud de registro de garantía.',
            name: 'Nombre*',
            namePlaceholder: 'Nombre',
            datePurchased: 'Fecha de compra*',
            email: 'Email*',
            techHeader: 'Pregunta técnica / Falla',
            deviceCategory: 'Categoría del dispositivo*',
            deviceModel: 'Modelo del dispositivo*',
            serialNo: 'Número de serie*',
            message: 'Mensaje',
            messagePlaceholder: 'Escribe tu mensaje...',
            select: 'Seleccionar',
            submit: 'Enviar mensaje',
            successMessage: '✅ Tu garantía ha sido registrada correctamente.',
            errorMessage: '❌ Algo salió mal. Por favor, inténtalo de nuevo más tarde.'
        },
        DE: {
            pageTitle: 'Garantieregistrierung',
            metaDescription: 'Registrieren Sie Ihre DragLab-Produktgarantie für schnellen technischen Support und sicheren Service.',
            ogTitle: 'Garantieregistrierung | DragLab',
            ogDescription: 'Füllen Sie das Formular aus, um Support und Service für Ihr DragLab-Produkt zu aktivieren.',
            heroTitle: 'Garantieregistrierung',
            heroDesc: 'Schnelle und zuverlässige Lösungen für Ihre technischen Probleme.',
            formTitle: 'Garantie-Registrierungsformular',
            dataLabel: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der',
            privacyPolicy: 'Datenschutzerklärung',
            dataSuffix: 'zum Zweck der Bearbeitung meiner Garantieregistrierung.',
            name: 'Name*',
            namePlaceholder: 'Name',
            datePurchased: 'Kaufdatum*',
            email: 'Email*',
            techHeader: 'Technische Frage / Fehler',
            deviceCategory: 'Gerätekategorie*',
            deviceModel: 'Gerätemodell*',
            serialNo: 'Seriennummer*',
            message: 'Nachricht',
            messagePlaceholder: 'Schreiben Sie Ihre Nachricht...',
            select: 'Auswählen',
            submit: 'Nachricht senden',
            successMessage: '✅ Ihre Garantie wurde erfolgreich registriert.',
            errorMessage: '❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.'
        },
        TR: {
            pageTitle: 'Garanti Kaydı',
            metaDescription: 'DragLab ürün garanti kaydınızı yapın; hızlı teknik destek ve güvenli servis.',
            ogTitle: 'Garanti Kaydı | DragLab',
            ogDescription: 'DragLab ürününüz için garanti kaydı formunu doldurun.',
            heroTitle: 'Garanti Kaydı',
            heroDesc: 'Teknik sorunlarınıza hızlı ve güvenilir çözümler.',
            formTitle: 'Garanti Kayıt Formu',
            dataLabel: 'Kişisel verilerimin işlenmesini kabul ediyorum',
            privacyPolicy: 'Gizlilik Politikası',
            dataSuffix: 'garanti kaydı talebimin işlenmesi amacıyla.',
            name: 'Ad Soyad*',
            namePlaceholder: 'Ad Soyad',
            datePurchased: 'Satın Alma Tarihi*',
            email: 'E-posta*',
            techHeader: 'Teknik Soru / Arıza',
            deviceCategory: 'Cihaz Kategorisi*',
            deviceModel: 'Cihaz Modeli*',
            serialNo: 'Seri No*',
            message: 'Mesaj',
            messagePlaceholder: 'Mesajınızı yazın...',
            select: 'Seç',
            submit: 'Mesajı Gönder',
            successMessage: '✅ Garanti kaydınız başarıyla oluşturuldu.',
            errorMessage: '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        },
        FR: {
            pageTitle: 'Enregistrement de la Garantie',
            metaDescription: 'Enregistrez la garantie de votre produit DragLab pour un support technique rapide et un service sécurisé.',
            ogTitle: 'Enregistrement de la Garantie | DragLab',
            ogDescription: 'Remplissez le formulaire d\'enregistrement de la garantie pour activer le support et le service de votre produit DragLab.',
            heroTitle: 'Enregistrement de la Garantie',
            heroDesc: 'Des solutions rapides et fiables à vos problèmes techniques.',
            formTitle: "Formulaire d'Enregistrement de la Garantie",
            dataLabel: 'J\'accepte le traitement de mes données personnelles conformément à la',
            privacyPolicy: 'Politique de Confidentialité',
            dataSuffix: 'dans le but de traiter ma demande d\'enregistrement de garantie.',
            name: 'Nom*',
            namePlaceholder: 'Nom',
            datePurchased: 'Date d\'Achat*',
            email: 'Email*',
            techHeader: 'Question Technique / Panne',
            deviceCategory: 'Catégorie de l\'Appareil*',
            deviceModel: 'Modèle de l\'Appareil*',
            serialNo: 'Numéro de Série*',
            message: 'Message',
            messagePlaceholder: 'Écrivez votre message...',
            select: 'Sélectionner',
            submit: 'Envoyer le Message',
            successMessage: '✅ Votre garantie a été enregistrée avec succès.',
            errorMessage: '❌ Une erreur est survenue. Veuillez réessayer plus tard.'
        }
    };

    Product.find()
        .then(products => {
            res.render('customer/WarrantyRegistration', {
                lang,
                products,
                t: t[lang],
                req
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};


exports.postWarrantyRegistration = async (req, res) => {
    const lang = (req.body.lang || req.query.lang || 'EN').toUpperCase();
    const token = req.body['g-recaptcha-response'];

    try {
        // (Optional) reCAPTCHA – only if enabled and token present
        if (RECAPTCHA_ENABLED && token) {
            const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
            const { data } = await axios.post(verifyUrl, null, {
                params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token }
            });
            if (!data?.success || Number(data?.score) < 0.5) {
                console.error('❌ reCAPTCHA verification failed (warranty):', data);
                return res.redirect(`/${lang}/WarrantyRegistration?error=true`);
            }
        } else if (RECAPTCHA_ENABLED && !token) {
            // if you want to enforce it strictly, redirect; otherwise allow during tests
            console.warn('⚠️ reCAPTCHA enabled but no token on Warranty form');
            return res.redirect(`/${lang}/WarrantyRegistration?error=true`);
        }

        // Extract fields
        const {
            name, email, datePurchased,
            deviceCategory, deviceModel, serialNo, message
        } = req.body;

        // Resolve human-friendly names from DB (Product + embedded Model)
        let productName = '';
        let modelName = '';
        try {
            const productDoc = await Product.findById(
                deviceCategory,
                { Language: 1, Models: 1 }
            ).lean();

            if (productDoc) {
                productName =
                    productDoc?.Language?.[lang]?.[0]?.ProductName ??
                    productDoc?.Language?.EN?.[0]?.ProductName ?? '';

                const modelSub = productDoc?.Models?.find(m => String(m._id) === String(deviceModel));
                if (modelSub) {
                    modelName =
                        modelSub?.Language?.[lang]?.[0]?.ModelName ??
                        modelSub?.Language?.EN?.[0]?.ModelName ?? '';
                }
            }
        } catch (e) {
            console.warn('⚠️ Product/Model name lookup (warranty) failed:', e?.message || e);
        }
        if (!productName) productName = deviceCategory; // fallback to ID
        if (!modelName) modelName = deviceModel;    // fallback to ID

        // Meta
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        const userAgent = req.get('User-Agent');

        // Save to DB (store IDs; optionally store resolved names)
        const doc = await new WarrantyRegistration({
            name, email, datePurchased,
            deviceCategory, deviceModel, serialNo,
            message, lang,
            ipAddress, userAgent
            // productNameResolved: productName,
            // modelNameResolved: modelName
        }).save();

        const ticketId = `WR-${doc._id.toString().slice(-6).toUpperCase()}`;

        // Customer confirmation (SendGrid Dynamic Template - warrantyRegistration)
        const flags = { isEN: lang === 'EN', isES: lang === 'ES', isDE: lang === 'DE', isTR: lang === 'TR', isFR: lang === 'FR' };

        await sendCustomerEmail({
            to: email,
            form: 'warrantyRegistration',  // <- use the new template key
            data: {
                ...flags,
                year: new Date().getFullYear(),
                brandName: 'DragLab',
                brandLogoUrl: 'https://cdn.draglab.com/brand/draglab-logo-100.png', // optional
                supportEmail: 'info@drag-lab.de',
                ticketId,
                deviceCategory: productName,
                deviceModel: modelName,
                serialNumber: serialNo || '',
                datePurchased: datePurchased || '',
                userMessage: message || '',
                helpCenterUrl: `https://www.drag-lab.de/${lang}/WarrantyRegistration`
            }
        });


        // Internal notification (SMTP fallback → SendGrid)
        const subjectMap = {
            EN: `[Warranty] ${name} — ${productName}/${modelName} (${ticketId})`,
            ES: `[Garantía] ${name} — ${productName}/${modelName} (${ticketId})`,
            DE: `[Garantie] ${name} — ${productName}/${modelName} (${ticketId})`,
            TR: `[Garanti] ${name} — ${productName}/${modelName} (${ticketId})`,
            FR: `[Garantie] ${name} — ${productName}/${modelName} (${ticketId})`
        };
        const subject = subjectMap[lang] || subjectMap.EN;

        const bodyText =
            `New Warranty Registration

Ticket: ${ticketId}
Name: ${name}
Email: ${email}

Device:
- Category: ${productName}
- Model: ${modelName}
- Serial: ${serialNo || '-'}

Date Purchased: ${datePurchased || '-'}

Message:
${message || '-'}

Meta:
- Language: ${lang}
- IP: ${ipAddress || '-'}
- User-Agent: ${userAgent || '-'}

Admin Link (optional): https://www.drag-lab.de/admin/warranty-registrations/${doc._id}
`;

        await notifyInternal({ to: 'info@drag-lab.de', subject, text: bodyText });

        return res.redirect(`/${lang}/WarrantyRegistration?success=true`);
    } catch (err) {
        console.error('❌ Error in WarrantyRegistration submission:', err);
        return res.redirect(`/${lang}/WarrantyRegistration?error=true`);
    }
};








exports.getIndustryPage = async (req, res, next) => {
    try {
        const supportedLangs = allanguages;
        const rawLang = req.params.lang?.toUpperCase() || 'EN';
        const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

        const products = await Product.find({ isDraft: false });

        const industries = await Industry.find({ isDraft: false });

        // Extract title and introImage per industry
        const industryCards = industries.map(industry => {
            const langData = industry.Language?.[lang]?.[0];
            const sharedImages = industry.sharedImages || {};
            return {
                slug: industry.slug,
                title: langData?.slideTitle || '',
                introImage: sharedImages.introImage || ''
            };
        });

        res.render('customer/industry', {
            lang,
            pageTitle: {
                EN: 'Industry Solutions',
                ES: 'Soluciones para la Industria',
                DE: 'Branchenspezifische Lösungen',
                TR: 'Endüstri Çözümleri',
                FR: 'Solutions Industrielles'
            }[lang],
            metaDescription: {
                EN: 'Read DragLab’s Industry Solutions and learn how we can help your business.',
                ES: 'Lea las Soluciones para la Industria de DragLab y descubra cómo podemos ayudar a su negocio.',
                DE: 'Lesen Sie die Branchenspezifischen Lösungen von DragLab und erfahren Sie, wie wir Ihnen helfen können.',
                TR: 'DragLab’ın Endüstri Çözümleri’ni okuyun ve işinize nasıl yardımcı olabileceğimizi öğrenin.',
                FR: 'Lisez les Solutions Industrielles de DragLab et découvrez comment nous pouvons aider votre entreprise.'
            }[lang],
            products,
            industryCards
        });

    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};


exports.getIndustryDetails = async (req, res) => {
    const lang = (req.params.lang || req.query.lang || 'EN').toUpperCase();
    const slug = req.params.slug;

    try {
        const industry = await Industry.findOne({ slug });
        if (!industry) {
            return res.status(404).render('404', {
                pageTitle: 'Not Found',
                path: '/industry'
            });
        }

        const allProducts = await Product.find({ isDraft: false });

        // ✅ Select language-specific content
        const langData = industry.Language?.[lang]?.[0] || industry.Language?.EN?.[0];
        const translation = {
            slideTitle: langData?.slideTitle,
            subtitle: langData?.slideSubTitle,
            description: langData?.slideDesc,
            introTitle: langData?.introTitle,
            introDesc: langData?.introDesc,
            features: (langData?.features || []).map(f => ({
                featureTitle: f.FeatureName,
                featureDesc: f.FeatureDesc,
                featureImage: f.FeatureImage
            }))
        };

        // ✅ Get frequently used product descriptions (language-specific)
        const frequentlyUsed = industry.frequentlyUsedProducts?.[lang] || [];

        // ✅ Attach description to matching product
        const featuredProducts = allProducts
            .map(product => {
                const match = frequentlyUsed.find(item => item.productId?.toString() === product._id.toString());
                if (match) {
                    return {
                        ...product.toObject(),
                        description: match.text
                    };
                }
                return null; // no description = exclude product
            })
            .filter(p => p); // remove nulls (products without matching entry)

        // ✅ Render page with all industry data
        res.render('customer/industry-details', {
            pageTitle: translation.slideTitle || 'Industry',
            metaDescription: translation.description || '',
            industry: {
                sharedSlideImage: industry.sharedImages?.slideImage,
                sharedIntroImage: industry.sharedImages?.introImage
            },
            translation,
            lang,
            products: featuredProducts, // ✅ products with a description
            usedProducts: frequentlyUsed // ✅ FIX: needed in EJS logic
        });

    } catch (err) {
        console.error('❌ Error loading Industry Details:', err.message);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            path: '/industry',
            isAuthenticated: req.session?.isLoggedIn || false
        });
    }
};



exports.getQualityPolicy = (req, res, next) => {
    const supportedLangs = allanguages;
    const rawLang = req.params.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    const policyContent = {
        EN: {
            pageTitle: "Quality Policy",
            metaDescription: "Read NanoDrag’s commitment to quality, compliance, safety, and continuous improvement.",
            status: "Make It Right, Reliable, and Cost-Effective",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Germany<br> Tel: +49 6196 400816<br> Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Our Commitment",
                    body: `At NANODRAG TECHNOLOGY GmbH, our commitment is to provide our customers with high-quality products that comply with international requirements and consistently meet or exceed expectations for performance, reliability, and safety — all while ensuring competitive cost-effectiveness.`
                },
                {
                    title: "Continuous Improvement and Quality Standards",
                    body: `To achieve this, we have established and continue to improve the effectiveness of our Quality Management System (QMS) in accordance with internationally recognized standards. We ensure that an adequate framework is in place for setting and reviewing quality objectives aligned with our strategic direction.`
                },
                {
                    title: "Compliance and Responsibility",
                    body: `We take great care in every aspect of our work to ensure the final products fully meet client, legal, and regulatory requirements. Our approach is built on awareness of best practices, continuous monitoring of industry innovations, and the adoption of advanced strategies to deliver outstanding products and services.`
                },
                {
                    title: "Empowering Our Team",
                    body: `We are relentlessly working to ensure that customer needs are always prioritized to be met in every project. We proactively invest in staff training and development, empowering our teams with the competencies needed to meet high standards of quality and performance.`
                },
                {
                    title: "Open Communication and Trust",
                    body: `We maintain transparency with our clients, promoting open communication and swift resolution of any challenges that may arise. This fosters trust and enhances collaboration throughout the customer journey.`
                },
                {
                    title: "Culture of Excellence",
                    body: `Excellence and innovation are appreciated and rewarded within our organization to encourage a strong, positive quality culture. By implementing clear internal standards, we collaboratively streamline processes, enhance efficiency, and deliver consistent satisfaction for our customers’ experiences.`
                },
                {
                    title: "Review and Innovation",
                    body: `Finally, we are continuously improving through regular reviews and feedback mechanisms, we enhance our processes, products, and services accordingly. We encourage innovation and embrace new technologies to stay ahead in the industry.`
                }
            ]
        },
        ES: {
            pageTitle: "Política de Calidad",
            metaDescription: "Lea el compromiso de NanoDrag con la calidad, el cumplimiento, la seguridad y la mejora continua.",
            status: "Correcto, Fiable y Rentable",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Alemania<br> Tel: +49 6196 400816<br> Correo electrónico: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Nuestro Compromiso",
                    body: `En NANODRAG TECHNOLOGY GmbH, nuestro compromiso es ofrecer a nuestros clientes productos de alta calidad que cumplan con los requisitos internacionales y superen de forma constante las expectativas en cuanto a rendimiento, fiabilidad y seguridad, manteniendo al mismo tiempo una rentabilidad competitiva.`
                },
                {
                    title: "Mejora Continua y Estándares de Calidad",
                    body: `Para lograr esto, hemos establecido y seguimos mejorando la eficacia de nuestro Sistema de Gestión de Calidad (SGC) conforme a normas reconocidas internacionalmente. Aseguramos un marco adecuado para definir y revisar objetivos de calidad alineados con nuestra dirección estratégica.`
                },
                {
                    title: "Cumplimiento y Responsabilidad",
                    body: `Cuidamos cada aspecto de nuestro trabajo para garantizar que los productos finales cumplan plenamente con los requisitos del cliente, legales y reglamentarios. Nuestro enfoque se basa en el conocimiento de las mejores prácticas, la supervisión continua de innovaciones del sector y la adopción de estrategias avanzadas para ofrecer productos y servicios excepcionales.`
                },
                {
                    title: "Empoderamiento de Nuestro Equipo",
                    body: `Trabajamos incansablemente para garantizar que las necesidades del cliente siempre sean una prioridad en cada proyecto. Invertimos proactivamente en formación y desarrollo del personal, dotando a nuestros equipos con las competencias necesarias para alcanzar altos estándares de calidad y rendimiento.`
                },
                {
                    title: "Comunicación Abierta y Confianza",
                    body: `Mantenemos la transparencia con nuestros clientes, promoviendo una comunicación abierta y una resolución rápida de cualquier problema que pueda surgir. Esto fomenta la confianza y mejora la colaboración a lo largo del proceso del cliente.`
                },
                {
                    title: "Cultura de Excelencia",
                    body: `La excelencia y la innovación son valoradas y recompensadas dentro de nuestra organización para fomentar una cultura de calidad fuerte y positiva. Al implementar normas internas claras, optimizamos procesos de forma colaborativa, mejoramos la eficiencia y ofrecemos una satisfacción constante a nuestros clientes.`
                },
                {
                    title: "Revisión e Innovación",
                    body: `Finalmente, mejoramos continuamente mediante revisiones regulares y mecanismos de retroalimentación. Mejoramos nuestros procesos, productos y servicios en consecuencia. Fomentamos la innovación y adoptamos nuevas tecnologías para mantenernos a la vanguardia del sector.`
                }
            ]
        },
        DE: {
            pageTitle: "Qualitätspolitik",
            metaDescription: "Lesen Sie NanoDrags Engagement für Qualität, Compliance, Sicherheit und kontinuierliche Verbesserung.",
            status: "Richtig, Zuverlässig und Kosteneffizient",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Deutschland<br> Tel: +49 6196 400816<br> E-Mail: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Unser Engagement",
                    body: `Bei NANODRAG TECHNOLOGY GmbH ist es unser Ziel, unseren Kunden hochwertige Produkte bereitzustellen, die internationalen Anforderungen entsprechen und die Erwartungen in Bezug auf Leistung, Zuverlässigkeit und Sicherheit konsequent erfüllen oder übertreffen – und dabei wirtschaftlich bleiben.`
                },
                {
                    title: "Kontinuierliche Verbesserung und Qualitätsstandards",
                    body: `Zu diesem Zweck haben wir ein Qualitätsmanagementsystem (QMS) gemäß international anerkannten Standards eingeführt und verbessern dessen Wirksamkeit kontinuierlich. Wir stellen sicher, dass ein geeigneter Rahmen für die Festlegung und Überprüfung von Qualitätszielen vorhanden ist, die mit unserer strategischen Ausrichtung übereinstimmen.`
                },
                {
                    title: "Compliance und Verantwortung",
                    body: `Wir achten in jeder Phase unserer Arbeit sorgfältig darauf, dass unsere Endprodukte sämtliche Kunden-, gesetzlichen und regulatorischen Anforderungen erfüllen. Unser Ansatz basiert auf bewährten Verfahren, ständiger Beobachtung von Branchentrends und dem Einsatz fortschrittlicher Strategien zur Lieferung herausragender Produkte und Dienstleistungen.`
                },
                {
                    title: "Stärkung unseres Teams",
                    body: `Wir arbeiten unermüdlich daran, die Bedürfnisse unserer Kunden in jedem Projekt stets zu priorisieren. Wir investieren proaktiv in Schulungen und die Weiterentwicklung unserer Mitarbeitenden, um die erforderlichen Kompetenzen für hohe Qualitäts- und Leistungsstandards sicherzustellen.`
                },
                {
                    title: "Offene Kommunikation und Vertrauen",
                    body: `Wir pflegen Transparenz gegenüber unseren Kunden, fördern eine offene Kommunikation und sorgen für die schnelle Lösung auftretender Herausforderungen. Dies stärkt das Vertrauen und verbessert die Zusammenarbeit über den gesamten Kundenprozess hinweg.`
                },
                {
                    title: "Kultur der Exzellenz",
                    body: `Exzellenz und Innovation werden in unserem Unternehmen geschätzt und gefördert, um eine starke, positive Qualitätskultur zu etablieren. Durch klare interne Standards optimieren wir gemeinsam Prozesse, steigern die Effizienz und gewährleisten durchgehend hohe Kundenzufriedenheit.`
                },
                {
                    title: "Überprüfung und Innovation",
                    body: `Durch regelmäßige Überprüfungen und Rückmeldemechanismen verbessern wir kontinuierlich unsere Prozesse, Produkte und Dienstleistungen. Wir fördern Innovationen und setzen neue Technologien ein, um in der Branche führend zu bleiben.`
                }
            ]
        },
        TR: {
            pageTitle: "Kalite Politikası",
            metaDescription: "NanoDrag'ın kalite, uyumluluk, güvenlik ve sürekli iyileştirme taahhüdünü okuyun.",
            status: "Doğru, Güvenilir ve Maliyet Etkin",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Almanya<br> Tel: +49 6196 400816<br> E-posta: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Taahhüdümüz",
                    body: `NANODRAG TECHNOLOGY GmbH olarak, müşterilerimize uluslararası gereksinimlere uygun, performans, güvenilirlik ve güvenlik açısından beklentileri sürekli karşılayan veya aşan yüksek kaliteli ürünler sunmayı taahhüt ediyoruz - tüm bunları rekabetçi maliyet etkinliği sağlarken yapıyoruz.`
                },
                {
                    title: "Sürekli İyileştirme ve Kalite Standartları",
                    body: `Bunu başarmak için, uluslararası tanınan standartlara uygun olarak Kalite Yönetim Sistemimizin (KYS) etkinliğini kurduk ve geliştirmeye devam ediyoruz. Stratejik yönümüzle uyumlu kalite hedeflerinin belirlenmesi ve gözden geçirilmesi için uygun bir çerçevenin mevcut olmasını sağlıyoruz.`
                },
                {
                    title: "Uyumluluk ve Sorumluluk",
                    body: `Son ürünlerin müşteri, yasal ve düzenleyici gereksinimleri tam olarak karşıladığından emin olmak için çalışmalarımızın her yönünde büyük özen gösteriyoruz. Yaklaşımımız, en iyi uygulamalara olan farkındalık, sektör yeniliklerinin sürekli izlenmesi ve olağanüstü ürünler ve hizmetler sunmak için gelişmiş stratejilerin benimsenmesi üzerine kuruludur.`
                },
                {
                    title: "Ekibimizi Güçlendirme",
                    body: `Müşteri ihtiyaçlarının her projede her zaman öncelikli olmasını sağlamak için durmaksızın çalışıyoruz. Personel eğitimi ve gelişimine proaktif olarak yatırım yapıyor, ekiplerimizi yüksek kalite ve performans standartlarını karşılamak için gereken yetkinliklerle güçlendiriyoruz.`
                },
                {
                    title: "Açık İletişim ve Güven",
                    body: `Müşterilerimizle şeffaflığı koruyor, açık iletişimi ve ortaya çıkabilecek herhangi bir zorluğun hızlı çözümünü teşvik ediyoruz. Bu, güveni artırır ve müşteri yolculuğu boyunca işbirliğini geliştirir.`
                },
                {
                    title: "Mükemmellik Kültürü",
                    body: `Mükemmellik ve yenilik, güçlü, pozitif bir kalite kültürünü teşvik etmek için organizasyonumuz içinde takdir edilir ve ödüllendirilir. Net iç standartlar uygulayarak, süreçleri birlikte kolaylaştırır, verimliliği artırır ve müşterilerimizin deneyimleri için tutarlı memnuniyet sağlar.`
                },
                {
                    title: "Gözden Geçirme ve Yenilik",
                    body: `Son olarak, düzenli incelemeler ve geri bildirim mekanizmaları aracılığıyla sürekli olarak iyileştiriyoruz, süreçlerimizi, ürünlerimizi ve hizmetlerimizi buna göre geliştiriyoruz. Yeniliği teşvik ediyor ve sektörde önde kalmak için yeni teknolojileri benimsiyoruz.`
                }
            ]
        },
        FR: {
            pageTitle: "Politique de Qualité",
            metaDescription: "Lisez l'engagement de NanoDrag en matière de qualité, de conformité, de sécurité et d'amélioration continue.",
            status: "Juste, Fiable et Rentable",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Allemagne<br> Tel: +49 6196 400816<br> Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Notre Engagement",
                    body: `Chez NANODRAG TECHNOLOGY GmbH, notre engagement est de fournir à nos clients des produits de haute qualité qui respectent les exigences internationales et répondent ou dépassent constamment les attentes en matière de performance, de fiabilité et de sécurité, tout en garantissant une rentabilité compétitive.`
                },
                {
                    title: "Amélioration Continue et Normes de Qualité",
                    body: `Pour y parvenir, nous avons mis en place et continuons d'améliorer l'efficacité de notre Système de Management de la Qualité (SMQ) conformément aux normes reconnues internationalement. Nous veillons à ce qu'un cadre adéquat soit en place pour définir et revoir les objectifs de qualité alignés sur notre orientation stratégique.`
                },
                {
                    title: "Conformité et Responsabilité",
                    body: `Nous accordons une grande importance à chaque aspect de notre travail pour garantir que les produits finaux répondent pleinement aux exigences des clients, légales et réglementaires. Notre approche repose sur la connaissance des meilleures pratiques, la surveillance continue des innovations du secteur et l'adoption de stratégies avancées pour offrir des produits et services exceptionnels.`
                },
                {
                    title: "Valorisation de Notre Équipe",
                    body: `Nous travaillons sans relâche pour garantir que les besoins des clients sont toujours prioritaires dans chaque projet. Nous investissons de manière proactive dans la formation et le développement du personnel, en dotant nos équipes des compétences nécessaires pour atteindre des normes élevées de qualité et de performance.`
                },

                {
                    title: "Communication Ouverte et Confiance",
                    body: `Nous maintenons la transparence avec nos clients, en favorisant une communication ouverte et une résolution rapide de tout défi pouvant survenir. Cela favorise la confiance et améliore la collaboration tout au long du parcours client.`
                },
                {
                    title: "Culture d'Excellence",
                    body: `L'excellence et l'innovation sont appréciées et récompensées au sein de notre organisation pour encourager une culture de qualité forte et positive. En mettant en œuvre des normes internes claires, nous rationalisons les processus de manière collaborative, améliorons l'efficacité et offrons une satisfaction constante pour les expériences de nos clients.`
                },
                {
                    title: "Revue et Innovation",
                    body: `Enfin, nous nous améliorons continuellement grâce à des revues régulières et des mécanismes de feedback, nous améliorons nos processus, produits et services en conséquence. Nous encourageons l'innovation et adoptons de nouvelles technologies pour rester à la pointe du secteur.`
                }
            ]
        },


    };

    Product.find()
        .then(products => {
            res.render('customer/QualityPolicy', {
                lang,
                products, // ✅ ADD THIS
                policyContent,
                pageTitle: policyContent[lang].pageTitle,
                metaDescription: policyContent[lang].metaDescription
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};




exports.getSustainabilityPolicy = (req, res, next) => {
    const supportedLangs = allanguages;
    const rawLang = req.params.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    const sustainabilityPolicyContent = {
        EN: {
            pageTitle: "Sustainability Policy",
            metaDescription: "Read NanoDrag’s commitment to environmental protection and sustainability in accordance with ISO 14001:2015.",
            status: "Make It Sustainable, Safe, and Responsible",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Germany<br> Tel: +49 6196 400816<br> Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Sustainability Policy",
                    body: `We at NANODRAG TECHNOLOGY GmbH recognize our responsibility to protect the environment as a manufacturer and distributor of laboratory equipment. We acknowledge that our operations and products have environmental impacts, and we are committed to managing these impacts in an environmentally responsible manner while keeping the highest quality met for our products and services. This Environmental Policy aligns with the requirements of ISO 14001:2015 and reflects our dedication to integrating environmental considerations into our business strategy and daily operations.`
                },
                {
                    title: "Commitment to Compliance and Continuous Improvement",
                    body: `We are committed to protecting the environment and to full compliance with all applicable environmental laws, regulations, and other obligations. We strive to prevent pollution and minimize any negative impact by adopting best practices in waste management, efficient use of resources, and emission reduction. We aim to meet or exceed relevant environmental standards and continuously improve our processes to reduce our environmental footprint, thereby preserving natural resources for future generations.`
                },
                {
                    title: "Shared Responsibility",
                    body: `Environmental responsibility is a shared commitment across our organization. All members of our team and parties working on our behalf are expected to adhere to this policy and support it in their daily work. We provide training and resources to raise environmental awareness and empower our team to contribute ideas and actions for improvement.`
                }
            ]
        },
        ES: {
            pageTitle: "Política de Sostenibilidad",
            metaDescription: "Descubra el compromiso de NanoDrag con la protección ambiental y la sostenibilidad según la norma ISO 14001:2015.",
            status: "Compromiso con la sostenibilidad ambiental",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Alemania<br> Tel: +49 6196 400816<br> Correo electrónico: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Política de Sostenibilidad",
                    body: `En NANODRAG TECHNOLOGY GmbH reconocemos nuestra responsabilidad de proteger el medio ambiente como fabricante y distribuidor de equipos de laboratorio. Reconocemos que nuestras operaciones y productos tienen impactos ambientales y nos comprometemos a gestionarlos de manera responsable, garantizando al mismo tiempo los más altos estándares de calidad en nuestros productos y servicios. Esta Política Ambiental está alineada con los requisitos de la norma ISO 14001:2015 y refleja nuestro compromiso de integrar consideraciones ambientales en nuestra estrategia empresarial y operaciones diarias.`
                },
                {
                    title: "Compromiso con el Cumplimiento y la Mejora Continua",
                    body: `Estamos comprometidos con la protección del medio ambiente y con el cumplimiento total de todas las leyes, regulaciones y obligaciones ambientales aplicables. Nos esforzamos por prevenir la contaminación y minimizar cualquier impacto negativo adoptando las mejores prácticas en gestión de residuos, uso eficiente de los recursos y reducción de emisiones. Nuestro objetivo es cumplir o superar los estándares ambientales relevantes y mejorar continuamente nuestros procesos para reducir nuestra huella ecológica, preservando así los recursos naturales para las futuras generaciones.`
                },
                {
                    title: "Responsabilidad Compartida",
                    body: `La responsabilidad ambiental es un compromiso compartido en toda nuestra organización. Todos los miembros de nuestro equipo y las partes que actúan en nuestro nombre deben cumplir esta política y apoyarla en su trabajo diario. Proporcionamos formación y recursos para fomentar la conciencia ambiental y empoderar a nuestro equipo para que proponga ideas y acciones orientadas a la mejora.`
                }
            ]
        },
        DE: {
            pageTitle: "Nachhaltigkeitspolitik",
            metaDescription: "Erfahren Sie mehr über das Umweltengagement von NanoDrag gemäß ISO 14001:2015.",
            status: "Engagement für ökologische Nachhaltigkeit",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Deutschland<br> Tel: +49 6196 400816<br> E-Mail: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Nachhaltigkeitspolitik",
                    body: `Wir bei NANODRAG TECHNOLOGY GmbH erkennen unsere Verantwortung zum Schutz der Umwelt als Hersteller und Anbieter von Laborausrüstung an. Wir sind uns bewusst, dass unsere Tätigkeiten und Produkte Umweltauswirkungen haben, und verpflichten uns, diese Auswirkungen auf umweltverträgliche Weise zu steuern – bei gleichzeitiger Einhaltung höchster Qualitätsstandards für unsere Produkte und Dienstleistungen. Diese Umweltpolitik entspricht den Anforderungen der ISO 14001:2015 und spiegelt unser Bestreben wider, Umweltaspekte in unsere Geschäftsstrategie und täglichen Abläufe zu integrieren.`
                },
                {
                    title: "Engagement für Einhaltung und kontinuierliche Verbesserung",
                    body: `Wir verpflichten uns zum Umweltschutz und zur vollständigen Einhaltung aller geltenden Umweltgesetze, -vorschriften und sonstigen Anforderungen. Wir streben an, Umweltverschmutzung zu verhindern und negative Auswirkungen zu minimieren, indem wir bewährte Praktiken im Abfallmanagement, in der Ressourcennutzung und bei der Emissionsminderung anwenden. Unser Ziel ist es, relevante Umweltstandards zu erfüllen oder zu übertreffen und unsere Prozesse kontinuierlich zu verbessern, um unseren ökologischen Fußabdruck zu verringern und natürliche Ressourcen für kommende Generationen zu bewahren.`
                },
                {
                    title: "Geteilte Verantwortung",
                    body: `Umweltverantwortung ist ein gemeinsames Engagement in unserem gesamten Unternehmen. Alle Mitglieder unseres Teams sowie Parteien, die in unserem Namen arbeiten, sind verpflichtet, diese Richtlinie einzuhalten und sie in ihrer täglichen Arbeit zu unterstützen. Wir stellen Schulungen und Ressourcen bereit, um das Umweltbewusstsein zu stärken und unser Team zu befähigen, Ideen und Maßnahmen zur Verbesserung beizutragen.`
                }
            ]
        },
        TR: {
            pageTitle: "Sürdürülebilirlik Politikası",
            metaDescription: "NanoDrag'ın ISO 14001:2015'e uygun olarak çevre koruma ve sürdürülebilirliğe olan bağlılığını okuyun.",
            status: "Çevresel Sürdürülebilirliğe Bağlılık",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Almanya<br> Tel: +49 6196 400816<br> E-posta: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Sürdürülebilirlik Politikası",
                    body: `NANODRAG TECHNOLOGY GmbH olarak, laboratuvar ekipmanları üreticisi ve distribütörü olarak çevreyi koruma sorumluluğumuzu kabul ediyoruz. Operasyonlarımızın ve ürünlerimizin çevresel etkileri olduğunu kabul ediyor ve bu etkileri çevresel açıdan sorumlu bir şekilde yönetmeye kararlıyız; aynı zamanda ürünlerimiz ve hizmetlerimiz için en yüksek kaliteyi sağlamaya devam ediyoruz. Bu Çevre Politikası, ISO 14001:2015 gereksinimleriyle uyumludur ve çevresel hususları iş stratejimize ve günlük operasyonlarımıza entegre etme taahhüdümüzü yansıtır.`
                },
                {
                    title: "Uyum ve Sürekli İyileştirme Taahhüdü",
                    body: `Çevreyi korumaya ve tüm geçerli çevre yasalarına, düzenlemelere ve diğer yükümlülüklere tam uyum sağlamaya kararlıyız. Atık yönetimi, kaynakların verimli kullanımı ve emisyon azaltımı konularında en iyi uygulamaları benimseyerek kirliliği önlemeye ve olumsuz etkileri en aza indirmeye çalışıyoruz. İlgili çevre standartlarını karşılamayı veya aşmayı ve çevresel ayak izimizi azaltmak için süreçlerimizi sürekli olarak iyileştirmeyi hedefliyoruz; böylece gelecek nesiller için doğal kaynakları koruyoruz.`
                },
                {
                    title: "Paylaşılan Sorumluluk",
                    body: `Çevresel sorumluluk, organizasyonumuz genelinde paylaşılan bir taahhüttür. Ekibimizin tüm üyeleri ve bizim adımıza çalışan taraflar, bu politikaya uymalı ve günlük çalışmalarında desteklemelidir. Çevresel farkındalığı artırmak ve ekibimizi iyileştirme için fikir ve eylemlerle katkıda bulunmaya teşvik etmek için eğitim ve kaynaklar sağlıyoruz.`
                }
            ]
        },
        FR: {
            pageTitle: "Politique de Durabilité",
            metaDescription: "Lisez l'engagement de NanoDrag en matière de protection de l'environnement et de durabilité conformément à la norme ISO 14001:2015.",
            status: "Engagement en faveur de la durabilité environnementale",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Allemagne<br> Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Politique de Durabilité",
                    body: `Chez NANODRAG TECHNOLOGY GmbH, nous reconnaissons notre responsabilité de protéger l'environnement en tant que fabricant et distributeur d'équipements de laboratoire. Nous reconnaissons que nos opérations et nos produits ont des impacts environnementaux, et nous nous engageons à gérer ces impacts de manière responsable tout en garantissant la plus haute qualité pour nos produits et services. Cette politique environnementale est conforme aux exigences de la norme ISO 14001:2015 et reflète notre engagement à intégrer les considérations environnementales dans notre stratégie commerciale et nos opérations quotidiennes.`
                },

                {
                    title: "Engagement en matière de conformité et d'amélioration continue",
                    body: `Nous nous engageons à protéger l'environnement et à respecter pleinement toutes les lois, réglementations et autres obligations environnementales applicables. Nous nous efforçons de prévenir la pollution et de minimiser tout impact négatif en adoptant les meilleures pratiques en matière de gestion des déchets, d'utilisation efficace des ressources et de réduction des émissions. Nous visons à respecter ou à dépasser les normes environnementales pertinentes et à améliorer continuellement nos processus pour réduire notre empreinte environnementale, préservant ainsi les ressources naturelles pour les générations futures.`
                },
                {
                    title: "Responsabilité partagée",
                    body: `La responsabilité environnementale est un engagement partagé au sein de notre organisation. Tous les membres de notre équipe et les parties agissant en notre nom sont tenus de respecter cette politique et de la soutenir dans leur travail quotidien. Nous fournissons des formations et des ressources pour sensibiliser à l'environnement et permettre à notre équipe de contribuer par des idées et des actions d'amélioration.`
                }
            ]
        }

    };

    Product.find()
        .then(products => {
            res.render('customer/SustainabilityPolicy', {
                lang,
                products,
                sustainabilityPolicyContent,
                pageTitle: sustainabilityPolicyContent[lang].pageTitle,
                metaDescription: sustainabilityPolicyContent[lang].metaDescription
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};




exports.getQualifications = (req, res, next) => {
    const supportedLangs = allanguages;
    const rawLang = req.params.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    const qualificationsContent = {
        EN: {
            pageTitle: "Qualifications",
            metaDescription: "Learn about DragLab's quality certifications, compliance, technical expertise, after-sales support, and global partnerships.",
            status: "Certified, Compliant, Experienced",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Germany<br> Tel: +49 6196 400816<br> Email: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Quality Assurance & Certifications",
                    body: `Quality is central to our operations at Nanodrag Technology GmbH. Our quality management system is certified adhering to the ISO 9001 and ISO 14001 standards, ensuring strong quality and environmental management systems. Each DragLab product undergoes strict quality control checks to meet international standards. In collaboration with third-party audits, we do regular checks to confirm our compliance, while continuous employee training promotes a strong culture of quality across all levels.`
                },
                {
                    title: "Compliance & International Standards",
                    body: `All our products are designed and manufactured in compliance with European directives. We ensure that our equipment meets both European and global regulatory requirements, providing customers with safe, certified, and globally accepted solutions for their laboratories.`
                },
                {
                    title: "Technical Expertise & Experience",
                    body: `With over 20 years of experience in the laboratory equipment industry, DragLab Technologies prides itself on deep technical expertise and innovation. Our team of highly qualified scientists and engineers brings decades of combined experience, ensuring that every solution we provide—from laboratory incubators to drying ovens and centrifuges—is backed by profound knowledge and proven know-how. This rich experience and specialization allow us to understand our customers’ needs and exceed their expectations in reliability and performance.`
                },
                {
                    title: "Warranty & After Sales",
                    body: `At DragLab Technologies, we stand behind the reliability of our products with a clear warranty policy and responsive after-sales support. Our devices, whether it's a centrifuge, drying oven, water distillation, or hotplate magnetic stirrer, are covered by a standard manufacturer’s warranty, ensuring high customer care and long-term performance. In addition, our dedicated service team provides prompt technical assistance, spare parts, and maintenance solutions to minimize downtime and enhance customer satisfaction. We aim to build lasting relationships by offering comprehensive support well beyond the point of sale.`
                },
                {
                    title: "Global Presence & Trusted Partnerships",
                    body: `With a growing global distribution network and long-standing partnerships in Europe, Middle East, Asia, and beyond, DragLab Technologies is recognized as a reliable partner in the laboratory equipment sector. Our international presence allows us to support clients worldwide with consistent quality and service.`
                },
                {
                    title: "Commitment to Training & Support",
                    body: `We offer professional training programs and technical documentation to ensure our partners and customers can take full advantage of all our products’ features. Whether through on-site training, remote support, or user manuals, we equip our clients with the knowledge and confidence to operate and maintain their devices.`
                }
            ]
        }, ES: {
            pageTitle: "Cualificaciones",
            metaDescription: "Conozca las certificaciones de calidad, el cumplimiento, la experiencia técnica, el soporte posventa y las alianzas globales de DragLab.",
            status: "Certificado, Conforme, Experimentado",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Alemania<br> Tel: +49 6196 400816<br> Correo electrónico: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Garantía de Calidad y Certificaciones",
                    body: `La calidad es fundamental en nuestras operaciones en Nanodrag Technology GmbH. Nuestro sistema de gestión de calidad está certificado según las normas ISO 9001 e ISO 14001, lo que garantiza sólidos sistemas de gestión de calidad y medio ambiente. Cada producto de DragLab pasa por estrictos controles de calidad para cumplir con estándares internacionales. A través de auditorías externas, realizamos verificaciones periódicas para confirmar nuestro cumplimiento, mientras que la formación continua de los empleados promueve una sólida cultura de calidad en todos los niveles.`
                },
                {
                    title: "Cumplimiento y Normas Internacionales",
                    body: `Todos nuestros productos están diseñados y fabricados conforme a las directivas europeas. Nos aseguramos de que nuestro equipo cumpla con los requisitos reglamentarios tanto europeos como globales, ofreciendo soluciones seguras, certificadas y aceptadas internacionalmente para laboratorios.`
                },
                {
                    title: "Experiencia Técnica y Especialización",
                    body: `Con más de 20 años de experiencia en la industria de equipos de laboratorio, DragLab Technologies se enorgullece de su profunda experiencia técnica e innovación. Nuestro equipo de científicos e ingenieros altamente calificados aporta décadas de experiencia combinada, asegurando que cada solución —desde incubadoras hasta estufas de secado y centrífugas— esté respaldada por conocimientos sólidos y experiencia comprobada. Esta experiencia nos permite comprender las necesidades de nuestros clientes y superar sus expectativas en fiabilidad y rendimiento.`
                },
                {
                    title: "Garantía y Soporte Posventa",
                    body: `En DragLab Technologies respaldamos la fiabilidad de nuestros productos con una política de garantía clara y soporte posventa receptivo. Nuestros dispositivos, ya sean centrífugas, estufas de secado, sistemas de destilación de agua o agitadores magnéticos calefactores, están cubiertos por una garantía estándar del fabricante. Además, nuestro equipo de servicio brinda asistencia técnica, repuestos y mantenimiento oportuno para minimizar el tiempo de inactividad y mejorar la satisfacción del cliente. Nuestro objetivo es construir relaciones duraderas a través de un soporte integral más allá de la venta.`
                },
                {
                    title: "Presencia Global y Alianzas Confiables",
                    body: `Con una red de distribución en crecimiento y alianzas duraderas en Europa, Medio Oriente, Asia y más allá, DragLab Technologies es reconocida como un socio confiable en el sector de equipos de laboratorio. Nuestra presencia internacional nos permite ofrecer calidad y servicio constante a clientes en todo el mundo.`
                },
                {
                    title: "Compromiso con la Formación y el Soporte",
                    body: `Ofrecemos programas de formación profesional y documentación técnica para garantizar que nuestros socios y clientes aprovechen todas las funcionalidades de nuestros productos. Ya sea mediante formación presencial, soporte remoto o manuales de usuario, capacitamos a nuestros clientes con el conocimiento y la confianza necesarios para operar y mantener sus dispositivos.`
                }
            ]
        },
        DE: {
            pageTitle: "Qualifikationen",
            metaDescription: "Erfahren Sie mehr über DragLabs Qualitätszertifikate, Compliance, technische Kompetenz, After-Sales-Service und globale Partnerschaften.",
            status: "Zertifiziert, Konform, Erfahren",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Deutschland<br> Tel: +49 6196 400816<br> E-Mail: <a href="mailto:info@drag-lab.de">info@drag-lab.de</a><br>`,
            sections: [
                {
                    title: "Qualitätssicherung und Zertifizierungen",
                    body: `Qualität steht im Zentrum unserer Arbeit bei Nanodrag Technology GmbH. Unser Qualitätsmanagementsystem ist nach ISO 9001 und ISO 14001 zertifiziert und gewährleistet starke Qualitäts- und Umweltmanagementsysteme. Jedes DragLab-Produkt durchläuft strenge Qualitätskontrollen, um internationalen Standards zu entsprechen. Durch unabhängige Audits führen wir regelmäßige Prüfungen durch, um unsere Konformität zu bestätigen. Gleichzeitig fördert die kontinuierliche Schulung unserer Mitarbeiter eine starke Qualitätskultur auf allen Ebenen.`
                },
                {
                    title: "Konformität und Internationale Standards",
                    body: `Alle unsere Produkte werden gemäß den europäischen Richtlinien entwickelt und hergestellt. Wir stellen sicher, dass unsere Geräte sowohl den europäischen als auch den globalen regulatorischen Anforderungen entsprechen und bieten sichere, zertifizierte und international anerkannte Lösungen für Labore.`
                },
                {
                    title: "Technisches Fachwissen und Erfahrung",
                    body: `Mit über 20 Jahren Erfahrung in der Laborgerätebranche steht DragLab Technologies für fundiertes technisches Know-how und Innovation. Unser Team aus hochqualifizierten Wissenschaftlern und Ingenieuren bringt jahrzehntelange kombinierte Erfahrung mit und stellt sicher, dass jede von uns angebotene Lösung – von Inkubatoren bis hin zu Trockenschränken und Zentrifugen – auf profundem Wissen basiert. Diese Spezialisierung ermöglicht es uns, die Bedürfnisse unserer Kunden zu verstehen und ihre Erwartungen in puncto Zuverlässigkeit und Leistung zu übertreffen.`
                },
                {
                    title: "Garantie und Kundendienst",
                    body: `Bei DragLab Technologies stehen wir hinter der Zuverlässigkeit unserer Produkte mit einer klaren Garantiepolitik und einem reaktionsschnellen Kundendienst. Unsere Geräte – egal ob Zentrifuge, Trockenschrank, Wasseraufbereitung oder Magnetrührer – sind durch eine Standardgarantie des Herstellers abgedeckt. Unser engagiertes Serviceteam bietet zudem schnelle technische Unterstützung, Ersatzteile und Wartungslösungen, um Ausfallzeiten zu minimieren und die Kundenzufriedenheit zu erhöhen. Wir streben langfristige Beziehungen durch umfassenden Support weit über den Verkaufszeitpunkt hinaus an.`
                },
                {
                    title: "Globale Präsenz und Vertrauensvolle Partnerschaften",
                    body: `Mit einem wachsenden internationalen Vertriebsnetz und langjährigen Partnerschaften in Europa, dem Nahen Osten, Asien und darüber hinaus gilt DragLab Technologies als zuverlässiger Partner im Bereich Labortechnik. Unsere weltweite Präsenz ermöglicht es uns, Kunden weltweit mit gleichbleibender Qualität und Service zu unterstützen.`
                },
                {
                    title: "Engagement für Schulung und Support",
                    body: `Wir bieten professionelle Schulungsprogramme und technische Dokumentationen an, damit unsere Partner und Kunden alle Funktionen unserer Produkte optimal nutzen können. Ob vor Ort, per Fernsupport oder durch Benutzerhandbücher – wir statten unsere Kunden mit dem nötigen Wissen und Vertrauen aus, um ihre Geräte effizient zu bedienen und zu warten.`
                }
            ]
        },
        TR: {
            pageTitle: "Nitelikler",
            metaDescription: "DragLab'ın kalite sertifikaları, uyumluluk, teknik uzmanlık, satış sonrası destek ve küresel ortaklıkları hakkında bilgi edinin.",
            status: "Sertifikalı, Uyumlu, Deneyimli",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Almanya<br> Tel: +49 6196 400816<br> E-posta: <a href="mailto:info@draglab.com">info@draglab.com</a>`,
            sections: [
                {
                    title: "Kalite Güvencesi ve Sertifikalar",
                    body: `Kalite, Nanodrag Technology GmbH'deki operasyonlarımızın merkezindedir. Kalite yönetim sistemimiz, güçlü kalite ve çevre yönetim sistemlerini garanti eden ISO 9001 ve ISO 14001 standartlarına uygun olarak sertifikalandırılmıştır. Her DragLab ürünü, uluslararası standartlara uygunluğu sağlamak için sıkı kalite kontrol kontrollerinden geçer. Üçüncü taraf denetimleri ile işbirliği içinde, uyumluluğumuzu doğrulamak için düzenli kontroller yapıyoruz ve sürekli çalışan eğitimi, tüm seviyelerde güçlü bir kalite kültürünü teşvik ediyor.`
                },
                {
                    title: "Uyumluluk ve Uluslararası Standartlar",
                    body: `Tüm ürünlerimiz, Avrupa direktiflerine uygun olarak tasarlanmış ve üretilmiştir. Ekipmanlarımızın hem Avrupa hem de küresel düzenleyici gereksinimleri karşıladığından emin oluyoruz ve müşterilere laboratuvarları için güvenli, sertifikalı ve dünya çapında kabul gören çözümler sunuyoruz.`
                },
                {
                    title: "Teknik Uzmanlık ve Deneyim",
                    body: `Laboratuvar ekipmanları endüstrisinde 20 yılı aşkın deneyime sahip olan DragLab Technologies, derin teknik uzmanlık ve yenilikle gurur duymaktadır. Yüksek nitelikli bilim insanları ve mühendislerden oluşan ekibimiz, her sağladığımız çözümün - laboratuvar inkübatörlerinden kurutma fırınlarına ve santrifüjlere kadar - derin bilgi ve kanıtlanmış bilgi birikimiyle desteklendiğinden emin olmak için onlarca yıllık birleşik deneyim getiriyor. Bu zengin deneyim ve uzmanlık, müşterilerimizin ihtiyaçlarını anlamamızı ve güvenilirlik ve performansta beklentilerini aşmamızı sağlıyor.`
                },
                {
                    title: "Garanti ve Satış Sonrası Hizmet",
                    body: `DragLab Technologies'te, net bir garanti politikası ve duyarlı satış sonrası destekle ürünlerimizin güvenilirliğinin arkasındayız. Santrifüj, kurutma fırını, su distilasyonu veya manyetik karıştırıcı gibi cihazlarımız, yüksek müşteri bakımı ve uzun vadeli performans sağlayan standart bir üretici garantisi ile korunmaktadır. Ayrıca, özel servis ekibimiz, kesinti süresini en aza indirmek ve müşteri memnuniyetini artırmak için hızlı teknik destek, yedek parça ve bakım çözümleri sunar. Satış noktasının ötesinde kapsamlı destek sunarak kalıcı ilişkiler kurmayı hedefliyoruz.`
                },
                {
                    title: "Küresel Varlık ve Güvenilir Ortaklıklar",
                    body: `Gelişen küresel dağıtım ağımız ve Avrupa, Orta Doğu, Asya ve ötesinde uzun süredir devam eden ortaklıklarımızla DragLab Technologies, laboratuvar ekipmanları sektöründe güvenilir bir ortak olarak tanınmaktadır. Uluslararası varlığımız, dünya çapındaki müşterilere tutarlı kalite ve hizmetle destek olmamızı sağlıyor.`
                },
                {
                    title: "Eğitim ve Destek Taahhüdü",
                    body: `Tüm ürünlerimizin özelliklerinden tam olarak yararlanabilmeleri için ortaklarımıza ve müşterilerimize profesyonel eğitim programları ve teknik dokümantasyon sunuyoruz. İster yerinde eğitim, uzaktan destek veya kullanıcı kılavuzları aracılığıyla olsun, müşterilerimizi cihazlarını çalıştırmak ve bakımını yapmak için gerekli bilgi ve güvenle donatıyoruz.`
                }
            ]
        },
        FR: {
            pageTitle: "Qualifications",
            metaDescription: "Découvrez les certifications de qualité, la conformité, l'expertise technique, le support après-vente et les partenariats mondiaux de DragLab.",
            status: "Certifié, Conforme, Expérimenté",
            contactInfo: `NanoDrag Technology GmbH<br> Alfred-Herrhausen-Allee 3-5<br> D-65760 Eschborn Allemagne<br> Email: <a href="mailto:info@draglab.com">info@draglab.com</a>`,
            sections: [
                {
                    title: "Assurance Qualité et Certifications",
                    body: `La qualité est au cœur de nos opérations chez Nanodrag Technology GmbH. Notre système de gestion de la qualité est certifié selon les normes ISO 9001 et ISO 14001, garantissant des systèmes solides de gestion de la qualité et de l'environnement. Chaque produit DragLab subit des contrôles de qualité stricts pour répondre aux normes internationales. En collaboration avec des audits tiers, nous effectuons des contrôles réguliers pour confirmer notre conformité, tandis que la formation continue des employés favorise une forte culture de la qualité à tous les niveaux.`
                },
                {

                    title: "Conformité et Normes Internationales",
                    body: `Tous nos produits sont conçus et fabriqués conformément aux directives européennes. Nous veillons à ce que nos équipements répondent aux exigences réglementaires européennes et mondiales, offrant aux clients des solutions sûres, certifiées et reconnues mondialement pour leurs laboratoires.`
                },
                {
                    title: "Expertise Technique et Expérience",
                    body: `Avec plus de 20 ans d'expérience dans l'industrie des équipements de laboratoire, DragLab Technologies est fière de sa profonde expertise technique et de son innovation. Notre équipe de scientifiques et d'ingénieurs hautement qualifiés apporte des décennies d'expérience combinée, garantissant que chaque solution que nous fournissons - des incubateurs de laboratoire aux fours de séchage en passant par les centrifugeuses - est soutenue par une connaissance approfondie et un savoir-faire éprouvé. Cette riche expérience et cette spécialisation nous permettent de comprendre les besoins de nos clients et de dépasser leurs attentes en matière de fiabilité et de performance.`
                },
                {
                    title: "Garantie et Service Après-Vente",
                    body: `Chez DragLab Technologies, nous soutenons la fiabilité de nos produits avec une politique de garantie claire et un support après-vente réactif. Nos appareils, qu'il s'agisse d'une centrifugeuse, d'un four de séchage, d'une distillation d'eau ou d'un agitateur magnétique chauffant, sont couverts par une garantie standard du fabricant, garantissant un service client de haute qualité et des performances à long terme. De plus, notre équipe de service dédiée fournit une assistance technique rapide, des pièces de rechange et des solutions de maintenance pour minimiser les temps d'arrêt et améliorer la satisfaction client. Nous visons à établir des relations durables en offrant un support complet bien au-delà du point de vente.`
                },
                {
                    title: "Présence Mondiale et Partenariats de Confiance",
                    body: `Avec un réseau de distribution mondial en pleine expansion et des partenariats de longue date en Europe, au Moyen-Orient, en Asie et au-delà, DragLab Technologies est reconnue comme un partenaire fiable dans le secteur des équipements de laboratoire. Notre présence internationale nous permet de soutenir les clients du monde entier avec une qualité et un service constants.`
                },
                {
                    title: "Engagement en Matière de Formation et de Support",
                    body: `Nous proposons des programmes de formation professionnelle et une documentation technique pour garantir que nos partenaires et clients peuvent tirer pleinement parti de toutes les fonctionnalités de nos produits. Que ce soit par le biais de formations sur site, d'un support à distance ou de manuels d'utilisation, nous équipons nos clients des connaissances et de la confiance nécessaires pour exploiter et entretenir leurs appareils.`
                }
            ]
        }

    };

    Product.find()
        .then(products => {
            res.render('customer/Qualifications', {
                lang,
                products,
                qualificationsContent,
                pageTitle: qualificationsContent[lang].pageTitle,
                metaDescription: qualificationsContent[lang].metaDescription
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
};



exports.getLicensePage = async (req, res, next) => {
    const lang = (req.params.lang || req.query.lang || 'EN').toUpperCase();

    const meta = {
        EN: {
            pageTitle: 'Licenses & Attributions',
            description: 'View the licenses and attributions for images, icons, and third-party assets used on DragLab\'s website.',
        },
        ES: {
            pageTitle: 'Licencias y Atribuciones',
            description: 'Consulta las licencias y atribuciones de imágenes, iconos y recursos de terceros utilizados en el sitio web de DragLab.',
        },
        DE: {
            pageTitle: 'Lizenzen & Quellenangaben',
            description: 'Sehen Sie sich die Lizenzen und Quellenangaben für Bilder, Symbole und Drittanbieterressourcen auf der DragLab-Website an.',
        },
        TR: {
            pageTitle: 'Lisanslar ve Atıflar',
            description: 'DragLab web sitesinde kullanılan resimler, simgeler ve üçüncü taraf varlıklar için lisansları ve atıfları görüntüleyin.',
        },
        FR: {
            pageTitle: 'Licences et Attributions',
            description: 'Consultez les licences et attributions des images, icônes et ressources tierces utilisées sur le site Web de DragLab.',
        }
    };

    const selectedMeta = meta[lang] || meta.EN;

    try {
        const products = await Product.find().lean(); // ✅ for navbar

        res.render('customer/license', {
            lang,
            pageTitle: selectedMeta.pageTitle,
            metaDescription: selectedMeta.description,
            products
        });
    } catch (err) {
        next(err);
    }
};
