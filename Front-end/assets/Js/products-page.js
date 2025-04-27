document.getElementById('brand-select').addEventListener('change', applyFilters);
document.getElementById('color-select').addEventListener('change', applyFilters);
document.getElementById('category-select').addEventListener('change', applyFilters);
document.getElementById('memory-select').addEventListener('change', applyFilters);
document.getElementById('apply-price-filter').addEventListener('click', applyFilters);
document.getElementById('sort').addEventListener('change', applyFilters);
document.getElementById('clear-filters').addEventListener('click', clearFilters);

function applyFilters() {
    const brand = document.getElementById('brand-select').value;
    const color = document.getElementById('color-select').value;
    const category = document.getElementById('category-select').value;
    const memory = document.getElementById('memory-select').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const sort = document.getElementById('sort').value;

    let query = `?Company=${brand !== 'all' ? brand : ''}&color=${color !== 'all' ? color : ''}&category=${category !== 'all' ? category : ''}&InternalMemory=${memory !== 'all' ? memory : ''}`;

    if (minPrice) query += `&minPrice=${minPrice}`;
    if (maxPrice) query += `&maxPrice=${maxPrice}`;
    if (sort !== 'all') query += `&sort=${sort}`;

    window.location.href = `/products${query}`;
}

function clearFilters() {
    document.getElementById('brand-select').value = 'all';
    document.getElementById('color-select').value = 'all';
    document.getElementById('category-select').value = 'all';
    document.getElementById('memory-select').value = 'all';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('sort').value = 'all';

    applyFilters();
}

