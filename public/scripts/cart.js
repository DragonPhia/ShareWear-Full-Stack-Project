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
        cartItem.classList.add('cart_item');

        const image = document.createElement('img');
        image.src = item.image_url;
        image.alt = item.product_name;

        const itemDetails = document.createElement('div');

        const itemName = document.createElement('h4');
        itemName.textContent = item.product_name;

        const itemQuantity = document.createElement('p');
        itemQuantity.textContent = `Quantity: ${item.quantity}`;

        const pricePerItem = document.createElement('p');
        pricePerItem.textContent = `Price per item: $${item.price}`;

        const total = document.createElement('p');
        total.textContent = `Total: $${itemTotal.toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(cartId, item.cart_product_id);

        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemQuantity);
        itemDetails.appendChild(pricePerItem);
        itemDetails.appendChild(total);
        itemDetails.appendChild(removeButton);

        cartItem.appendChild(image);
        cartItem.appendChild(itemDetails);

        cartList.appendChild(cartItem);
      });

      // Calculate tax (6.75%) and delivery fee ($5.00)
      const taxRate = 6.75 / 100;
      const deliveryFee = 5.00;
      const taxAmount = subtotal * taxRate;
      const totalCost = subtotal + taxAmount + deliveryFee;

      // Displaying the checkout summary
      const checkoutSummary = document.getElementById('checkout-summary');
      const summaryContainer = document.createElement('div');

      const checkoutTitle = document.createElement('h2');
      checkoutTitle.textContent = 'Checkout';

      const subtotalText = document.createElement('h4');
      subtotalText.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

      const taxText = document.createElement('h4');
      taxText.textContent = `Tax (6.75%): $${taxAmount.toFixed(2)}`;

      const deliveryFeeText = document.createElement('h4');
      deliveryFeeText.textContent = `Delivery Fee: $${deliveryFee.toFixed(2)}`;

      const serviceFeeText = document.createElement('h4');
      serviceFeeText.textContent = `Service Fee: $0.00`;  // Modify as needed

      const totalText = document.createElement('h4');
      totalText.textContent = `Total: $${totalCost.toFixed(2)}`;

      const checkoutButtonContainer = document.createElement('div');
      checkoutButtonContainer.id = 'checkout';
      const checkoutButton = document.createElement('button');
      checkoutButton.textContent = 'Checkout';
      checkoutButton.onclick = checkoutCart;

      checkoutButtonContainer.appendChild(checkoutButton);

      summaryContainer.appendChild(checkoutTitle);
      summaryContainer.appendChild(subtotalText);
      summaryContainer.appendChild(taxText);
      summaryContainer.appendChild(deliveryFeeText);
      summaryContainer.appendChild(serviceFeeText);
      summaryContainer.appendChild(totalText);
      summaryContainer.appendChild(checkoutButtonContainer);

      checkoutSummary.appendChild(summaryContainer);
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