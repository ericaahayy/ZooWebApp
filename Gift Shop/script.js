const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let shopContent = document.querySelector("#shop-content");

let shop_items = [];
let purchase_items = {};
let purchase_total = 0;

document.addEventListener("DOMContentLoaded", function () {
  get_all_shop_items();
});

function get_all_shop_items() {
  fetch(back_end_url + "/user/load_shop_items")
    .then((response) => response.json())
    .then((data) => {
      shop_items = data.data;
      load_shop_items();
    });
}

function load_shop_items() {
  shopContent.innerHTML = "";
  shop_items.forEach(function ({ image, item_id, item_name, price, quantity }) {
    shopContent.innerHTML += `
            <div 
                class="product-box ${quantity === 0 && "sold-out"}" 
            >
                <img src="${image}" alt="item image" class="product-img" style="border-radius: 5px">
                <div class="product-details">
                    <h2 class="product-title">${item_name}</h2>
                    <span class="price">Available: ${quantity}</span>
                    <span class="price">$${price}</span>
                </div>
                <button 
                    class="
                        ${
                          quantity === 0
                            ? "disabled-btn"
                            : " add-to-cart-button "
                        }
                    " 
                    onclick="addCartClicked(this)" 
                    prod-id=${item_id}
                    ${quantity === 0 && "disabled"}
                >Add to Cart</button>
            </div>`;
  });
}

cartIcon.onclick = () => {
  cart.classList.add("active");
};

closeCart.onclick = () => {
  cart.classList.remove("active");
};

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
//buy function
function ready() {
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}
//function to checkout the items in cart
function buyButtonClicked() {
  if (Object.keys(purchase_items).length === 0) return;
  var cartContent = document.getElementsByClassName("cart-content")[0];
  let today = new Date();
  let date_of_purchase =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);

  // Loop through each item in the cart
  Object.keys(purchase_items).forEach(function (key) {
    let { purchase_quantity, item_id } = purchase_items[key];
    for (let item of shop_items) {
      if (item.item_id === item_id) {
        let purchase_total = item.price * purchase_quantity; // Assuming you have a 'price' property for each item

        var itemInfo = {
          customer_id: parseInt(window.localStorage.getItem("customer_id")),
          item_id,
          date_of_purchase: date_of_purchase,
          quantity: purchase_quantity,
          update_quantity: item.quantity - purchase_quantity,
          amount: purchase_total.toFixed(2),
          item_name: item.item_name,
          item_from: "gift_shop",
        };
        fetch(back_end_url + "/user/insert_into_purchase_history", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(itemInfo),
        }).then((response) => {
          if (!response.ok) {
            alert("Server error");
          } else {
            alert("purchase successfully");
            get_all_shop_items();
          }
        });
        break;
      }
    }
  });

  purchase_items = {};

  // Reset the cart and update the total
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updatetotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  delete purchase_items[buttonClicked.getAttribute("item-name")];
  console.log(purchase_items);
  buttonClicked.parentElement.remove();
  updatetotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  purchase_items[input.getAttribute("item-name")].purchase_quantity = parseInt(
    input.value
  );
  updatetotal();
}

function addCartClicked(button) {
  let role = window.localStorage.getItem("role");
  // console.log(role);
  if (role === null) {
    alert("Please login before add to cart");
    return;
  }
  let item_id = button.getAttribute("prod-id");
  for (let item of shop_items) {
    if (item.item_id === parseInt(item_id)) {
      addProductToCart(item);
      return;
    }
  }
}

function addProductToCart({ item_name, price, image, item_id, quantity }) {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartItems = cartContent.getElementsByClassName("cart-box");

  for (var i = 0; i < cartItems.length; i++) {
    var cartItem = cartItems[i];
    var cartItemTitle = cartItem.querySelector(".cart-product-title");

    if (cartItemTitle && cartItemTitle.innerText === item_name) {
      var quantityInput = cartItem.querySelector(".cart-quantity");
      var currentQuantity = parseInt(quantityInput.value);
      if (currentQuantity < parseInt(quantity)) {
        quantityInput.value = currentQuantity + 1;
        purchase_items[item_name].purchase_quantity = currentQuantity + 1;
      }
      updatetotal();
      cart.classList.add("active"); // Display the cart
      return;
    }
  }

  purchase_items[item_name] = { purchase_quantity: 1, item_id };
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");

  var cartBoxContent = `
            <img src="${image}" alt="" class="cart-img">
            <div class="detail-box" item-id=${item_id}>
                <div class="cart-product-title">${item_name}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" item-name="${item_name}" onkeypress="return false;" max="${quantity}" class="cart-quantity">
            </div>
            <i class='bx bxs-trash-alt cart-remove' item-name="${item_name}"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartContent.append(cartShopBox);

  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);

  updatetotal();

  cart.classList.add("active"); // Display the cart
}

function updatetotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;

    total = Math.round(total * 100) / 100;
  }
  purchase_total = total;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}
