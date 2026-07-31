document.addEventListener('DOMContentLoaded', function () {
  var initialized = {};

  function initTinyMCE(lang) {
    if (initialized[lang] || typeof tinymce === 'undefined') return;
    tinymce.init({
      selector: '#body_' + lang,
      plugins: 'image link media table code lists',
      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image media link | code',
      height: 500
    });
    initialized[lang] = true;
  }

  function showTab(lang) {
    document.querySelectorAll('.lang-tab-content').forEach(function (el) {
      el.classList.remove('active');
    });
    document.querySelectorAll('.lang-tab-btn').forEach(function (el) {
      el.classList.remove('active');
    });
    var content = document.getElementById('tab-' + lang);
    if (content) content.classList.add('active');
    var btn = document.querySelector('.lang-tab-btn[data-lang="' + lang + '"]');
    if (btn) btn.classList.add('active');
    initTinyMCE(lang);
  }

  // Tab click
  document.querySelectorAll('.lang-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(this.dataset.lang);
    });
  });

  // Status button toggle
  document.querySelectorAll('.status-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang      = this.dataset.lang;
      var val       = this.dataset.val;
      var hidden    = document.getElementById('status_' + lang);
      var container = document.getElementById('status-btns-' + lang);

      if (hidden.value === val) {
        // toggle off → none
        hidden.value = 'none';
        container.querySelectorAll('.status-btn').forEach(function (b) {
          b.classList.remove('active');
        });
      } else {
        hidden.value = val;
        container.querySelectorAll('.status-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
      }

      // Update the tab dot
      updateTabDot(lang, hidden.value);
    });
  });

  function updateTabDot(lang, status) {
    var tabBtn = document.querySelector('.lang-tab-btn[data-lang="' + lang + '"]');
    if (!tabBtn) return;
    var dot = tabBtn.querySelector('.tab-dot');
    if (dot) dot.remove();
    if (status === 'published' || status === 'draft') {
      var newDot = document.createElement('span');
      newDot.className = 'tab-dot dot-' + status;
      tabBtn.insertBefore(newDot, tabBtn.firstChild);
    }
  }

  // Save all TinyMCE content before form submit
  var form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function () {
      if (typeof tinymce !== 'undefined') {
        tinymce.triggerSave();
      }
    });
  }

  // Initialize EN tab on load
  initTinyMCE('en');
});
