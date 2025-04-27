const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const User = require('../models/user');
// const isAuth = require('../middleware/is-auth');
const isRole = require('../middleware/is-role');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/admin/login', authController.getLogin);
router.post('/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password', 'Please enter a valid Password.')
            .isLength({ min: 8 })
            .trim()

    ],
    authController.postLogin);

router.get('/admin/logout', authController.postLogOut);

// router.get('/signup', authController.getSignup);
router.get('/admin/adduser', isAdmin, authController.getAdduser);
// router.get('/admin/Signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail exists already, please pick a different one.');
                        }
                    })
            }).normalizeEmail(),
        body('password', 'Please enter a password with only numbers and text and at least 8 characters.')
            .isLength({ min: 8 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        }),
      

        // body('Conditions').custom((value, { req }) => {
        //     if (value !== 'on') {
        //         throw new Error('You have to agree to the terms and conditions!');
        //     }
        //     return true;
        // })

    ],
    authController.postSignup);

// router.get('/reset', authController.getReset);
// router.post('/reset', authController.postReset);

// router.get('/admin/changepassword', authController.getchangepass);
// router.post('/postchangepass', authController.postReset);

// router.get('/reset/:token', authController.getNewPassword);
// router.post('/new-password', authController.postNewPassword);

module.exports = router;
