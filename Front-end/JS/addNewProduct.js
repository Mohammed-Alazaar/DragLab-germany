// Event delegation + safe defaults + tags init
document.addEventListener("DOMContentLoaded", function () {
  // ===== 0) Helpers =====
  const toArray = (x) => (Array.isArray(x) ? x : [x]).filter(Boolean);
  const normalizeTags = (tags) => {
    return toArray(tags)
      .map(String)
      .map(s => s.trim().toLowerCase())
      .map(s => s.replace(/\s+/g, ' '))        // collapse inner spaces
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) // dedupe
  };

  // ===== 1) Collapse logic (unchanged, just tidied) =====
  document.querySelectorAll(".language-section").forEach(section => {
    const body = section.querySelector(".language-body");
    const btn  = section.querySelector(".language-toggle");
    if (!body || !btn) return;

    if (body.querySelector(".is-invalid, .form-error")) {
      body.classList.remove("collapse");
      section.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      body.classList.add("collapse");
      section.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".language-toggle");
    if (!btn) return;

    const section = btn.closest(".language-section");
    const body = section && section.querySelector(".language-body");
    if (!body) return;

    const isCollapsed = body.classList.toggle("collapse");
    section.classList.toggle("is-open", !isCollapsed);
    btn.setAttribute("aria-expanded", String(!isCollapsed));
  });

  // ===== 2) Tagify init (per-language) =====
  const tagInputs = document.querySelectorAll('input.tags-input');
  const tagifyInstances = new Map();

  tagInputs.forEach(input => {
    // read config from data-attrs
    const max = Number(input.dataset.max || 12);
    const min = Number(input.dataset.min || 0);
    let whitelist = [];
    try { whitelist = JSON.parse(input.dataset.whitelist || '[]'); } catch(e) { /* ignore */ }

    // fallback: plain input if Tagify not present
    if (typeof window.Tagify !== "function") {
      // still normalize on submit (see form handler below)
      return;
    }

    const tagify = new Tagify(input, {
      duplicates: false,
      maxTags: max,
      trim: true,
      dropdown: { enabled: 0, maxItems: 50, fuzzySearch: true },
      whitelist
    });

    // normalize on "add"/"edit"/"blur"
    const normalize = () => {
      const current = (tagify.value || []).map(t => t.value);
      const normalized = normalizeTags(current);
      if (normalized.length !== current.length ||
          normalized.some((v, i) => v !== current[i])) {
        tagify.removeAllTags();
        tagify.addTags(normalized);
      }
    };
    tagify.on('add', normalize);
    tagify.on('edit:updated', normalize);
    tagify.on('blur', normalize);

    // enforce max/min with UI hint
    tagify.on('add', () => {
      if (tagify.value.length > max) {
        tagify.removeTag(tagify.value[tagify.value.length - 1].value);
      }
    });

    tagifyInstances.set(input, tagify);
  });

  // ===== 3) Normalize + serialize on submit (Tagify or plain) =====
  // This ensures server sees comma-separated strings you already parse.
  document.querySelectorAll('form[action*="/admin/"][method="POST"]').forEach(form => {
    form.addEventListener('submit', () => {
      document.querySelectorAll('input.tags-input').forEach(input => {
        const tagify = tagifyInstances.get(input);
        const values = tagify
          ? (tagify.value || []).map(t => t.value)
          : String(input.value || '').split(',');
        const normalized = normalizeTags(values).slice(0, Number(input.dataset.max || 12));
        input.value = normalized.join(', ');
      });
    });
  });
});
