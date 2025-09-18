const productTemplate = document.getElementById('product-template');
const productGrid = document.getElementById('product-grid');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const pageNumberDisplay = document.getElementById('page-number');
const PAGE_SIZE = 12;

let products = [];
let pageNumber = 1;

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

function updatePagination() {
    previousButton.disabled = pageNumber === 1;
    nextButton.disabled = pageNumber * PAGE_SIZE >= products.length;
    pageNumberDisplay.textContent = `Страница ${pageNumber}`;
}

async function fetchProducts() {
    try {
        const response = await fetch('/api/products.json');
        products = await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function displayProducts() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    productGrid.innerHTML = '';
    for (const product of products.slice(PAGE_SIZE * (pageNumber - 1), PAGE_SIZE * pageNumber)) {
        const productElement = productTemplate.content.cloneNode(true);
        productElement.querySelector('.product__image').src = product.image;
        productElement.querySelector('.product__image').alt = product.name;
        productElement.querySelector('.product__name').textContent = product.name;
        productElement.querySelector('.product__price').textContent = `$${product.price.toFixed(2)}`;
        productElement.querySelector('.product__rating').textContent = product.rating.toFixed(2);
        productElement.querySelector('.product__stock').textContent = product.stock > 0 ? 'In Stock' : 'Out of Stock';
        productGrid.appendChild(productElement);
    }
}

updatePagination();
fetchProducts().then(displayProducts).then(updatePagination);
