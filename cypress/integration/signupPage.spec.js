describe('The Signup Page', () => {

  before(() => {
    // run dev script to clean and seed the database with test users
    cy.exec('npm run db:devReset && npm run db:devSeed')
  })

  beforeEach(() => {
    // Logout
    cy.request('http://localhost:5000/auth/logout')
    // Go to signup page
    cy.visit('/signup')
  })

  it('Successful Signup', () => {
    const email = 'user4@like.com';
    const username = 'user4';
    const password = 'pass4';
    const confirmation = 'pass4';

    // Create an account
    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_username]').type(username);

    cy.get('input[id=basic_password]').type(password);

    cy.get('input[id=basic_confirmation]').type(confirmation);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/dashboard');

    cy.contains(username)

  })

  it('Wrong confirmation', () => {
    const email = 'user5@like.com';
    const username = 'user5';
    const password = 'pass5';
    const confirmation = 'pas5';

    // Create an account
    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_username]').type(username);

    cy.get('input[id=basic_password]').type(password);

    cy.get('input[id=basic_confirmation]').type(confirmation);

    cy.get('button[type=submit]').click();

    cy.contains('Password and confirmation do not match');
  })

})