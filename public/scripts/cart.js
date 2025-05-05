// scripts/cart.js
let currentCartId = null;

document.addEventListener('DOMContentLoaded', () => {
  const userId = 1;

  fetch(`/carts/${userId}`)
    .then(response => response.json())
    .then(data => {
      const { cartId, items } = data;
      currentCartId = cartId; // Save cartId for later checkout

      if (!cartId) {
        console.warn('No active cart found');
        return;
      }

      const cartList = document.getElementById('cart_list');
      let subtotal = 0;

      items.forEach(item => {
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
              <button onclick="removeFromCart(${cartId}, ${item.cart_product_id})">Remove</button>
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
            <div id="checkout">
              <button onclick="checkoutCart()">Checkout</button>
            </div>
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
  if (!currentCartId) {
      alert('No cart available to checkout.');
      return;
  }

  fetch(`/carts/${currentCartId}/checkout`, {
      method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
      console.log('Checkout successful:', data);
      alert('Checkout successful! Your cart has been emptied.');
      window.location.reload();
  })
  .catch(error => {
      console.error('Error during checkout:', error);
      alert('There was an issue during checkout.');
  });
}