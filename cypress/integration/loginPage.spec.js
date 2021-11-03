describe('The Login Page', () => {

  before(() => {
    // run dev script to clean and seed the database with test users
    cy.exec('npm run db:devReset && npm run db:devSeed')
  })

  beforeEach(() => {
    // Logout

    // Go to login page
    cy.visit('/login')
  })

  it('Successful Login', () => {
    const email = 'user1@like.com';
    const password = 'pass1';

    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/profile');

    // Watch for session cookie
    // cy.getCookie('secret_token').should('exist');
  })

  it('Wrong password', () => {
    const email = 'user1@like.com';
    const password = 'pass2';

    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/login');

    cy.contains('Invalid password');

    // Watch for session cookie
    // cy.getCookie('secret_token').should('not.exist');
  })

  it('Wrong email', () => {
    const email = 'user@like.com';
    const password = 'pass1';

    cy.get('input[id=basic_email]').type(email);

    cy.get('input[id=basic_password]').type(password);

    cy.get('button[type=submit]').click();

    cy.url().should('include', '/login');

    cy.contains('User not found');

    // Watch for session cookie
    // cy.getCookie('secret_token').should('not.exist');
  })
})
