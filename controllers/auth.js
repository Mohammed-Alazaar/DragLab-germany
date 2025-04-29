const crypto = require('crypto');
const path = require('path'); // Add this line to import the path module
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key:'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'
//     }
// }));



exports.getLogin = ((req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
    console.log('Rendering login page...');
    console.log('Message:', message);
});

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/admin/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/admin/login',
                    pageTitle: 'Login',
                    isAuthenticated: false,
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            if (user.role === 'admin' || user.role === 'seller') {
                                res.redirect('/admin/dashboard');
                            } else {
                                res.redirect('/EN');
                            }
                        });
                    }
                    return res.status(422).render('auth/login', {
                        path: '/admin/login',
                        pageTitle: 'Login',
                        isAuthenticated: false,
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/admin/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};



exports.postLogOut = ((req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/EN');
    });
});



// exports.getSignup = ((req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'auth', 'signup'), {
//         path: '/signup',
//         pageTitle: 'signup',
//         isAuthenticated: false,
//         errorMessage: message,
//         oldInput: {
//             name: '',
//             email: '',
//             password: '',
//             confirmPassword: '',
//             phoneNumber: '',
//         },
//         validationErrors: []
//     });
// });
exports.getAdduser = ((req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('sellercompany/adduser', {
        path: '/admin/adduser',
        pageTitle: 'add user',
        isAuthenticated: true,
        errorMessage: message,
        oldInput: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
        },
        validationErrors: []
    });
});


exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const confirmPassword = req.body.confirmPassword;
    const webConditions = req.body.webConditions;
    const errors = validationResult(req);
    const role = req.body.role;

    if (!errors.isEmpty()) {
        const errorMessage = '<ul class="sign-up-error-message">' + errors.array().map(error => `<li>${error.msg}</li>`).join('') + '</ul>';
        return res.status(422).render('sellercompany/adduser', {
            path: '/signup',
            pageTitle: 'adduser',
            isAuthenticated: false,
            errorMessage: errorMessage,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                phoneNumber: phoneNumber,
            },
            validationErrors: errors.array()
        });
    }
    if (req.body.role = '') {
        role = 'customer';
    }


    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            cart: { items: [] },
            role: role
        });

        return user.save();
    })
    
    .then(() => {
        if (role === 'admin' || role === 'subAdmin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/adduser');
        }
        console.log('User created successfully!');
    })
    .catch(err => {
        console.log(err);
    });
    
};






// exports.getReset = ((req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'auth', 'reset'), {
//         path: '/reset',
//         pageTitle: 'Reset Password',
//         isAuthenticated: false,
//         errorMessage: message
//     });
// });

// exports.postReset = (req, res, next) => {
//     crypto.randomBytes(32, (err, buffer) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/reset');
//         }
//         const token = buffer.toString('hex');
//         User.findOne({ email: req.body.email })
//             .then(user => {
//                 if (!user) {
//                     req.flash('error', 'No account with that email found.');
//                     return res.redirect('/reset');
//                 }
//                 user.resetToken = token;
//                 user.resetTokenExpiration = Date.now() + 3600000;
//                 return user.save();
//             })
//             .then(result => {
//                 console.log('User found and token saved, attempting to send email...');
//                 return transporter.sendMail({
//                     to: req.body.email,
//                     from: 'mhmdalazr@gmail.com',
//                     subject: 'Password reset',
//                     html: `
//                     <p>You requested a password reset</p>
//                     <p>Click this <a href="http://localhost:3010/reset/${token}">link</a> to set a new password.</p>
//                     `
//                 });
//             })
//             .then(() => {
//                 console.log('Email sent successfully!');
//                 res.redirect('/');
//             })
//             .catch(err => {
//                 console.log('Error in sending email:', err);
//             });
            

//     });
// };



// exports.getNewPassword = ((req, res, next) => {
//     const token = req.params.token;
//     User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
//         .then(user => {
//             let message = req.flash('error');
//             if (message.length > 0) {
//                 message = message[0];
//             } else {
//                 message = null;
//             }
//             res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'auth', 'new-password'), {
//                 path: '/new-password',
//                 pageTitle: 'New Password',
//                 isAuthenticated: false,
//                 errorMessage: message,
//                 userId: user._id.toString(),
//                 passwordToken: token
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });

// });

// exports.postNewPassword = ((req, res, next) => {
//     const newPassword = req.body.password;
//     const userId = req.body.userId;
//     const passwordToken = req.body.passwordToken;
//     let resetUser;


//     User.findOne({
//         resetToken: passwordToken,
//         resetTokenExpiration: { $gt: Date.now() },
//         _id: userId
//     })
//         .then(user => {
//             resetUser = user;
//             return bcrypt.hash(newPassword, 12);
//         })
//         .then(hashedPassword => {
//             resetUser.password = hashedPassword;
//             resetUser.resetToken = undefined;
//             resetUser.resetTokenExpiration = undefined;
//             return resetUser.save();
//         })
//         .then(result => {
//             res.redirect('/login');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });


// exports.getchangepass = ((req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     req.user
//        .populate('address')

//     const cartItemCount = req.user.cart.items.reduce((count, item) => count + item.quantity, 0);

//     res.render(path.join(__dirname, '..', 'front-end', 'HTML', 'auth', 'changepassword'), {
//         path: '/reset',
//         pageTitle: 'Reset Password',
//         isAuthenticated: false,
//         errorMessage: message,
//         role: req.user.role,
//         user: req.user,
//         cartItemCount: cartItemCount,
//         isAuthenticated: req.session.isLoggedIn,
//     });
// });

// exports.postchangepass = (req, res, next) => {
//     crypto.randomBytes(32, (err, buffer) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/reset');
//         }
//         const token = buffer.toString('hex');
//         User.findOne({ email: req.body.email })
//             .then(user => {
//                 if (!user) {
//                     req.flash('error', 'No account with that email found.');
//                     return res.redirect('/reset');
//                 }
//                 user.resetToken = token;
//                 user.resetTokenExpiration = Date.now() + 3600000;
//                 return user.save();
//             })
//             .then(result => {
//                 res.redirect('/');
//                 console.log('email sent');
//                 transporter.sendMail({
//                     to: req.body.email,
//                     from: 'mhmdalazr@gmail.com',
//                     subject: 'Password reset',
//                     html: `
//                     <p>You requested a password reset</p>
//                     <p>Click this <a href="http://localhost:3010/reset/${token}">link</a> to set a new password.</p>
//                     `
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//             });

//     });
// };
