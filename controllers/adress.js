const path = require('path');
const User = require('../models/user');

exports.getAddress = (req, res, next) => {
    const userId = req.session.user._id;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(302).redirect('/error');  // Properly handle case where user is not found
            }
            const cartItemCount = req.user.cart.items.reduce((count, item) => count + item.quantity, 0);
            res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'customer', 'address'), {
                pageTitle: 'Edit Address',
                address: user.address,
                isAuthenticated: req.session.isLoggedIn,
                cartItemCount: cartItemCount,
                path: '/address'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(302).redirect('/error');
        });
};

exports.postaddress = (req, res) => {
    const userId = req.session.user._id;
    const updatedAddress = {
        TCNumber: req.body.TCNumber,
        Country: req.body.Country,
        City: req.body.City,
        District: req.body.District,
        Neighborhood: req.body.Neighborhood,
        PostalCode: req.body.PostalCode,
        fulladdress: req.body.fulladdress,
        Street: req.body.Street,
        BuildingNumber: req.body.BuildingNumber,
        Floor: req.body.Floor,
        ApartmentNumber: req.body.ApartmentNumber,
        addressNackName: req.body.addressNackName
    };

    User.findByIdAndUpdate(userId, { $set: { address: updatedAddress } }, { new: true, upsert: true })
        .then(result => {
            res.redirect('/checkout');
        })
        .catch(err => {
            console.error(err);
            res.status(302).redirect('/error');
        });
};

exports.getEditAddress = (req, res) => {
    const userId = req.session.user._id;
    User.findById(userId, 'address')
        .then(user => {
            if (!user) {
                return res.status(302).redirect('/error');  // Properly handle case where user is not found
            }
            res.render('address', {
                pageTitle: 'Edit Address',
                address: user.address,
                isAuthenticated: req.session.isLoggedIn,
                path: '/edit-address'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(302).redirect('/error');
        });
};
