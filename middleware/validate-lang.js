/**
 * Express router.param middleware for `:lang` route parameter.
 *
 * Rules:
 *  - Accepts: en, de, tr, fr, es  (lowercase — canonical form)
 *  - Uppercase / mixed-case variants (EN, De, …) → 301 redirect to lowercase
 *  - Anything else → 404
 */

const VALID_LANGS = new Set(['en', 'de', 'tr', 'fr', 'es']);

module.exports = function validateLang(req, res, next, lang) {
  const lower = lang.toLowerCase();

  if (!VALID_LANGS.has(lower)) {
    // Not a valid language code — hard 404, do not serve content
    return res.status(404).render('404', {
      pageTitle: 'Page Not Found',
      isAuthenticated: req.session?.isLoggedIn || false,
      lang: 'EN',
    });
  }

  if (lang !== lower) {
    // Uppercase or mixed-case lang → 301 to lowercase canonical URL.
    // Replace only the first path segment to avoid clobbering slugs that
    // happen to contain the lang string (e.g. /DE/products/de-30-oven).
    const newPath = req.originalUrl.replace(
      new RegExp(`^/${escapeForRegex(lang)}(/|$)`, 'i'),
      `/${lower}$1`
    );
    return res.redirect(301, newPath);
  }

  // Keep res.locals.lang in sync (used by nav middleware + controllers)
  res.locals.lang = lower.toUpperCase();
  next();
};

function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
