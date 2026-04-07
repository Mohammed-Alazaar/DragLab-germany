require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const crypto = require('crypto');




const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();


const redirects = require('./util/redirects');

Object.keys(redirects).forEach(oldPath => {
    app.get(oldPath, (req, res) => {
        res.redirect(301, redirects[oldPath]);
    });
});

// ── Dynamic 301 redirects for old URL formats ─────────────────────────────

// Group A: old sitemap used /:lang/product/:slug/model/:modelSlug
//          current routes use /:lang/products/:slug/:modelSlug
app.get('/:lang/product/:productSlug/model/:modelSlug', (req, res) => {
    const { lang, productSlug, modelSlug } = req.params;
    res.redirect(301, `/${lang}/products/${productSlug}/${modelSlug}`);
});

// Group B: /:lang/products with no slug → home (no product-listing page exists)
app.get('/:lang/products', (req, res) => {
    res.redirect(301, `/${req.params.lang}`);
});

// Group C: /:lang/industry/industry → /:lang/Industry
app.get('/:lang/industry/industry', (req, res) => {
    res.redirect(301, `/${req.params.lang}/Industry`);
});

// Group D: /:lang/quality-policy (hyphenated) → /:lang/QualityPolicy
app.get('/:lang/quality-policy', (req, res) => {
    res.redirect(301, `/${req.params.lang}/QualityPolicy`);
});

// Group E: /:lang/license (singular) → /:lang/licenses
app.get('/:lang/license', (req, res) => {
    res.redirect(301, `/${req.params.lang}/licenses`);
});

// Lowercase route aliases (Express is case-insensitive for letters but hyphens are different)
app.get('/:lang/qualifications', (req, res) => {
    res.redirect(301, `/${req.params.lang}/Qualifications`);
});

// Group F: old short model slugs that were missing the series prefix
const OLD_MODEL_SLUG_MAP = {
    'do-30-digital-display':       'drying-oven-do-30-digital-display',
    'do-55-digital-display':       'drying-oven-do-55-digital-display',
    'do-80-digital-display':       'drying-oven-do-80-digital-display',
    'do-120-digital-display':      'drying-oven-do-120-digital-display',
    'do-30-touch-screen-display':  'drying-oven-to-30-touch-screen-display',
    'do-55-touch-screen-display':  'drying-oven-to-55-touch-screen-display',
    'do-80-touch-screen-display':  'drying-oven-to-80-touch-screen-display',
    'do-120-touch-screen-display': 'drying-oven-to-120-touch-screen-display',
    'di-30-digital-display':       'incubator-di-30-digital-display',
    'di-55-digital-display':       'incubator-di-55-digital-display',
    'di-80-digital-display':       'incubator-di-80-digital-display',
    'di-120-digital-display':      'incubator-di-120-digital-display',
    'ti-30-touch-screen':          'incubator-ti-30-touch-screen',
    'ti-55-touch-screen':          'incubator-ti-55-touch-screen',
    'ti-80-touch-screen':          'incubator-ti-80-touch-screen',
    'ti-120-touch-screen':         'incubator-ti-120-touch-screen',
    'ds-2000':  'water-still-ds-2000',
    'ds-4000':  'water-still-ds-4000',
    'ds-8000':  'water-still-ds-8000',
    'ds-8008':  'water-still-ds-8008',
    'ds-8012':  'water-still-ds-8012',
    'ds-8025':  'water-still-ds-8025',
    'dw-06':    'water-bath-dw-06',
    'dw-10':    'water-bath-dw-10',
    'dw-15':    'water-bath-dw-15',
    'dw-25':    'water-bath-dw-25',
    'dw-35':    'water-bath-dw-35',
    'dw-50':    'water-bath-dw-50',
};

app.get('/:lang/products/:productSlug/:modelSlug', (req, res, next) => {
    const { lang, productSlug, modelSlug } = req.params;
    const newSlug = OLD_MODEL_SLUG_MAP[modelSlug];
    if (newSlug) return res.redirect(301, `/${lang}/products/${productSlug}/${newSlug}`);
    next();
});

const helmet = require('helmet');


// General helmet middleware (adds common security headers)
// dnsPrefetchControl: allow — Helmet sets X-DNS-Prefetch-Control:off by default which
// blocks the browser from pre-resolving hostnames found in links, hurting page load.
app.use(helmet({ dnsPrefetchControl: { allow: true } }));

// Content Security Policy (CSP)


