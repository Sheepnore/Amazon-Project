export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity:2,
    deliveryOptionId: '1',
  },{
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity:1,
    deliveryOptionId: '2', 
  }];  
}

export function addToCart(productId){
  let matchingItem;

  cart.forEach((cartItem)=>{
    if (productId === cartItem.productId){ // 選定的產品的productId 若有在cart裡，
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(quantitySelector.value);

  if (matchingItem){ // if we find the item in cart, it's a object which is truthy value      
    matchingItem.quantity +=quantity;
  }
  else{
    cart.push({
      productId,
      quantity:1,
      deliveryOptionId:'1',
    });  
  };
  saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem)=>{
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    };
  });
  cart = newCart;
  saveToStorage();
};

export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart)) // save cart item into localStorage in string 
};

export function calculateCartQuantity(){
    let quantity=0;
      cart.forEach((cartItem)=>{
        quantity += cartItem.quantity;
      });

  };

export function updateQuantity(productId, newQuantity){
  cart.forEach((item)=>{
    if (item.id === productId){
      item.quantity = newQuantity;
    }
  })
}

// When update the deliveryOption, we need to know 1. product we want to update and 2. delivery option that we chose
// Steps: 1. Loop thru cart and find product 2. Update the deliveryOptionId of the product
export function updateDeliveryOption(productId, deliveryOptionId){ 

  let matchingItem;
  cart.forEach((cartItem)=>{
    if (productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}