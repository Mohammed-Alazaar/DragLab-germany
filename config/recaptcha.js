// config/recaptcha.js

// Default: ENABLED.
// Only if RECAPTCHA_ENABLED is explicitly set to "false" will it be disabled.
const RECAPTCHA_ENABLED =
  process.env.RECAPTCHA_ENABLED === 'false' ? false : true;

module.exports = { RECAPTCHA_ENABLED };