app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://*.clarity.ms https://cdn.jsdelivr.net https://cdn.tiny.cloud https://www.termsfeed.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://cdn.tiny.cloud https://embed.tawk.to https://va.tawk.to https://client.tawk.to;
    img-src 'self' data: blob: https://cdn.draglab.com https://*.clarity.ms https://c.bing.com https://s3.amazonaws.com https://cdn.drag-lab.de https://res.cloudinary.com https://cdn.jsdelivr.net https://*.googleusercontent.com https://sp.tinymce.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://www.google-analytics.com https://www.googleadservices.com https://www.googletagmanager.com https://www.google.com https://www.google.com.tr https://www.gstatic.com https://pagead2.googlesyndication.com https://*.doubleclick.net;
    connect-src 'self' https://analytics.google.com https://www.google-analytics.com https://region1.google-analytics.com https://www.termsfeed.com https://www.google.com https://www.recaptcha.net https://www.gstatic.com https://region1.google-analytics.com https://*.clarity.ms wss://*.clarity.ms https://c.bing.com https://cdn.tiny.cloud https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://*.tawk.to wss://embed.tawk.to wss://va.tawk.to wss://client.tawk.to wss://*.tawk.to https://www.google-analytics.com https://www.googleadservices.com https://www.googletagmanager.com https://www.google.com https://google.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.doubleclick.net https://www.google.com.tr;
    font-src 'self' https://cdn.tiny.cloud https://api.tiny.cloud https://fonts.gstatic.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to ;
    frame-src https://www.google.com https://www.youtube.com https://www.googletagmanager.com https://td.doubleclick.net https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://www.gstatic.com https://recaptcha.google.com https://www.googleadservices.com https://*.doubleclick.net;
    object-src 'none'; 
    frame-ancestors 'self'; 
  `.replace(/\s+/g, ' ').trim();

    res.setHeader('Content-Security-Policy', csp);
    next();
});






// Referrer-Policy
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

// X-Frame-Options
app.use(helmet.frameguard({ action: 'deny' }));

// X-Content-Type-Options
app.use(helmet.noSniff());

// Strict Transport Security (HSTS)
app.use(
    helmet.hsts({
        maxAge: 63072000, // 2 years
        includeSubDomains: true,
        preload: true,
    })
);




// const MONGODB_URI = `mongodb+srv://mhmdalazr:${process.env.MONGO_PASSWORD}@cluster0.r8u1rna.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority&ssl=true`;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&ssl=true`;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 7, // auto-expire sessions after 7 days
});



app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'Front-end', 'HTML'));
app.locals.enableClarity = process.env.ENABLE_CLARITY === 'true';


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const staticpagesRoutes = require('./routes/staticpages');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const sitemapRoutes = require('./routes/sitemap');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static assets with long-term caching (versioned via filenames in production)
const staticOpts = { maxAge: '7d', etag: true, lastModified: true };
const immutableOpts = { maxAge: '365d', immutable: true, etag: true };
app.use('/assets', express.static(path.join(__dirname, 'Front-end', 'assets'), immutableOpts));
app.use('/css', express.static(path.join(__dirname, 'Front-end', 'css'), staticOpts));
app.use('/js', express.static(path.join(__dirname, 'Front-end', 'JS'), staticOpts));
// Note: /includes intentionally NOT served as static (contains server-side EJS templates)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOpts));
app.use(session({ secret: process.env.SESSION_SECRET || ' my secret', resave: false, saveUninitialized: false, store: store }));
// Sitemap routes must come before express.static so /sitemap.xml is served dynamically
app.use(sitemapRoutes);
app.use(express.static(path.join(__dirname, 'public'), staticOpts));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    // Expose current path so EJS views can build canonical / hreflang URLs
    res.locals.currentPath = req.path;
    next();
});



app.use((req, res, next) => {
    res.locals.lang = (req.params.lang || req.query.lang || 'EN').toUpperCase();
    res.locals.faqSchema = {
        EN: { url: "https://www.drag-lab.de/EN" },
        ES: { url: "https://www.drag-lab.de/ES" },
        DE: { url: "https://www.drag-lab.de/DE" },
        TR: { url: "https://www.drag-lab.de/TR" },
        FR: { url: "https://www.drag-lab.de/FR" }
    };
    next();
});


const Product = require('./models/product');
const navCache = {}; // { EN: { ts, data }, ES: { ts, data }, ... }
const NAV_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

