import {cart, removeFromCart, calculateCartQuantity, updateDeliveryOption} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOption.js';

export function renderOrderSummary(){
  let cartProductHTML ='';

  cart.forEach((cartItem)=>{ 
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();

    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartProductHTML += `
    <div class="cart-item-container js-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString};
      </div>
      <div class="cart-item-details-grid js-cart-item-container-${matchingProduct.id}">
        <img class="product-image"
          src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input">
            <span class="save-quantity-link link-primary js-save-link" data-product-id = "${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-linked-productid="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionHTML(matchingProduct,cartItem)}
      </div>
    </div>
  </div>`

  });

  // Generate HTML for delivery options
  function deliveryOptionHTML(matchingProduct,cartItem){ 

    let html = ''
    
    deliveryOptions.forEach((deliveryOption)=>{
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
      const priceString = deliveryOption.priceCents ===0 ? 'Free':`$${formatCurrency(deliveryOption.priceCents)} -`; // price == 0 return 'Free' otherwise return the price 

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" 
          ${isChecked ? 'checked': ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    })
    return html;
  }


  document.querySelector('.js-order-summary').innerHTML = cartProductHTML;

  document.querySelectorAll('.js-delete-link') // 刪除購物車項目 
  .forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.linkedProductid;
      console.log(productId);
      removeFromCart(productId);

      const html = document.querySelector(`.js-container-${productId}`);
      html.remove(); 
      
      calculateCartQuantity();

      renderPaymentSummary();
    });
  });

  calculateCartQuantity();

  document.querySelectorAll('.js-update-link')
  .forEach((updateLink)=>{
    updateLink.addEventListener('click',()=>{
      const productId = updateLink.dataset.productId;
      console.log(productId);
      const containerElement = document.querySelector(`.js-container-${productId}`)
      containerElement.classList.add('is-editing-quantity');

      updateLink.classList.add('is-editing-quantity');
      updateLink.classList.add('update-link-disappear');

    })
  })

  document.querySelectorAll('.js-save-link')
  .forEach((saveLink)=>{
    saveLink.addEventListener('click',()=>{
      const productId = saveLink.dataset.productId;

      const containerElement = document.querySelector(`.js-container-${productId}`);
      containerElement.classList.remove('is-editing-quantity');

      const input = document.querySelector('quantity-input');
      inputQuan = Number(input.value);
      renderPaymentSummary();
    })
  })

  // When select the delivery option, update the deliveryOptionId in cart, and update the page 
  document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
    element.addEventListener('click',()=>{
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary(); // recursion // Regenerate checkout HTML and replace previous HTML to have delivery date updated immediately when select delivery option  
    });
  });
};

