/// <reference types="cypress" />

import locators from "../../support/locators";
import "../../support/accountCommands";

// https://barrigareact.wcaquino.me/

describe("Should test at functional level", () => {
  // IT CREATES, UPDATE AND DELETE AN ACCOUNT

  before(function () {
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.login(this.user.login, this.user.password);
      });
    cy.resetApp();
    cy.logout();
  });

  beforeEach(function () {
    // env variables can be found at the cypress.config.js file

    // command created at the commands.js file
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.login(this.user.login, this.user.password);
      });
  });

  it("Should create a bank account", function () {
    cy.accessAccountMenu();
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
    cy.accessAccountMenu();
    cy.xpath(
      locators.ACCOUNTS.FN_XP_BTN_UPDATE(
        Cypress.env("account_to_be_updated_name")
      )
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
    cy.accessAccountMenu();

    // CREATES AN ACCOUNT WITH THE NAME 'duplicated account name'
    cy.addAccount(Cypress.env("account_duplicated_name"));
    cy.get(locators.ACCOUNTS.BTN_SAVE);
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.account_created
        );
      });

    // CREATES A SECOND ACCOUNT USING THE SAME NAME 'duplicated account name'
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

  it("Should create a transaction", function () {
    cy.get(locators.MENU.TRANSACTION).click();

    // CREATING A TRANSACTION
    cy.get(locators.ACCOUNT_TRANSACTION.DESCRIPTION).type("Desc");
    cy.get(locators.ACCOUNT_TRANSACTION.VALUE).type("123");
    cy.get(locators.ACCOUNT_TRANSACTION.INTERESTED).type("Bank name");
    cy.get(locators.ACCOUNT_TRANSACTION.ACCOUNT).select(
      Cypress.env("account_name_to_make_transaction")
    );
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
