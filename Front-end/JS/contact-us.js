document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactus-form');
  if (!form) return;

  const btn = form.querySelector('.submit-btn');
  const originalText = btn ? btn.textContent : '';

  function setLoading(loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? '...' : originalText;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setLoading(true);

    // Safety net: if reCAPTCHA never calls back, re-enable after 10 seconds
    const fallback = setTimeout(function () {
      setLoading(false);
    }, 10000);

    grecaptcha.enterprise.ready(function () {
      grecaptcha.enterprise.execute('6LemaIMrAAAAABkGmvhvmbRSO5BbXQq7AsLB7NGU', { action: 'submit' })
        .then(function (token) {
          clearTimeout(fallback);
          form.querySelector('input[name="g-recaptcha-response"]').value = token;
          form.submit();
        })
        .catch(function () {
          clearTimeout(fallback);
          setLoading(false);
        });
    });
  });
});