app.use(async (req, res, next) => {
    const t0 = Date.now();
    try {
        const supported = ['EN', 'ES', 'DE', 'TR', 'FR'];
        const m = req.path.match(/^\/(EN|ES|DE|TR|FR)\b/i);
        const langFromPath = m ? m[1].toUpperCase() : (res.locals.lang || 'EN');
        const lang = supported.includes(langFromPath) ? langFromPath : 'EN';
        res.locals.lang = lang;

        // 🧠 Check cache first
        const now = Date.now();
        const cached = navCache[lang];
        if (cached && (now - cached.ts) < NAV_CACHE_TTL_MS) {
            res.locals.navProducts = cached.data;
            console.log(`🌐 navProducts (lang=${lang}) served from cache in ${Date.now() - t0} ms`);
            return next();
        }

        const query = { [`Language.${lang}`]: { $elemMatch: { publish: true } } };

        let navProducts = await Product.find(query)
            .select([
                'slug',
                'ProductSketch',
                `Language.${lang}`,
                'Language.EN',
                'Models.slug',
                `Models.Language.${lang}`,
                'Models.Language.EN',
            ])
            .lean();

        navProducts = navProducts.map(p => {
            const cur = p?.Language?.[lang]?.[0] || {};
            const en = p?.Language?.EN?.[0] || {};
            const displayName = cur.ProductName || en.ProductName || '';
            const displayDesc = cur.ProductNameDesc || en.ProductNameDesc || '';

            const models = (p.Models || []).filter(
                m => m?.Language?.[lang]?.[0]?.publish === true
            );

            return { ...p, displayName, displayDesc, Models: models };
        });

        // 💾 Save to cache
        navCache[lang] = { ts: now, data: navProducts };

        res.locals.navProducts = navProducts;
        console.log(`🌐 navProducts (lang=${lang}) loaded from DB in ${Date.now() - t0} ms`);
        next();
    } catch (e) {
        console.error('Navbar preload error:', e);
        res.locals.navProducts = [];
        next();
    }
});

// In-memory user cache: avoids a MongoDB lookup on every single page request.
// TTL is short (60s) so changes (role, cart, etc.) are reflected quickly.
const userCache = require('./util/userCache');

app.use((req, res, next) => {
    if (!req.session.user) return next();
    const userId = req.session.user._id.toString();

    const cachedUser = userCache.get(userId);
    if (cachedUser) {
        req.user = cachedUser;
        res.locals.user = cachedUser;
        res.locals.isAdmin = (cachedUser.role === 'admin' || cachedUser.isAdmin === true);
        return next();
    }

    User.findById(userId)
        .then(user => {
            if (!user) return next();
            userCache.set(userId, user);
            req.user = user;
            res.locals.user = user;
            res.locals.isAdmin = (user.role === 'admin' || user.isAdmin === true);
            next();
        })
        .catch(err => next(err));
});

const { verifyMailTransports } = require('./services/email');
verifyMailTransports();



// Compress all responses (gzip). Threshold: only compress responses > 1KB.
app.use(compression({ threshold: 1024 }));

// HTTP request logging — skip static asset paths to reduce disk I/O
const _staticPrefixes = ['/assets', '/css', '/js', '/uploads', '/public'];
const _skipStatic = (req) => _staticPrefixes.some(p => req.path.startsWith(p));
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: accessLogStream, skip: _skipStatic }));
} else {
    app.use(morgan('dev', { skip: _skipStatic }));
}


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(staticpagesRoutes);
app.use(authRoutes);
app.use(accountRoutes);
const feedRoutes = require('./routes/feed');
app.use('/', feedRoutes);


app.use(errorController.get404);
app.use((error, req, res, next) => {
    console.error('🔴 500 ERROR:', error); // ADD THIS
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session?.isLoggedIn || false
    });
});

// app.set('view options', { pretty: true, strict: false });
// app.locals.compileDebug = true;
// app.locals.debug = true;






const server = http.createServer(app);



mongoose.connect(MONGODB_URI, {
    maxPoolSize: 20,              // allow up to 20 concurrent DB connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(result => {
        server.listen(process.env.PORT || 3010);
        console.log(`Server running on port ${process.env.PORT || 3010}`);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Also exit if MongoDB fails
    });

//     // Enable Mongoose debug mode to log queries
// mongoose.set('debug', function (collectionName, method, query, doc) {
//     console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
// });
