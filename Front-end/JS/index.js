document.addEventListener('DOMContentLoaded', function () {

  /* ── Utilities ─────────────────────────────────────────────────────────── */
  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* ── 0. Lazy image compression ──────────────────────────────────────────── */
  // For Cloudinary URLs: inject q_auto,f_auto,w_800 to let Cloudinary serve
  // a compressed/resized version. For all other URLs: use canvas to resize +
  // compress to JPEG 0.75 quality before displaying (CORS fallback to original).
  function optimizeSrc(src, maxW) {
    if (src && src.indexOf('res.cloudinary.com') !== -1 && src.indexOf('/upload/') !== -1) {
      return src.replace('/upload/', '/upload/q_auto,f_auto,w_' + maxW + '/');
    }
    return null; // non-Cloudinary: use canvas path
  }

  function compressAndLoad(img) {
    var src = img.dataset.src;
    if (!src) return;

    // Cloudinary: just swap to the optimized URL
    var cloudSrc = optimizeSrc(src, 800);
    if (cloudSrc) {
      img.src = cloudSrc;
      img.classList.add('img-loaded');
      return;
    }

    // Canvas compression for same-origin / other external images
    var offscreen = new Image();
    offscreen.crossOrigin = 'anonymous';
    offscreen.onload = function () {
      try {
        var maxWidth = 800;
        var ratio    = Math.min(1, maxWidth / offscreen.naturalWidth);
        var w = Math.round(offscreen.naturalWidth  * ratio);
        var h = Math.round(offscreen.naturalHeight * ratio);
        var canvas   = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(offscreen, 0, 0, w, h);
        img.src = canvas.toDataURL('image/jpeg', 0.75);
      } catch (e) {
        img.src = src; // CORS-tainted canvas fallback
      }
      img.classList.add('img-loaded');
    };
    offscreen.onerror = function () {
      img.src = src;
      img.classList.add('img-loaded');
    };
    offscreen.src = src;
  }

  var lazyImgs = document.querySelectorAll('img.img-lazy');
  if (lazyImgs.length > 0) {
    if ('IntersectionObserver' in window) {
      var lazyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          lazyObserver.unobserve(entry.target);
          compressAndLoad(entry.target);
        });
      }, { rootMargin: '200px 0px' });

      lazyImgs.forEach(function (img) { lazyObserver.observe(img); });
    } else {
      // Fallback: browsers without IntersectionObserver
      lazyImgs.forEach(function (img) { compressAndLoad(img); });
    }
  }

  /* ── 1. Hide nav dropdown on scroll ────────────────────────────────────── */
  var dropdown = document.querySelector('.dropdown-menu-products');
  if (dropdown) {
    window.addEventListener('scroll', function () {
      dropdown.style.display = window.scrollY > 0 ? 'none' : '';
    }, { passive: true });
  }

  /* ── 2. Hero slideshow ──────────────────────────────────────────────────── */
  var heroEl     = document.getElementById('slideshow');
  var heroSlides = heroEl ? heroEl.querySelectorAll('.slide')  : [];
  var heroDots   = heroEl ? heroEl.querySelectorAll('.dot')    : [];
  var heroTimer  = null;
  var heroIndex  = 0;
  var heroTotal  = heroSlides.length;

  function showHeroSlide(idx) {
    heroIndex = ((idx % heroTotal) + heroTotal) % heroTotal;
    heroSlides.forEach(function (s) { s.classList.remove('show'); });
    heroDots.forEach(function (d)   { d.classList.remove('activedot'); });
    heroSlides[heroIndex].classList.add('show');
    if (heroDots[heroIndex]) heroDots[heroIndex].classList.add('activedot');
  }

  function startHeroTimer() {
    if (heroTotal <= 1) return;
    heroTimer = setInterval(function () { showHeroSlide(heroIndex + 1); }, 6000);
  }
  function stopHeroTimer()  { clearInterval(heroTimer); }
  function resetHeroTimer() { stopHeroTimer(); startHeroTimer(); }

  // Dot clicks
  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showHeroSlide(parseInt(this.dataset.idx, 10));
      resetHeroTimer();
    });
  });

  // Arrow buttons
  var heroPrev = heroEl && heroEl.querySelector('.hero-prev');
  var heroNext = heroEl && heroEl.querySelector('.hero-next');
  if (heroPrev) heroPrev.addEventListener('click', function () { showHeroSlide(heroIndex - 1); resetHeroTimer(); });
  if (heroNext) heroNext.addEventListener('click', function () { showHeroSlide(heroIndex + 1); resetHeroTimer(); });

  // Touch swipe
  if (heroEl) {
    var touchX = 0;
    heroEl.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) {
        showHeroSlide(heroIndex + (dx < 0 ? 1 : -1));
        resetHeroTimer();
      }
    }, { passive: true });
  }

  startHeroTimer();

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stopHeroTimer() : startHeroTimer();
  });

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

    document.querySelectorAll('[data-article-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () { moveArticleSlide(parseInt(btn.dataset.articleDir, 10)); });
    });

    window.addEventListener('resize', debounce(updateArticleSlides, 150), { passive: true });

    updateArticleSlides();
  }

});
