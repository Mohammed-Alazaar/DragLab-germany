document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.language-section');

  sections.forEach(section => {
    const btn = section.querySelector('.language-toggle');
    const body = section.querySelector('.language-body');
    if (!btn || !body) return;

    const lang = section.getAttribute('data-lang') || body.id || Math.random().toString(36).slice(2);
    const storeKey = `draglab_industry_lang_open_${lang}`;

    // 1) Default: collapsed (do nothing)
    // 2) Restore saved state (optional but nice UX)
    const saved = localStorage.getItem(storeKey);
    if (saved === '1') {
      section.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }

    // Toggle behavior
    btn.addEventListener('click', () => {
      const willOpen = !section.classList.contains('is-open');
      section.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
      localStorage.setItem(storeKey, willOpen ? '1' : '0');
    });
  });
});
