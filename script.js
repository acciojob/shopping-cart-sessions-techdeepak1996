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

// Initialize cart in sessionStorage if it doesn't exist
if (!sessionStorage.getItem("cart")) {
  sessionStorage.setItem("cart", JSON.stringify([]));
}

// Render product list
function renderProducts() {
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - $${product.price}
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });
}

// Render cart list
function renderCart() {
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  cartList.innerHTML = "";
  if (cart && cart.length > 0) {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price} x ${item.quantity || 1}`;
      cartList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty.";
    cartList.appendChild(li);
  }
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.id === productId);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(sessionStorage.getItem("cart"));
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Clear cart
function clearCart() {
  sessionStorage.setItem("cart", JSON.stringify([]));
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

it("should display product list and shopping cart", () => {
  cy.visit(baseUrl + "/main.html");
  cy.get("h1").contains("Products");
  cy.get("ul#product-list").children("li").should("have.length", 5);
  cy.get("h2").contains("Shopping Cart");
  cy.get("ul#cart-list").should("be.empty");
  cy.get("button#clear-cart-btn").contains("Clear Cart");
});

it("should add items to cart", () => {
  cy.visit(baseUrl + "/main.html");
  cy.get("ul#product-list").children("li").first().children("button").click();
  cy.get("ul#cart-list").children("li").should("have.length", 1);
  cy.get("ul#product-list").children("li").last().children("button").click();
  cy.get("ul#cart-list").children("li").should("have.length", 2);
});

it("should persist cart items in sessionStorage", () => {
  cy.get("ul#product-list").children("li").first().children("button").click();
  cy.window().its("sessionStorage").should("have.length", 1);
  cy.window().its("sessionStorage").invoke("getItem", "cart").then((cart) => {
    const cartArray = JSON.parse(cart);
    const expectedCart = [
      { id: 1, name: "Product 1", price: 10, quantity: 1 },
      { id: 5, name: "Product 5", price: 50, quantity: 1 }
    ];
    // Sort both arrays before comparing
    const sortedActualCart = cartArray.sort((a, b) => a.id - b.id);
    const sortedExpectedCart = expectedCart.sort((a, b) => a.id - b.id);
    expect(sortedActualCart).to.deep.equal(sortedExpectedCart);
  });
});