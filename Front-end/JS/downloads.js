document.addEventListener("DOMContentLoaded", function () {

    const filterButtons = document.querySelectorAll('.filter-button');
    const catalogCards = document.querySelectorAll('.catalog-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active-category'));
            button.classList.add('active-category');

            const category = button.getAttribute('data-category');

            catalogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || category === 'general') {
                    card.style.display = '';
                } else {
                    card.style.display = cardCategory === category ? '' : 'none';
                }
            });
        });
    });

    function trackDownload() {
        gtag('event', 'conversion', {
            'send_to': 'AW-754782155/Km5ZCI6_qIQaEMuf9OcC',
            'value': 1.0,
            'currency': 'USD'
        });
    }
});
