document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const langInput = document.getElementById("newsletterLang");
  const messageBox = document.getElementById("newsletterMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const language = langInput.value;

    if (!email) {
      messageBox.textContent = "Please enter a valid email.";
      return;
    }

    try {
      const res = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, language })
      });

      if (res.ok) {
        messageBox.textContent = "✔️ Subscribed successfully!";
        emailInput.value = "";
      } else {
        messageBox.textContent = "❌ Subscription failed. Try again.";
      }
    } catch (err) {
      console.error("Subscription error:", err);
      messageBox.textContent = "❌ Something went wrong.";
    }
  });
});
