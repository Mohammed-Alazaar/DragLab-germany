document.addEventListener("DOMContentLoaded", () => { 
  console.log("✅ technical-service.js loaded");

  const html = document.documentElement;
  const lang = html.getAttribute("data-lang");
  const selectOptionText = html.getAttribute("data-select-option");
  const recaptchaEnabled = (html.getAttribute("data-recaptcha-enabled") === "true");

  const categorySelect = document.getElementById("deviceCategory");
  const modelSelect = document.getElementById("deviceModel");

  if (categorySelect && modelSelect) {
    categorySelect.addEventListener("change", async function () {
      const productId = this.value;

      // Clear all options
      while (modelSelect.options.length > 0) modelSelect.remove(0);

      // Add placeholder
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = selectOptionText;
      modelSelect.appendChild(placeholder);

      if (!productId) return;

      try {
        const res = await fetch(`/api/models/${productId}?lang=${lang}`);
        if (!res.ok) throw new Error("Failed to fetch models");

        const data = await res.json();
        data.models.forEach((model) => {
          const option = document.createElement("option");
          option.value = model._id;
          option.textContent = model.ModelName;
          modelSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    });
  }

  const submitBtn = document.getElementById("techServiceSubmitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const form = document.getElementById("techServiceForm");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // 🔹 If reCAPTCHA is disabled, just submit normally
      if (!recaptchaEnabled) {
        console.warn("⚠️ reCAPTCHA disabled (test mode) — submitting form directly");
        form.submit();
        return;
      }

      // 🔹 Otherwise, run Enterprise reCAPTCHA
      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise
          .execute("6LemaIMrAAAAABkGmvhvmbRSO5BbXQq7AsLB7NGU", { action: "submit" })
          .then(function (token) {
            console.log("✅ Token received:", token);

            const tokenInput = document.createElement("input");
            tokenInput.type = "hidden";
            tokenInput.name = "g-recaptcha-response";
            tokenInput.value = token;
            form.appendChild(tokenInput);

            form.submit();
          })
          .catch((err) => {
            console.error("❌ reCAPTCHA failed:", err);
            alert("reCAPTCHA failed to initialize. Please try again.");
          });
      });
    });
  }
});

function validateTechnicalForm() {
  return true;
}
