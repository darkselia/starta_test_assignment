import {fetchProducts, products, filteredProducts} from './modules/productData.js';
import {displayProducts} from './modules/productRender.js';
import {filterProducts, sortProducts} from './modules/productFilters.js';

const urlParams = new URLSearchParams(window.location.search);

const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const pageNumberDisplay = document.getElementById('page-number');
const PAGE_SIZE = 12;

const filterForm = document.getElementById('filters');
const searchInput = document.getElementById('search');
searchInput.value = urlParams.get('q') ?? '';
const categorySelect = document.getElementById('category');
categorySelect.value = urlParams.get('cat') ?? '';
const minPriceInput = document.getElementById('min-price');
minPriceInput.value = urlParams.get('min') ?? '';
const maxPriceInput = document.getElementById('max-price');
maxPriceInput.value = urlParams.get('max') ?? '';
const minRatingInput = document.getElementById('min-rating');
minRatingInput.value = urlParams.get('rating') ?? '';
const inStockOnlyInput = document.getElementById('in-stock');
inStockOnlyInput.checked = urlParams.get('inStock') === '1';

const sortSelect = document.getElementById('sort-by');
sortSelect.value = urlParams.get('sort') || 'date-desc';

let pageNumber = Number(urlParams.get('page')) || 1;

function updatePagination() {
    previousButton.disabled = pageNumber === 1;
    nextButton.disabled = pageNumber * PAGE_SIZE >= filteredProducts.length;
    pageNumberDisplay.textContent = `Страница ${pageNumber}`;
}

function preserveState() {
    const state = new URLSearchParams();
    state.set('q', searchInput.value);
    state.set('cat', categorySelect.value);
    state.set('min', minPriceInput.value);
    state.set('max', maxPriceInput.value);
    state.set('rating', minRatingInput.value);
    state.set('inStock', inStockOnlyInput.checked ? '1' : '0');
    state.set('sort', sortSelect.value);
    state.set('page', pageNumber.toString());
    const newUrl = `?${state}`;
    window.history.pushState({}, '', newUrl);
}

function applyFiltersAndDisplay() {
    let params = {
        searchTerm: searchInput.value.toLowerCase(),
        category: categorySelect.value,
        minPrice: minPriceInput.value ? parseFloat(minPriceInput.value) : 0,
        maxPrice: maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity,
        minRating: minRatingInput.value ? parseFloat(minRatingInput.value) : 0,
        inStockOnly: inStockOnlyInput.checked
    };
    let filtered = filterProducts(params);
    sortProducts(filtered, sortSelect.value);
    filteredProducts.length = 0;
    filteredProducts.push(...filtered);
    updatePagination();
    displayProducts(pageNumber, PAGE_SIZE);
    setTimeout(preserveState, 0);
}

updatePagination();
fetchProducts().then(applyFiltersAndDisplay);

previousButton.addEventListener('click', () => {
    pageNumber--;
    updatePagination();
    displayProducts(pageNumber, PAGE_SIZE);
    preserveState();
});
nextButton.addEventListener('click', () => {
    pageNumber++;
    updatePagination();
    displayProducts(pageNumber, PAGE_SIZE);
    preserveState();
});

filterForm.addEventListener('submit', event => {
    event.preventDefault();
    pageNumber = 1;
    applyFiltersAndDisplay();
});

filterForm.addEventListener('reset', () => {
    filteredProducts.length = 0;
    filteredProducts.push(...products);
    pageNumber = 1;
    setTimeout(applyFiltersAndDisplay,0);
});

sortSelect.addEventListener('change', () => {
    pageNumber = 1;
    applyFiltersAndDisplay();
});
