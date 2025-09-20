import {products} from './productData.js';

export function filterProducts({
                                   searchTerm = '',
                                   category = '',
                                   minPrice = 0,
                                   maxPrice = Infinity,
                                   minRating = 0,
                                   inStockOnly = false
                               }) {
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) &&
        (!category || product.category === category) &&
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.rating >= minRating &&
        (!inStockOnly || product.stock > 0)
    );
}

export function sortProducts(filteredProducts, sortBy) {
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
