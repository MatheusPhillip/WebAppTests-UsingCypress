const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {


    // URLs

    page_login: 'https://barrigareact.wcaquino.me/',


    // VARIABLES

    account_name: 'test account',
    account_name_updated: 'test account updated',
    
  }
});
