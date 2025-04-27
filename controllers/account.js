const path = require('path');
const Product = require('../models/product'); 
const User = require('../models/user');
exports.getaccount = (req, res, next) => {
    req.user
        .populate('address')
        .then(user => {
            const cartItemCount = req.user.cart.items.reduce((count, item) => count + item.quantity, 0);

            res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'customer', 'account'), {
                path: '/account',
                pageTitle: 'Your Account',
                user: user,
                role: user.role,
                cartItemCount: cartItemCount,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
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