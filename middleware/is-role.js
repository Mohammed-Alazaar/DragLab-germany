// middleware/is-role.js
module.exports = (roles) => {
    return (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/admin/login');
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).render('403', {
                pageTitle: 'Forbidden',
                path: '/403',
                isAuthenticated: req.session.isLoggedIn
            });
        }
        next();
    };
};
