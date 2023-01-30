// Sends selected hire products to the cart.html page where the start and end dates will be selected
// Author: Charles Umesi

// Relevant selectors (not yet stored in variables)
let hireIndicator = document.querySelector('.hire-indicator');
let hSuffix = document.querySelector('.h-suffix');
let rate = document.querySelector('.rate');
let selectHireProduct = document.getElementById('select-hire-product');
let selectHireProductPara = document.getElementById('select-hire-product-para');
let selectHireProductLink = document.querySelector('#product-form a button');

// Linking the quantity selected (to hire) and 'click' with the hire product tally (using the browser's inbuilt local and session storages)
if (localStorage.hire != undefined) {
  hireIndicator.style.display = "unset";
  hSuffix.style.display = "unset";
}
hireIndicator.textContent = localStorage.hire;

let hireProducts = 0;
// Event listeners
selectHireProduct.addEventListener('click', () => {
  hireProducts = Number(hireIndicator.textContent);
  hireIndicator.style.display = "unset";
  hireIndicator.textContent = String(hireProducts);
  hSuffix.style.display = "unset";
  if (mode.textContent == 'TO HIRE' && sessionStorage['cart_' + code.textContent] == null) {
    sessionStorage.setItem('cart_' + code.textContent, JSON.stringify({item: shouldBeH2ButDecidedP.textContent, image: displayedImage.src, mode: "Hire", from: 'To be selected', to: 'To be selected', duration: 'To be determined', currency: currency.textContent, rate: rate.textContent, qty: 'To be selected', cost: "Will be displayed once dates and quantity are known"}));
    hireProducts += 1;
    localStorage.hire = String(hireProducts);
    hireIndicator.style.display = "unset";
    hireIndicator.textContent = localStorage.hire;
  }
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
