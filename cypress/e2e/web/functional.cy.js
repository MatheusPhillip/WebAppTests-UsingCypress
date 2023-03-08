/// <reference types="cypress" />

import locators from '../../support/locators'

// https://barrigareact.wcaquino.me/

describe("Should test at functional level", () =>{
    // IT CREATES, UPDATE AND DELETE AN ACCOUNT

    beforeEach(() =>{

        // env variables can be found at the cypress.config.js file

        // visit the desired web page
        cy.visit(Cypress.env('page_login'))

        // command created at the commands.js file
        cy.login(Cypress.env('user_login'), Cypress.env('user_password'))
    })

    it('Should create a bank account', () => {
        cy.get(locators.MENU.SETTINGS).click()
        cy.get(locators.MENU.ACCOUNTS_OPTION).click()
        cy.get(locators.ACCOUNTS.NAME_INPUT_FIELD).type(Cypress.env('account_name'))
        cy.get(locators.ACCOUNTS.BTN_SAVE).click()
        cy.get(locators.TOAST_MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.get(locators.MENU.SETTINGS).click()
        cy.get(locators.MENU.ACCOUNTS_OPTION).click()
        cy.xpath(locators.ACCOUNTS.XP_BTN_UPDATE).click()
        cy.get(locators.ACCOUNTS.NAME_INPUT_FIELD)
            .clear()
            .type(Cypress.env('account_name_updated'))
        cy.get(locators.ACCOUNTS.BTN_SAVE).click()
        cy.get(locators.TOAST_MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should delete an account', () =>{
        cy.get('[data-test="menu-settings"]').click()
        cy.get('[href="/contas"]').click()
        cy.xpath(`//table//td[contains(., \'${Cypress.env('account_name_updated')}\')]/..//i[@class='far fa-trash-alt']`).click()
        cy.get('.toast-message').should('contain', 'Conta excluída com sucesso')
    })
    
})
