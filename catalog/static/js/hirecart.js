// On the cart.html page, handles items to be hired and places them in the shopping cart
// Author: Charles Umesi

// Keeps a tally of items hired and (successfully) placed in cart
if (localStorage.tally != undefined) {
  circle.style.display = "unset";
}
circle.textContent = localStorage.tally;

// Function to be used later to check validity of dates selected for hire of product
function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

let aDiffTime; // This will be required for 'amendments' further down
let aDiffTimeArray = []; // To help channel multiple "else ifs" into one pathway further down
let aDiffDays; // Converts aDiffTime from milliseconds to days
let updating_subtotalArrayH = []; // Because of the way I have set up the updating subtotal calculation, this will only be needed for DEDUCTIONS

// Required actions as hired items to be placed in cart are looped and initially generated on the page
for (let h of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(h))["mode"] == "Hire") {

    // Create parent figure container
    figureH = document.createElement('figure');

    // Create the 'left' child of the parent figure container
    leftH = document.createElement('div');
    
    // Create the 'right' child of the parent figure container
    rightH = document.createElement('figcaption');

    // Create descendants of the 'right' child
    ulH = document.createElement('ul');
    productH = document.createElement('li');
    acquiringModeH = document.createElement('li');
    quantityInCart = document.createElement('span');
    costPlusCurrency = document.createElement('li');
    costText = document.createElement('span');
    costColon = document.createElement('span');
    cart_currencyH1 = document.createElement('span');
    cost = document.createElement('span');
    cratePlusDay = document.createElement('li');
    crateText = document.createElement('span');
    crateColon = document.createElement('span');
    cart_currencyH2 = document.createElement('span');
    cart_rate = document.createElement('span');
    perDay = document.createElement('span');
    durationPlusDays = document.createElement('li');
    duration = document.createElement('span');
    durationColon = document.createElement('span');
    durationCore = document.createElement('span');
    days = document.createElement('span');
    dates = document.createElement('li');
    startAccepted = document.createElement('span');
    toRH = document.createElement('span');
    endAccepted = document.createElement('span');
    warning_1 = document.createElement('p');
    warning_2 = document.createElement('p');


    // Create descendants of the 'left' child
    imgH = document.createElement('img');
    leftFigCaptionH = document.createElement('div');
    promptAndMessage = document.createElement('p');

    // Styling-related attributes and textContent
    costText.textContent = "Cost";
    costText.style.color = "#429CD9";
    costText.style.fontWeight = "bold";
    costColon.textContent = ": ";
    cost.textContent = JSON.parse(sessionStorage.getItem(h))["cost"];
    currencyArrayH.push(JSON.parse(sessionStorage.getItem(h))["currency"]); // Note: this line refers to an array
    crateText.textContent = "Rate (for quantity of 1)";
    crateText.style.color = "#429CD9";
    crateText.style.fontWeight = "bold";
    crateColon.textContent = ": ";
    cart_currencyH2.textContent = currencyArrayH[0];
    cart_rate.textContent = JSON.parse(sessionStorage.getItem(h))["rate"];
    perDay.textContent = "/day";
    duration.textContent = "Duration";
    duration.style.color = "#429CD9";
    duration.style.fontWeight = "bold";
    durationColon.textContent = ": "

    imgH.src = JSON.parse(sessionStorage.getItem(h))["image"];
    acquiringModeH.textContent = JSON.parse(sessionStorage.getItem(h))["mode"];

    // Attributes for larger elements and elements relating to hire product, cost, and accepted quantity
    productH.textContent = JSON.parse(sessionStorage.getItem(h))["item"];
    quantityInCart.setAttribute('id', 'qic_' + h);
    productH.setAttribute('id', h);
    cart_currencyH1.setAttribute('id', 'c_curr_' + h);
    cost.setAttribute('id', 'cost_' + h);
    figureH.setAttribute('id', 'fig_' + h)
    rightH.setAttribute('id', 'div_r_' + h);
    leftH.setAttribute('id', 'div_l_' + h);
    leftFigCaptionH.setAttribute('id', 'div_l_figc_' + h);
    leftFigCaptionH.classList.add('hire-inputs-and-instructions'); // class names have been created for CSS (see zeta.css file)
    imgH.setAttribute('id', 'img_' + h);

    cart_rate.setAttribute('id', 'cart_rate_' + h);
    durationCore.setAttribute('id', 'dc_' + h);
    days.setAttribute('id', 'days_' + h);
    startAccepted.setAttribute('id', 'start_acc_' + h);
    toRH.setAttribute('id', 'tor_' + h);
    endAccepted.setAttribute('id', 'end_acc_' + h);
    warning_1.setAttribute('id', 'warning_1_' + h);
    warning_2.setAttribute('id', 'warning_2_' + h);
    warning_1.classList.add('warning-p');
    warning_2.classList.add('warning-p');
    promptAndMessage.setAttribute('id', 'pam_' + h);

    leftH.appendChild(imgH);
    leftFigCaptionH.appendChild(promptAndMessage);
    if (JSON.parse(sessionStorage.getItem(h))['qty'] == "To be selected") {
      // Selectors to be created if the above condition is met
      inputGroup = document.createElement('p');
      startEntered = document.createElement('input');
      toLH = document.createElement('span');
      endEntered = document.createElement('input');
      submit_InNameOnlyNotType = document.createElement('button');

      // Attributes for selectors created
      inputGroup.style.marginLeft = "0.1em";
      inputGroup.setAttribute('class', 'input-group input-daterange'); // class names have been created for CSS (see zeta.css file)
      inputGroup.classList.add('input-gr');
      inputGroup.setAttribute('id', 'input_gr_' + h); // setAttribute names have been created for the event listeners further down
      startEntered.classList.add('start-entered');
      startEntered.setAttribute('id', 'start_e_' + h.replace('/', '_')); // To be handled by jQuery which doesn't like '/'
      startEntered.setAttribute('type', 'text');
      startEntered.setAttribute('onkeydown', 'return false'); // Prevents typing on the start date input field
      startEntered.setAttribute('onpaste', 'return false'); // Prevents pasting onto the start date field
      startEntered.setAttribute('data-provide', 'datepicker'); // Provides the calender for the start date (via jQuery and jQuery-ui)
      toLH.classList.add('tol');
      endEntered.classList.add('end-entered');
      endEntered.setAttribute('id', 'end_e_' + h.replace('/', '_')); // See earlier comment on 'h.replace()'
      endEntered.setAttribute('type', 'text');
      endEntered.setAttribute('onkeydown', 'return false'); // Prevents typing on the end date input field
      endEntered.setAttribute('onpaste', 'return false'); // Prevents pasting onto the end date field
      endEntered.setAttribute('data-provide', 'datepicker'); // Provides the calender for the end date (via jQuery and jQuery-ui)
      submit_InNameOnlyNotType.classList.add('submit-in-name-only-not-type');
      submit_InNameOnlyNotType.setAttribute('id', 'submit_i_' + h);
      submit_InNameOnlyNotType.setAttribute('type', 'button');

      // Also
      promptAndMessage.textContent = "Enter your start and end dates (submit then see 'Duration')";
      toLH.textContent = "to";
      submit_InNameOnlyNotType.textContent = "Submit";
      quantityInCart.textContent = " (Quantity to be selected)";
      cart_currencyH1.textContent = "";
      durationCore.textContent = "Will be displayed once dates are known";
      days.textContent = "";
      startAccepted.textContent = "";
      toRH.textContent = "";
      endAccepted.textContent = "";
      warning_1.textContent = "";
      warning_2.textContent = "";

      // And
      inputGroup.appendChild(startEntered);
      inputGroup.appendChild(toLH);
      inputGroup.appendChild(endEntered);
      leftFigCaptionH.appendChild(inputGroup);
      leftFigCaptionH.appendChild(submit_InNameOnlyNotType);

    } else if (JSON.parse(sessionStorage.getItem(h))['qty'] != "To be selected") {
      // Selectors to be created if the alternative condition is met instead
      deleteProduct = document.createElement('button');
      amend = document.createElement('button');

      // Attributes for alternative selectors created
      deleteProduct.classList.add('delete-product');
      deleteProduct.setAttribute('id', 'delete_p_' + h);
      deleteProduct.setAttribute('type', 'button');
      amend.classList.add('amend');
      amend.setAttribute('id', 'amend_' + h);
      amend.setAttribute('type', 'button');

      // Also
      promptAndMessage.textContent = "See details of dates and quantity";
      deleteProduct.textContent = "Delete";
      amend.textContent = "Amend";
      quantityInCart.textContent = " (" + JSON.parse(sessionStorage.getItem(h))['qty'] + ")";
      cart_currencyH1.textContent = currencyArrayH[0];
      durationCore.textContent = JSON.parse(sessionStorage.getItem(h))['duration'];
      if (durationCore.textContent == 1) {
        days.textContent = " day";
      } else if (durationCore.textContent > 1) {
        days.textContent = " days";
      }
      startAccepted.textContent = JSON.parse(sessionStorage.getItem(h))['from'];
      startAccepted.style.fontWeight = "bold";
      toRH.textContent = " to ";
      endAccepted.textContent = JSON.parse(sessionStorage.getItem(h))['to'];
      endAccepted.style.fontWeight = "bold";
      warning_1.textContent = "";
      warning_2.textContent = "";

      // Then there's the subtotal!
      subtotalArrayH.push(JSON.parse(sessionStorage.getItem(h))["duration"] * JSON.parse(sessionStorage.getItem(h))["qty"] * JSON.parse(sessionStorage.getItem(h))["rate"]);

      // And...
      leftFigCaptionH.appendChild(deleteProduct);
      leftFigCaptionH.appendChild(amend);

    }
    leftH.appendChild(leftFigCaptionH);
    figureH.appendChild(leftH);

    ulH.appendChild(productH);
    acquiringModeH.appendChild(quantityInCart);
    ulH.appendChild(acquiringModeH);
    costPlusCurrency.appendChild(costText);
    costPlusCurrency.appendChild(costColon);
    costPlusCurrency.appendChild(cart_currencyH1);
    costPlusCurrency.appendChild(cost);
    ulH.appendChild(costPlusCurrency);
    cratePlusDay.appendChild(crateText);
    cratePlusDay.appendChild(crateColon);
    cratePlusDay.appendChild(cart_currencyH2);
    cratePlusDay.appendChild(cart_rate);
    cratePlusDay.appendChild(perDay);
    ulH.appendChild(cratePlusDay);
    durationPlusDays.appendChild(duration);
    durationPlusDays.appendChild(durationColon);
    durationPlusDays.appendChild(durationCore);
    durationPlusDays.appendChild(days);
    ulH.appendChild(durationPlusDays);
    dates.appendChild(startAccepted);
    dates.appendChild(toRH);
    dates.appendChild(endAccepted);
    ulH.appendChild(dates);
    rightH.appendChild(ulH);
    rightH.appendChild(warning_1);
    rightH.appendChild(warning_2);
    figureH.appendChild(rightH);

    // And append parent
    summaryCartContainer.appendChild(figureH);
  }
}

