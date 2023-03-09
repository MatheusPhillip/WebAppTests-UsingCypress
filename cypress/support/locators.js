const locators = {

    LOGIN: {
        USER: '[data-test="email"]',
        PASSWORD: '[data-test="passwd"]',
        BTN_LOGIN: '.btn'
    },
    MENU: {
        // HOME PAGE OPTION
        HOME: '[data-test="menu-home"]',

        // EXTRACT OPTION
        EXTRACT: '[data-test="menu-extrato"]',

        // SETTINGS OPTION
        SETTINGS: '[data-test="menu-settings"]',

        // THESE OPTIONS ARE INSIDE THE SETTINGS
        ACCOUNTS_OPTION: '[href="/contas"]',
        RESET_OPTION: '[href="/reset"]',
        LOGOUT_OPTION: '[href="/logout"]',

        // TRANSACTION OPTION
        TRANSACTION: '[data-test="menu-movimentacao"]'
        
    },
    ACCOUNTS:{
        NAME_INPUT_FIELD: '[data-test="nome"]',
        BTN_SAVE: '.btn',
        FN_XP_BTN_UPDATE: (account_name) => `//table//td[contains(., '${account_name}')]/..//i[@class='far fa-edit']`,
        FN_XP_BTN_DELETE: (account_name) => `//table//td[contains(., '${account_name}')]/..//i[@class='far fa-trash-alt']`
    },
    ACCOUNT_TRANSACTION: {
        DESCRIPTION: '[data-test="descricao"]',
        VALUE: '[data-test="valor"]',
        INTERESTED: '[data-test="envolvido"]',
        BTN_SAVE: '.btn-primary',
        STATUS: '[data-test="status"]',
        ACCOUNT: '[data-test="conta"]'
    },
    EXTRACT: {
        LINES: '.list-group > li',
        FN_XP_SEARCH_TRANSACTION: (desc, value) => `//span[contains(., '${desc}')]/following-sibling::small[contains(., '${value}')]`,
        FN_XP_DELETE_TRANSACTION: desc => `//span[contains(., '${desc}')]/../../..//i[@class='far fa-trash-alt']`
    },
    BALANCE: {
        FN_XP_ACCOUNT_BALANCE: (account_name) => `//td[contains(., '${account_name}')]/../td[contains(., '123,00')]`
        //XP_ACCOUNT_BALANCE: `//td[contains(., 'test account')]/../td[contains(., '123,00')]`
    },
    TOAST_MESSAGE: '.toast-message'

}

export default locators;