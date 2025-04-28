require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');




const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrit4.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&ssl=true`;


const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});



app.set('view engine', 'ejs');

app.set('views', 'front-end/HTML'); // This is the default setting, so you don't actually need to specify this line

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(__dirname, 'front-end', 'Css'))); // This will make the front-end folder accessible to the public
app.use(express.static(path.join(__dirname, 'front-end'))); // This will make the front-end folder accessible to the public
app.use(session({ secret: ' my secret', resave: false, saveUninitialized: false, store: store }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(flash());



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



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(accountRoutes);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});

app.use(errorController.get404);
app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});




app.use(helmet());
app.use(compression()); // Compress all routes
app.use(morgan('combined', { stream: accessLogStream })); // Log all requests to the console



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
