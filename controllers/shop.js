const path = require('path');
const Product = require('../models/product');
const express = require('express');
const User = require('../models/user');
const Article = require('../models/articles');
const WarrantyRegistration = require('../models/warrantyRegistration'); // Add at the top
const TechnicalService = require('../models/technicalService'); // make sure path is correct
const ContactUs = require('../models/contactUs');
const Industry = require('../models/IndustryPage');
const mongoose = require('mongoose');
const CatalogCategory = require('../models/CatalogCategory'); // Add this line to import the order model

const Slideshow = require('../models/slideshow'); // ✅ Make sure this is imported at the top
const axios = require('axios'); // ✅ Import axios for HTTP requests
const { RECAPTCHA_ENABLED } = require('../config/recaptcha');
const geoip = require('geoip-lite');

const cloudinary = require('../util/cloudinaryConfig');

// New page models
const Quote = require('../models/quote');
const DistributorApplication = require('../models/distributorApplication');
const FAQ = require('../models/faq');
const CaseStudy = require('../models/caseStudy');
const Glossary = require('../models/glossary');
// notifyInternal is available from the existing require at line ~1544 in this file

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
        const lang    = (req.params.lang || req.query.lang || 'EN').toUpperCase();
        const langKey = lang.toLowerCase();




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
       // ✅ Only fetch what you need for homepage cards
