const path = require('path');


module.exports = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'subAdmin') {
        return  res.render(path.join(__dirname, '..', 'front-end', 'HTML', '403'), {
            pageTitle: 'Forbidden',
            path: '/403',
            isAuthenticated: req.session.isLoggedIn
        });
    }
    next();
};
