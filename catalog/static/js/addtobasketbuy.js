// Saves the contents of the shopping cart as you shop and visit different pages on the site
// Author: Charles Umesi

// Relevant selectors (not yet stored in variables)
const circle = document.querySelector('.circle');
let shouldBeH2ButDecidedP = document.querySelector('.should-be-h2-but-decided-p');
let code = document.querySelector('.code');
let mode = document.querySelector('.mode');
const currency = document.querySelector('.currency');
let price = document.querySelector('.price');
let quantity = document.getElementById('quantity');
const addToBasketBuy = document.getElementById('add-to-basket-buy');

// Linking the quantity selected (to buy) and 'click' with the shopping cart tally (using the browser's inbuilt local and session storages)
if (localStorage.tally != undefined) {
  circle.style.display = "unset";
}
circle.textContent = localStorage.tally;

let sum = 0;
// Event listener for products selected to buy
addToBasketBuy.addEventListener('click', () => {
  sum = Number(circle.textContent) + Number(quantity.value);
  circle.textContent = String(sum);
  circle.style.display = "unset";

  if (mode.textContent == 'TO BUY' && sessionStorage['cart_' + code.textContent] == null) {
    sessionStorage.setItem('cart_' + code.textContent, JSON.stringify({item: shouldBeH2ButDecidedP.textContent, image: bDisplayedImage.src, mode: "Buy", currency: currency.textContent, price: price.textContent, qty: quantity.value }));
  } else if (mode.textContent == 'TO BUY' && sessionStorage['cart_' + code.textContent] != null) {
    running_product_tally = Number(quantity.value) + Number(JSON.parse(sessionStorage.getItem('cart_'+ code.textContent))["qty"]);
    sessionStorage.setItem('cart_' + code.textContent, JSON.stringify({item: shouldBeH2ButDecidedP.textContent, image: bDisplayedImage.src, mode: "Buy", currency: currency.textContent, price: price.textContent, qty: running_product_tally }));
  }
  localStorage.tally = String(sum);
})
if (localStorage.tally == "0" && (localStorage.hire == "0" || localStorage.hire == undefined)) {
  localStorage.clear();
  circle.style.display = "none";
  sessionStorage.clear();
}
if (sessionStorage.length == 0 && (localStorage.hire == "0" || localStorage.hire == undefined)) {
  localStorage.clear();
  circle.style.display = "none";
}
