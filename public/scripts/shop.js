// public/shop.js

document.addEventListener('DOMContentLoaded', () => {

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
            productListing.innerHTML = '<p>No products found.</p>';
        } else {
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product_card');  // Apply the class for styling

                productElement.innerHTML = `
                    <img class="product-image" src="${product.image_url}" alt="${product.name}" />
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <a href="details.html?id=${product.id}" class="view-details-link">View Details</a>
                `;
                
                // Append the product to the listing
                productListing.appendChild(productElement);
            });
        }
    }

    // Fetch and display all products on initial load
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const productListing = document.getElementById('product_listing'); // make sure this id matches!!

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product_card'; // Use the same class for consistency

                const img = document.createElement('img');
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
        })
        .catch(error => console.error('Error fetching products:', error));
});