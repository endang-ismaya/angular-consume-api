describe('WikiSearch App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the app title', () => {
    cy.get('app-search-bar').should('exist');
    cy.get('app-page-list').should('exist');
  });

  it('should have a search input', () => {
    cy.get('input').should('have.attr', 'placeholder', 'Search Wikipedia...');
  });

  it('should search and display results', () => {
    cy.get('input').type('angular');
    cy.get('button').click();
    // Wait for API response
    cy.wait(2000);
    cy.get('app-page-list .card').should('have.length.greaterThan', 0);
  });
});
