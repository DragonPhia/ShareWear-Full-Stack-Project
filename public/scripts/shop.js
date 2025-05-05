// public/scripts/shop.js
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate the category dropdown
    fetch('/categories')
        .then(res => res.json())
        .then(categories => {
            const dropdown = document.getElementById('dropdown');
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All';
            dropdown.appendChild(defaultOption); // Add "All" option

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id; // use category ID for filtering
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

    // Handle form submission for product search
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission behavior

        const query = document.getElementById('searchInput').value;  // Get the search input value
        searchProducts(query);  // Call the function to search products
    });

    // Function to fetch products from the backend based on the search query
    function searchProducts(query) {
        fetch(`/products/search?q=${query}`)
            .then(response => response.json())
            .then(products => {
                displayProducts(products);  // Display the search results
            })
            .catch(error => {
                console.error('Error searching products:', error);
            });
    }

    // Function to display the products
    function displayProducts(products) {
        const productListing = document.getElementById('product_listing');
        productListing.innerHTML = '';  // Clear existing product listings

        if (products.length === 0) {
            const noProductsMessage = document.createElement('p');
            noProductsMessage.textContent = 'No products found.';
            productListing.appendChild(noProductsMessage);
        } else {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');  // Apply the class for styling

                const img = document.createElement('img');
                img.classList.add('product-image');
                img.src = product.image_url;
                img.alt = product.name;

                const title = document.createElement('h3');
                title.textContent = product.name;

                const price = document.createElement('p');
                price.textContent = `$${product.price.toFixed(2)}`;

                const link = document.createElement('a');
                link.href = `details.html?id=${product.id}`;
                link.textContent = 'View Details';
                link.classList.add('view-details-link');  // Added for styling consistency

                // Add everything inside the card
                productCard.appendChild(img);
                productCard.appendChild(title);
                productCard.appendChild(price);
                productCard.appendChild(link);

                // Add card to the product listing
                productListing.appendChild(productCard);
            });
        }
    }

    // Fetch and display all products on initial load
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));
});