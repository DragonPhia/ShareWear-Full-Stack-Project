// public/scripts/shop.js
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'cur_live_bK2LdX2J9yt8sQKA2VArrZT9EdCSaGvLwNhEwWWM';
    let exchangeRates = {};
    let selectedCurrency = 'USD';

    // Fetch and populate the category dropdown
    fetch('/categories')
        .then(res => res.json())
        .then(categories => {
            const dropdown = document.getElementById('dropdown');
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All';
            dropdown.appendChild(defaultOption);

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                dropdown.appendChild(option);
            });
        });

    document.getElementById('dropdown').addEventListener('change', function () {
        const categoryId = this.value;

        if (categoryId === '') {
            fetch('/products')
                .then(res => res.json())
                .then(displayProducts)
                .catch(err => console.error('Error fetching all products:', err));
        } else {
            fetch(`/products/category/${categoryId}`)
                .then(res => res.json())
                .then(displayProducts)
                .catch(err => console.error('Error fetching category products:', err));
        }
    });

    // Currency dropdown
    document.getElementById('currency').addEventListener('change', function () {
        selectedCurrency = this.value;
        fetch('/products')
            .then(response => response.json())
            .then(displayProducts)
            .catch(error => console.error('Error fetching products:', error));
    });

    // Get latest exchange rates
    fetch(`https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=USD`)
        .then(res => res.json())
        .then(data => {
            exchangeRates = data.data;
        })
        .catch(error => console.error('Error fetching exchange rates:', error));

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value;
        searchProducts(query);
    });

    function searchProducts(query) {
        fetch(`/products/search?q=${query}`)
            .then(response => response.json())
            .then(products => displayProducts(products))
            .catch(error => console.error('Error searching products:', error));
    }

    function displayProducts(products) {
        const productListing = document.getElementById('product_listing');
        productListing.innerHTML = '';

        if (products.length === 0) {
            const noProductsMessage = document.createElement('p');
            noProductsMessage.textContent = 'No products found.';
            productListing.appendChild(noProductsMessage);
        } else {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');

                const img = document.createElement('img');
                img.classList.add('product-image');
                img.src = product.image_url;
                img.alt = product.name;

                const title = document.createElement('h3');
                title.textContent = product.name;

                const price = document.createElement('p');
                let convertedPrice = product.price;

                if (selectedCurrency !== 'USD' && exchangeRates[selectedCurrency]) {
                    convertedPrice *= exchangeRates[selectedCurrency].value;
                }

                price.textContent = `${selectedCurrency} ${convertedPrice.toFixed(2)}`;

                const link = document.createElement('a');
                link.href = `details.html?id=${product.id}`;
                link.textContent = 'View Details';
                link.classList.add('view-details-link');

                productCard.appendChild(img);
                productCard.appendChild(title);
                productCard.appendChild(price);
                productCard.appendChild(link);
                productListing.appendChild(productCard);
            });
        }
    }

    fetch('/products')
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => console.error('Error fetching products:', error));
});