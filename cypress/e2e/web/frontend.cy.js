/// <reference types="cypress" />

import locators from "../../support/locators";
import "../../support/accountCommands";
import buildEnv from "../../support/buildEnv";

// https://barrigareact.wcaquino.me/

describe("Should test using mocks", () => {
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

  it("Should create a transaction", function () {
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
    cy.get(locators.EXTRACT.LINES).should("have.length", 8);
    cy.xpath(
      locators.EXTRACT.FN_XP_SEARCH_TRANSACTION("Desc", "123,00")
    ).should("exist");
  });

  it("Should get balance", function () {
    
    cy.intercept('GET', '/transacoes/**', {
      body: [{
        "conta": "Conta para saldo",
        "id": 1666130,
        "descricao": "Movimentacao 1, calculo saldo",
        "envolvido": "CCC",
        "observacao": null,
        "tipo": "REC",
        "data_transacao": "2023-06-13T03:00:00.000Z",
        "data_pagamento": "2023-06-13T03:00:00.000Z",
        "valor": "3500.00",
        "status": false,
        "conta_id": 1778503,
        "usuario_id": 36921,
        "transferencia_id": null,
        "parcelamento_id": null
    },]
    })

    cy.get(locators.MENU.HOME).click();
    cy.xpath(
      locators.BALANCE.FN_XP_ACCOUNT_BALANCE("Wallet","100,00")
    ).should("exist");

  });

  it("Should delete a transaction", function () {

    cy.intercept('DELETE', '/transacoes/**', {
      statusCode: 204
    }).as('del');

    cy.get(locators.MENU.EXTRACT).click();
    cy.xpath(
      locators.EXTRACT.FN_XP_DELETE_TRANSACTION("Desc")
    ).click();
  });

  it("Should validate data sent to create a bank account", function () {

    cy.intercept('POST', '/contas', (req) => {
      req.reply({
        body:[
          {id: 3, nome: Cypress.env("account_name"), visivel: true, usuario_id: 1}
        ]
      })
      console.log(req)
      expect(req.body.nome).to.be.empty;
      expect(req.headers).to.have.property('authorization');
      expect(req.headers).to.have.property
    }).as('saveAccount')

    cy.accessAccountMenu();
    
    cy.intercept('GET', '/contas', {
      body:[
        {id: 1, nome:"Wallet", visivel: true, usuario_id: 1},
        {id: 2, nome:"Bank", visivel: true, usuario_id: 1},
        {id: 3, nome: Cypress.env("account_name"), visivel: true, usuario_id: 1},
      ]
    }).as('savedAccounts')

    cy.addAccount('{CONTROL}');

    // Validate request
    //1
    //cy.wait('@saveAccount').its('request.body.nome').should('not.be.empty')
    //2
    //req.reply
    /*
      cy.intercept('POST', '/contas', (req) => {
      req.reply({
        body:[
          {id: 3, nome: Cypress.env("account_name"), visivel: true, usuario_id: 1}
        ]
      })
      console.log(req)
      expect(req.body.nome).to.be.empty;
      expect(req.headers).to.have.property('authorization');
      expect(req.headers).to.have.property
    }).as('saveAccount')
    */
    cy.fixture("toast_success_messages")
      .as("toast")
      .then(() => {
        cy.get(locators.TOAST_MESSAGE).should(
          "contain",
          this.toast.account_created
        );
      });
  });

  it('Should test colors', function () {

    cy.intercept('GET', '/extrato/**', {
      body:[
        {
            "conta": "Conta com movimentacao",
            "id": 1666129,
            "descricao": "Receita paga",
            "envolvido": "BBB",
            "observacao": null,
            "tipo": "REC",
            "data_transacao": "2023-06-13T03:00:00.000Z",
            "data_pagamento": "2023-06-13T03:00:00.000Z",
            "valor": "-1500.00",
            "status": true,
            "conta_id": 1778502,
            "usuario_id": 36921,
            "transferencia_id": null,
            "parcelamento_id": null
        },
        {
            "conta": "Conta para saldo",
            "id": 1666130,
            "descricao": "Receita pendente",
            "envolvido": "CCC",
            "observacao": null,
            "tipo": "REC",
            "data_transacao": "2023-06-13T03:00:00.000Z",
            "data_pagamento": "2023-06-13T03:00:00.000Z",
            "valor": "3500.00",
            "status": false,
            "conta_id": 1778503,
            "usuario_id": 36921,
            "transferencia_id": null,
            "parcelamento_id": null
        },
        {
            "conta": "Conta para saldo",
            "id": 1666131,
            "descricao": "Despesa paga",
            "envolvido": "DDD",
            "observacao": null,
            "tipo": "DESP",
            "data_transacao": "2023-06-13T03:00:00.000Z",
            "data_pagamento": "2023-06-13T03:00:00.000Z",
            "valor": "-1000.00",
            "status": true,
            "conta_id": 1778503,
            "usuario_id": 36921,
            "transferencia_id": null,
            "parcelamento_id": null
        },
        {
            "conta": "Conta para saldo",
            "id": 1666132,
            "descricao": "Despesa pendente",
            "envolvido": "EEE",
            "observacao": null,
            "tipo": "DESP",
            "data_transacao": "2023-06-13T03:00:00.000Z",
            "data_pagamento": "2023-06-13T03:00:00.000Z",
            "valor": "1534.00",
            "status": false,
            "conta_id": 1778503,
            "usuario_id": 36921,
            "transferencia_id": null,
            "parcelamento_id": null
        }
    ]
    }).as('accountsForTransaction')

    cy.get(locators.MENU.EXTRACT).click()
    cy.xpath(locators.EXTRACT.FN_XP_GET_LINE('Receita paga')).should('have.class', 'receitaPaga');
    cy.xpath(locators.EXTRACT.FN_XP_GET_LINE('Receita pendente')).should('have.class', 'receitaPendente');
    cy.xpath(locators.EXTRACT.FN_XP_GET_LINE('Despesa paga')).should('have.class', 'despesaPaga');
    cy.xpath(locators.EXTRACT.FN_XP_GET_LINE('Despesa pendente')).should('have.class', 'despesaPendente');
  })

  it.only('Should test responsiveness', function () {
    cy.get('[data-test=menu-home]').should('exist')
      .and('be.visible')
    
    // Update resolution for a smartphone type using numbers
    cy.viewport(500, 700)
    
    cy.get('[data-test=menu-home]').should('exist')
      .and('not.be.visible')
    
    // Update resolution for a smartphone type using a type of phone

    cy.viewport('iphone-5')
    
    cy.get('[data-test=menu-home]').should('exist')
      .and('not.be.visible')
  })

});
