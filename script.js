// Product data
() => {
  cy.get("ul#product-list").children("li").first().children("button").click();
  cy.window().its("sessionStorage").should("have.length", 1);
  cy.window().its("sessionStorage").invoke("getItem", "cart").should("eq", JSON.stringify([{ id: 1, name: "Product 1", price: 10, quantity: 2 }, { id: 5, name: "Product 5", price: 50, quantity: 1 }]));
}

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Render product list
function renderProducts() {
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
    productList.appendChild(li);
  });
}

// Render cart list
function renderCart() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
    cartList.appendChild(li);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      // Create a new copy of the product object and add a quantity property
      const newProduct = { ...product, quantity: 1 };
      cart.push(newProduct);
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}



// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listener for add to cart buttons
productList.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart-btn")) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    addToCart(productId);
  }
});

// Event listener for clear cart button
clearCartBtn.addEventListener("click", clearCart);

// Initial render
renderProducts();
renderCart();