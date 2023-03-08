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

    // USERs AND PASSWORDS

    user_login: 'manophillip2015@gmail.com',
    user_password: 'seubarriga',

    // VARIABLES

    account_name: "test account",
    account_name_updated: 'test account updated'

  }
});
