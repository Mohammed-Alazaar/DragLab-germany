document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown-menu-products");

  if (!dropdown) return; // exit if not found

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      dropdown.style.display = "none"; // hide when user scrolls
    } else {
      dropdown.style.display = ""; // show again when back at top
    }
  });
});

//      slideshow autoplay  
document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    if (slides.length === 0) return;

    function showSlides() {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove("show");
        });

        // Deactivate all dots
        dots.forEach(dot => {
            dot.classList.remove("activedot");
        });

        // Show current slide and dot
        slides[slideIndex].classList.add("show");
        dots[slideIndex].classList.add("activedot");

        // Move to next index
        slideIndex = (slideIndex + 1) % slides.length;
    }

    // Initial show
    slides[slideIndex].classList.add("show");
    dots[slideIndex].classList.add("activedot");

    // Start autoplay
    setInterval(showSlides, 5000);
});

// Product slider functionality
document.addEventListener("DOMContentLoaded", function () {
    // ✅ Slideshow logic
    let currentIndex = 0;
    const slidesWrapper = document.getElementById("slidesWrapper");
    const slides = document.querySelectorAll(".product-slide");

    function updateSlidePosition() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && slides.length > 0) {
            const slideWidth = slides[0].offsetWidth + 10;
            const offset = currentIndex * slideWidth;
            slidesWrapper.style.transform = `translateX(-${offset}px)`;
        } else {
            slidesWrapper.style.transform = 'none';
        }
    }

    function moveSlide(direction) {
        if (window.innerWidth <= 768 || slides.length === 0) return;
        const slidesPerPage = 2;
        const maxIndex = Math.max(0, slides.length - slidesPerPage);

        currentIndex += direction;

        if (currentIndex > maxIndex) currentIndex = 0;
        else if (currentIndex < 0) currentIndex = maxIndex;

        updateSlidePosition();
    }

    // ✅ Bind click events from JS instead of inline
    document.querySelectorAll(".slideshow-btn").forEach(btn => {
        const dir = parseInt(btn.dataset.dir, 10);
        btn.addEventListener("click", () => moveSlide(dir));
    });

    window.addEventListener("resize", updateSlidePosition);
    updateSlidePosition();
});

// Article slider functionality
document.addEventListener("DOMContentLoaded", function () {

    const articleWrapper = document.getElementById('articleSlidesWrapper');
    const articleSlides = document.querySelectorAll('.article-slide');
    let articleIndex = 0;

    function updateArticleSlides() {
        const isMobile = window.innerWidth <= 768;

        articleSlides.forEach((slide, i) => {
            slide.classList.remove('featured');

            // ✅ On mobile, all slides are 100% width
            if (isMobile) {
                slide.style.flex = '0 0 100%';
            } else {
                // ✅ On desktop, default 25%, featured is wider
                slide.style.flex = '0 0 25%';
            }
        });

        // ✅ Highlight featured slide
        if (articleSlides[articleIndex]) {
            articleSlides[articleIndex].classList.add('featured');

            if (!isMobile) {
                articleSlides[articleIndex].style.flex = '0 0 calc(50% - 5px)';
            }
        }

        if (isMobile) {
            const slideWidth = articleSlides[articleIndex]?.offsetWidth || 0;
            articleWrapper.scrollTo({
                left: slideWidth * articleIndex,
                behavior: 'smooth'
            });
        } else {
            const offset = 25 * articleIndex;
            articleWrapper.style.transform = `translateX(-${offset}%)`;
        }
    }


    function moveArticleSlide(direction) {
        articleIndex += direction;
        if (articleIndex < 0) articleIndex = articleSlides.length - 1;
        else if (articleIndex >= articleSlides.length) articleIndex = 0;
        updateArticleSlides();
    }

    document.querySelectorAll('[data-article-dir]').forEach(btn => {
        const dir = parseInt(btn.dataset.articleDir, 10);
        btn.addEventListener("click", () => moveArticleSlide(dir));
    });

    if (articleSlides.length > 0) {
        updateArticleSlides();
        setInterval(() => moveArticleSlide(1), 5000);
        window.addEventListener("resize", updateArticleSlides);
    }



});
