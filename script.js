// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

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

// Add item to cart
function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity -= 1;
    if (existingProduct.quantity === 0) {
      const productIndex = cart.findIndex((item) => item.id === productId);
      cart.splice(productIndex, 1);
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

cy.get("ul#product-list").children("li").first().children("button").click();
cy.window().its("sessionStorage").invoke("getItem", "cart").then((cart) => {
  const actualCart = JSON.parse(cart);
  const expectedCart = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 5, name: "Product 5", price: 50 },
    { id: 1, name: "Product 1", price: 10, quantity: 1 }
  ];
  // Sort both arrays before comparing
  const sortedActualCart = actualCart.sort((a, b) => a.id - b.id);
  const sortedExpectedCart = expectedCart.sort((a, b) => a.id - b.id);
  expect(sortedActualCart).to.deep.equal(sortedExpectedCart);
});