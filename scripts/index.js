const productTemplate = document.getElementById('product-template');
const productGrid = document.getElementById('product-grid');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const pageNumberDisplay = document.getElementById('page-number');
const PAGE_SIZE = 12;

const filterForm = document.getElementById('filters');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minRatingInput = document.getElementById('min-rating');
const inStockOnlyInput = document.getElementById('in-stock');

const sortSelect = document.getElementById('sort-by');

let products = [];
let filteredProducts = [];
let pageNumber = 1;

function updatePagination() {
    previousButton.disabled = pageNumber === 1;
    nextButton.disabled = pageNumber * PAGE_SIZE >= filteredProducts.length;
    pageNumberDisplay.textContent = `Страница ${pageNumber}`;
}

async function fetchProducts() {
    try {
        const response = await fetch('/api/products.json');
        products = await response.json();
        filteredProducts = products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function displayProducts() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    productGrid.innerHTML = '';
    for (const product of filteredProducts.slice(PAGE_SIZE * (pageNumber - 1), PAGE_SIZE * pageNumber)) {
        const productElement = productTemplate.content.cloneNode(true);
        productElement.querySelector('.product__image').src = product.image.includes('picsum.photos')
            ? `${product.image}?random=${product.id}`
            : product.image;
        /*productElement.querySelector('.product__image').src = product.image;*/
        productElement.querySelector('.product__image').alt = product.name;
        productElement.querySelector('.product__name').textContent = product.name;
        productElement.querySelector('.product__price').textContent = product.price.toFixed(2);
        let productRating = productElement.querySelector('.product__rating');
        productRating.textContent = product.rating.toFixed(2);
        if (product.rating <= 3) productRating.classList.add('product__rating_bad');
        else if (product.rating >= 4.5) productRating.classList.add('product__rating_good');
        else productRating.classList.add('product__rating_average');


        productElement.querySelector('.product__stock').textContent = product.stock > 0 ? 'In Stock' : 'Out of Stock';
        productGrid.appendChild(productElement);
    }
}

function sortProducts() {
    const sortBy = sortSelect.value;
    switch (sortBy) {
        case 'date-asc':
            filteredProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'date-desc':
            filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-asc':
            filteredProducts.sort((a, b) => a.rating - b.rating);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;

    }
}

updatePagination();
fetchProducts().then(displayProducts).then(updatePagination);

previousButton.addEventListener('click', () => {
    pageNumber--;
    updatePagination();
    displayProducts();
});
nextButton.addEventListener('click', () => {
    pageNumber++;
    updatePagination();
    displayProducts();
});

filterForm.addEventListener('submit', event => {
    event.preventDefault();

    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;
    const minRating = minRatingInput.value ? parseFloat(minRatingInput.value) : 0;
    const inStockOnly = inStockOnlyInput.checked;

    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) &&
        (!category || product.category === category) &&
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.rating >= minRating &&
        (!inStockOnly || product.stock > 0)
    );
    pageNumber = 1;
    updatePagination();
    displayProducts();
});

filterForm.addEventListener('reset', () => {
    filteredProducts = products;
    pageNumber = 1;
    updatePagination();
    displayProducts();
});

sortSelect.addEventListener('change', () => {
    sortProducts();
    pageNumber = 1;
    updatePagination();
    displayProducts();
})

