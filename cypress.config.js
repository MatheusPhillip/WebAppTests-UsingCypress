const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://barrigarest.wcaquino.me'
  },
  env: {


    // URLs

    page_login: 'https://barrigareact.wcaquino.me/',


    // VARIABLES

    account_name: 'test account',
    account_to_be_updated_name: 'Conta para alterar',
    account_name_updated: 'test account updated',
    account_duplicated_name: 'duplicated account name',
    account_name_to_make_transaction: 'Conta para movimentacoes',
    account_name_to_get_balance: 'Conta para saldo',

    transaction_name_desc_to_be_deleted: 'Movimentacao para exclusao'
    
  }
});
