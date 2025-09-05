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

const helmet = require('helmet');


// General helmet middleware (adds common security headers)
app.use(helmet());

// Content Security Policy (CSP)


app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://*.clarity.ms https://cdn.jsdelivr.net https://cdn.tiny.cloud https://www.termsfeed.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://cdn.tiny.cloud https://embed.tawk.to https://va.tawk.to https://client.tawk.to;
    img-src 'self' data: blob: https://cdn.draglab.com https://*.clarity.ms https://c.bing.com https://s3.amazonaws.com https://cdn.drag-lab.de https://res.cloudinary.com https://cdn.jsdelivr.net https://*.googleusercontent.com https://sp.tinymce.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://www.google-analytics.com https://www.googleadservices.com https://www.googletagmanager.com https://www.google.com https://www.google.com.tr https://www.gstatic.com https://pagead2.googlesyndication.com https://*.doubleclick.net;
    connect-src 'self' https://region1.google-analytics.com https://*.clarity.ms wss://*.clarity.ms https://c.bing.com https://cdn.tiny.cloud https://embed.tawk.to https://va.tawk.to https://client.tawk.to https://api.tawk.to https://*.tawk.to wss://embed.tawk.to wss://va.tawk.to wss://client.tawk.to wss://*.tawk.to https://www.google-analytics.com https://www.googleadservices.com https://www.googletagmanager.com https://www.google.com https://google.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.doubleclick.net https://www.google.com.tr;
    font-src 'self' https://cdn.tiny.cloud https://api.tiny.cloud https://fonts.gstatic.com https://embed.tawk.to https://va.tawk.to https://client.tawk.to data:;
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




// const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&ssl=true`;

const MONGODB_URI = `mongodb+srv://mhmdalazr:7NRgpPYqQ3HZs3mH@cluster0.r8u1rna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});



app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'Front-end', 'HTML'));


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'Front-end', 'assets')));
app.use('/css', express.static(path.join(__dirname, 'Front-end', 'css')));
app.use('/js', express.static(path.join(__dirname, 'Front-end', 'JS')));
app.use('/includes', express.static(path.join(__dirname, 'Front-end', 'includes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({ secret: ' my secret', resave: false, saveUninitialized: false, store: store }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err)); // for incide the promise
            // throw new Error(err); for code out of the promise
        });
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

app.use(async (req, res, next) => {
    try {
        const supported = ['EN', 'ES', 'DE', 'TR', 'FR'];
        const m = req.path.match(/^\/(EN|ES|DE|TR|FR)\b/i);
        const langFromPath = m ? m[1].toUpperCase() : (res.locals.lang || 'EN');
        const lang = supported.includes(langFromPath) ? langFromPath : 'EN';
        res.locals.lang = lang;

        // ✅ Use $elemMatch, not ".0.publish"
        const query = { [`Language.${lang}`]: { $elemMatch: { publish: true } } };

        // ✅ Select full language arrays (no numeric index in projection)
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

        // ✅ Derive safe display fields and filter models by current lang publish
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

        res.locals.navProducts = navProducts;
        next();
    } catch (e) {
        console.error('Navbar preload error:', e);
        res.locals.navProducts = [];
        next();
    }
});
app.use((req, res, next) => {
    if (!req.session.user) return next();
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) return next();
            req.user = user;
            res.locals.user = user; // ensure views see the full user doc (with role)
            res.locals.isAdmin = (user.role === 'admin' || user.isAdmin === true);
            next();
        })
        .catch(err => next(err));
});

const { verifyMailTransports } = require('./services/email');
verifyMailTransports();



// Log and compress
app.use(compression()); // Compress all routes
app.use(morgan('combined', { stream: accessLogStream })); // Log all requests to the console


app.use('/admin', adminRoutes);
app.use(shopRoutes);
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



mongoose.connect(MONGODB_URI)
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
