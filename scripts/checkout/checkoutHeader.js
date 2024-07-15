import {cart} from '../../data/cart.js';

export function renderCheckoutHeader(){
  const checkoutElement = document.querySelector('.js-checkout-header');

  let quantity=0;

  cart.forEach(cartItem => {
    quantity += cartItem.quantity;
  });

  let html = 
  `
  <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>

        <div class="checkout-header-middle-section js-checkout-quantity">
          Checkout (${quantity} items)
        </div>

        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
  `
  checkoutElement.innerHTML = html
}