const [products, rawSlides, rawArticles] = await Promise.all([
  Product.find({ isDraft: false })
    .select([
      'slug',
      'ProductThumbnail',
      'Language.EN',
      'Language.ES',
      'Language.DE',
      'Language.TR',
      'Language.FR'
    ])
    .limit(12)                // show max 12 featured products
    .lean(),
  Slideshow.find({ [`translations.${langKey}.status`]: 'published' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean(),
  Article.find({ [`translations.${langKey}.status`]: 'published' })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean(),
]);


        // Map slides to flat structure for the template
        const slides = rawSlides.map(s => ({
            _id:   s._id,
            image: s.image,
            title: s.translations?.[langKey]?.title || '',
            desc:  s.translations?.[langKey]?.desc  || ''
        }));

        // Map articles to flat structure for the template
        const articles = rawArticles.map(a => ({
            _id:       a._id,
            thumbnail: a.thumbnail,
            title:     a.translations?.[langKey]?.title || '',
            slug:      a.translations?.[langKey]?.slug  || '',
            summary:   a.translations?.[langKey]?.summary || '',
            body:      a.translations?.[langKey]?.body  || ''
        }));

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


// You can move this object outside the function if you want (better for performance)
// const homeTranslations = {
//     EN: {
//         featured: "Featured Products",
//         articles: "Articles",
//         industries: "Industries",
//         about: "About Us",
//         vision: "Our Vision",
//         mission: "Our Mission",
//         values: "Our Values",
//         tab1Title: "Innovative Excellence",
//         tab1Subtitle: "Pushing technology with superior design.",
//         tab1Desc: "We believe that the products and services we provide will enable our partners to be a global leader in laboratory and medical equipment, known for our innovation, quality, and customer-focused approach.",
//         tab2Title: "Global Leadership",
//         tab2Subtitle: "Innovation, quality, and customer-driven success.",
//         tab2Desc: "We aim to empower professionals in science and healthcare with advanced, reliable, and user-friendly equipment, driving progress and improving outcomes.",
//         tab3Title: "Integrity and Responsibility",
//         tab3Subtitle: "Empowering change through ethical commitment.",
//         tab3Desc: ` <b>Innovation:</b> Continuously pushing the boundaries of technology to create cutting-edge solutions.<br><b>Quality:</b> Upholding the highest standards in product design, manufacturing, and performance.`,
//         industries: "Industries",
//         industriesList: {
//             chemical: "Chemical industry",
//             food: "Food and Beverage Industry",
//             biotech: "Biotechnology and Life Sciences",
//             pharma: "Pharmaceutical industry"
//         },
//     },
//     ES: {
//         featured: "Productos Destacados",
//         articles: "Artículos",
//         industries: "Industrias",
//         about: "Sobre Nosotros",
//         vision: "Nuestra Visión",
//         mission: "Nuestra Misión",
//         values: "Nuestros Valores",
//         tab1Title: "Excelencia Innovadora",
//         tab1Subtitle: "Impulsando la tecnología con diseño superior.",
//         tab1Desc: "Creemos que los productos y servicios que ofrecemos permitirán a nuestros socios ser líderes globales en equipos de laboratorio y médicos, reconocidos por nuestra innovación, calidad y enfoque en el cliente.",
//         tab2Title: "Liderazgo Global",
//         tab2Subtitle: "Innovación, calidad y éxito orientado al cliente.",
//         tab2Desc: "Nuestro objetivo es empoderar a los profesionales de la ciencia y la salud con equipos avanzados, confiables y fáciles de usar, impulsando el progreso y mejorando los resultados.",
//         tab3Title: "Integridad y Responsabilidad",
//         tab3Subtitle: "Empoderando el cambio mediante el compromiso ético.",
//         tab3Desc: `<b>Innovación:</b> Superar continuamente los límites de la tecnología para crear soluciones innovadoras.<br><b>Calidad:</b> Mantener los más altos estándares en el diseño, fabricación y rendimiento del producto.`,
//         industries: "Industrias",
//         industriesList: {
//             chemical: "Industria química",
//             food: "Industria alimentaria y de bebidas",
//             biotech: "Biotecnología y ciencias de la vida",
//             pharma: "Industria farmacéutica"
//         },
//     },
//     DE: {
//         featured: "Empfohlene Produkte",
//         articles: "Artikel",
//         industries: "Branchen",
//         about: "Über Uns",
//         vision: "Unsere Vision",
//         mission: "Unsere Mission",
//         values: "Unsere Werte",
//         tab1Title: "Innovative Exzellenz",
//         tab1Subtitle: "Technologie mit überragendem Design vorantreiben.",
//         tab1Desc: "Wir glauben, dass unsere Produkte und Dienstleistungen unseren Partnern helfen, weltweit führend in Labor- und Medizintechnik zu werden – bekannt für Innovation, Qualität und Kundenorientierung.",
//         tab2Title: "Globale Führung",
//         tab2Subtitle: "Innovation, Qualität und kundengesteuerter Erfolg.",
//         tab2Desc: "Unser Ziel ist es, Fachkräfte in Wissenschaft und Gesundheitswesen mit fortschrittlichen, zuverlässigen und benutzerfreundlichen Geräten auszustatten und Fortschritte zu fördern.",
//         tab3Title: "Integrität und Verantwortung",
//         tab3Subtitle: "Veränderung durch ethisches Engagement fördern.",
//         tab3Desc: '<b>Innovation:</b> Continuously pushing the boundaries of technology to create cutting-edge solutions.<br><b>Quality:</b> Upholding the highest standards in product design, manufacturing, and performance.',
//         industries: "Branchen",
//         industriesList: {
//             chemical: "Chemische Industrie",
//             food: "Lebensmittel- und Getränkeindustrie",
//             biotech: "Biotechnologie und Lebenswissenschaften",
//             pharma: "Pharmazeutische Industrie"
//         },
//     },
//     TR: {
//         featured: "Öne Çıkan Ürünler",
//         articles: "Makaleler",
//         industries: "Endüstriler",
//         about: "Hakkımızda",
//         vision: "Vizyonumuz",
//         mission: "Misyonumuz",
//         values: "Değerlerimiz",
//         tab1Title: "Yenilikçi Mükemmellik",
//         tab1Subtitle: "Üstün tasarımla teknolojiyi ileriye taşıyoruz.",
//         tab1Desc: "Ürün ve hizmetlerimizin, ortaklarımızın yenilik, kalite ve müşteri odaklı yaklaşımıyla tanınan laboratuvar ve tıbbi ekipmanlarda küresel lider olmalarını sağlayacağına inanıyoruz.",
//         tab2Title: "Küresel Liderlik",
//         tab2Subtitle: "Yenilik, kalite ve müşteri odaklı başarı.",
//         tab2Desc: "Bilim ve sağlık profesyonellerini gelişmiş, güvenilir ve kullanıcı dostu ekipmanlarla güçlendirerek ilerlemeyi teşvik etmeyi ve sonuçları iyileştirmeyi hedefliyoruz.",
//         tab3Title: "Dürüstlük ve Sorumluluk",
//         tab3Subtitle: "Etik taahhütle değişimi güçlendirmek.",
//         tab3Desc: `<b>Yenilik:</b> Kesintisiz olarak teknolojinin sınırlarını zorlayarak öncü çözümler yaratmak.<br><b>Kalite:</b> Ürün tasarımı, üretimi ve performansında en yüksek standartları korumak.`,
//         industries: "Endüstriler",
//         industriesList: {
//             chemical: "Kimya Endüstrisi",
//             food: "Gıda ve İçecek Endüstrisi",
//             biotech: "Biyoteknoloji ve Yaşam Bilimleri",
//             pharma: "İlaç Endüstrisi"
//         },
//     },
//     FR: {
//         featured: "Produits en Vedette",
//         articles: "Articles",
//         industries: "Industries",
//         about: "À Propos de Nous",
//         vision: "Notre Vision",
//         mission: "Notre Mission",
//         values: "Nos Valeurs",
//         tab1Title: "Excellence Innovante",
//         tab1Subtitle: "Pousser la technologie avec un design supérieur.",
//         tab1Desc: "Nous croyons que les produits et services que nous fournissons permettront à nos partenaires de devenir un leader mondial dans les équipements de laboratoire et médicaux, connus pour notre innovation, notre qualité et notre approche axée sur le client.",
//         tab2Title: "Leadership Mondial",
//         tab2Subtitle: "Innovation, qualité et succès axé sur le client.",
//         tab2Desc: "Nous visons à autonomiser les professionnels de la science et des soins de santé avec des équipements avancés, fiables et conviviaux, stimulant le progrès et améliorant les résultats.",
//         tab3Title: "Intégrité et Responsabilité",
//         tab3Subtitle: "Favoriser le changement grâce à un engagement éthique.",
//         tab3Desc: `<b>Innovation :</b> Repousser continuellement les limites de la technologie pour créer des solutions de pointe.<br><b>Qualité :</b> Maintenir les normes les plus élevées en matière de conception, de fabrication et de performance des produits.`,
//         industries: "Industries",
//         industriesList: {
//             chemical: "Industrie Chimique",
//             food: "Industrie Alimentaire et des Boissons",
//             biotech: "Biotechnologie et Sciences de la Vie",
//             pharma: "Industrie Pharmaceutique"
//         }
//     }
// };

// exports.getHomePage = async (req, res, next) => {
//     try {
//         const supportedLangs = ['EN', 'ES', 'DE', 'TR', 'FR'];

//         // Prefer lang from navbar middleware, fall back to params/query
//         const langFromMiddleware = (res.locals.lang || '').toUpperCase();
//         const rawLang = (req.params.lang || req.query.lang || 'EN').toUpperCase();
//         const candidateLang = langFromMiddleware || rawLang;
//         const lang = supportedLangs.includes(candidateLang) ? candidateLang : 'EN';

//         const t = homeTranslations[lang] || homeTranslations.EN;

//         const t0 = Date.now();

//         // Fetch everything in parallel (including industries)
//         const [products, slides, articles, rawIndustries] = await Promise.all([
//             // ✅ Only non-draft AND published in this language
//             Product.find({
//                 isDraft: false,
//                 [`Language.${lang}`]: { $elemMatch: { publish: true } }
//             })
//                 .select([
//                     'slug',
//                     'ProductThumbnail',
//                     `Language.${lang}`,
//                     'Language.EN'
//                 ])
//                 .lean(),

//             Slideshow.find({ $or: [{ language: lang }, { language: 'ALL' }] })
//                 .sort({ createdAt: -1 })
//                 .lean(),

//             Article.find({ $or: [{ language: lang }, { language: 'ALL' }] })
//                 .sort({ createdAt: -1 })
//                 .limit(10)
//                 .lean(),

//             Industry.find({ isDraft: false })
//                 .sort({ createdAt: 1 })
//                 .limit(4)
//                 .lean()
//         ]);

//         // Industries -> cards
//         const industryCards = rawIndustries.map(ind => {
//             const langData = ind.Language?.[lang]?.[0] || {};
//             return {
//                 slug: ind.slug,
//                 image: ind.sharedImages?.introImage || '/assets/Imgs/default.jpg',
//                 title: langData.slideTitle || ind.slug,
//                 description: langData.slideDesc || ''
//             };
//         });

//         const elapsed = Date.now() - t0;
//         console.log(`🧩 getHomePage controller took ${elapsed} ms`);

//         res.render('customer/Home-page', {
//             pageTitle: 'DragLab – Scientific Equipment for Modern Labs',
//             path: '/',
//             products,        // already filtered to published in this lang
//             slides,
//             articles,
//             lang,
//             industryCards,
//             t
//         });

//     } catch (err) {
//         console.error('Error loading home page:', err);
//         next(err);
//     }
// };




exports.getProducts = async (req, res, next) => {
  try {
    // 1) Build filters
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

    // 2) Base query – only select what you really need
    let productQuery = Product.find(filters)
      .select('ProductName Productprice productThumbnail quantity Company color')
      .lean(); // ✅ lean for faster read

    // 3) Sorting
    if (req.query.sort === 'price-asc') {
      productQuery = productQuery.sort({ Productprice: 1 });
    } else if (req.query.sort === 'price-desc') {
      productQuery = productQuery.sort({ Productprice: -1 });
    }

    // 4) Run products + categories in parallel
    const [products, categories] = await Promise.all([
      productQuery.exec(),
      Category.find().lean().exec()
    ]);

    // 5) Cart count (for both logged in / not logged in)
    let cartItemCount = 0;
    let likedItems = [];
    let role;

    if (req.user) {
      cartItemCount = (req.user.cart?.items || [])
        .reduce((count, item) => count + (item.quantity || 0), 0);

      const populatedUser = await req.user.populate('likedItems');
      likedItems = (populatedUser.likedItems || []).map(item => item._id.toString());
      role = populatedUser.role;
    }

    // 6) Render once
    res.render('customer/products-page', {
      prods: products,
      categories,
      cartItemCount,
      pageTitle: 'Products',
      path: '/Products',
      role,
      likedItems,
      isAuthenticated: req.session?.isLoggedIn || false
    });

  } catch (err) {
    console.error('getProducts error:', err);
    return next(err); // let your 500 handler render the error page
  }
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

// Search index cache — rebuilt at most once per 10 minutes per language
const _searchCache = {};
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;

async function _buildSearchIndex(lang) {
    const [products, articles] = await Promise.all([
        Product.find({ isDraft: false })
            .select(['slug', 'Models.slug', 'Models.isPublished', `Language.${lang}`, `Models.Language.${lang}`, 'Language.EN', 'Models.Language.EN'])
            .lean(),
        Article.find({ language: lang }).select(['title', 'slug']).lean()
    ]);

    const searchableData = [];

    for (const product of products) {
        const pLang = getLangBlock(product.Language, lang);
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
            if (mLang && mLang.ModelName) {
                searchableData.push({
                    type: 'model',
                    name: mLang.ModelName,
                    url: `/${lang}/products/${product.slug}/${model.slug}`
                });
            }
        }
    }

    for (const article of articles) {
        searchableData.push({
            type: 'article',
            name: article.title,
            url: `/${lang}/articles/${article.slug}`
        });
    }

    return new Fuse(searchableData, { keys: ['name'], threshold: 0.4, includeScore: true });
}

exports.search = async (req, res) => {
    const query = req.query.q?.trim();
    const lang = (req.query.lang || 'EN').toUpperCase();

    if (!query || query.length < 2) return res.json([]);

    try {
        const now = Date.now();
        const cached = _searchCache[lang];
        if (!cached || (now - cached.ts) > SEARCH_CACHE_TTL_MS) {
            _searchCache[lang] = { fuse: await _buildSearchIndex(lang), ts: now };
        }

        const results = _searchCache[lang].fuse.search(query)
            .sort((a, b) => a.score - b.score)
            .map(r => r.item);

        const grouped = { product: [], model: [], article: [] };
        for (const item of results) {
            if (grouped[item.type].length < 5) grouped[item.type].push(item);
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

    // 1) Normalize language
    const rawLang = req.params.lang || req.query.lang || 'EN';
    const selectedLang = String(rawLang).toUpperCase();

    const supportedLangs = ['EN', 'ES', 'DE', 'TR', 'FR'];
    const langKey = supportedLangs.includes(selectedLang) ? selectedLang : 'EN';

    // 2) Fetch product (lean + minimal projection if you want even more perf)
    const product = await Product.findOne({ slug: productSlug }).lean();

    if (!product) {
      // Use your 404 template
      return res.status(404).render('404', {
        pageTitle: 'Not found',
        path: '/404',
        isAuthenticated: req.session?.isLoggedIn || false
      });
    }

    const langData = product.Language?.[langKey]?.[0];
    const enData = product.Language?.EN?.[0];

    // 3) Available languages (where product is published)
    const availableLangs = supportedLangs.filter(
      L => product?.Language?.[L]?.[0]?.publish === true
    );

    // 4) If product is not published in current language -> show switch page
    if (!langData || langData.publish !== true) {
      const sortedAvailable = availableLangs.sort((a, b) =>
        a === 'EN' ? -1 : b === 'EN' ? 1 : 0
      );

      const langNames = {
        EN: 'English',
        ES: 'Español',
        DE: 'Deutsch',
        TR: 'Türkçe',
        FR: 'Français'
      };

      const links = sortedAvailable.map(L => ({
        code: L,
        url: `/${L}/products/${product.slug}`,
        name: langNames[L] || L
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

    // 5) SEO meta & tags (with EN fallback)
    const metaForLang =
      (product.meta && (product.meta[langKey] || product.meta.EN)) || {};
    const tagsForLang =
      (product.tags && (product.tags[langKey] || product.tags.EN)) || [];

    const stripHtml = (s) =>
      String(s || '')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const productNameBase =
      langData?.ProductName || enData?.ProductName || 'Product';
    const descBase = stripHtml(
      langData?.ProductDesc || enData?.ProductDesc || ''
    );

    const metaTitle =
      (metaForLang.title && metaForLang.title.trim()) ||
      `${productNameBase} | DragLab`;

    const metaDescription =
      (metaForLang.description && metaForLang.description.trim()) ||
      descBase.slice(0, 160) ||
      `Discover ${productNameBase} from DragLab – reliable laboratory equipment for modern labs.`;

    const keywordsArray = Array.isArray(tagsForLang)
      ? tagsForLang.slice(0, 12)
      : [];
    const keywordsCsv = keywordsArray.join(', ');

    // 6) Filter models for current language
    // show model if:
    // - current language publish === true OR
    // - EN publish === true OR
    // - model-level isPublished === true
    const modelsForLang = (product.Models || []).filter((m) => {
      const langBlock = m?.Language?.[langKey]?.[0];
      const enBlock = m?.Language?.EN?.[0];
      return (
        langBlock?.publish === true ||
        enBlock?.publish === true ||
        m?.isPublished === true
      );
    });

    // Debug if needed
    console.debug(
      '[ProductDetails] slug=%s lang=%s models=%d',
      product.slug,
      langKey,
      modelsForLang.length
    );

    const navProducts = res.locals.navProducts || [];

    // 7) Render
    return res.render('customer/product-details', {
      product,
      lang: langKey,
      translation: langData || enData,
      models: modelsForLang,
      products: navProducts,
      metaTitle,
      metaDescription,
      keywordsCsv,
      keywordsArray
    });
  } catch (err) {
    console.error('getProductDetails error:', err);
    return next(err); // let your global 500 handler render the error page
  }
};


        const modelPageTranslations  = {
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

exports.getModelDetailsPage = async (req, res, next) => {
  try {
    const { lang, productSlug, modelSlug } = req.params;

    const supportedLangs = allanguages; // e.g. ['EN','ES','DE','TR','FR']
    const rawLang = (lang || req.query.lang || 'EN').toUpperCase();
    const selectedLang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    // ✅ 1) Fetch ONLY the product + the single matching model
    const projection = {
      slug: 1,
      'Language.EN': 1,
      'Models.$': 1    // only the matched model is returned
    };
    // also include selected language for product title (if not EN)
    if (selectedLang !== 'EN') {
      projection[`Language.${selectedLang}`] = 1;
    }

    const product = await Product.findOne(
      { slug: productSlug, 'Models.slug': modelSlug },
      projection
    ).lean();

    if (!product || !product.Models || product.Models.length === 0) {
      return res.status(404).render('404', {
        pageTitle: 'Not found',
        path: '/404',
        isAuthenticated: req.session?.isLoggedIn || false
      });
    }

    const model = product.Models[0];

    // If model itself is not published at all -> 404
    if (model.isPublished === false) {
      return res.status(404).render('404', {
        pageTitle: 'Not found',
        path: '/404',
        isAuthenticated: req.session?.isLoggedIn || false
      });
    }

    // 2) Published languages for this model
    const availableLangs = (supportedLangs || []).filter(
      L => model?.Language?.[L]?.[0]?.publish === true
    );

    // 3) Current language gate: if NOT published -> friendly "switch language" page
    const currentLangData = model?.Language?.[selectedLang]?.[0];
    const englishLangData = model?.Language?.EN?.[0];

    if (!currentLangData || currentLangData.publish !== true) {
      const sortedAvailable = availableLangs.sort((a, b) =>
        a === 'EN' ? -1 : b === 'EN' ? 1 : 0
      );

      const langNames = {
        EN: 'English',
        ES: 'Español',
        DE: 'Deutsch',
        TR: 'Türkçe',
        FR: 'Français'
      };

      const links = sortedAvailable.map(L => ({
        code: L,
        url: `/${L}/products/${product.slug}/${model.slug}`,
        name: langNames[L] || L
      }));

      return res.status(200).render('customer/model-not-available', {
        pageTitle: 'Model Unavailable',
        lang: selectedLang,
        productSlug: product.slug,
        modelSlug: model.slug,
        links,
        hasAny: links.length > 0,
        products: res.locals.navProducts || []
      });
    }

    // 4) Product language (for product name)
    const productLangData =
      product.Language?.[selectedLang]?.[0] || product.Language?.EN?.[0];

    // 5) SEO (meta + tags) with EN fallback
    const metaForLang =
      (model.meta && (model.meta[selectedLang] || model.meta.EN)) || {};
    const tagsForLang =
      (model.tags && (model.tags[selectedLang] || model.tags.EN)) || [];

    const modelNameBase =
      currentLangData?.ModelName || englishLangData?.ModelName || 'Model';
    const productNameBase =
      productLangData?.ProductName || 'DragLab Product';

    const stripHtml = (s) =>
      String(s || '')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const descBase = stripHtml(
      currentLangData?.ModelDesc || englishLangData?.ModelDesc || ''
    );

    const metaTitle =
      (metaForLang.title && metaForLang.title.trim()) ||
      `${modelNameBase} – ${productNameBase} | DragLab`;

    const metaDescription =
      (metaForLang.description && metaForLang.description.trim()) ||
      descBase.slice(0, 160) ||
      `Discover ${modelNameBase} for ${productNameBase} by DragLab.`;

    const keywordsArray = Array.isArray(tagsForLang) ? tagsForLang : [];
    const keywordsCsv = keywordsArray.join(', ');

    // 6) Translations for UI labels (Overview / Downloads / etc.)
    const t = modelPageTranslations[selectedLang] || modelPageTranslations.EN;

    // 7) Build overview array with shared EN images
    const overviewSource =
      currentLangData.overview?.length
        ? currentLangData.overview
        : englishLangData?.overview || [];

    const overview = overviewSource.map((o, i) => ({
      ...(o.toObject ? o.toObject() : o),
      overviewImage: englishLangData?.overview?.[i]?.overviewImage || ''
    }));

    // 7b) Build industry array from IndustryPage references (or fallback to embedded data)
    let industry = [];
    if (model.industrySlugs && model.industrySlugs.length > 0) {
      const industryDocs = await Industry.find({
        slug: { $in: model.industrySlugs },
        isDraft: false
      }).lean();
      industry = model.industrySlugs
        .map(slug => industryDocs.find(d => d.slug === slug))
        .filter(Boolean)
        .map(ind => {
          const langData = ind.Language?.[selectedLang]?.[0] || ind.Language?.EN?.[0] || {};
          return {
            slug: ind.slug,
            industryImage: ind.sharedImages?.introImage || '',
            industryName: langData.slideTitle || ind.slug
          };
        });
    } else {
      // Fallback: use legacy embedded industry data
      const industrySource =
        currentLangData.industry?.length
          ? currentLangData.industry
          : englishLangData?.industry || [];
      industry = industrySource.map((ind, i) => ({
        ...(ind.toObject ? ind.toObject() : ind),
        industryImage: englishLangData?.industry?.[i]?.industryImage || '',
        industryLogo: englishLangData?.industry?.[i]?.industryLogo || ''
      }));
    }

    const navProducts = res.locals.navProducts || [];

    // 8) Render page
    return res.render('customer/Model-details', {
      pageTitle: metaTitle,
      metaTitle,
      metaDescription,
      keywordsCsv,
      keywordsArray,

      ModelName:
        currentLangData.ModelName || englishLangData?.ModelName || 'No Name',
      ModelNameDesc:
        currentLangData.ModelNameDesc ||
        englishLangData?.ModelNameDesc ||
        'No Description',
      ModelDesc:
        currentLangData.ModelDesc ||
        englishLangData?.ModelDesc ||
        'No Details',

      overview,
      industry,
      specs: currentLangData.technicalSpecifications || [],
      downloads: currentLangData.downloads || [],

      modelThumbnail: model.ModelThumbnail,
      overviewThumbnail: model.overviewThumbnail,
      modelPhotos: model.ModelPhotos,

      lang: selectedLang,
      products: navProducts,
      productId: product._id,
      modelId: model._id,
      t,
      productName: productLangData?.ProductName || 'Unknown Product',
      productSlug,
      modelSlug
    });
  } catch (err) {
    console.error('getModelDetailsPage error:', err);
    return next(err); // let your 500 handler render the error page
  }
};






exports.getContactus = (req, res, next) => {
    const lang = req.params.lang?.toUpperCase() || req.query.lang?.toUpperCase() || 'EN';
    const CDN_BASE = 'https://www.drag-lab.de';
    const DEFAULT_OG = `${CDN_BASE}/assets/Imgs/SEO/contact-us.jpg`;

    const translations = {
        EN: {
            pageTitle: 'Contact Us - DragLab',
            metaDescription: 'Have a question or need help? Contact DragLab for fast support and expert assistance. We\'re here to help you.',
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

            res.render('customer/contact-us.ejs', {
                ...t,
                labels: t.labels,
                lang,
                req,
                categories: [],
                path: `/${lang}/contactus`,
                noindex,
                canonicalUrl,
                ogImage: t.ogImage
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
                params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token },
                timeout: 5000 // 5-second cap — don't let Google hang the form
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
        const referrer  = req.get('Referer') || null;

        // --- Geo lookup ---
        const geo = geoip.lookup(ipAddress);
        const geoLocation = {
            country: geo?.country || null,
            region:  geo?.region  || null,
            city:    geo?.city    || null,
            isp:     geo?.org     || null
        };

        // --- Persist submission ---
        const doc = await new ContactUs({
            firstName, lastName, subject, email, message,
            lang, ipAddress, userAgent, referrer, geoLocation
        }).save();

        // Redirect the user immediately — they don't need to wait for email delivery.
        // Emails are sent asynchronously in the background after the response.
        res.redirect(`/${lang}/contactus?success=true`);

        // --- Build email payloads ---
        const ticketId = `CU-${doc._id.toString().slice(-6).toUpperCase()}`;
        const flags = {
            isEN: lang === 'EN', isES: lang === 'ES', isDE: lang === 'DE',
            isTR: lang === 'TR', isFR: lang === 'FR'
        };
        const subjectMap = {
            EN: `[Contact] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            ES: `[Contacto] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            DE: `[Kontakt] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            TR: `[İletişim] ${firstName} ${lastName} — ${subject} (${ticketId})`,
            FR: `[Contact] ${firstName} ${lastName} — ${subject} (${ticketId})`
        };
        const bodyText =
            `New Contact Us submission\n\nTicket: ${ticketId}\nName: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message || '-'}\n\nMeta:\n- Language: ${lang}\n- IP: ${ipAddress || '-'}\n- User-Agent: ${userAgent || '-'}\n\nAdmin Link: https://www.drag-lab.de/admin/contact-message/${doc._id}\n`;

        // --- Send both emails in parallel, non-blocking ---
        Promise.all([
            sendCustomerEmail({
                to: email,
                form: 'contactUs',
                data: {
                    ...flags,
                    year: new Date().getFullYear(),
                    brandName: 'DragLab',
                    supportEmail: 'info@drag-lab.de',
                    ticketId,
                    fullName: `${firstName} ${lastName}`,
                    contactSubject: subject,
                    userMessage: message || '',
                    helpCenterUrl: `https://www.drag-lab.de/${lang}/contactus`
                }
            }),
            notifyInternal({
                to: 'info@drag-lab.de',
                subject: subjectMap[lang] || subjectMap.EN,
                text: bodyText
            })
        ]).catch(err => console.error('❌ Contact Us email delivery failed:', err));
    } catch (err) {
        console.error('❌ Error in Contact Us submission:', err);
        const fallback = (req.body.lang || req.query.lang || 'EN').toUpperCase();
        return res.redirect(`/${fallback}/contactus?error=true`);
    }
};






// controllers/shop.js

exports.geTechnicalservice = async (req, res, next) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();

  
    const translations = {
        EN: {
            pageTitle: 'Technical Support - DragLab',
            metaDescription: 'Need technical support for your DragLab equipment? Fill out our Technical Support Form for quick and reliable assistance from our experts.',
            ogTitle: 'Technical Support | DragLab',
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
            pageTitle: 'Soporte Técnico - DragLab',
            metaDescription: '¿Necesita soporte técnico para su equipo DragLab? Complete nuestro Formulario de Soporte Técnico para obtener asistencia rápida y confiable de nuestros expertos.',
            ogTitle: 'Soporte Técnico | DragLab',
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
            pageTitle: 'Technischer Support - DragLab',
            metaDescription: 'Benötigen Sie technischen Support für Ihre DragLab-Geräte? Füllen Sie unser Technischer Support-Formular aus, um schnelle und zuverlässige Unterstützung von unseren Experten zu erhalten.',
            ogTitle: 'Technischer Support | DragLab',
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
            pageTitle: 'Teknik Destek - DragLab',
            metaDescription: 'DragLab ekipmanınız için teknik desteğe mi ihtiyacınız var? Hızlı ve güvenilir yardım için Teknik Destek Formumuzu doldurun.',
            ogTitle: 'Teknik Destek | DragLab',
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
            pageTitle: 'Support Technique - DragLab',
            metaDescription: 'Besoin d\'un support technique pour votre équipement DragLab ? Remplissez notre formulaire de support technique pour une assistance rapide et fiable de nos experts.',
            ogTitle: 'Support Technique | DragLab',
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

    const t = translations[lang] || translations.EN;

    // ✅ Load products for the dropdown
    const allProducts = await Product.find({ isDraft: { $ne: true } })
      .select('_id Language')
      .lean();

    // (Optional) keep only products published in this language
    const products = allProducts.filter(p => {
      const block = p.Language?.[lang]?.[0] || p.Language?.EN?.[0];
      return block && block.publish === true;
    });

    res.render('customer/technical-service', {
      pageTitle:'Technical Service',
      path: `/technical-service/${lang}`,
      lang,
      t,
      translations: t,
      products,                 // ✅ now available in EJS
      req,
    recaptchaEnabled: RECAPTCHA_ENABLED, 
    });
  } catch (err) {
    console.error('Technical service page error:', err);
    next(err);
  }
};



// controllers/technicalService.js
const { sendCustomerEmail, notifyInternal } = require('../services/email');

// controllers/technicalService.js


exports.postTechnicalService = async (req, res) => {
  const lang = (req.body.lang || req.query.lang || 'EN').toUpperCase();
  const token = req.body['g-recaptcha-response'];

  try {
    // --- reCAPTCHA (same logic as Contact Us) -----------------------
    if (RECAPTCHA_ENABLED) {
      if (!token) {
        console.error('❌ Missing reCAPTCHA token (technical service)');
        return res.redirect(`/${lang}/technical-service?error=true`);
      }

      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const { data } = await axios.post(verifyUrl, null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        },
        timeout: 5000 // 5-second cap — don't let Google hang the form
      });

      if (!data?.success || Number(data?.score) < 0.5) {
        console.error('❌ reCAPTCHA verification failed (technical service):', data);
        return res.redirect(`/${lang}/technical-service?error=true`);
      }
    } else {
      console.warn('⚠️ reCAPTCHA disabled via RECAPTCHA_ENABLED=false (test mode)');
    }

    // --- Extract submitted fields ----------------------------------
    const {
      infoType, company, department, salutation, firstName, lastName,
      postalTown, street, country, telephone, telefax, email,
      failureDate, deviceCategory, deviceModel, serialNo, note,
      deviceCategoryName, deviceModelName
    } = req.body;

    // --- HARD validation for IDs before hitting Mongoose -----------
    if (
      !deviceCategory ||
      !mongoose.isValidObjectId(deviceCategory) ||
      !deviceModel ||
      deviceModel === 'undefined' ||
      !mongoose.isValidObjectId(deviceModel)
    ) {
      console.error('❌ Invalid deviceCategory/deviceModel in TechnicalService POST:', {
        deviceCategory,
        deviceModel
      });
      return res.redirect(`/${lang}/technical-service?error=true`);
    }

    // --- Resolve readable names from Product + embedded Model ------
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
          productDoc?.Language?.EN?.[0]?.ProductName ??
          '';

        const modelSub = productDoc?.Models?.find(
          (m) => String(m._id) === String(deviceModel)
        );

        if (modelSub) {
          modelName =
            modelSub?.Language?.[lang]?.[0]?.ModelName ??
            modelSub?.Language?.EN?.[0]?.ModelName ??
            '';
        }
      }
    } catch (e) {
      console.warn('⚠️ Product/Model name lookup failed:', e?.message || e);
    }

    // Fallbacks if lookup failed
    if (!productName) productName = deviceCategoryName || deviceCategory;
    if (!modelName) modelName = deviceModelName || deviceModel;

    // --- Meta info -------------------------------------------------
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const userAgent = req.get('User-Agent');

    // --- Persist submission ----------------------------------------
    const doc = await TechnicalService.create({
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
      deviceCategory,   // valid ObjectId
      deviceModel,      // valid ObjectId
      serialNo,
      note,
      lang,
      ipAddress,
      userAgent
    });

    const ticketId = `TS-${doc._id.toString().slice(-6).toUpperCase()}`;

    // Redirect the user immediately — they don't need to wait for email delivery.
    // Emails are sent asynchronously in the background after the response.
    res.redirect(`/${lang}/technical-service?success=true`);

    // --- Build email payloads ---
    const flags = {
      isEN: lang === 'EN', isES: lang === 'ES', isDE: lang === 'DE',
      isTR: lang === 'TR', isFR: lang === 'FR'
    };
    const subjectMap = {
      EN: `[Tech Support] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
      ES: `[Soporte Técnico] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
      DE: `[Technischer Support] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
      TR: `[Teknik Destek] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`,
      FR: `[Support Technique] ${firstName} ${lastName} — ${productName}/${modelName} (${ticketId})`
    };
    const bodyText =
`New Technical Support submission\n\nTicket: ${ticketId}\nName: ${firstName} ${lastName}\nEmail: ${email}\nType: ${infoType || '-'}\nCompany: ${company || '-'}\nDepartment: ${department || '-'}\n\nAddress:\n- ${street || '-'}\n- ${postalTown || '-'}\n- ${country || '-'}\n\nContact:\n- Telephone: ${telephone || '-'}\n- Telefax: ${telefax || '-'}\n\nDevice:\n- Category: ${productName || '-'}\n- Model: ${modelName || '-'}\n- Serial: ${serialNo || '-'}\n\nFailure Date: ${failureDate || '-'}\nQuestion/Note:\n${note || '-'}\n\nMeta:\n- Language: ${lang}\n- IP: ${ipAddress || '-'}\n- User-Agent: ${userAgent || '-'}\n\nAdmin Link: https://www.drag-lab.de/admin/technical-requests/${doc._id}\n`;

    // --- Send both emails in parallel, non-blocking ---
    Promise.all([
      sendCustomerEmail({
        to: email,
        form: 'technicalSupport',
        data: {
          ...flags,
          year: new Date().getFullYear(),
          brandName: 'DragLab',
          supportEmail: 'info@drag-lab.de',
          ticketId,
          deviceCategory: productName || '',
          deviceModel: modelName || '',
          serialNumber: serialNo || '',
          dateOfFailure: failureDate || '',
          technicalQuestion: note || '',
          helpCenterUrl: `https://www.drag-lab.de/${lang}/technical-service`
        }
      }),
      notifyInternal({
        to: 'info@drag-lab.de',
        subject: subjectMap[lang] || subjectMap.EN,
        text: bodyText
      })
    ]).catch(err => console.error('❌ Technical Service email delivery failed:', err));
  } catch (err) {
    console.error('❌ Error in TechnicalService submission:', err);
    const fallback = (req.body.lang || req.query.lang || 'EN').toUpperCase();
    return res.redirect(`/${fallback}/technical-service?error=true`);
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

   
            res.render('customer/Support', {
                pageTitle: 'Support',
                path: '/support',
                lang,
                content
            });
    
};





exports.getArticles = async (req, res) => {
    const lang    = (req.params.lang || 'EN').toUpperCase();
    const langKey = lang.toLowerCase();

    const seoTranslations = {
        EN: { pageTitle: 'Articles - DragLab', metaDescription: 'Explore insights, innovations, and expert knowledge in lab technology through DragLab\'s latest articles.' },
        ES: { pageTitle: 'Artículos - DragLab', metaDescription: 'Explore conocimientos, innovaciones y experiencia en tecnología de laboratorio a través de los artículos de DragLab.' },
        DE: { pageTitle: 'Artikel - DragLab',   metaDescription: 'Entdecken Sie Einblicke, Innovationen und Fachwissen über Labortechnologie in den neuesten Artikeln von DragLab.' },
        TR: { pageTitle: 'Makaleler - DragLab', metaDescription: 'DragLab\'ın en son makaleleri aracılığıyla laboratuvar teknolojisindeki içgörüler, yenilikler ve uzman bilgilerini keşfedin.' },
        FR: { pageTitle: 'Articles - DragLab',  metaDescription: 'Explorez les idées, les innovations et l\'expertise en technologie de laboratoire à travers les derniers articles de DragLab.' }
    };
    const t = seoTranslations[lang] || seoTranslations['EN'];

    try {
        const raw = await Article.find({ [`translations.${langKey}.status`]: 'published' })
            .sort({ createdAt: -1 });

        const articles = raw.map(a => {
            const tr = a.translations[langKey];
            return {
                _id: a._id,
                thumbnail: a.thumbnail,
                author: a.author,
                category: a.category,
                slug: tr.slug,
                title: tr.title,
                summary: tr.summary,
                body: tr.body,
                tags: tr.tags,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt
            };
        });

        res.render('customer/Articles', {
            articles,
            lang,
            pageTitle: t.pageTitle,
            metaDescription: t.metaDescription
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};


exports.getArticleDetails = async (req, res) => {
    const { slug }  = req.params;
    const lang      = (req.params.lang || 'EN').toUpperCase();
    const langKey   = lang.toLowerCase();

    try {
        const raw = await Article.findOne({ [`translations.${langKey}.slug`]: slug });
        if (!raw) return res.redirect('/');

        const tr = raw.translations[langKey];
        const article = {
            _id:       raw._id,
            thumbnail: raw.thumbnail,
            author:    raw.author,
            category:  raw.category,
            slug:      tr.slug,
            title:     tr.title,
            summary:   tr.summary,
            body:      tr.body,
            tags:      tr.tags,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };

        const recentRaw = await Article.find({
            _id: { $ne: raw._id },
            [`translations.${langKey}.status`]: 'published'
        }).sort({ createdAt: -1 }).limit(4);

        const recentArticles = recentRaw.map(a => ({
            _id:       a._id,
            thumbnail: a.thumbnail,
            title:     a.translations[langKey].title,
            slug:      a.translations[langKey].slug
        }));

        // Build per-language slug map so the navbar switcher can link to the right slug
        const langSlugs = {};
        const LANGS = ['en', 'es', 'de', 'tr', 'fr'];
        for (const l of LANGS) {
            const t = raw.translations[l];
            if (t && t.status === 'published' && t.slug) {
                langSlugs[l.toUpperCase()] = t.slug;
            }
        }

        res.render('customer/article-details', { article, recentArticles, lang, langSlugs });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

exports.getDownloads = async (req, res, next) => {
  const rawLang = req.params.lang || 'EN';
  const lang = rawLang.toUpperCase();
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
  const t = translations[lang] || translations.EN;

  try {
    // Build projection for Product to avoid loading entire docs
    const productProjection = {
      [`Language.${lang}.ProductName`]: 1,
      'Language.EN.ProductName': 1,
      [`Models.Language.${lang}.downloads`]: 1,
      [`Models.Language.${lang}.ModelName`]: 1,
      'Models.Language.EN.downloads': 1,
      'Models.Language.EN.ModelName': 1
    };

    const [products, catalogCategories] = await Promise.all([
      Product.find({ isDraft: false }).select(productProjection).lean(),
      CatalogCategory.find({})
        .select('categoryKey categoryName files')
        .lean()
    ]);

    const downloads = [];
    const productNamesSet = new Set();
    const catalogCategoryNamesSet = new Set();

    // ✅ Model-based downloads – now using lean + minimal fields
    for (const product of products) {
      const productLang =
        product.Language?.[lang]?.[0] ||
        product.Language?.EN?.[0];
      if (!productLang) continue;

      const productName = productLang.ProductName || 'Unnamed Product';
      productNamesSet.add(productName);

      if (!Array.isArray(product.Models)) continue;

      for (const model of product.Models) {
        const modelLang =
          model.Language?.[lang]?.[0] ||
          model.Language?.EN?.[0];

        if (!modelLang || !Array.isArray(modelLang.downloads)) continue;

        for (const file of modelLang.downloads) {
          if (!file.filePath) continue;

          downloads.push({
            fileName: file.fileName,
            filePath: file.filePath,
            fileSize: file.fileSize,
            fileCategory: (file.fileCategory || 'general')
              .toLowerCase()
              .replace(/\s+/g, '-'),
            fileProductCategory: (file.fileProductCategory || productName)
              .toLowerCase()
              .replace(/\s+/g, '-'),
            productName,
            modelName: modelLang.ModelName || 'Unnamed Model',
            lang,
            type: 'model'
          });
        }
      }
    }

    // ✅ CatalogCategory files
    for (const category of catalogCategories) {
      if (!Array.isArray(category.files)) continue;

      for (const file of category.files) {
        if (file.language?.toUpperCase() !== lang) continue;
        if (!file.filePath) continue;

        const catSlug = category.categoryKey
          .toLowerCase()
          .replace(/\s+/g, '-');

        const catNameSlug = category.categoryName
          .toLowerCase()
          .replace(/\s+/g, '-');

        downloads.push({
          fileName: file.fileName,
          filePath: file.filePath,
          fileSize: file.fileSize,
          fileCategory: catSlug,
          fileProductCategory: catNameSlug,
          productName: category.categoryName,
          modelName: '-',
          lang,
          type: 'catalog'
        });

        catalogCategoryNamesSet.add(catNameSlug);
      }
    }

    const productNames = Array.from(productNamesSet);
    const catalogCategoryNames = Array.from(catalogCategoryNamesSet);

    res.render('customer/Downloads', {
      pageTitle: t.pageTitle,
      path: '/Downloads',
      downloads,
      productNames: productNames.length ? productNames : [t.noProducts],
      catalogCategoryNames: catalogCategoryNames.length ? catalogCategoryNames : [t.noCategories],
      lang,
      translations: {
        ...t,
        // ensure these exist for EJS SEO usage
        metaDescription:
          t.metaDescription ||
          'Find DragLab product catalogs, manuals, certificates and technical documents.',
        ogDescription:
          t.ogDescription ||
          'Explore technical documentation, catalogs, and certificates for DragLab products.'
      }
      // ❌ we no longer send full products array – not needed for this page
    });

  } catch (err) {
    console.error('Error loading downloads:', err);
    return res.status(500).render('500', { errorMessage: err.message });
  }
};






exports.getWarrantyRegistration = async (req, res) => {
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

  const translations = t[lang] || t.EN;

  try {
    const products = await Product.find({ isDraft: false })
      .select('Language')       // we only need names
      .lean();                  // faster, no Mongoose docs

    res.render('customer/WarrantyRegistration', {
      pageTitle: translations.pageTitle,
      path: `/WarrantyRegistration/${lang}`,
      lang,
      products,
      t: translations,
      translations,
      req,
      recaptchaEnabled: RECAPTCHA_ENABLED, // same pattern as technical service
    });
  } catch (err) {
    console.error('❌ getWarrantyRegistration error:', err);
    res.redirect('/');
  }
};

exports.postWarrantyRegistration = async (req, res) => {
    const lang = (req.body.lang || req.query.lang || 'EN').toUpperCase();
    const token = req.body['g-recaptcha-response'];

    try {
        // (Optional) reCAPTCHA – only if enabled and token present
        if (RECAPTCHA_ENABLED && token) {
            const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
            const { data } = await axios.post(verifyUrl, null, {
                params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token },
                timeout: 5000 // 5-second cap — don't let Google hang the form
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

        // Redirect the user immediately — they don't need to wait for email delivery.
        // Emails are sent asynchronously in the background after the response.
        res.redirect(`/${lang}/WarrantyRegistration?success=true`);

        // --- Build email payloads ---
        const flags = { isEN: lang === 'EN', isES: lang === 'ES', isDE: lang === 'DE', isTR: lang === 'TR', isFR: lang === 'FR' };
        const subjectMap = {
            EN: `[Warranty] ${name} — ${productName}/${modelName} (${ticketId})`,
            ES: `[Garantía] ${name} — ${productName}/${modelName} (${ticketId})`,
            DE: `[Garantie] ${name} — ${productName}/${modelName} (${ticketId})`,
            TR: `[Garanti] ${name} — ${productName}/${modelName} (${ticketId})`,
            FR: `[Garantie] ${name} — ${productName}/${modelName} (${ticketId})`
        };
        const bodyText =
            `New Warranty Registration\n\nTicket: ${ticketId}\nName: ${name}\nEmail: ${email}\n\nDevice:\n- Category: ${productName}\n- Model: ${modelName}\n- Serial: ${serialNo || '-'}\n\nDate Purchased: ${datePurchased || '-'}\n\nMessage:\n${message || '-'}\n\nMeta:\n- Language: ${lang}\n- IP: ${ipAddress || '-'}\n- User-Agent: ${userAgent || '-'}\n\nAdmin Link: https://www.drag-lab.de/admin/warranty-registrations/${doc._id}\n`;

        // --- Send both emails in parallel, non-blocking ---
        Promise.all([
            sendCustomerEmail({
                to: email,
                form: 'warrantyRegistration',
                data: {
                    ...flags,
                    year: new Date().getFullYear(),
                    brandName: 'DragLab',
                    brandLogoUrl: 'https://cdn.draglab.com/brand/draglab-logo-100.png',
                    supportEmail: 'info@drag-lab.de',
                    ticketId,
                    deviceCategory: productName,
                    deviceModel: modelName,
                    serialNumber: serialNo || '',
                    datePurchased: datePurchased || '',
                    userMessage: message || '',
                    helpCenterUrl: `https://www.drag-lab.de/${lang}/WarrantyRegistration`
                }
            }),
            notifyInternal({ to: 'info@drag-lab.de', subject: subjectMap[lang] || subjectMap.EN, text: bodyText })
        ]).catch(err => console.error('❌ Warranty Registration email delivery failed:', err));
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
                EN: "Read DragLab's Industry Solutions and learn how we can help your business.",
                ES: 'Lea las Soluciones para la Industria de DragLab y descubra cómo podemos ayudar a su negocio.',
                DE: 'Lesen Sie die Branchenspezifischen Lösungen von DragLab und erfahren Sie, wie wir Ihnen helfen können.',
                TR: "DragLab'ın Endüstri Çözümleri'ni okuyun ve işinize nasıl yardımcı olabileceğimizi öğrenin.",
                FR: 'Lisez les Solutions Industrielles de DragLab et découvrez comment nous pouvons aider votre entreprise.'
            }[lang],
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
    // 1) Get industry (lean for speed)
    const industry = await Industry.findOne({ slug }).lean();
    if (!industry) {
      return res.status(404).render('404', {
        pageTitle: 'Not Found',
        path: '/industry',
      });
    }

    // 2) Language data (fallback EN)
    const langData =
      (industry.Language && industry.Language[lang] && industry.Language[lang][0]) ||
      (industry.Language && industry.Language.EN && industry.Language.EN[0]) ||
      {};

    const translation = {
      slideTitle: langData.slideTitle || 'Industry',
      subtitle: langData.slideSubTitle || '',
      description: langData.slideDesc || '',
      introTitle: langData.introTitle || '',
      introDesc: langData.introDesc || '',
      features: (langData.features || []).map(f => ({
        featureTitle: f.FeatureName,
        featureDesc: f.FeatureDesc,
        featureImage: f.FeatureImage,
      })),
    };

    // 3) Frequently used products entries (fallback to EN if current lang empty)
    const frequentlyUsedLang =
      (industry.frequentlyUsedProducts && industry.frequentlyUsedProducts[lang]) ||
      (industry.frequentlyUsedProducts && industry.frequentlyUsedProducts.EN) ||
      [];

    const productIds = frequentlyUsedLang
      .map(item => item.productId)
      .filter(Boolean);

    // If no products configured, render quick
    if (!productIds.length) {
      return res.render('customer/industry-details', {
        pageTitle: translation.slideTitle || 'Industry',
        metaDescription: translation.description || '',
        industry: {
          slug: industry.slug,
          sharedSlideImage: industry.sharedImages?.slideImage || null,
          sharedIntroImage: industry.sharedImages?.introImage || null,
        },
        translation,
        lang,
        products: [],
        usedProducts: frequentlyUsedLang,
        structuredProducts: [], // for JSON-LD
      });
    }

    // 4) Fetch only needed products, only needed fields
    const products = await Product.find({
      _id: { $in: productIds },
      isDraft: false,
    })
      .select('slug ProductThumbnail Language') // keep only what you use
      .lean();

    // 5) Attach descriptions and prepare a simple array for EJS & JSON-LD
    const usedMap = {};
    frequentlyUsedLang.forEach(entry => {
      if (entry && entry.productId) {
        usedMap[String(entry.productId)] = entry;
      }
    });

    const featuredProducts = products
      .map(p => {
        const match = usedMap[String(p._id)];
        if (!match) return null;

        const langBlock =
          (p.Language && p.Language[lang] && p.Language[lang][0]) ||
          (p.Language && p.Language.EN && p.Language.EN[0]) ||
          {};

        return {
          _id: p._id,
          slug: p.slug,
          thumbnail: p.ProductThumbnail || null,
          name: langBlock.ProductName || p.slug || 'Product',
          desc: (match.text || langBlock.ProductDesc || '').toString(),
        };
      })
      .filter(Boolean);

    // 6) Prepare a JSON-LD-ready array (very small) – no heavy logic in EJS
    const structuredProducts = featuredProducts.map(p => ({
      name: p.name,
      slug: p.slug,
      thumbnail: p.thumbnail,
      desc: p.desc,
    }));

    // 7) Render
    res.render('customer/industry-details', {
      pageTitle: translation.slideTitle || 'Industry',
      metaDescription: translation.description || '',
      industry: {
        slug: industry.slug,
        sharedSlideImage: industry.sharedImages?.slideImage || null,
        sharedIntroImage: industry.sharedImages?.introImage || null,
      },
      translation,
      lang,
      products: featuredProducts,      // already filtered + with description
      usedProducts: frequentlyUsedLang,
      structuredProducts,              // small array for JSON-LD
    });
  } catch (err) {
    console.error('❌ Error loading Industry Details:', err);
    res.status(500).render('500', {
      pageTitle: 'Server Error',
      path: '/industry',
      isAuthenticated: req.session?.isLoggedIn || false,
    });
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1: REQUEST A QUOTE
// ═══════════════════════════════════════════════════════════════════════════════

exports.getRequestQuote = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();

    const t = {
      EN: {
        pageTitle: 'Request a Quote – DragLab Laboratory Equipment',
        metaDescription: 'Request a custom quote for DragLab laboratory equipment. Fast response from our sales team.',
        ogTitle: 'Request a Quote | DragLab',
        ogDescription: 'Get a tailored quote for incubators, ovens, water stills and more.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/quote-BC.png',
        heroTitle: 'Request a Quote for Laboratory Equipment',
        heroSub: 'Professional lab equipment solutions tailored to your requirements',
        trustISO: 'ISO 9001 Certified',
        trustCE: 'CE Compliance',
        trustGlobal: 'Global Distribution',
        trustWarranty: '2-Year Warranty',
        sectionProduct: 'Product Information',
        sectionCustomer: 'Your Information',
        sectionDetails: 'Request Details',
        labelCategory: 'Product Category',
        labelModel: 'Product Model / Reference',
        labelQuantity: 'Quantity',
        labelCompany: 'Company Name',
        labelCountry: 'Country',
        labelIndustry: 'Industry',
        labelContact: 'Contact Name',
        labelEmail: 'Email Address',
        labelPhone: 'Phone Number',
        labelMessage: 'Additional Requirements',
        labelDeadline: 'Delivery Deadline',
        labelFile: 'Attach Specification File (optional)',
        btnSubmit: 'Request Quote',
        successMsg: 'Thank you! Your quote request has been received. We will respond within 1 business day.',
        required: 'Required fields are marked with *',
        categories: ['Incubators', 'Ovens & Furnaces', 'Water Stills & Baths', 'Centrifuges', 'Autoclaves', 'Other']
      },
      ES: {
        pageTitle: 'Solicitar Cotización – DragLab Equipos de Laboratorio',
        metaDescription: 'Solicite una cotización personalizada para equipos de laboratorio DragLab.',
        ogTitle: 'Solicitar Cotización | DragLab',
        ogDescription: 'Obtenga una cotización personalizada para incubadoras, hornos y más.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/quote-BC.png',
        heroTitle: 'Solicitar Cotización de Equipos de Laboratorio',
        heroSub: 'Soluciones profesionales de laboratorio adaptadas a sus necesidades',
        trustISO: 'Certificado ISO 9001', trustCE: 'Cumplimiento CE', trustGlobal: 'Distribución Global', trustWarranty: 'Garantía 2 Años',
        sectionProduct: 'Información del Producto', sectionCustomer: 'Su Información', sectionDetails: 'Detalles de la Solicitud',
        labelCategory: 'Categoría de Producto', labelModel: 'Modelo / Referencia', labelQuantity: 'Cantidad',
        labelCompany: 'Nombre de la Empresa', labelCountry: 'País', labelIndustry: 'Industria',
        labelContact: 'Nombre de Contacto', labelEmail: 'Correo Electrónico', labelPhone: 'Teléfono',
        labelMessage: 'Requisitos Adicionales', labelDeadline: 'Fecha de Entrega', labelFile: 'Adjuntar Especificación (opcional)',
        btnSubmit: 'Solicitar Cotización',
        successMsg: 'Gracias. Su solicitud de cotización ha sido recibida. Responderemos en 1 día hábil.',
        required: 'Los campos requeridos están marcados con *',
        categories: ['Incubadoras', 'Hornos y Estufas', 'Destiladores y Baños', 'Centrífugas', 'Autoclaves', 'Otro']
      },
      DE: {
        pageTitle: 'Angebot Anfragen – DragLab Laborgeräte',
        metaDescription: 'Fordern Sie ein individuelles Angebot für DragLab Laborgeräte an.',
        ogTitle: 'Angebot Anfragen | DragLab',
        ogDescription: 'Erhalten Sie ein maßgeschneidertes Angebot für Inkubatoren, Öfen und mehr.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/quote-BC.png',
        heroTitle: 'Angebot für Laborgeräte Anfragen',
        heroSub: 'Professionelle Laborlösungen nach Ihren Anforderungen',
        trustISO: 'ISO 9001 Zertifiziert', trustCE: 'CE-Konformität', trustGlobal: 'Weltweiter Vertrieb', trustWarranty: '2 Jahre Garantie',
        sectionProduct: 'Produktinformation', sectionCustomer: 'Ihre Angaben', sectionDetails: 'Anfragedetails',
        labelCategory: 'Produktkategorie', labelModel: 'Produktmodell / Referenz', labelQuantity: 'Menge',
        labelCompany: 'Firmenname', labelCountry: 'Land', labelIndustry: 'Branche',
        labelContact: 'Ansprechpartner', labelEmail: 'E-Mail-Adresse', labelPhone: 'Telefonnummer',
        labelMessage: 'Weitere Anforderungen', labelDeadline: 'Liefertermin', labelFile: 'Spezifikation anhängen (optional)',
        btnSubmit: 'Angebot Anfragen',
        successMsg: 'Vielen Dank! Ihre Angebotsanfrage ist eingegangen. Wir antworten innerhalb von 1 Werktag.',
        required: 'Pflichtfelder sind mit * markiert',
        categories: ['Inkubatoren', 'Öfen & Muffelöfen', 'Wasseraufbereitung & Bäder', 'Zentrifugen', 'Autoklaven', 'Sonstiges']
      },
      TR: {
        pageTitle: 'Fiyat Teklifi İste – DragLab Laboratuvar Ekipmanları',
        metaDescription: 'DragLab laboratuvar ekipmanları için özel fiyat teklifi alın.',
        ogTitle: 'Fiyat Teklifi İste | DragLab',
        ogDescription: 'İnkübatörler, fırınlar ve daha fazlası için özelleştirilmiş teklif alın.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/quote-BC.png',
        heroTitle: 'Laboratuvar Ekipmanı Fiyat Teklifi İste',
        heroSub: 'Gereksinimlerinize göre profesyonel laboratuvar çözümleri',
        trustISO: 'ISO 9001 Sertifikalı', trustCE: 'CE Uyumluluğu', trustGlobal: 'Global Dağıtım', trustWarranty: '2 Yıl Garanti',
        sectionProduct: 'Ürün Bilgisi', sectionCustomer: 'Bilgileriniz', sectionDetails: 'Talep Detayları',
        labelCategory: 'Ürün Kategorisi', labelModel: 'Ürün Modeli', labelQuantity: 'Miktar',
        labelCompany: 'Şirket Adı', labelCountry: 'Ülke', labelIndustry: 'Sektör',
        labelContact: 'İletişim Kişisi', labelEmail: 'E-posta Adresi', labelPhone: 'Telefon',
        labelMessage: 'Ek Gereksinimler', labelDeadline: 'Teslimat Tarihi', labelFile: 'Spesifikasyon Dosyası Ekle (isteğe bağlı)',
        btnSubmit: 'Teklif İste',
        successMsg: 'Teşekkürler! Teklif talebiniz alındı. 1 iş günü içinde yanıt vereceğiz.',
        required: 'Zorunlu alanlar * ile işaretlenmiştir',
        categories: ['İnkübatörler', 'Fırınlar', 'Su Damıtıcılar ve Banyolar', 'Santrifüjler', 'Otoklavlar', 'Diğer']
      },
      FR: {
        pageTitle: 'Demande de Devis – DragLab Équipements de Laboratoire',
        metaDescription: 'Demandez un devis personnalisé pour les équipements DragLab.',
        ogTitle: 'Demande de Devis | DragLab',
        ogDescription: 'Obtenez un devis sur mesure pour incubateurs, fours et plus encore.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/quote-BC.png',
        heroTitle: 'Demande de Devis pour Équipements de Laboratoire',
        heroSub: 'Solutions professionnelles adaptées à vos besoins',
        trustISO: 'Certifié ISO 9001', trustCE: 'Conformité CE', trustGlobal: 'Distribution Mondiale', trustWarranty: 'Garantie 2 Ans',
        sectionProduct: 'Informations Produit', sectionCustomer: 'Vos Informations', sectionDetails: 'Détails de la Demande',
        labelCategory: 'Catégorie de Produit', labelModel: 'Modèle / Référence', labelQuantity: 'Quantité',
        labelCompany: 'Nom de la Société', labelCountry: 'Pays', labelIndustry: 'Secteur',
        labelContact: 'Nom du Contact', labelEmail: 'Adresse E-mail', labelPhone: 'Numéro de Téléphone',
        labelMessage: 'Exigences Supplémentaires', labelDeadline: 'Date de Livraison', labelFile: 'Joindre Spécification (optionnel)',
        btnSubmit: 'Demander un Devis',
        successMsg: 'Merci ! Votre demande de devis a été reçue. Nous répondrons dans 1 jour ouvré.',
        required: 'Les champs obligatoires sont marqués d\'un *',
        categories: ['Incubateurs', 'Fours & Moufles', 'Bains & Distillateurs', 'Centrifugeuses', 'Autoclaves', 'Autre']
      }
    };

    const tr = t[lang] || t.EN;

    // Fetch all published products with their embedded models
    const rawProducts = await Product.find({ isDraft: false })
      .select('Language slug Models ProductThumbnail')
      .lean();

    const productsData = rawProducts.map(p => {
      const productName = p.Language?.[lang]?.[0]?.ProductName
        || p.Language?.EN?.[0]?.ProductName
        || '';
      if (!productName) return null;
      const models = (p.Models || []).map(m => ({
        slug: m.slug || String(m._id),
        name: m.Language?.[lang]?.[0]?.ModelName || m.Language?.EN?.[0]?.ModelName || '',
        capacity: m.modelcapacity || ''
      })).filter(m => m.name);
      const rawThumb = p.ProductThumbnail || '';
      let thumbnail = rawThumb;
      if (rawThumb && rawThumb.includes('cloudinary.com') && rawThumb.includes('/upload/')) {
        thumbnail = rawThumb.replace('/upload/', '/upload/w_300,h_220,c_pad,b_white,q_auto,f_auto/');
      }
      return {
        slug: p.slug || String(p._id),
        name: productName,
        thumbnail,
        models
      };
    }).filter(Boolean);

    res.render('customer/request-a-quote', {
      lang,
      ...tr,
      path: `/${lang}/request-a-quote`,
      success: req.query.success === '1',
      error: req.query.error || null,
      productsData
    });
  } catch (err) {
    console.error('getRequestQuote error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

exports.postRequestQuote = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    const {
      companyName, country, industry, contactName, email, phone,
      message, deliveryDeadline, lang
    } = req.body;

    // bodyParser extended:true (qs) strips [] suffix → req.body.selectedModels
    const selectedProducts = [].concat(req.body.selectedProducts || req.body['selectedProducts[]'] || []);
    const selectedModels   = [].concat(req.body.selectedModels   || req.body['selectedModels[]']   || []);
    const selectedModelQtys = [].concat(req.body.selectedModelQtys || []);
    const modelQtyLines = selectedModels.map((m, i) => {
      const qty = parseInt(selectedModelQtys[i], 10);
      return `${m} × ${(qty > 0 ? qty : 1)}`;
    });

    if (!companyName || !country || !email) {
      return res.redirect(`/${lang || 'EN'}/request-a-quote?error=1`);
    }

    // Upload attachment to Cloudinary if provided
    let fileAttachmentUrl = '';
    if (req.file && req.file.buffer) {
      try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        // Include extension in public_id so Cloudinary URL preserves the format
        const publicId = `quote-attachment-${Date.now()}${ext}`;
        fileAttachmentUrl = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'draglab/quotes',
              resource_type: isImage ? 'image' : 'raw',
              public_id: publicId,
              use_filename: false,
            },
            (err, result) => { if (err) reject(err); else resolve(result.secure_url); }
          ).end(req.file.buffer);
        });
      } catch (uploadErr) {
        console.error('Quote attachment upload error:', uploadErr);
      }
    }

    const quote = new Quote({
      companyName, country, industry, contactName, email, phone,
      productCategory:  selectedProducts.join(', '),
      productModel:     modelQtyLines.join('\n'),
      quantity:         null,
      message,
      fileAttachment:   fileAttachmentUrl || undefined,
      deliveryDeadline: deliveryDeadline || null,
      lang: (lang || 'EN').toUpperCase(),
      ipAddress: ip
    });
    await quote.save();

    const modelsHtml = modelQtyLines.length
      ? modelQtyLines.map(l => `<li>${l}</li>`).join('') : '—';
    const attachHtml = fileAttachmentUrl
      ? `<p><strong>Attachment:</strong> <a href="${fileAttachmentUrl}">${req.file.originalname}</a></p>` : '';

    notifyInternal({
      to: 'info@drag-lab.de',
      subject: `New Quote Request from ${companyName} (${country})`,
      html: `<h2>New Quote Request</h2>
             <p><strong>Company:</strong> ${companyName}</p>
             <p><strong>Country:</strong> ${country}</p>
             <p><strong>Contact:</strong> ${contactName || '—'}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || '—'}</p>
             <p><strong>Industry:</strong> ${industry || '—'}</p>
             <p><strong>Products:</strong> ${selectedProducts.join(', ') || '—'}</p>
             <p><strong>Models &amp; Quantities:</strong><ul>${modelsHtml}</ul></p>
             <p><strong>Deadline:</strong> ${deliveryDeadline || '—'}</p>
             <p><strong>Message:</strong> ${message || '—'}</p>
             ${attachHtml}`,
      text: `New Quote Request from ${companyName} – ${email}`
    }).catch(e => console.error('Quote email error:', e));

    return res.redirect(`/${(lang || 'EN').toUpperCase()}/request-a-quote?success=1`);
  } catch (err) {
    console.error('postRequestQuote error:', err);
    return res.redirect('/EN/request-a-quote?error=1');
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2: BECOME A DISTRIBUTOR
// ═══════════════════════════════════════════════════════════════════════════════

exports.getBecomDistributor = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();

    const t = {
      EN: {
        pageTitle: 'Become a DragLab Distributor – Partner With Us',
        metaDescription: 'Join the DragLab global distributor network. Apply to become an authorised distributor of premium laboratory equipment.',
        ogTitle: 'Become a Distributor | DragLab',
        ogDescription: 'Partner with DragLab and distribute world-class laboratory equipment in your region.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/distributor-BC.png',
        heroTitle: 'Become a DragLab Distributor',
        heroSub: 'Partner with a leading European laboratory equipment manufacturer',
        whyTitle: 'Why Partner With DragLab?',
        whyPoints: ['Exclusive territorial rights', 'ISO 9001 certified product range', 'Marketing and technical support', 'Competitive margin structure', 'Training and certification programs', 'Dedicated partner account manager'],
        benefitsTitle: 'Partner Benefits',
        benefits: [
          { icon: '🏆', title: 'Premium Products', desc: 'Access to our full range of CE-certified lab equipment' },
          { icon: '📊', title: 'Business Growth', desc: 'Proven business model with strong market demand' },
          { icon: '🤝', title: 'Full Support', desc: 'Sales, technical and marketing support from our team' }
        ],
        whoTitle: 'Who We Are Looking For',
        whoDesc: 'We seek established companies with experience in laboratory or scientific equipment distribution, a strong local network, and a commitment to quality service.',
        formTitle: 'Distributor Application Form',
        labelCompany: 'Company Name', labelCountry: 'Country', labelWebsite: 'Company Website',
        labelYears: 'Years in Business', labelBrands: 'Current Brands / Products You Distribute',
        labelMarket: 'Target Market', labelContact: 'Contact Name', labelEmail: 'Email Address',
        labelPhone: 'Phone Number', btnSubmit: 'Submit Application',
        successMsg: 'Thank you for your application! Our partnership team will review it and contact you within 3 business days.'
      },
      ES: {
        pageTitle: 'Conviértase en Distribuidor DragLab – Asóciese Con Nosotros',
        metaDescription: 'Únase a la red global de distribuidores DragLab.',
        ogTitle: 'Conviértase en Distribuidor | DragLab',
        ogDescription: 'Asóciese con DragLab y distribuya equipos de laboratorio de clase mundial.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/distributor-BC.png',
        heroTitle: 'Conviértase en Distribuidor DragLab',
        heroSub: 'Asóciese con un fabricante líder europeo de equipos de laboratorio',
        whyTitle: '¿Por qué Asociarse con DragLab?',
        whyPoints: ['Derechos territoriales exclusivos', 'Gama certificada ISO 9001', 'Soporte técnico y de marketing', 'Estructura de márgenes competitiva', 'Programas de capacitación', 'Gerente de cuenta dedicado'],
        benefitsTitle: 'Beneficios del Socio',
        benefits: [
          { icon: '🏆', title: 'Productos Premium', desc: 'Acceso a toda nuestra gama de equipos certificados CE' },
          { icon: '📊', title: 'Crecimiento Empresarial', desc: 'Modelo de negocio probado con fuerte demanda' },
          { icon: '🤝', title: 'Soporte Completo', desc: 'Apoyo comercial, técnico y de marketing' }
        ],
        whoTitle: 'A Quién Buscamos',
        whoDesc: 'Buscamos empresas establecidas con experiencia en distribución de equipos de laboratorio y una sólida red local.',
        formTitle: 'Formulario de Solicitud',
        labelCompany: 'Nombre de la Empresa', labelCountry: 'País', labelWebsite: 'Sitio Web',
        labelYears: 'Años en el Negocio', labelBrands: 'Marcas Actuales que Distribuye',
        labelMarket: 'Mercado Objetivo', labelContact: 'Nombre de Contacto', labelEmail: 'Correo Electrónico',
        labelPhone: 'Teléfono', btnSubmit: 'Enviar Solicitud',
        successMsg: 'Gracias por su solicitud. Nuestro equipo le contactará en 3 días hábiles.'
      },
      DE: {
        pageTitle: 'DragLab Distributor Werden – Partnerschaft',
        metaDescription: 'Werden Sie autorisierter DragLab-Distributor und vertreiben Sie Premium-Laborgeräte.',
        ogTitle: 'Distributor Werden | DragLab',
        ogDescription: 'Partnerschaft mit DragLab für den weltweiten Vertrieb von Laborgeräten.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/distributor-BC.png',
        heroTitle: 'DragLab Distributor Werden',
        heroSub: 'Partnerschaft mit einem führenden europäischen Laborgerätehersteller',
        whyTitle: 'Warum DragLab Partner Werden?',
        whyPoints: ['Exklusive Gebietsrechte', 'ISO 9001 zertifiziertes Sortiment', 'Marketing- und Technik-Support', 'Wettbewerbsfähige Margenstruktur', 'Schulungs- und Zertifizierungsprogramme', 'Dedizierter Partneransprechpartner'],
        benefitsTitle: 'Partnervorteile',
        benefits: [
          { icon: '🏆', title: 'Premium-Produkte', desc: 'Zugang zu unserem gesamten CE-zertifizierten Sortiment' },
          { icon: '📊', title: 'Geschäftswachstum', desc: 'Bewährtes Geschäftsmodell mit starker Marktnachfrage' },
          { icon: '🤝', title: 'Vollständige Unterstützung', desc: 'Vertriebs-, technischer und Marketing-Support' }
        ],
        whoTitle: 'Wen Wir Suchen',
        whoDesc: 'Wir suchen etablierte Unternehmen mit Erfahrung im Laborgerätevertrieb und einem starken lokalen Netzwerk.',
        formTitle: 'Bewerbungsformular',
        labelCompany: 'Firmenname', labelCountry: 'Land', labelWebsite: 'Firmenwebseite',
        labelYears: 'Jahre im Geschäft', labelBrands: 'Aktuelle Marken / Produkte',
        labelMarket: 'Zielmarkt', labelContact: 'Ansprechpartner', labelEmail: 'E-Mail-Adresse',
        labelPhone: 'Telefon', btnSubmit: 'Bewerbung Einreichen',
        successMsg: 'Vielen Dank für Ihre Bewerbung! Unser Team meldet sich innerhalb von 3 Werktagen.'
      },
      TR: {
        pageTitle: 'DragLab Distribütörü Olun – Ortaklık',
        metaDescription: 'DragLab global distribütör ağına katılın.',
        ogTitle: 'Distribütör Olun | DragLab',
        ogDescription: 'DragLab ile ortak olun ve bölgenizde dünya standartlarında laboratuvar ekipmanları dağıtın.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/distributor-BC.png',
        heroTitle: 'DragLab Distribütörü Olun',
        heroSub: 'Önde gelen Avrupalı laboratuvar ekipman üreticisiyle ortaklık kurun',
        whyTitle: 'Neden DragLab Ortağı Olmalısınız?',
        whyPoints: ['Özel bölge hakları', 'ISO 9001 sertifikalı ürün yelpazesi', 'Pazarlama ve teknik destek', 'Rekabetçi marj yapısı', 'Eğitim ve sertifikasyon programları', 'Özel hesap yöneticisi'],
        benefitsTitle: 'Ortak Avantajları',
        benefits: [
          { icon: '🏆', title: 'Premium Ürünler', desc: 'CE sertifikalı ürün yelpazemize tam erişim' },
          { icon: '📊', title: 'İş Büyümesi', desc: 'Güçlü pazar talebiyle kanıtlanmış iş modeli' },
          { icon: '🤝', title: 'Tam Destek', desc: 'Satış, teknik ve pazarlama desteği' }
        ],
        whoTitle: 'Kimleri Arıyoruz',
        whoDesc: 'Laboratuvar ekipmanı dağıtımında deneyimli, güçlü yerel ağa sahip köklü şirketler arıyoruz.',
        formTitle: 'Başvuru Formu',
        labelCompany: 'Şirket Adı', labelCountry: 'Ülke', labelWebsite: 'Şirket Web Sitesi',
        labelYears: 'İş Yılı', labelBrands: 'Mevcut Markalar',
        labelMarket: 'Hedef Pazar', labelContact: 'İletişim Kişisi', labelEmail: 'E-posta',
        labelPhone: 'Telefon', btnSubmit: 'Başvuru Gönder',
        successMsg: 'Başvurunuz için teşekkürler! Ortaklık ekibimiz 3 iş günü içinde sizinle iletişime geçecektir.'
      },
      FR: {
        pageTitle: 'Devenir Distributeur DragLab – Partenariat',
        metaDescription: 'Rejoignez le réseau mondial de distributeurs DragLab.',
        ogTitle: 'Devenir Distributeur | DragLab',
        ogDescription: 'Partenariat avec DragLab pour distribuer des équipements de laboratoire de classe mondiale.',
        ogImage: 'https://www.drag-lab.de/assets/Imgs/Icons/products/distributor-BC.png',
        heroTitle: 'Devenir Distributeur DragLab',
        heroSub: 'Partenariat avec un fabricant européen leader en équipements de laboratoire',
        whyTitle: 'Pourquoi Collaborer avec DragLab ?',
        whyPoints: ['Droits territoriaux exclusifs', 'Gamme certifiée ISO 9001', 'Support marketing et technique', 'Structure de marges compétitive', 'Programmes de formation', 'Responsable partenaire dédié'],
        benefitsTitle: 'Avantages Partenaire',
        benefits: [
          { icon: '🏆', title: 'Produits Premium', desc: 'Accès à toute notre gamme certifiée CE' },
          { icon: '📊', title: 'Croissance des Affaires', desc: 'Modèle éprouvé avec forte demande marché' },
          { icon: '🤝', title: 'Support Complet', desc: 'Support commercial, technique et marketing' }
        ],
        whoTitle: 'Qui Nous Cherchons',
        whoDesc: 'Nous recherchons des sociétés expérimentées dans la distribution d\'équipements scientifiques avec un réseau local solide.',
        formTitle: 'Formulaire de Candidature',
        labelCompany: 'Nom de la Société', labelCountry: 'Pays', labelWebsite: 'Site Web',
        labelYears: 'Années d\'Activité', labelBrands: 'Marques Actuelles Distribuées',
        labelMarket: 'Marché Cible', labelContact: 'Nom du Contact', labelEmail: 'Adresse E-mail',
        labelPhone: 'Numéro de Téléphone', btnSubmit: 'Soumettre la Candidature',
        successMsg: 'Merci pour votre candidature ! Notre équipe partenariat vous contactera sous 3 jours ouvrés.'
      }
    };

    const tr = t[lang] || t.EN;
    res.render('customer/become-a-distributor', {
      lang,
      ...tr,
      path: `/${lang}/become-a-distributor`,
      success: req.query.success === '1',
      error: req.query.error || null
    });
  } catch (err) {
    console.error('getBecomDistributor error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

exports.postDistributorApplication = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    const { companyName, country, website, yearsExperience, currentBrands, targetMarket, contactName, email, phone, lang } = req.body;

    if (!companyName || !country || !email || !contactName) {
      return res.redirect(`/${lang || 'EN'}/become-a-distributor?error=1`);
    }

    const app = new DistributorApplication({
      companyName, country, website,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
      currentBrands, targetMarket, contactName, email, phone,
      lang: (lang || 'EN').toUpperCase(),
      ipAddress: ip
    });
    await app.save();

    notifyInternal({
      to: 'info@drag-lab.de',
      subject: `New Distributor Application from ${companyName} (${country})`,
      html: `<h2>New Distributor Application</h2>
             <p><strong>Company:</strong> ${companyName}</p>
             <p><strong>Country:</strong> ${country}</p>
             <p><strong>Website:</strong> ${website || '—'}</p>
             <p><strong>Years in Business:</strong> ${yearsExperience || '—'}</p>
             <p><strong>Current Brands:</strong> ${currentBrands || '—'}</p>
             <p><strong>Target Market:</strong> ${targetMarket || '—'}</p>
             <p><strong>Contact:</strong> ${contactName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || '—'}</p>`,
      text: `New Distributor Application from ${companyName} – ${email}`
    }).catch(e => console.error('Distributor email error:', e));

    return res.redirect(`/${(lang || 'EN').toUpperCase()}/become-a-distributor?success=1`);
  } catch (err) {
    console.error('postDistributorApplication error:', err);
    return res.redirect('/EN/become-a-distributor?error=1');
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3: KNOWLEDGE BASE / FAQ
// ═══════════════════════════════════════════════════════════════════════════════

exports.getKnowledgeBase = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();
    const activeCategory = req.query.category || 'All';

    const query = { status: 'published', lang };
    if (activeCategory && activeCategory !== 'All') query.category = activeCategory;

    const faqs = await FAQ.find(query).sort({ category: 1, order: 1 }).lean();

    // Group by category
    const grouped = {};
    faqs.forEach(faq => {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push(faq);
    });

    const categories = ['All', 'Installation', 'Maintenance', 'Troubleshooting', 'Warranty', 'Product Usage', 'General'];

    const t = {
      EN: { pageTitle: 'Knowledge Base & FAQ – DragLab', metaDescription: 'Find answers to frequently asked questions about DragLab laboratory equipment installation, maintenance, and troubleshooting.', heroTitle: 'Knowledge Base', heroSub: 'Answers to your most common questions', searchPlaceholder: 'Search questions...', noResults: 'No FAQs found for this category yet.', ogTitle: 'Knowledge Base | DragLab', ogDescription: 'FAQ and support articles for DragLab laboratory equipment.' },
      ES: { pageTitle: 'Base de Conocimiento – DragLab', metaDescription: 'Encuentre respuestas a preguntas frecuentes sobre equipos DragLab.', heroTitle: 'Base de Conocimiento', heroSub: 'Respuestas a sus preguntas más frecuentes', searchPlaceholder: 'Buscar preguntas...', noResults: 'No hay preguntas frecuentes para esta categoría todavía.', ogTitle: 'Base de Conocimiento | DragLab', ogDescription: 'Preguntas frecuentes sobre equipos de laboratorio DragLab.' },
      DE: { pageTitle: 'Wissensdatenbank & FAQ – DragLab', metaDescription: 'Finden Sie Antworten auf häufig gestellte Fragen zu DragLab Laborgeräten.', heroTitle: 'Wissensdatenbank', heroSub: 'Antworten auf Ihre häufigsten Fragen', searchPlaceholder: 'Fragen suchen...', noResults: 'Noch keine FAQs für diese Kategorie.', ogTitle: 'Wissensdatenbank | DragLab', ogDescription: 'FAQ und Support-Artikel für DragLab Laborgeräte.' },
      TR: { pageTitle: 'Bilgi Bankası & SSS – DragLab', metaDescription: 'DragLab laboratuvar ekipmanları hakkında sık sorulan sorulara cevaplar bulun.', heroTitle: 'Bilgi Bankası', heroSub: 'En sık sorulan sorularınızın yanıtları', searchPlaceholder: 'Soru ara...', noResults: 'Bu kategori için henüz SSS bulunmamaktadır.', ogTitle: 'Bilgi Bankası | DragLab', ogDescription: 'DragLab laboratuvar ekipmanları için SSS.' },
      FR: { pageTitle: 'Base de Connaissances & FAQ – DragLab', metaDescription: 'Trouvez des réponses aux questions fréquentes sur les équipements DragLab.', heroTitle: 'Base de Connaissances', heroSub: 'Réponses à vos questions les plus courantes', searchPlaceholder: 'Rechercher des questions...', noResults: 'Aucune FAQ pour cette catégorie pour l\'instant.', ogTitle: 'Base de Connaissances | DragLab', ogDescription: 'FAQ et articles de support pour les équipements DragLab.' }
    };

    const tr = t[lang] || t.EN;
    res.render('customer/knowledge-base', {
      lang, ...tr, faqs, grouped, categories, activeCategory,
      path: `/${lang}/knowledge-base`
    });
  } catch (err) {
    console.error('getKnowledgeBase error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

exports.getKnowledgeBaseCategory = async (req, res) => {
  req.query.category = req.params.category;
  return exports.getKnowledgeBase(req, res);
};


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4: CASE STUDIES
// ═══════════════════════════════════════════════════════════════════════════════

exports.getCaseStudies = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();
    const langKey = lang.toLowerCase();

    const caseStudies = await CaseStudy.find({ status: 'published' }).sort({ createdAt: -1 }).lean();

    // Attach localized display data
    const localizedStudies = caseStudies.map(cs => {
      const tr = cs.translations?.[langKey] || cs.translations?.en || {};
      return {
        ...cs,
        displayTitle: tr.title || cs.title || '',
        displaySummary: tr.summary || '',
        displaySlug: tr.slug || cs.slug || cs._id.toString()
      };
    });

    const t = {
      EN: { pageTitle: 'Case Studies – DragLab Laboratory Equipment', metaDescription: 'Real-world success stories from our global laboratory clients.', heroTitle: 'Case Studies', heroSub: 'Real solutions. Proven results.', readMore: 'Read More', ogTitle: 'Case Studies | DragLab', ogDescription: 'Discover how DragLab equipment has solved laboratory challenges worldwide.' },
      ES: { pageTitle: 'Casos de Estudio – DragLab', metaDescription: 'Historias de éxito reales de nuestros clientes de laboratorio.', heroTitle: 'Casos de Estudio', heroSub: 'Soluciones reales. Resultados probados.', readMore: 'Leer Más', ogTitle: 'Casos de Estudio | DragLab', ogDescription: 'Descubra cómo los equipos DragLab han resuelto desafíos en laboratorios de todo el mundo.' },
      DE: { pageTitle: 'Fallstudien – DragLab Laborgeräte', metaDescription: 'Echte Erfolgsgeschichten unserer globalen Laborkunden.', heroTitle: 'Fallstudien', heroSub: 'Echte Lösungen. Nachgewiesene Ergebnisse.', readMore: 'Mehr Lesen', ogTitle: 'Fallstudien | DragLab', ogDescription: 'Entdecken Sie, wie DragLab-Geräte Laborherausforderungen weltweit lösen.' },
      TR: { pageTitle: 'Vaka Çalışmaları – DragLab Laboratuvar Ekipmanları', metaDescription: 'Küresel laboratuvar müşterilerimizden gerçek başarı hikayeleri.', heroTitle: 'Vaka Çalışmaları', heroSub: 'Gerçek çözümler. Kanıtlanmış sonuçlar.', readMore: 'Devamını Oku', ogTitle: 'Vaka Çalışmaları | DragLab', ogDescription: 'DragLab ekipmanlarının dünya genelindeki laboratuvar sorunlarını nasıl çözdüğünü keşfedin.' },
      FR: { pageTitle: 'Études de Cas – DragLab Équipements de Laboratoire', metaDescription: 'Témoignages de réussite de nos clients laboratoires mondiaux.', heroTitle: 'Études de Cas', heroSub: 'Vraies solutions. Résultats prouvés.', readMore: 'Lire la Suite', ogTitle: 'Études de Cas | DragLab', ogDescription: 'Découvrez comment les équipements DragLab ont résolu des défis en laboratoire dans le monde entier.' }
    };

    const tr = t[lang] || t.EN;
    res.render('customer/case-studies', {
      lang, ...tr, caseStudies: localizedStudies,
      path: `/${lang}/case-studies`
    });
  } catch (err) {
    console.error('getCaseStudies error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

exports.getCaseStudyDetail = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();
    const langKey = lang.toLowerCase();
    const { slug } = req.params;

    const cs = await CaseStudy.findOne({
      $or: [{ slug }, { [`translations.${langKey}.slug`]: slug }],
      status: 'published'
    }).lean();

    if (!cs) return res.status(404).render('404', { pageTitle: 'Not Found', path: '/', isAuthenticated: false });

    const tr = cs.translations?.[langKey] || cs.translations?.en || {};
    const display = {
      title: tr.title || cs.title || '',
      clientProfile: tr.clientProfile || '',
      problem: tr.problem || cs.problem || '',
      solution: tr.solution || cs.solution || '',
      results: tr.results || cs.results || '',
      summary: tr.summary || ''
    };

    const t = {
      EN: { pageTitle: `${display.title} – DragLab Case Study`, clientProfile: 'Client Profile', problem: 'The Challenge', solution: 'Our Solution', results: 'Results Achieved', productsUsed: 'Products Used', backLink: 'Back to Case Studies', ogTitle: `${display.title} | DragLab`, ogDescription: display.summary || display.problem },
      ES: { pageTitle: `${display.title} – Caso de Estudio DragLab`, clientProfile: 'Perfil del Cliente', problem: 'El Desafío', solution: 'Nuestra Solución', results: 'Resultados', productsUsed: 'Productos Utilizados', backLink: 'Volver a Casos de Estudio', ogTitle: `${display.title} | DragLab`, ogDescription: display.summary || display.problem },
      DE: { pageTitle: `${display.title} – DragLab Fallstudie`, clientProfile: 'Kundenprofil', problem: 'Die Herausforderung', solution: 'Unsere Lösung', results: 'Ergebnisse', productsUsed: 'Verwendete Produkte', backLink: 'Zurück zu Fallstudien', ogTitle: `${display.title} | DragLab`, ogDescription: display.summary || display.problem },
      TR: { pageTitle: `${display.title} – DragLab Vaka Çalışması`, clientProfile: 'Müşteri Profili', problem: 'Zorluk', solution: 'Çözümümüz', results: 'Elde Edilen Sonuçlar', productsUsed: 'Kullanılan Ürünler', backLink: 'Vaka Çalışmalarına Dön', ogTitle: `${display.title} | DragLab`, ogDescription: display.summary || display.problem },
      FR: { pageTitle: `${display.title} – Étude de Cas DragLab`, clientProfile: 'Profil Client', problem: 'Le Défi', solution: 'Notre Solution', results: 'Résultats Obtenus', productsUsed: 'Produits Utilisés', backLink: 'Retour aux Études de Cas', ogTitle: `${display.title} | DragLab`, ogDescription: display.summary || display.problem }
    };

    const translations = t[lang] || t.EN;
    res.render('customer/case-study-detail', {
      lang, ...translations, caseStudy: cs, display,
      path: `/${lang}/case-studies/${slug}`
    });
  } catch (err) {
    console.error('getCaseStudyDetail error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5: LABORATORY GLOSSARY
// ═══════════════════════════════════════════════════════════════════════════════

exports.getLaboratoryGlossary = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();
    const langKey = lang.toLowerCase();

    const terms = await Glossary.find({ status: 'published' }).sort({ letter: 1, term: 1 }).lean();

    // Attach localized display data & group by letter
    const grouped = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    terms.forEach(term => {
      const tr = term.translations?.[langKey] || term.translations?.en || {};
      const displayTerm = tr.term || term.term;
      const displayDef = tr.definition || term.definition;
      const letter = (term.letter || displayTerm.charAt(0).toUpperCase());
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push({ ...term, displayTerm, displayDef });
    });

    const availableLetters = Object.keys(grouped).sort();

    const t = {
      EN: { pageTitle: 'Laboratory Glossary – DragLab', metaDescription: 'Comprehensive glossary of laboratory equipment terms and definitions.', heroTitle: 'Laboratory Glossary', heroSub: 'Your A–Z guide to laboratory equipment terminology', searchPlaceholder: 'Search terms...', noResults: 'No terms found.', ogTitle: 'Laboratory Glossary | DragLab', ogDescription: 'Browse definitions of laboratory equipment terms from A to Z.' },
      ES: { pageTitle: 'Glosario de Laboratorio – DragLab', metaDescription: 'Glosario completo de términos de equipos de laboratorio.', heroTitle: 'Glosario de Laboratorio', heroSub: 'Su guía A–Z de terminología de equipos de laboratorio', searchPlaceholder: 'Buscar términos...', noResults: 'No se encontraron términos.', ogTitle: 'Glosario de Laboratorio | DragLab', ogDescription: 'Explore definiciones de términos de equipos de laboratorio de la A a la Z.' },
      DE: { pageTitle: 'Laborglossar – DragLab', metaDescription: 'Umfassendes Glossar mit Laborgerätebegriffen und -definitionen.', heroTitle: 'Laborglossar', heroSub: 'Ihr A–Z-Leitfaden zur Laborgeräteterminologie', searchPlaceholder: 'Begriffe suchen...', noResults: 'Keine Begriffe gefunden.', ogTitle: 'Laborglossar | DragLab', ogDescription: 'Definitionen von Laborgerätebegriffen von A bis Z.' },
      TR: { pageTitle: 'Laboratuvar Sözlüğü – DragLab', metaDescription: 'Kapsamlı laboratuvar ekipman terimleri ve tanımları sözlüğü.', heroTitle: 'Laboratuvar Sözlüğü', heroSub: 'A\'dan Z\'ye laboratuvar ekipman terminoloji rehberiniz', searchPlaceholder: 'Terim ara...', noResults: 'Terim bulunamadı.', ogTitle: 'Laboratuvar Sözlüğü | DragLab', ogDescription: 'A\'dan Z\'ye laboratuvar ekipman terimi tanımları.' },
      FR: { pageTitle: 'Glossaire de Laboratoire – DragLab', metaDescription: 'Glossaire complet des termes et définitions d\'équipements de laboratoire.', heroTitle: 'Glossaire de Laboratoire', heroSub: 'Votre guide A–Z de la terminologie des équipements de laboratoire', searchPlaceholder: 'Rechercher des termes...', noResults: 'Aucun terme trouvé.', ogTitle: 'Glossaire de Laboratoire | DragLab', ogDescription: 'Parcourez les définitions des termes d\'équipements de laboratoire de A à Z.' }
    };

    const tr = t[lang] || t.EN;
    res.render('customer/laboratory-glossary', {
      lang, ...tr, grouped, alphabet, availableLetters,
      path: `/${lang}/laboratory-glossary`
    });
  } catch (err) {
    console.error('getLaboratoryGlossary error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

exports.getGlossaryTerm = async (req, res) => {
  try {
    const lang = (req.params.lang || 'EN').toUpperCase();
    const langKey = lang.toLowerCase();
    const { slug } = req.params;

    const term = await Glossary.findOne({ slug, status: 'published' }).lean();
    if (!term) return res.status(404).render('404', { pageTitle: 'Not Found', path: '/', isAuthenticated: false });

    const tr = term.translations?.[langKey] || term.translations?.en || {};
    const display = {
      term: tr.term || term.term,
      definition: tr.definition || term.definition,
      description: tr.description || term.description || ''
    };

    const t = {
      EN: { pageTitle: `${display.term} – Laboratory Glossary | DragLab`, metaDescription: display.definition, whyItMatters: 'Why It Matters', whereUsed: 'Where It\'s Used', relatedProducts: 'Related Products', backLink: 'Back to Glossary', ogTitle: `${display.term} | DragLab Glossary`, ogDescription: display.definition },
      ES: { pageTitle: `${display.term} – Glosario | DragLab`, metaDescription: display.definition, whyItMatters: 'Por qué es Importante', whereUsed: 'Dónde se Usa', relatedProducts: 'Productos Relacionados', backLink: 'Volver al Glosario', ogTitle: `${display.term} | Glosario DragLab`, ogDescription: display.definition },
      DE: { pageTitle: `${display.term} – Laborglossar | DragLab`, metaDescription: display.definition, whyItMatters: 'Warum es Wichtig ist', whereUsed: 'Wo es Verwendet Wird', relatedProducts: 'Verwandte Produkte', backLink: 'Zurück zum Glossar', ogTitle: `${display.term} | DragLab Glossar`, ogDescription: display.definition },
      TR: { pageTitle: `${display.term} – Laboratuvar Sözlüğü | DragLab`, metaDescription: display.definition, whyItMatters: 'Neden Önemli', whereUsed: 'Nerede Kullanılır', relatedProducts: 'İlgili Ürünler', backLink: 'Sözlüğe Dön', ogTitle: `${display.term} | DragLab Sözlük`, ogDescription: display.definition },
      FR: { pageTitle: `${display.term} – Glossaire de Laboratoire | DragLab`, metaDescription: display.definition, whyItMatters: 'Pourquoi c\'est Important', whereUsed: 'Où c\'est Utilisé', relatedProducts: 'Produits Associés', backLink: 'Retour au Glossaire', ogTitle: `${display.term} | Glossaire DragLab`, ogDescription: display.definition }
    };

    const translations = t[lang] || t.EN;
    res.render('customer/glossary-term', {
      lang, ...translations, term, display,
      path: `/${lang}/laboratory-glossary/${slug}`
    });
  } catch (err) {
    console.error('getGlossaryTerm error:', err);
    res.status(500).render('500', { pageTitle: 'Error', path: '/', isAuthenticated: false });
  }
};

