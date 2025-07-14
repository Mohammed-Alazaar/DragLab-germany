  // contents of /js/termsfeed-init.js
  document.addEventListener('DOMContentLoaded', function () {
    cookieconsent.run({
      notice_banner_type: "interstitial",
      consent_type: "implied",
      palette: "light",
language: document.documentElement.lang.toLowerCase(),
      page_load_consent_levels: [
        "strictly-necessary",
        "functionality",
        "tracking",
        "targeting"
      ],
      notice_banner_reject_button_hide: false,
      preferences_center_close_button_hide: false,
      page_refresh_confirmation_buttons: false,
      website_name: "dragLab"
    });
  });
