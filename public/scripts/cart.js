// cart.js
document.addEventListener('DOMContentLoaded', () => {
    const userId = 1; // Example static user/cart ID, replace with actual logic if needed
    fetch(`/carts/${userId}`)
      .then(response => response.json())
      .then(cartItems => {
        console.log('Cart Items:', cartItems);

        const cartList = document.getElementById('cart_list');
        let subtotal = 0;

        cartItems.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          const cartItem = document.createElement('div');
          cartItem.innerHTML = `
            <div class="cart_item">
              <img src="${item.image_url}" alt="${item.product_name}" />
              <div>
                <h4>${item.product_name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price per item: $${item.price}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${userId}, ${item.cart_product_id})">Remove</button>
              </div>
            </div>
          `;
          cartList.appendChild(cartItem);
        });

        // Calculate tax (6.75%) and delivery fee ($5.00)
        const taxRate = 6.75 / 100;
        const deliveryFee = 5.00;
        const taxAmount = subtotal * taxRate;
        const totalCost = subtotal + taxAmount + deliveryFee;

        // Displaying the checkout summary
        const checkoutSummary = document.getElementById('checkout-summary');
        checkoutSummary.innerHTML = `
            <h2>Checkout</h2>
            <h4>Subtotal: $${subtotal.toFixed(2)}</h4>
            <h4>Tax (6.75%): $${taxAmount.toFixed(2)}</h4>
            <h4>Delivery Fee: $${deliveryFee.toFixed(2)}</h4>
            <h4>Service Fee: $0.00</h4>  <!-- You can modify this if you have a service fee -->
            <h4>Total: $${totalCost.toFixed(2)}</h4>
            <form action="#">
                <button type="submit">Proceed to Checkout</button>
            </form>
        `;
      })
      .catch(error => console.error('Error loading cart:', error));
  });

function removeFromCart(cartId, cartProductId) {
    fetch(`/carts/${cartId}/products/${cartProductId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Removed from cart:', data);
      alert('Item removed from cart.');
      window.location.reload();
    })
    .catch(error => console.error('Error removing from cart:', error));
}

function checkoutCart() {
    const userId = 1; // Replace with actual user ID if needed

    // Step 1: Send request to backend to checkout and empty the cart
    fetch(`/carts/${userId}/checkout`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Checkout successful:', data);
        alert('Checkout successful! Your cart has been emptied.');

        // Step 2: After checkout, reload the page or update UI to reflect empty cart
        window.location.reload(); // This reloads the page to show the empty cart
    })
    .catch(error => {
        console.error('Error during checkout:', error);
        alert('There was an issue during checkout.');
    });
}