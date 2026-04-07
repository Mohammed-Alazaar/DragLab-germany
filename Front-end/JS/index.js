document.addEventListener('DOMContentLoaded', function () {

  /* ── Utilities ─────────────────────────────────────────────────────────── */
  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* ── 1. Hide nav dropdown on scroll ────────────────────────────────────── */
  var dropdown = document.querySelector('.dropdown-menu-products');
  if (dropdown) {
    window.addEventListener('scroll', function () {
      dropdown.style.display = window.scrollY > 0 ? 'none' : '';
    }, { passive: true });
  }

  /* ── 2. Hero slideshow ──────────────────────────────────────────────────── */
  var slides     = document.querySelectorAll('.slide');
  var dots       = document.querySelectorAll('.dot');
  var heroTimer  = null;
  var heroIndex  = 0;

  if (slides.length > 1) {
    function showHeroSlide(idx) {
      slides.forEach(function (s) { s.classList.remove('show'); });
      dots.forEach(function (d)   { d.classList.remove('activedot'); });
      slides[idx].classList.add('show');
      if (dots[idx]) dots[idx].classList.add('activedot');
    }

    function nextHeroSlide() {
      heroIndex = (heroIndex + 1) % slides.length;
      showHeroSlide(heroIndex);
    }

    function startHeroTimer() { heroTimer = setInterval(nextHeroSlide, 5000); }
    function stopHeroTimer()  { clearInterval(heroTimer); }

    startHeroTimer();

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stopHeroTimer() : startHeroTimer();
    });
  }

  /* ── 3. Product slideshow ───────────────────────────────────────────────── */
  var slidesWrapper   = document.getElementById('slidesWrapper');
  var productSlides   = document.querySelectorAll('.product-slide');
  var productIndex    = 0;

  function updateProductPosition() {
    if (!slidesWrapper || productSlides.length === 0) return;
    if (window.innerWidth <= 768) {
      slidesWrapper.style.transform = 'none';
      return;
    }
    var slideWidth = productSlides[0].offsetWidth + 10;
    slidesWrapper.style.transform = 'translateX(-' + (productIndex * slideWidth) + 'px)';
  }

  function moveProductSlide(direction) {
    if (window.innerWidth <= 768 || productSlides.length === 0) return;
    var maxIndex = Math.max(0, productSlides.length - 2);
    productIndex = Math.min(Math.max(productIndex + direction, 0), maxIndex);
    if (productIndex > maxIndex) productIndex = 0;
    if (productIndex < 0)        productIndex = maxIndex;
    updateProductPosition();
  }

  document.querySelectorAll('.slideshow-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { moveProductSlide(parseInt(btn.dataset.dir, 10)); });
  });

  window.addEventListener('resize', debounce(updateProductPosition, 150), { passive: true });
  updateProductPosition();

  /* ── 4. Article slideshow ───────────────────────────────────────────────── */
  var articleWrapper = document.getElementById('articleSlidesWrapper');
  var articleSlides  = document.querySelectorAll('.article-slide');
  var articleIndex   = 0;
  var articleTimer   = null;

  if (articleSlides.length > 0 && articleWrapper) {

    function updateArticleSlides() {
      var isMobile = window.innerWidth <= 780;

      requestAnimationFrame(function () {
        // Toggle .featured class only — CSS handles the flex-basis sizing
        articleSlides.forEach(function (s) { s.classList.remove('featured'); });
        articleSlides[articleIndex].classList.add('featured');

        if (isMobile) {
          var slideWidth = articleSlides[articleIndex].offsetWidth || 0;
          articleWrapper.scrollTo({ left: slideWidth * articleIndex, behavior: 'smooth' });
        } else {
          articleWrapper.style.transform = 'translateX(-' + (25 * articleIndex) + '%)';
        }
      });
    }

    function moveArticleSlide(direction) {
      articleIndex = (articleIndex + direction + articleSlides.length) % articleSlides.length;
      updateArticleSlides();
    }

    function startArticleTimer() { articleTimer = setInterval(function () { moveArticleSlide(1); }, 5000); }
    function stopArticleTimer()  { clearInterval(articleTimer); }

    document.querySelectorAll('[data-article-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () { moveArticleSlide(parseInt(btn.dataset.articleDir, 10)); });
    });

    window.addEventListener('resize', debounce(updateArticleSlides, 150), { passive: true });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stopArticleTimer() : startArticleTimer();
    });

    updateArticleSlides();
    startArticleTimer();
  }

});
