module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/admin/login');
    }
    next();
};

// is-auth for testing
// const isAuth = (req, res, next) => {
//     if (!req.session.isLoggedIn) {
//         return res.redirect('/login');
//     }
//     next();
// };

// export default isAuth;
