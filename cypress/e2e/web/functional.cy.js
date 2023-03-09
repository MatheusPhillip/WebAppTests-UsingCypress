/// <reference types="cypress" />

import locators from '../../support/locators'
import '../../support/accountCommands'

// https://barrigareact.wcaquino.me/

describe("Should test at functional level", () =>{
    // IT CREATES, UPDATE AND DELETE AN ACCOUNT

    before( function ()  {

        cy.fixture('user').as('user').then(() => {
            cy.login(this.user.login, this.user.password)
        })
        cy.resetApp()
        cy.logout()
    })

    beforeEach(function () {

        // env variables can be found at the cypress.config.js file

        // command created at the commands.js file
        cy.fixture('user').as('user').then(() => {
            cy.login(this.user.login, this.user.password)
        })
    })

    it('Should create a bank account', function () {
        cy.accessAccountMenu()
        cy.addAccount(Cypress.env('account_name'))
        cy.fixture('toast_success_messages').as('toast').then(() => {
            cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.account_created)
        })
    })

    it('Should update an account', function ()  {
        cy.accessAccountMenu()
        cy.xpath(locators.ACCOUNTS.XP_BTN_UPDATE).click()
        cy.get(locators.ACCOUNTS.NAME_INPUT_FIELD)
            .clear()
            .type(Cypress.env('account_name_updated'))
        cy.get(locators.ACCOUNTS.BTN_SAVE).click()
        cy.fixture('toast_success_messages').as('toast').then(() => {
            cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.account_updated)
        })    
    })

    it('Should delete an account', function () {
        cy.accessAccountMenu()
        cy.xpath(locators.ACCOUNTS.XP_UPDATED_ACCOUNT_BTN_UPDATED).click()
        cy.fixture('toast_success_messages').as('toast').then(() => {
            cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.account_deleted)
        })
    })

    it('Should not create two accounts with the same name', function() {
        cy.accessAccountMenu()

        // CREATES AN ACCOUNT WITH THE NAME 'test account'
        cy.addAccount(Cypress.env('account_name'))
        cy.get(locators.ACCOUNTS.BTN_SAVE)
        cy.fixture('toast_success_messages').as('toast').then(() => {
            cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.account_created)
        })

        // CREATES A SECOND ACCOUNT USING THE SAME NAME 'test account'
        cy.addAccount(Cypress.env('account_name'))
        cy.get(locators.ACCOUNTS.BTN_SAVE)
        cy.fixture('toast_error_messages').as('toast').then(() =>{
            cy.get(locators.TOAST_MESSAGE).should('contain', this.toast.duplicated_account)
        })
    })
    
})
