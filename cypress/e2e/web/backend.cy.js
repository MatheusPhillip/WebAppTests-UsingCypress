/// <reference types="cypress" />

// https://barrigarest.wcaquino.me/

import "../../support/commands_backend";
const dayjs = require("dayjs");

describe("Should test at functional level", () => {
  // The variable token will be the token used on every test
  let token;

  before(function () {
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.getToken(this.user.login, this.user.password).then((tkn) => {
          token = tkn;
        });
      });
  });

  beforeEach(function () {
    cy.fixture("user")
      .as("user")
      .then(() => {
        cy.appResetRest(this.user.login, this.user.password);
      });
  });

  it("Should create a bank account", function () {
    cy.request({
      url: "/contas",
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: {
        nome: "Conta via rest",
      },
    }).as("response");

    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("nome", "Conta via rest");
    });
  });

  it("Should update an account", function () {
    cy.getAccountByName("Conta para alterar").then((accountId) => {
      cy.request({
        method: "PUT",
        url: `/contas/${accountId}`,
        headers: { Authorization: `JWT ${token}` },
        body: {
          nome: "Account updated using rest",
        },
      }).as("response");
    });

    cy.get("@response").its("status").should("be.equal", 200);
  });

  it("Should delete an account", function () {});

  it("Should not create two accounts with the same name", function () {
    cy.request({
      method: "POST",
      url: "/contas",
      headers: { Authorization: `JWT ${token}` },
      body: {
        nome: "Conta mesmo nome",
      },
      failOnStatusCode: false,
    }).as("response");

    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal("Já existe uma conta com esse nome!");
    });
  });

  it("Should create a transaction", function () {
    cy.getAccountByName("Conta para movimentacoes").then((accountId) => {
      cy.request({
        method: "POST",
        url: "/transacoes",
        headers: { Authorization: `JWT ${token}` },
        body: {
          conta_id: accountId,
          data_pagamento: dayjs().format("DD/MM/YYYY"),
          data_transacao: dayjs().format("DD/MM/YYYY"),
          descricao: "desc",
          envolvido: "bank name",
          status: true,
          tipo: "REC",
          valor: "123",
        },
      }).as("response");
    });
    cy.get("@response").its("status").should("be.equal", 201);
    cy.get("@response").its("body.id").should("exist");
  });

  it.only("Should get balance", function () {
    cy.request({
      method: "GET",
      url: "/transacoes",
      headers: { Authorization: `JWT ${token}` },
      qs: { descricao: "Movimentacao 1, calculo saldo" },
    }).then((res) => {
		console.log(res)
      cy.request({
        url: `/transacoes/${res.body[0].id}`,
        method: "PUT",
        headers: { Authorization: `JWT ${token}` },
        body: {
          status: true,
		  data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
		  data_pagamento: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
		  descricao: res.body[0].descricao,
		  envolvido: res.body[0].envolvido,
		  valor: res.body[0].valor,
		  conta_id: res.body[0].conta_id
        },
      });
      // .its("status")
      // .should("be.equal", 200);
    });
    cy.request({
      method: "GET",
      url: "/saldo",
      headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let accountBalance = null;
      res.body.forEach((account) => {
        if (account.conta === "Conta para saldo") {
          accountBalance = account.saldo;
        }
      });
      expect(accountBalance).to.be.equal("4034.00");
    });
  });

  it("Should delete a transaction", function () {});
});
