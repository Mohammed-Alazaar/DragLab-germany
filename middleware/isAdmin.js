const path = require('path');

module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.render(path.join(__dirname, '..', 'HTML', '403'), {
            pageTitle: 'Forbidden',
            path: '/403',
            isAuthenticated: req.session.isLoggedIn
        });
    }
    next();
};
