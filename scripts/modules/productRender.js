import { filteredProducts, medianPriceByCategory } from './productData.js';
import { createBadge } from './productBadges.js';

const productTemplate = document.getElementById('product-template');
const productGrid = document.getElementById('product-grid');

export function displayProducts(pageNumber, PAGE_SIZE) {
    window.scrollTo({top: 0, behavior: 'smooth'});
    productGrid.innerHTML = '';
    for (const product of filteredProducts.slice(PAGE_SIZE * (pageNumber - 1), PAGE_SIZE * pageNumber)) {
        const productElement = productTemplate.content.cloneNode(true);
        productElement.querySelector('.product__image').src = product.image.includes('picsum.photos')
            ? `${product.image}?random=${product.id}`
            : product.image;
        productElement.querySelector('.product__image').alt = product.name;
        productElement.querySelector('.product__name').textContent = product.name;
        productElement.querySelector('.product__price-number').textContent = product.price.toFixed(2);
        productElement.querySelector('.product__stock').textContent = product.stock > 0 ? 'В наличии' : 'Нет в наличии';

        let productRating = productElement.querySelector('.product__rating');
        productRating.textContent = product.rating.toFixed(2);

        if (product.rating <= 3) productRating.classList.add('product__rating--bad');
        else if (product.rating >= 4.5) productRating.classList.add('product__rating--good');
        else productRating.classList.add('product__rating--average');
        const badges = [];
        if (Date.now() - new Date(product.created_at) <= 30 * 24 * 60 * 60 * 1000) {
            badges.push(createBadge('✨Новинка', "new"));
        }
        if (product.rating >= 4.7 && product.reviews_count >= 50) {
            badges.push(createBadge('⬆️Топ-рейтинг', "top"));
        }
        if (badges.length < 2 && product.price / medianPriceByCategory[product.category] <= 0.85) {
            badges.push(createBadge('🪄Выгодно', "profit"));
        }
        if (badges.length < 2 && product.stock <= 3) {
            badges.push(createBadge('❕Последний на складе', "last"));
        }
        const badgeElement = productElement.querySelector('.product__badges');
        for (const badge of badges) {
            badgeElement.appendChild(badge);
        }
        productGrid.appendChild(productElement);
    }
}

