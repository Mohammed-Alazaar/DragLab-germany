document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactus-form');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    grecaptcha.enterprise.ready(function () {
      grecaptcha.enterprise.execute('6LemaIMrAAAAABkGmvhvmbRSO5BbXQq7AsLB7NGU', { action: 'submit' }).then(function (token) {
        form.querySelector('input[name="g-recaptcha-response"]').value = token;
        form.submit();
      });
    });
  });
});
