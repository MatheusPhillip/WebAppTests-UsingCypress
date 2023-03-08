// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import locators from '../support/locators'

Cypress.Commands.add('login', (userLogin, userPassw) => {
    // realizes the login and check if everything went well using a toast

    cy.get(locators.LOGIN.USER).type(userLogin)
    cy.get(locators.LOGIN.PASSWORD).type(userPassw)
    cy.get(locators.LOGIN.BTN_LOGIN).click()
    cy.get(locators.TOAST_MESSAGE).should('contain', 'Bem vindo')
})