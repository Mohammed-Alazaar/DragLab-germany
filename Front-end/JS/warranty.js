document.addEventListener('DOMContentLoaded', () => {
  const lang = document.documentElement.lang?.toUpperCase() || 'EN';
  const deviceCategory = document.getElementById('deviceCategory');
  const modelSelect = document.getElementById('deviceModel');
  const submitBtn = document.getElementById('submit-btn');
  const form = document.getElementById('warranty-form');
  const tokenField = document.getElementById('recaptchaToken');

  if (deviceCategory && modelSelect) {
    deviceCategory.addEventListener('change', async function () {
      const productId = this.value;
      modelSelect.innerHTML = `<option value="">${modelSelect.dataset.defaultOption}</option>`;
      if (!productId) return;

      try {
        const res = await fetch(`/api/models/${productId}?lang=${lang}`);
        const data = await res.json();

        data.models?.forEach(model => {
          const option = document.createElement('option');
          option.value = model._id;
          option.textContent = (model.ModelName || 'Unnamed Model').trim();
          modelSelect.appendChild(option);
        });
      } catch (err) {
        console.error('❌ JS Fetch Error:', err);
      }
    });
  }

  // Submit with reCAPTCHA v3
  if (submitBtn && form) {
    submitBtn.addEventListener('click', function () {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // prevent double-click
      submitBtn.disabled = true;

      if (!window.grecaptcha || !window.grecaptcha.enterprise) {
        console.error('reCAPTCHA not loaded');
        submitBtn.disabled = false;
        form.reportValidity();
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
