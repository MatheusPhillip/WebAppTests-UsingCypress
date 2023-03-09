import locators from './locators'

Cypress.Commands.add('accessAccountMenu', () => {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.ACCOUNTS_OPTION).click()
})

Cypress.Commands.add('addAccount', (account) => {
    cy.get(locators.ACCOUNTS.NAME_INPUT_FIELD).type(account)
    cy.get(locators.ACCOUNTS.BTN_SAVE).click()
})

