document.addEventListener('DOMContentLoaded', () => {
  const lang = document.documentElement.lang.toUpperCase();
  const deviceCategory = document.getElementById('deviceCategory');
  const modelSelect = document.getElementById('deviceModel');
  const submitBtn = document.getElementById("submit-btn");

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
          option.textContent = model.ModelName?.trim() || 'Unnamed Model';
          modelSelect.appendChild(option);
        });
      } catch (err) {
        console.error("❌ JS Fetch Error:", err);
      }
    });
  }

  // Trigger reCAPTCHA v3 on submit click
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute('6LemaIMrAAAAABkGmvhvmbRSO5BbXQq7AsLB7NGU', { action: 'submit' }).then(function (token) {
          window.onRecaptchaSuccess(token);
        });
      });
    });
  }

  window.onRecaptchaSuccess = function (token) {
    const form = document.getElementById("warranty-form");
    if (form?.checkValidity()) {
      form.submit();
    } else {
      form?.reportValidity();
    }
  };
});
