const path = require('path');
const Product = require('../models/product'); 
const User = require('../models/user');
exports.getaccount = (req, res, next) => {
    try {
        const user = req.user; // directly get the user

        res.render('customer/account', {
            path: '/account',
            pageTitle: 'Your Account',
            user: user,
            role: user.role,
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};


exports.postaccount = (req, res, next) => {
    const userId = req.user._id; // Ensure you have user session management
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    };

    User.findByIdAndUpdate(userId, { $set: updatedUser }, { new: true, upsert: true })
        .then(result => {
            res.redirect('/account'); // Redirect to a profile or confirmation page
        })
        .catch(err => console.log(err));
};