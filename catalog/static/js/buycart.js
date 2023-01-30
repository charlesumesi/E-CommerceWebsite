// On the cart.html page, handles items to be bought that have been placed in the shopping cart
// Author: Charles Umesi

// Relevant selectors (Note: Because the global variables are referencing HTML elements, they will be accessible to ALL javascript files in the folder)
let shoppingCart = document.getElementById('shopping-cart');
let subtotal = document.getElementById('subtotal');
let subtotalTitle = document.querySelector('.subtotal-title');
const subtotalCurrency = document.querySelector('.subtotal-currency');
let subtotalProper = document.querySelector('.subtotal-proper');
let summaryCartContainer = document.getElementById('summary-cart-container');

// Required actions as items in cart are looped and initially generated on the page
for (let k of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(k))["mode"] == "Buy") {

    // Create parent figure container
    figure = document.createElement('figure');

    // Create the 'left' child of the parent figure container
    left = document.createElement('div');
    
    // Create the 'right' child of the parent figure container
    right = document.createElement('figcaption');

    // Create descendants of the 'right' child
    ul = document.createElement('ul');
    product = document.createElement('li');
    acquiringMode = document.createElement('li');
    cprice = document.createElement('li');
    cart_currency = document.createElement('span');
    cart_price = document.createElement('span');

    // Create descendants of the 'left' child
    img = document.createElement('img');
    leftFigCaption = document.createElement('div');
    qty_p = document.createElement('p');
    minus = document.createElement('span');
    qty_span = document.createElement('span');
    plus = document.createElement('span');

    // Attributes for generated selectors
    img.src = JSON.parse(sessionStorage.getItem(k))["image"];
    plus.textContent = "+";
    qty_span.textContent = JSON.parse(sessionStorage.getItem(k))["qty"];
    if (qty_span.textContent == 1) {
      icon = document.createElement('i');
      icon.setAttribute('class', 'fa fa-trash');
      icon.setAttribute('id', 'icon_' + k);
      minus.textContent = "";
      minus.appendChild(icon);
    } else if (qty_span.textContent > 1) {
      minus.textContent = "–";
    }
    calculated_cost = Number(JSON.parse(sessionStorage.getItem(k))["qty"]) * Number(JSON.parse(sessionStorage.getItem(k))["price"]);
    rounded_calculated_cost = calculated_cost.toFixed(2);
    subtotalArray.push(Number(rounded_calculated_cost));
    cart_price.textContent = rounded_calculated_cost;
    cart_currency.textContent = JSON.parse(sessionStorage.getItem(k))["currency"];
    currencyArray.push(cart_currency.textContent)
    acquiringMode.textContent = JSON.parse(sessionStorage.getItem(k))["mode"];
    product.textContent = JSON.parse(sessionStorage.getItem(k))["item"];

    product.setAttribute('id', k);
    figure.setAttribute('id', 'fig_' + k)
    right.setAttribute('id', 'div_r_' + k);
    left.setAttribute('id', 'div_l_' + k);
    leftFigCaption.setAttribute('id', 'div_l_figc_' + k);
    img.setAttribute('id', 'img_' + k);

    cart_price.classList.add('cart_price'); // classList.add names have been created for CSS (see zeta.css file)
    cart_price.setAttribute('id', 'cart_price_' + k); // setAttribute names have been created for the event listeners further down
    qty_p.setAttribute('id', 'qty_p_' + k);
    minus.classList.add('minus');
    minus.setAttribute('id', 'minus_' + k);
    qty_span.classList.add('quantity');
    qty_span.setAttribute('id', 'qty_' + k);
    plus.classList.add('plus');
    plus.setAttribute('id', 'plus_' + k);

    // Append children

    // 'left'
    left.appendChild(img);
    qty_p.appendChild(minus);
    qty_p.appendChild(qty_span);
    qty_p.appendChild(plus);
    leftFigCaption.appendChild(qty_p);
    left.appendChild(leftFigCaption);
    figure.appendChild(left);

    // 'right'
    ul.appendChild(product);
    ul.appendChild(acquiringMode);
    ul.appendChild(cprice);
    cprice.appendChild(cart_currency);
    cprice.appendChild(cart_price);
    right.appendChild(ul);
    figure.appendChild(right)

    // Append parent
    summaryCartContainer.appendChild(figure);
  }
}

if (sessionStorage.length == 0) {
  shoppingCart.textContent = "Your shopping cart is empty";
  shoppingCart.style.textAlign = "center";
  shoppingCart.style.marginLeft = "0em";
  subtotalTitle.textContent = '';
  subtotalCurrency.textContent = '';
} else {
  shoppingCart.textContent = "Shopping cart";
  subtotalTitle.textContent = "Subtotal: ";
  if (subtotalCurrency.textContent == '') {
    subtotalCurrency.textContent = currencyArray[0];
  }
  calculated_subtotalProper = subtotalArray.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0);
  subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
  if (localStorage.total == undefined) {
    localStorage.total = calculated_subtotalProper.toFixed(2);
  } else {
    localStorage.total = calculated_subtotalProper.toFixed(2);
  }
}

