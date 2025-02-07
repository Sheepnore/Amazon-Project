import {cart, removeFromCart, updateDeliveryOption,saveToStorage} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {calculateDeliveryDate, deliveryOptions, getDeliveryOption} from '../../data/deliveryOption.js';
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary(){
  let cartProductHTML ='';

  cart.forEach((cartItem)=>{ 
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    calculateDeliveryDate(deliveryOption);

    cartProductHTML += `
    <div class="cart-item-container js-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${calculateDeliveryDate(deliveryOption)};
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
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
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
              ${calculateDeliveryDate(deliveryOption)}
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
      removeFromCart(productId);

      renderOrderSummary();
      renderCheckoutHeader()    
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader()

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

      //let cart = JSON.parse(localStorage.getItem('cart'));

      const productId = saveLink.dataset.productId;

      const containerElement = document.querySelector(`.js-container-${productId}`);

      const inputElement = document.querySelector(`.js-quantity-input-${productId}`);

      const inputQuantity = Number(inputElement.value);

      let matchingProduct={};

      cart.forEach((item)=>{
        if (item.productId === productId){
          matchingProduct = item;
        }
      })      

      matchingProduct.quantity = inputQuantity;

      cart.forEach((item)=>{
        if (item.id === productId){
          item = matchingProduct;
        }
      })

      const quantityText = document.querySelector(`.js-quantity-label-${productId}`);

      quantityText.innerHTML = inputQuantity;

      containerElement.classList.remove('is-editing-quantity');

      console.log(cart);


      renderCheckoutHeader()

      saveToStorage();
  

      renderPaymentSummary();
    });
  });


  console.log(cart);
 
  // When select the delivery option, update the deliveryOptionId in cart, and update the page 
  document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
    element.addEventListener('click',()=>{
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary(); // recursion // Regenerate checkout HTML and replace previous HTML to have delivery date updated immediately when select delivery option  
      renderPaymentSummary();
    });
  });
};

