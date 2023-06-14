/// <reference types="cypress" />

import locators from "../../support/locators";
import "../../support/accountCommands";
import buildEnv from "../../support/buildEnv";

// https://barrigareact.wcaquino.me/

describe("Should test at functional level", () => {
  // IT CREATES, UPDATE AND DELETE AN ACCOUNT

  after(function () {
    cy.clearAllLocalStorage()
  })

  
  beforeEach(function () {
    buildEnv()
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.login(this.user.login, this.user.password);
      });
    // env variables can be found at the cypress.config.js file

    // command created at the commands.js file
    /*
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.login(this.user.login, this.user.password);
      });
      //cy.resetApp();
      cy.logout();
      */

      cy.get(locators.MENU.HOME).click()
  });

  it("Should create a bank account", function () {

    

    cy.intercept('POST', '/contas', {
      body:
        {id: 3, nome: Cypress.env("account_name"), visivel: true, usuario_id: 1}
    }).as('saveAccount')

    cy.accessAccountMenu();
    
    cy.intercept('GET', '/contas', {
      body:[
        {id: 1, nome:"Wallet", visivel: true, usuario_id: 1},
        {id: 2, nome:"Bank", visivel: true, usuario_id: 1},
        {id: 3, nome: Cypress.env("account_name"), visivel: true, usuario_id: 1}

      ]
    }).as('savedAccounts')

    cy.addAccount(Cypress.env("account_name"));
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.account_created
        );
      });
  });

  it("Should update an account", function () {
    

    cy.intercept('PUT', '/contas/**', {
      body:[
        {id: 1, nome:Cypress.env("account_name_updated"), visivel: true, usuario_id: 1}
      ]
    })

    cy.accessAccountMenu();
    cy.xpath(
      locators.ACCOUNTS.FN_XP_BTN_UPDATE('Wallet')
    ).click();
    cy.get(locators.ACCOUNTS.NAME_INPUT_FIELD)
      .clear()
      .type(Cypress.env("account_name_updated"));
    cy.get(locators.ACCOUNTS.BTN_SAVE).click();
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.account_updated
        );
      });
  });

  it("Should delete an account", function () {
    cy.accessAccountMenu();
    cy.xpath(
      locators.ACCOUNTS.FN_XP_BTN_DELETE(Cypress.env("account_name_updated"))
    ).click();
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.account_deleted
        );
      });
  });

  it("Should not create two accounts with the same name", function () {
    
    cy.intercept('POST', '/contas', {
      statusCode: 400,
      body:
        {"error": "Já existe uma conta com esse nome!"}
    }).as('saveAccountDuplicated')
    
    cy.accessAccountMenu();

    // CREATES AN ACCOUNT WITH THE NAME 'duplicated account name'
    
    cy.addAccount(Cypress.env("account_duplicated_name"));
    cy.get(locators.ACCOUNTS.BTN_SAVE);
    cy.fixture("toast_error_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.duplicated_account
        );
      });
  });

  it.only("Should create a transaction", function () {
    cy.intercept('POST', '/transacoes', {
      body:
        {
          "id": 1668575,
          "descricao": "asdas",
          "envolvido": "asdasd",
          "observacao": null,
          "tipo": "REC",
          "data_transacao": "2023-06-14T03:00:00.000Z",
          "data_pagamento": "2023-06-14T03:00:00.000Z",
          "valor": "213.00",
          "status": false,
          "conta_id": 1778500,
          "usuario_id": 36921,
          "transferencia_id": null,
          "parcelamento_id": null
      }
    }).as('createTransaction')

    

    cy.get(locators.MENU.TRANSACTION).click();

    // CREATING A TRANSACTION
    cy.get(locators.ACCOUNT_TRANSACTION.DESCRIPTION).type("Desc");
    cy.get(locators.ACCOUNT_TRANSACTION.VALUE).type("123");
    cy.get(locators.ACCOUNT_TRANSACTION.INTERESTED).type("Bank name");
    cy.get(locators.ACCOUNT_TRANSACTION.ACCOUNT).select("Bank");
    
    cy.get(locators.ACCOUNT_TRANSACTION.STATUS).click();

    // CONFIRMING THE TRANSACTION
    cy.get(locators.ACCOUNT_TRANSACTION.BTN_SAVE).click();

    // VERIFYING THE MESSAGE
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.transaction
        );
      });

      cy.intercept('GET', '/extrato/**', {
        fixture: 'savedTransaction.json'
      }).as('accountsForTransaction')

    // VERIFYING IF THE NEW TRANSACTION WAS RECORDED
    cy.get(locators.EXTRACT.LINES).should("have.length", 7);
    cy.xpath(
      locators.EXTRACT.FN_XP_SEARCH_TRANSACTION("Desc", "123,00")
    ).should("exist");
  });

  it("Should get balance", function () {
    

    cy.get(locators.MENU.HOME).click();
    cy.xpath(
      locators.BALANCE.FN_XP_ACCOUNT_BALANCE(
        Cypress.env("account_name_to_get_balance"),
        "534,00"
      )
    ).should("exist");
  });

  it("Should delete a transaction", function () {
    cy.get(locators.MENU.EXTRACT).click();
    cy.xpath(
      locators.EXTRACT.FN_XP_DELETE_TRANSACTION(
        Cypress.env("transaction_name_desc_to_be_deleted")
      )
    ).click();
  });
});
