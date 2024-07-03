export const cart = [];

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
