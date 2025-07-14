window.onSubmit = function (token) {
  const form = document.getElementById("contactus-form");
  if (form.checkValidity()) {
    form.submit();
  } else {
    form.reportValidity();
  }
};


if (window.location.search.includes('success')) {
  gtag('event', 'conversion', {
    send_to: 'AW-754782155/Km5ZCI6_qIQaEMuf9OcC',
    value: 1.0,
    currency: 'USD',
    transaction_id: ''
  });
}
