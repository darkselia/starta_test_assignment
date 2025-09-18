const form = document.getElementById('import-form');
const fileInput = document.getElementById('import-products');

form.addEventListener('submit', event => {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
        alert('Пожалуйста, выберите файл для импорта.');
        return;
    }
    importProducts(file);
});

/**
 * Import products from a CSV file.
 * @param {File} file
 */
async function importProducts(file) {
    const formData = new FormData;
    formData.append('file', file);
    try {
        const response = await fetch('/api/import.php', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            alert('Ошибка сети: ' + response.statusText);
            return;
        }
        alert('Товары успешно импортированы!');
    } catch (error) {
        alert('Ошибка на сервере при импорте товаров: ' + error.message);
    }
}