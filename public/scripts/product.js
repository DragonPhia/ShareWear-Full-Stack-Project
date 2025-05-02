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
      productDetails.innerHTML = `
        <div id="details_card">
          <img src="${product.image_url}" alt="${product.name}" />
          <div id="details">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>Category:</strong> ${product.category_name || 'Uncategorized'}</p>
            <p>Price: <strong>$${product.price}</strong></p>
            <button onclick="addToCart(${product.id}, ${product.price})">Add to Cart</button>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
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