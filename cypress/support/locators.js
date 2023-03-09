const locators = {

    LOGIN: {
        USER: '[data-test="email"]',
        PASSWORD: '[data-test="passwd"]',
        BTN_LOGIN: '.btn'
    },
    MENU: {
        SETTINGS: '[data-test="menu-settings"]',
        ACCOUNTS_OPTION: '[href="/contas"]',
        RESET_OPTION: '[href="/reset"]',
        LOGOUT_OPTION: '[href="/logout"]'
    },
    ACCOUNTS:{
        NAME_INPUT_FIELD: '[data-test="nome"]',
        BTN_SAVE: '.btn',
        XP_BTN_UPDATE: `//table//td[contains(., \'${Cypress.env('account_name')}\')]/..//i[@class='far fa-edit']`,
        XP_UPDATED_ACCOUNT_BTN_UPDATED: `//table//td[contains(., \'${Cypress.env('account_name_updated')}\')]/..//i[@class='far fa-trash-alt']`
    },
    TOAST_MESSAGE: '.toast-message'

}

export default locators;