// /js/termsfeed-init.js
(function () {
  // Skip entirely if user already decided
  if (/(^|;\s*)cc_consent=/.test(document.cookie)) return;

  window.addEventListener('load', function () {
    var lang = (document.documentElement.lang || 'en').toLowerCase();

    cookieconsent.run({
      // smaller banner; easier to center
      notice_banner_type: "simple",
      consent_type: "implied",
      palette: "light",
      language: lang,
      page_load_consent_levels: [
        "strictly-necessary",
        "functionality",
        "tracking",
        "targeting"
      ],
      notice_banner_reject_button_hide: false,
      preferences_center_close_button_hide: false,
      page_refresh_confirmation_buttons: false,
      website_name: "DragLab",

      onFirstAction: function () {
        if (cookieconsent && typeof cookieconsent.loadScripts === 'function') {
          cookieconsent.loadScripts();
        }
      },
      onConsent: function () {
        if (cookieconsent && typeof cookieconsent.loadScripts === 'function') {
          cookieconsent.loadScripts();
        }
      }
    });
  });
})();
