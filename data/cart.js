
export let cart = [{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity:2
},{
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity:1
}];

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
      quantity,
    });  
  };
}

export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem)=>{
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  })
  cart = newCart;
}