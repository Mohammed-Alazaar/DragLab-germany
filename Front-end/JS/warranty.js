document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ warranty.js loaded');

  const html = document.documentElement;
  const lang = (html.getAttribute('data-lang') || 'EN').toUpperCase();
  const selectOptionText = html.getAttribute('data-select-option') || 'Select';
  const recaptchaEnabled = (html.getAttribute('data-recaptcha-enabled') === 'true');

  const deviceCategory = document.getElementById('deviceCategory');
  const modelSelect = document.getElementById('deviceModel');
  const submitBtn = document.getElementById('submit-btn');
  const form = document.getElementById('warranty-form');
  const tokenField = document.getElementById('recaptchaToken');

  // 🔹 Simple cache: { productId: [ { _id, ModelName }, ... ] }
  const modelsCache = {};

  function fillModelSelect(models) {
    // clear existing
    while (modelSelect.options.length > 0) modelSelect.remove(0);

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = selectOptionText;
    modelSelect.appendChild(placeholder);

    models.forEach(m => {
      const option = document.createElement('option');
      option.value = m._id;
      option.textContent = (m.ModelName || 'Unnamed Model').trim();
      modelSelect.appendChild(option);
    });
  }

  // 🔹 Product → Model dynamic select
  if (deviceCategory && modelSelect) {
    deviceCategory.addEventListener('change', async function () {
      const productId = this.value;
      fillModelSelect([]); // reset with placeholder

      if (!productId) return;

      // ✅ Use cache if available → instant
      if (modelsCache[productId]) {
        fillModelSelect(modelsCache[productId]);
        return;
      }

      // Optional "Loading..." state
      const loadingOption = document.createElement('option');
      loadingOption.value = '';
      loadingOption.textContent = 'Loading...';
      modelSelect.appendChild(loadingOption);

      try {
        const res = await fetch(`/api/models/${encodeURIComponent(productId)}?lang=${encodeURIComponent(lang)}`);
        if (!res.ok) throw new Error('Failed to fetch models');

        const data = await res.json();
        const models = Array.isArray(data.models) ? data.models : [];

        modelsCache[productId] = models; // cache
        fillModelSelect(models);
      } catch (err) {
        console.error('❌ JS Fetch Error (warranty):', err);
        fillModelSelect([]);
        const errorOption = document.createElement('option');
        errorOption.value = '';
        errorOption.textContent = 'Error loading models';
        modelSelect.appendChild(errorOption);
      }
    });
  }

  // 🔹 Submit with reCAPTCHA v3 (same logic, but respect recaptchaEnabled flag)
  if (submitBtn && form) {
    submitBtn.addEventListener('click', function () {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;

      if (!recaptchaEnabled) {
        console.warn('⚠️ reCAPTCHA disabled (test mode) — submitting form directly');
        form.submit();
        return;
      }

      if (!window.grecaptcha || !window.grecaptcha.enterprise) {
        console.error('reCAPTCHA not loaded');
        submitBtn.disabled = false;
        return;
      }

      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise
          .execute('6LemaIMrAAAAABkGmvhvmbRSO5BbXQq7AsLB7NGU', { action: 'submit' })
          .then(function (token) {
            if (tokenField) tokenField.value = token;
            form.submit();
          })
          .catch((e) => {
            console.error('reCAPTCHA execute failed', e);
            submitBtn.disabled = false;
          });
      });
    });
  }
});
