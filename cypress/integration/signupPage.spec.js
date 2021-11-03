describe('The Signup Page', () => {

  before(() => {
    // run dev script to clean and seed the database with test users
    cy.exec('npm run db:devReset && npm run db:devSeed')
  })

  beforeEach(() => {
    // Logout

    // Go to signup page
    cy.visit('/signup')
  })

  it('Successful Signup', () => {
    const email = 'user4@like.com';
    const password = 'pass4';

    // Create an account
    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('input[id=basic_confirmation]').type(password);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/login');

    // Then login
    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/profile');

  })

  it('Wrong confirmation', () => {
    const email = 'user4@like.com';
    const password = 'pass4';
    const confirmation = ('pas4');

    // Create an account
    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('input[id=basic_confirmation]').type(confirmation);

    cy.get('button[type=submit]').click();

    cy.contains('Password and confirmation do not match');
  })

})