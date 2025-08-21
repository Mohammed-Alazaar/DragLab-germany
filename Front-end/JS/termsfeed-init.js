// /js/termsfeed-init.js
(function () {
  // Skip entirely if user already decided
  if (/(^|;\s*)cc_consent=/.test(document.cookie)) return;

  function markContainer() {
    var el = document.getElementById('cc--main');
    if (!el) return;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-hidden', 'true');     // not primary content
    el.setAttribute('data-nosnippet', '');      // keep out of SERP snippets
  }

  // Reveal (remove aria-hidden) only after TermsFeed finishes and UI is ready
  function reveal() {
    document.documentElement.classList.add('cookie-ready');
    var el = document.getElementById('cc--main');
    if (el) el.removeAttribute('aria-hidden');
  }

  window.addEventListener('load', function () {
    var lang = (document.documentElement.lang || 'en').toLowerCase();

    // If the TermsFeed library isn't loaded yet (we lazy-load it), wait for it.
    function runWhenReady(attempts) {
      attempts = attempts || 0;
      if (window.cookieconsent && typeof cookieconsent.run === 'function') {
        cookieconsent.run({
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
            cookieconsent.loadScripts && cookieconsent.loadScripts();
            reveal();
          },
          onConsent: function () {
            cookieconsent.loadScripts && cookieconsent.loadScripts();
            reveal();
          },
          onChange: function () {
            // Preferences changed; nothing to do for UI here
          }
        });

        // Ensure attributes exist (TermsFeed may recreate nodes)
        markContainer();

        // In case there is no interaction (implied consent UI), still reveal after a short idle
        setTimeout(reveal, 1200);
      } else if (attempts < 40) {
        // wait up to ~2s for the lazy-loaded script
        return setTimeout(function(){ runWhenReady(attempts + 1); }, 50);
      }
    }

    runWhenReady();
  });
})();