// Required actions as items are looped (again) and their quantities on page amended by INCREMENT(S)
for (let i of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(i))["mode"] == "Buy") {
    document.getElementById('plus_' + i).addEventListener('click', () => {
      cart_bDisplayedimage = document.getElementById('img_' + i);
      cart_priceRevisited = document.getElementById('cart_price_' + i);
      cart_quantity = document.getElementById('qty_' + i);
      cart_minus = document.getElementById('minus_' + i);
      cart_product = document.getElementById(i);
      if (cart_product.textContent == JSON.parse(sessionStorage.getItem(i))["item"] && JSON.parse(sessionStorage.getItem(i))["mode"] == "Buy") {
        more = Number(cart_quantity.textContent);
        more += 1;
        cart_quantity.textContent = more;
        if (cart_quantity.textContent > 1) {
          cart_minus.textContent = "–";
        }
        single_price_revisited = Number(JSON.parse(sessionStorage.getItem(i))["price"]);
        sessionStorage.setItem(i, JSON.stringify({item: cart_product.textContent, image: cart_bDisplayedimage.src, mode: "Buy", currency: currencyArray[0], price: single_price_revisited, qty: more}));
        calculated_cost = Number(JSON.parse(sessionStorage.getItem(i))["qty"]) * Number(JSON.parse(sessionStorage.getItem(i))["price"]);
        rounded_calculated_cost = calculated_cost.toFixed(2);
        cart_priceRevisited.textContent = rounded_calculated_cost;
        updating_subtotalArray.push(Number(JSON.parse(sessionStorage.getItem(i))["price"]));
        calculated_subtotalProper = updating_subtotalArray.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0);
        subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
        localStorage.total = calculated_subtotalProper.toFixed(2);
        moreTally = Number(localStorage.tally) + 1;
        localStorage.tally = String(moreTally);
        circle.textContent = localStorage.tally;
      }
    })
  }
}
// Required actions as items are looped (again) and their quantities on page amended by DECREMENT(S)
for (let j of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(j))["mode"] == "Buy") {
    document.getElementById('minus_' + j).addEventListener('click', () => {
      cart_figure = document.getElementById('fig_' + j);  // Need to add parent selector (to deal with when the quantity == 0)
      cart_bDisplayedimage = document.getElementById('img_' + j);
      cart_priceRevisited = document.getElementById('cart_price_' + j);
      cart_quantity = document.getElementById('qty_' + j);
      cart_product = document.getElementById(j);
      if (cart_product.textContent == JSON.parse(sessionStorage.getItem(j))["item"] && JSON.parse(sessionStorage.getItem(j))["mode"] == "Buy") {
        less = Number(cart_quantity.textContent);
        less -= 1;
        cart_quantity.textContent = less;
        if (cart_quantity.textContent == 1) {
          icon = document.createElement('i');
          icon.setAttribute('class', 'fa fa-trash');
          icon.setAttribute('id', 'icon_' + j);
          document.getElementById('minus_' + j).textContent = "";
          document.getElementById('minus_' + j).appendChild(icon);
        }
        single_price_revisited = Number(JSON.parse(sessionStorage.getItem(j))["price"]);
        sessionStorage.setItem(j, JSON.stringify({item: cart_product.textContent, image: cart_bDisplayedimage.src, mode: "Buy", currency: currencyArray[0], price: single_price_revisited, qty: less}));
        calculated_cost = Number(JSON.parse(sessionStorage.getItem(j))["qty"]) * Number(JSON.parse(sessionStorage.getItem(j))["price"]);
        rounded_calculated_cost = calculated_cost.toFixed(2);
        cart_priceRevisited.textContent = rounded_calculated_cost;
        updating_subtotalArray.push(-Number(JSON.parse(sessionStorage.getItem(j))["price"]));
        calculated_subtotalProper = updating_subtotalArray.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0);
        subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
        localStorage.total = calculated_subtotalProper.toFixed(2);
        lessTally = Number(localStorage.tally) - 1;
        localStorage.tally = String(lessTally);
        circle.textContent = localStorage.tally;
        if (lessTally <= 0) {
          circle.style.display = "none";
        } else if (lessTally > 0) {
          circle.style.display = "unset";
        }
        if (Number(JSON.parse(sessionStorage.getItem(j))["qty"]) == 0) {
          summaryCartContainer.removeChild(figure);
          delete sessionStorage[j];
          return window.location.reload(true);
        }
      }
    })
  }
}
