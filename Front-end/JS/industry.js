// Industry slider functionality
document.addEventListener("DOMContentLoaded", function () {
    let currentIndustryIndex = 0;
    const industryWrapper = document.getElementById("industrySlidesWrapper");
    const industrySlides = document.querySelectorAll(".industry-card");

    function updateIndustrySlidePosition() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && industrySlides.length > 0) {
            const slideWidth = industrySlides[0].offsetWidth + 20; // includes margin
            const offset = currentIndustryIndex * slideWidth;
            industryWrapper.style.transform = `translateX(-${offset}px)`;
        } else {
            industryWrapper.style.transform = 'none';
        }
    }

    function moveIndustrySlide(direction) {
        if (window.innerWidth <= 768 || industrySlides.length === 0) return;

        const slidesPerPage = 4; // ✅ changed from 2 to 4
        const maxIndex = Math.max(0, industrySlides.length - slidesPerPage);

        currentIndustryIndex += direction;

        if (currentIndustryIndex > maxIndex) currentIndustryIndex = 0;
        else if (currentIndustryIndex < 0) currentIndustryIndex = maxIndex;

        updateIndustrySlidePosition();
    }

    document.querySelectorAll(".industry-slideshow-btn").forEach(btn => {
        const dir = parseInt(btn.dataset.dir, 10);
        btn.addEventListener("click", () => moveIndustrySlide(dir));
    });

    window.addEventListener("resize", updateIndustrySlidePosition);
    updateIndustrySlidePosition();
});
