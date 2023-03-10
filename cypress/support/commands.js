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

import locators from './locators'

Cypress.Commands.add('login', function (userLogin, userPassw)  {

     // visit the login web page
     cy.visit(Cypress.env('page_login'))

    // realize the login and check if everything went well using a toast
    
    cy.get(locators.LOGIN.USER).type(userLogin)
    cy.get(locators.LOGIN.PASSWORD).type(userPassw)
    cy.get(locators.LOGIN.BTN_LOGIN).click()
    cy.fixture('toast_success_messages').as('toast').then(() => {
        cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.login)
    })
})

Cypress.Commands.add('resetApp', function ()  {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.RESET_OPTION).click()
    cy.fixture('toast_success_messages').as('toast').then(() => {
        cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.app_reseted)
    })
})

Cypress.Commands.add('logout', function () {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.LOGOUT_OPTION).click()
    cy.fixture('toast_success_messages').as('toast').then(() => {
        cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.logout)
    })
})

