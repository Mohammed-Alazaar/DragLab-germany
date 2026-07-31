const slugify = require('slugify');

function generateSlug(text) {
  return slugify(text, { lower: true, strict: true }); // "DS 2000" → "ds-2000"
}
