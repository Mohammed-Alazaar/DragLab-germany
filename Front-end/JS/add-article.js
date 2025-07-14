
document.addEventListener('DOMContentLoaded', function () {
  if (typeof tinymce !== 'undefined') {
    tinymce.init({
      selector: '#articleBody',
      plugins: 'image link media table code lists',
      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image media link | code',
      height: 500
    });
  }
});
