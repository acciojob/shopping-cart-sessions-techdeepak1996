() => {
  cy.get("ul#product-list").children("li").first().children("button").click();
  cy.window().its("sessionStorage").should("have.length", 1);
  cy.window().its("sessionStorage").invoke("getItem", "cart").then((cart) => {
    const cartArray = JSON.parse(cart);
    const expectedCart = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 5, name: "Product 5", price: 50 },
      { id: 1, name: "Product 1", price: 10 }
    ];
    expect(cartArray.sort()).to.deep.equal(expectedCart.sort());
  });
}