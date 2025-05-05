// product.js
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  console.log('Product ID from URL:', productId);

  fetch(`/products/${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    })
    .then(product => {
      console.log('Fetched single product:', product);
      
      const productDetails = document.getElementById('product-details');
      productDetails.innerHTML = '';  // Clear previous content

      const detailsCard = document.createElement('div');
      detailsCard.id = 'details_card';

      const productImage = document.createElement('img');
      productImage.src = product.image_url;
      productImage.alt = product.name;

      const detailsDiv = document.createElement('div');
      detailsDiv.id = 'details';

      const productName = document.createElement('h2');
      productName.textContent = product.name;

      const productDescription = document.createElement('p');
      productDescription.textContent = product.description;

      const productCategory = document.createElement('p');
      productCategory.innerHTML = `<strong>Category:</strong> ${product.category_name || 'Uncategorized'}`;

      const productPrice = document.createElement('p');
      productPrice.innerHTML = `Price: <strong>$${product.price}</strong>`;

      detailsDiv.appendChild(productName);
      detailsDiv.appendChild(productDescription);
      detailsDiv.appendChild(productCategory);
      detailsDiv.appendChild(productPrice);

      // Add "Is Featured" info if the product is featured
      if (product.is_featured) {
        const isFeatured = document.createElement('p');
        isFeatured.innerHTML = `<strong>Featured:</strong> Yes`;
        detailsDiv.appendChild(isFeatured);
      }

      const addToCartButton = document.createElement('button');
      addToCartButton.textContent = 'Add to Cart';
      addToCartButton.onclick = () => addToCart(product.id, product.price);
      detailsDiv.appendChild(addToCartButton);

      detailsCard.appendChild(productImage);
      detailsCard.appendChild(detailsDiv);

      productDetails.appendChild(detailsCard);
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      const productDetails = document.getElementById('product-details');
      productDetails.innerHTML = '<p>Product not found.</p>';
    });
});

function addToCart(productId, price) {
  const userId = 1; // Static user ID for now, replace as needed
  const quantity = 1;

  fetch(`/carts/${userId}/products/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: quantity })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Added to cart:', data);
      alert('Product added to cart!');
    })
    .catch(error => console.error('Error adding to cart:', error));
}