if (sessionStorage.length == 0) {
  shoppingCart.textContent = "Your shopping cart is empty";
  shoppingCart.style.textAlign = "center";
  subtotalTitle.textContent = '';
  subtotalCurrency.textContent = '';
  subtotalProper.textContent = '';
} else {
  shoppingCart.textContent = "Shopping cart";
  subtotalTitle.textContent = "Subtotal: ";
  if (subtotalCurrency.textContent == "") {
    subtotalCurrency.textContent = currencyArrayH[0];
  }
  calculated_subtotalProper = subtotalArray.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0);
  subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
  if (localStorage.total == undefined) {
    localStorage.total = calculated_subtotalProper.toFixed(2);
  } else {
    localStorage.total = calculated_subtotalProper.toFixed(2);
  }
}

// Required actions when the SUBMIT button is presented on a refreshed cart page
for (let q of Object.keys(sessionStorage)) {
  // I'm using jQuery to run the calender and datepicker and set start and end date ranges for the hire product
  $('#start_e_' + q.replace('/', '_')).datepicker({minDate: new Date(), maxDate: '+365D'});
  $('#start_e_' + q.replace('/', '_')).datepicker("option", "dateFormat", "dd-mm-yy");
  $('#end_e_' + q.replace('/', '_')).datepicker({minDate: '+1D', maxDate: '+366D'});
  $('#end_e_' + q.replace('/', '_')).datepicker("option", "dateFormat", "dd-mm-yy");

  if (JSON.parse(sessionStorage.getItem(q))["mode"] == "Hire" && JSON.parse(sessionStorage.getItem(q))['qty'] == "To be selected") {
    // Event listener for the submit button
    document.getElementById('submit_i_' + q).addEventListener('click', () => {
      // If above condition is met, this means the start and end input dates will also be initially presented

      /* Now, before we begin, we will need to create a couple of elements
      .. These need to be placed BELOW the submit event listener - the same applies to listeners for the amend and delete buttons*/
      quantityToBeSelected = document.createElement('select');
      addToCart = document.createElement('button');

      // And declare the following selectors
      start = document.getElementById('start_e_' + q.replace('/', '_'));
      end = document.getElementById('end_e_' + q.replace('/', '_'));
      leftFigCap_revisited = document.getElementById('div_l_figc_' + q);
      pam_revisited = document.getElementById('pam_' + q);
      inputGroup_revisited = document.getElementById('input_gr_' + q);
      productH_revisited = document.getElementById(q);
      cart_displayedImage = document.getElementById('img_' + q);
      qtyInCart_revisited = document.getElementById('qic_' + q);
      c_currencyH1_revisited = document.getElementById('c_curr_' + q);
      cost_revisited = document.getElementById('cost_' + q);
      cart_rate_revisited = document.getElementById('cart_rate_' + q);
      durationC_revisited = document.getElementById('dc_' + q);
      days_revisited = document.getElementById('days_' + q);
      start_accept_revisited = document.getElementById('start_acc_' + q);
      toRH_revisited = document.getElementById('tor_' + q);
      end_accept_revisited = document.getElementById('end_acc_' + q);
      warning_1_revisited = document.getElementById('warning_1_' + q);
      warning_2_revisited = document.getElementById('warning_2_' + q);

      // Now let's deal with the validity of the dates selected
      starting = new Date(start.value.split('-').reverse().join('-'));
      ending = new Date(end.value.split('-').reverse().join('-'));

      if (dateIsValid(ending) && dateIsValid(starting) && ending < starting && (new Date() - new Date(ending))/(1000*60*60*24) < 1 && (new Date() - new Date(starting))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your end date cannot be earlier than your start date.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (!dateIsValid(ending) && dateIsValid(starting) && end.value == "" && (new Date() - new Date(starting))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your end date cannot be blank.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (!dateIsValid(ending) && dateIsValid(starting) && end.value != "" && (new Date() - new Date(starting))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your submitted end date is invalid.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (dateIsValid(ending) && dateIsValid(starting) && end.value == start.value && (new Date() - new Date(ending))/(1000*60*60*24) < 1 && (new Date() - new Date(starting))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "You have entered identical start and end dates.";
        warning_2_revisited.textContent = "Your hire duration must be at least 1 (ONE) day.";

      } else if (!dateIsValid(ending) && !dateIsValid(starting) && end.value == "" && start.value == "") {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your start and end dates cannot both be blank.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (!dateIsValid(ending) && !dateIsValid(starting) && ((end.value == "" && start.value != "") || (end.value != "" && start.value == "") || (end.value != "" && start.value != ""))) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your submitted dates are invalid.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (dateIsValid(ending) && !dateIsValid(starting) && start.value == "" && (new Date() - new Date(ending))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your start date cannot be blank.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (dateIsValid(ending) && !dateIsValid(starting) && start.value != "" && (new Date() - new Date(ending))/(1000*60*60*24) < 1) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "Your submitted start date is invalid.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if ((dateIsValid(ending) || dateIsValid(starting)) && ((new Date() - new Date(starting))/(1000*60*60*24) >= 1 || (new Date() - new Date(ending))/(1000*60*60*24) >= 1)) {
        durationC_revisited.textContent = "";
        warning_1_revisited.textContent = "For a new hire, neither your start nor end date can be set in the past.";
        warning_2_revisited.textContent = "Enter valid dates or your hire request will not be added to cart.";

      } else if (dateIsValid(ending) && dateIsValid(starting) && ending > starting && (new Date() - new Date(ending))/(1000*60*60*24) < 1 && (new Date() - new Date(starting))/(1000*60*60*24) < 1) {
        // Redefinitions and new variables required when the aforementioned condition is met
        diffTime = ending - starting;
        diffDays = diffTime/(1000 * 60 * 60 * 24);
        durationC_revisited.textContent = String(diffDays);
        if (diffDays == 1) {
          days_revisited.textContent = " day";
        } else if (diffDays > 1) {
          days_revisited.textContent = " days";
        }
        warning_1_revisited.textContent = "";
        warning_2_revisited.textContent = "";
        start_accept_revisited.textContent = start.value;
        toRH_revisited.textContent = " to ";
        end_accept_revisited.textContent = end.value;
        end_accept_revisited.style.fontWeight = "bold";
        start_accept_revisited.style.fontWeight = "bold";
        pam_revisited.textContent = "Select quantity";

        // Attributes for the two new elements
        quantityToBeSelected.classList.add('quantity-to-be-selected');
        quantityToBeSelected.setAttribute('id', 'qty_tbs_' + q.replace('/', '_'));  // This is for jQuery; it can't handle '/'
        addToCart.classList.add('add-to-cart-hire');
        addToCart.setAttribute('id', 'add_to_cart_' + q);
        addToCart.setAttribute('type', 'button');
        addToCart.textContent = "Add to cart";

        // Add functionality to the <select> (quantityToBeSelected) element created
        $(document).ready(function(){
          var $cart_select = $('#qty_tbs_' + q.replace('/', '_'))
          for (i=1; i<=10; i++) {
            $cart_select.append($('<option></option>').val(i).html(i))
          }
        })

        // And
        leftFigCap_revisited.removeChild(document.getElementById('submit_i_' + q));
        leftFigCap_revisited.removeChild(inputGroup_revisited);
        leftFigCap_revisited.appendChild(quantityToBeSelected);
        leftFigCap_revisited.appendChild(addToCart);

        // Now use the two selectors created and appended
        quantityH = document.getElementById('qty_tbs_' + q.replace('/', '_'));

        // Add event listener to the "Add to cart" button created
        document.getElementById('add_to_cart_' + q).addEventListener('click', () => {
          // Updating information on quantity and cost for hiring the product
          qtyInCart_revisited.textContent = " (" + quantityH.value + ")";
          cart_rate_revisited.textContent = JSON.parse(sessionStorage.getItem(q))["rate"];
          c_currencyH1_revisited.textContent = currencyArrayH[0];
          calculated_costH = diffDays * Number(quantityH.value) * Number(JSON.parse(sessionStorage.getItem(q))["rate"]);
          rounded_calculated_costH = calculated_costH.toFixed(2);

          // And updating the browser's local and session storages
          sessionStorage.setItem(q, JSON.stringify({item: productH_revisited.textContent, image: cart_displayedImage.src, mode: "Hire", from: start.value, to: end.value, duration: diffDays, currency: currencyArrayH[0], rate: cart_rate_revisited.textContent, qty: quantityH.value, cost: rounded_calculated_costH}));
          cost_revisited.textContent = rounded_calculated_costH;
          subtotalArrayH.push(Number(rounded_calculated_costH));
          sum = Number(circle.textContent) + Number(quantityH.value);
          circle.textContent = String(sum);
          circle.style.display = "unset";
          localStorage.tally = circle.textContent;

          // And updating the subtotal on display (on the cart page) and finalising the buttons to be displayed at the end of this
          subtotalCurrency.textContent = currencyArrayH[0];
          calculated_subtotalProper = subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0);
          subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
          localStorage.total = calculated_subtotalProper.toFixed(2);
          pam_revisited.textContent = "See details of dates and quantity";

          // Refreshing the page following successful inputs (helps preserve stability of event handlers)
          return window.location.reload(true);
        })
      }
    })
  }
}

// Required actions for the AMEND button when the amend and delete buttons are presented on a refreshed page
for (let a of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(a))["mode"] == "Hire" && JSON.parse(sessionStorage.getItem(a))['qty'] != "To be selected") {
    // Event listener
    document.getElementById('amend_' + a).addEventListener('click', () => {
      // In this situation, we need to create the following elements
      amendInputGroup = document.createElement('p');
      amendStart = document.createElement('input');
      toLH_again = document.createElement('span');
      amendEnd = document.createElement('input');
      submit_InNameOnlyNotType_again = document.createElement('button');
      amendQuantity = document.createElement('select');
      amendCart = document.createElement('button');

      // And declare the following selectors
      delProduct_revisited = document.getElementById('delete_p_' + a);
      pam_withAmend = document.getElementById('pam_' + a);
      amendLeftFigCap = document.getElementById('div_l_figc_' + a);
      amendQtyInCart = document.getElementById('qic_' + a);
      aCart_displayedImage = document.getElementById('img_' + a);
      aProductH = document.getElementById(a);
      amendCost = document.getElementById('cost_' + a);
      aCart_rate = document.getElementById('cart_rate_' + a);
      amendDurationC = document.getElementById('dc_' + a);
      amendDays = document.getElementById('days_' + a);
      aStart_accept = document.getElementById('start_acc_' + a);
      aEnd_accept = document.getElementById('end_acc_' + a);
      aWarning_1 = document.getElementById('warning_1_' + a);
      aWarning_2 = document.getElementById('warning_2_' + a);

      // Attributes for the new elements created (except amendQuantity and amendCart)
      amendInputGroup.style.marginLeft = "0.1em";
      amendInputGroup.setAttribute('class', 'input-group input-daterange');
      amendInputGroup.setAttribute('id', 'input_gr_' + a);
      amendInputGroup.classList.add('input-gr');
      amendStart.classList.add('start-entered');
      amendStart.setAttribute('id', 'start_e_' + a.replace('/', '_'));
      amendStart.setAttribute('type', 'text');
      amendStart.setAttribute('placeholder', JSON.parse(sessionStorage.getItem(a))["from"]);
      amendStart.setAttribute('onkeydown', 'return false');
      amendStart.setAttribute('onpaste', 'return false');
      amendStart.setAttribute('data-provide', 'datepicker');
      toLH_again.classList.add('tol');
      amendEnd.classList.add('end-entered');
      amendEnd.setAttribute('id', 'end_e_' + a.replace('/', '_'));
      amendEnd.setAttribute('type', 'text');
      amendEnd.setAttribute('placeholder', JSON.parse(sessionStorage.getItem(a))["to"]);
      amendEnd.setAttribute('onkeydown', 'return false');
      amendEnd.setAttribute('onpaste', 'return false');
      amendEnd.setAttribute('data-provide', 'datepicker');
      submit_InNameOnlyNotType_again.classList.add('submit-in-name-only-not-type');
      submit_InNameOnlyNotType_again.setAttribute('id', 'submit_i_' + a);
      submit_InNameOnlyNotType_again.setAttribute('type', 'button');
      submit_InNameOnlyNotType_again.textContent = "Submit";
      pam_withAmend.textContent = "See details of dates and quantity";
      toLH_again.textContent = "to";

      // Removing and appending various nodes
      amendLeftFigCap.removeChild(delProduct_revisited);
      amendLeftFigCap.removeChild(document.getElementById('amend_' + a));
      amendInputGroup.appendChild(amendStart);
      amendInputGroup.appendChild(toLH_again);
      amendInputGroup.appendChild(amendEnd);
      amendLeftFigCap.appendChild(amendInputGroup);
      amendLeftFigCap.appendChild(submit_InNameOnlyNotType_again);

      // jQuery for running the calender and datepicker and reseting date ranges for the hire product
      $('#start_e_' + a.replace('/', '_')).datepicker({minDate: new Date(), maxDate: '+365D'});
      $('#start_e_' + a.replace('/', '_')).datepicker("option", "dateFormat", "dd-mm-yy");
      $('#end_e_' + a.replace('/', '_')).datepicker({minDate: '+1D', maxDate: '+366D'});
      $('#end_e_' + a.replace('/', '_')).datepicker("option", "dateFormat", "dd-mm-yy");

      // Add event listener to newly created submit button
      submit_InNameOnlyNotType_again.addEventListener('click', () => {
        // Dealing with the validity of dates
        aStarting = new Date(amendStart.value.split('-').reverse().join('-'));
        aEnding = new Date(amendEnd.value.split('-').reverse().join('-'));
        pStarting = new Date(amendStart.placeholder.split('-').reverse().join('-'));
        pEnding = new Date(amendEnd.placeholder.split('-').reverse().join('-'));

        if (amendStart.value != "" && !dateIsValid(aStarting)) {
          if (!dateIsValid(aEnding) && amendEnd.value != "") {
            aWarning_1.textContent = "Your revised dates are invalid.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (dateIsValid(aEnding) && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised start date is invalid.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (dateIsValid(pEnding) && (new Date() - new Date(pEnding))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised start date is invalid.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          }

        } else if (amendStart.value == "" || (amendStart.value != "" && dateIsValid(aStarting))) {
          if (amendStart.value == "" && dateIsValid(aEnding) && aEnding < pStarting && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your end date cannot be earlier than your start date.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && dateIsValid(aEnding) && aEnding < aStarting && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1 && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your end date cannot be earlier than your start date.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && amendEnd.value == "" && pEnding < aStarting && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your end date cannot be earlier than your start date.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && !dateIsValid(aEnding) && amendEnd.value != "" && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised end date is invalid.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value == "" && amendEnd.value != "" && !dateIsValid(aEnding) && (new Date() - new Date(pStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised end date is invalid.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && dateIsValid(aEnding) && amendEnd.value == amendStart.value && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1 && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised dates are identical.";
            aWarning_2.textContent = "Your hire duration must be at least 1 (ONE) day.";

          } else if (amendStart.value == "" && dateIsValid(aEnding) && amendEnd.value == amendStart.placeholder && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1 && (new Date() - new Date(pStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised dates are identical.";
            aWarning_2.textContent = "Your hire duration must be at least 1 (ONE) day.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && amendEnd.placeholder == amendStart.value && (new Date() - new Date(pEnding))/(1000*60*60*24) < 1 && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "Your revised dates are identical.";
            aWarning_2.textContent = "Your hire duration must be at least 1 (ONE) day.";

          } else if (amendStart.value != "" && dateIsValid(aStarting) && dateIsValid(aEnding) && ((new Date() - new Date(aStarting))/(1000*60*60*24) >= 1 || (new Date() - new Date(aEnding))/(1000*60*60*24) >= 1)) {
            aWarning_1.textContent = "For a new hire, neither your start nor end date can be set in the past.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if ((amendStart.value == "" || amendEnd.value == "") && ((new Date() - new Date(pStarting))/(1000*60*60*24) >= 1 || (new Date() - new Date(pEnding))/(1000*60*60*24) >= 1)) {
            aWarning_1.textContent = "For a new hire, neither your start nor end date can be set in the past.";
            aWarning_2.textContent = "To amend your hire details for this product, enter valid dates.";

          } else if (amendStart.value == "" && dateIsValid(aEnding) && aEnding > pStarting && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "";
            aWarning_2.textContent = "";
            aDiffTime = aEnding - pStarting;
            aDiffTimeArray.push(aDiffTime);
            aStart_accept.textContent = amendStart.placeholder;
            aEnd_accept.textContent = amendEnd.value;

          } else if (amendStart.value != "" && dateIsValid(aStarting) && dateIsValid(aEnding) && aEnding > aStarting && (new Date() - new Date(aEnding))/(1000*60*60*24) < 1 && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "";
            aWarning_2.textContent = "";
            aDiffTime = aEnding - aStarting;
            aDiffTimeArray.push(aDiffTime);
            aStart_accept.textContent = amendStart.value;
            aEnd_accept.textContent = amendEnd.value;

          } else if (amendStart.value != "" && dateIsValid(aStarting) && amendEnd.value == "" && pEnding > aStarting && (new Date() - new Date(aStarting))/(1000*60*60*24) < 1) {
            aWarning_1.textContent = "";
            aWarning_2.textContent = "";
            aDiffTime = pEnding - aStarting;
            aDiffTimeArray.push(aDiffTime);
            aStart_accept.textContent = amendStart.value;
            aEnd_accept.textContent = amendEnd.placeholder;

          }

          if (aDiffTimeArray.includes(aDiffTime) || (amendStart.value == "" && amendEnd.value == "" && (new Date() - new Date(pStarting))/(1000*60*60*24) < 1 && (new Date() - new Date(pEnding))/(1000*60*60*24) < 1)) {
            // Note: Only ONE of the above conditions must be true (not both otherwise the code won't work properly)
            if (aDiffTimeArray.includes(aDiffTime)) {
              aDiffDays = aDiffTime/(1000 * 60 * 60 * 24);
            } else if (amendStart.value == "" && amendEnd.value == "") {
              aDiffDays = JSON.parse(sessionStorage.getItem(a))["duration"];
            }
            amendDurationC.textContent = String(aDiffDays);

            if (aDiffDays == 1) {
              amendDays.textContent = " day";
            } else if (aDiffDays > 1) {
              amendDays.textContent = " days";
            }
            aDiffTimeArray.pop(aDiffTime);

            aStart_accept.style.fontWeight = "bold";
            aEnd_accept.style.fontWeight = "bold";
            pam_withAmend.textContent = "Amend quantity";

            // New selectors required when the above condition is met
            amendQuantity = document.createElement('select');
            amendCart = document.createElement('button');

            // Attributes for amendQuantity <select> and amendCart <button>
            amendQuantity.classList.add('quantity-to-be-amended');
            amendQuantity.setAttribute('id', 'qty_tba_' + a.replace('/', '_'));  // This is for jQuery; it can't handle '/'
            amendCart.classList.add('amend-cart-hire');
            amendCart.setAttribute('id', 'amend_cart_' + a);
            amendCart.setAttribute('type', 'button');
            amendCart.textContent = "Amend cart";

            // Adding functionality to the <select> element created
            $(document).ready(function(){
              var $cart_select = $('#qty_tba_' + a.replace('/', '_'))
              for (i=1; i<=10; i++) {
                $cart_select.append($('<option></option>').val(i).html(i))
                if (i == JSON.parse(sessionStorage.getItem(a))['qty']) {
                  $cart_select.val(JSON.parse(sessionStorage.getItem(a))['qty']).change()
                }
              }
            })

            // And
            amendLeftFigCap.removeChild(submit_InNameOnlyNotType_again);
            amendLeftFigCap.removeChild(amendInputGroup);
            amendLeftFigCap.appendChild(amendQuantity);
            amendLeftFigCap.appendChild(amendCart);

            // Now use the two elements created and appended
            amendQuantityH = document.getElementById('qty_tbs_' + a.replace('/', '_'));

            // Event listener for the newly created 'Amend cart' button
            document.getElementById('amend_cart_' + a).addEventListener('click', () => {
              // Initial updating...
              amendQtyInCart.textContent = " (" + amendQuantity.value + ")";
              recalculated_costH = aDiffDays * Number(amendQuantity.value) * Number(JSON.parse(sessionStorage.getItem(a))["rate"]);
              rounded_recalculated_costH = recalculated_costH.toFixed(2);

              // Removing the initial/previous cost of the hire product from the subtotal
              updating_subtotalArrayH.push(-Number(JSON.parse(sessionStorage.getItem(a))["cost"])); // Notice the minus sign
              calculated_less_subtotal = updating_subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0) + updating_subtotalArray.reduce((a, b) => a + b, 0);
              updating_subtotalArrayH.length = 0;
              subtotalArrayH.length = 0;
              /* Note that updating_subtotalArrayH (for hire products) works very differently to updating_subtotalArray (for buy products)
              .. and unlike updating_subtotalArray, it is only needed for DEDUCTIONS
              .. The pop() function (or '.length=0') is therefore needed because of the way I have set up updating_subtotalArrayH */

              // Putting in the amended cost of the hire product into the subtotal
              subtotalArrayH.push(recalculated_costH);
              calculated_subtotalProper = subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0) + updating_subtotalArray.reduce((a, b) => a + b, 0);

              // The rest of the updating
              amendCost.textContent = rounded_recalculated_costH;
              subtotalProper.textContent = calculated_subtotalProper.toFixed(2);
              localStorage.total = calculated_subtotalProper.toFixed(2);
              sum = Number(circle.textContent) - Number(JSON.parse(sessionStorage.getItem(a))["qty"]) + Number(amendQuantity.value);
              circle.textContent = String(sum);
              circle.style.display = "unset";
              localStorage.tally = circle.textContent;
              sessionStorage.setItem(a, JSON.stringify({item: aProductH.textContent, image: aCart_displayedImage.src, mode: "Hire", from: aStart_accept.textContent, to: aEnd_accept.textContent, duration: aDiffDays, currency: currencyArrayH[0], rate: aCart_rate.textContent, qty: amendQuantity.value, cost: rounded_recalculated_costH}));

              pam_withAmend.textContent = "See details of dates and quantity";

              // The rationale for this was stated at the end of the SUBMIT for loop
              return window.location.reload(true);
            })
          }
        }
      })
    })
  }
}

// Required actions for the DELETE button when the amend and delete buttons are presented on a refreshed page
for (let d of Object.keys(sessionStorage)) {
  if (JSON.parse(sessionStorage.getItem(d))["mode"] == "Hire" && JSON.parse(sessionStorage.getItem(d))['qty'] != "To be selected") {
    // Event listener
    document.getElementById('delete_p_' + d).addEventListener('click', () => {
      // Required selector
      byeFigureH = document.getElementById('fig_' + d);

      // Updating the tally
      sum = Number(circle.textContent) - Number(JSON.parse(sessionStorage.getItem(d))["qty"]);
      circle.textContent = String(sum);
      if (sum <= 0) {
        circle.style.display = "none";
      } else if (sum > 0) {
        circle.style.display = "unset";
      }
      localStorage.tally = circle.textContent;

      // Making the necessary deductions
      updating_subtotalArrayH.push(-Number(JSON.parse(sessionStorage.getItem(d))["cost"])); // Notice the negative sign
      calculated_less_subtotal = updating_subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArrayH.reduce((a, b) => a + b, 0) + subtotalArray.reduce((a, b) => a + b, 0) + updating_subtotalArray.reduce((a, b) => a + b, 0);
      updating_subtotalArrayH.length = 0;
      subtotalArrayH.length = 0;
      if (Number(calculated_less_subtotal.toFixed(2)) < 0.00) {
        subtotalProper.textContent = "0.00";
        sessionStorage.clear();
        localStorage.clear();

      } else {
        subtotalProper.textContent = calculated_less_subtotal.toFixed(2);
        localStorage.total = calculated_less_subtotal.toFixed(2);
      }

      // And updating the 'H' number near the cart symbol
      hireProducts = Number(hireIndicator.textContent) - 1;
      hireIndicator.textContent = String(hireProducts);
      localStorage.hire = hireIndicator.textContent;
      if (hireProducts <= 0) {
        hireIndicator.style.display = "none";
        hSuffix.style.display = "none";
      } else if (hireProducts > 0) {
        hireIndicator.style.display = "unset";
        hSuffix.style.display = "unset";
      }

      // And finally
      summaryCartContainer.removeChild(byeFigureH);
      delete sessionStorage[d];
      return window.location.reload(true);
    })
  }
}
