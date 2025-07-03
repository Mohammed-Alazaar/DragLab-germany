exports.get404 = (req, res, next) => {
    const supportedLangs = ['EN', 'ES', 'DE'];
    const rawLang = req.params?.lang?.toUpperCase() || 'EN';
    const lang = supportedLangs.includes(rawLang) ? rawLang : 'EN';

    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        isAuthenticated: req.session.isLoggedIn,
        lang // ✅ Pass it here so footer/navbar won't crash
    });
};
