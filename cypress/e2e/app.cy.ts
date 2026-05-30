describe('Sembark Shop', () => {
  it('loads homepage and shows open product cards', () => {
    cy.visit('/')
    cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0)
  })

  it('applies category filters and preserves parameters in the URL', () => {
    cy.visit('/')
    cy.get('[data-cy=category-1]').click()
    cy.url().should('include', 'categories=1')
    cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0)
  })

  it('opens a product detail page and adds an item to the cart', () => {
    cy.visit('/')
    cy.get('[data-cy=product-card]').first().click()
    cy.contains('Add to Cart').click()
    cy.get('[data-cy=cart-count]').should('contain.text', '1')
    cy.visit('/cart')
    cy.get('[data-cy=cart-item]').should('have.length.greaterThan', 0)
  })

  it('removes an item from the cart', () => {
    cy.visit('/')
    cy.get('[data-cy=product-card]').first().click()
    cy.contains('Add to Cart').click()
    cy.visit('/cart')
    cy.get('[data-cy=remove-cart-item]').first().click()
    cy.contains('Your cart is empty')
  })
})
