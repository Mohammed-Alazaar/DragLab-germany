

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ technical-service.js loaded");

  const body = document.body;
  const lang = body.dataset.lang || "EN";
  const selectOptionText = body.dataset.selectOption || "Select";
  const recaptchaEnabled = body.dataset.recaptchaEnabled === "true";

  const categorySelect = document.getElementById("deviceCategory");
  const modelSelect = document.getElementById("deviceModel");

  // 🔹 simple in-memory cache: { productId: [ { _id, ModelName }, ... ] }
  const modelsCache = {};

  function fillModelSelect(models) {
    // Clear current options
    while (modelSelect.options.length > 0) modelSelect.remove(0);

    // Placeholder
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = selectOptionText;
    modelSelect.appendChild(placeholder);

    // Add models
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model._id;
      option.textContent = model.ModelName;
      modelSelect.appendChild(option);
    });
  }

  if (categorySelect && modelSelect) {
    categorySelect.addEventListener("change", async function () {
      const productId = this.value;

      // Empty + placeholder
      fillModelSelect([]);

      if (!productId) return;

      // ✅ If cached → instant
      if (modelsCache[productId]) {
        fillModelSelect(modelsCache[productId]);
        return;
      }

      // Optional: show “Loading…” placeholder
      const loadingOption = document.createElement("option");
      loadingOption.value = "";
      loadingOption.textContent = "Loading...";
      modelSelect.appendChild(loadingOption);

      try {
        const res = await fetch(`/api/models/${encodeURIComponent(productId)}?lang=${encodeURIComponent(lang)}`);
        if (!res.ok) throw new Error("Failed to fetch models");

        const data = await res.json();
        const models = Array.isArray(data.models) ? data.models : [];

        // Cache result
        modelsCache[productId] = models;

        fillModelSelect(models);
      } catch (err) {
        console.error("Error fetching models:", err);
        // Optional: show error state
        fillModelSelect([]);
        const errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Error loading models";
        modelSelect.appendChild(errorOption);
      }
    });
  }

  // ... (rest of your reCAPTCHA + submit code stays the same)
});


// ===============================
// Submit with optional reCAPTCHA
// ===============================
const submitBtn = document.getElementById("techServiceSubmitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    const form = document.getElementById("techServiceForm");
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

 

    // Safety: grecaptcha may not be ready if script failed
    if (!window.grecaptcha || !grecaptcha.enterprise) {
      console.error("❌ reCAPTCHA not available on window");
      alert("reCAPTCHA failed to load. Please refresh the page and try again.");
      return;
    }

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

// For any old inline/HTML references; kept as no-op hook
function validateTechnicalForm() {
  return true;
}
