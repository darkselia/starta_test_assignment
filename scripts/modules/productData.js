/** @typedef {Object} Product
 *  @property {number} id
 *  @property {string} name
 *  @property {string} category
 *  @property {number} price
 *  @property {number} stock
 *  @property {number} rating
 *  @property {string} image
 *  @property {string} created_at
 *  @property {number} reviews_count
 */

export const medianPriceByCategory = {};

/** @type {Product[]} */
export let products = [];
/** @type {Product[]} */
export let filteredProducts = [];

export async function fetchProducts() {
    try {
        const response = await fetch('/api/products.json');
        products = await response.json();
        filteredProducts = products.slice();

        const pricesByCategory = {};
        for (const product of products) {
            if (!pricesByCategory[product.category]) {
                pricesByCategory[product.category] = [];
            }
            pricesByCategory[product.category].push(product.price);
        }
        for (const category in pricesByCategory) {
            const prices = pricesByCategory[category].sort((a, b) => a - b);
            const mid = Math.floor(prices.length / 2);
            medianPriceByCategory[category] = prices.length % 2 !== 0
                ? prices[mid]
                : (prices[mid - 1] + prices[mid]) / 2;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
