/// <reference types="cypress" />

// https://barrigarest.wcaquino.me/

import '../../support/commands_backend'

describe("Should test at functional level", () =>{
    
    // The variable token will be the token used on every test
    let token

    before( function ()  {
        cy.fixture('user').as('user').then(() =>{
            cy.getToken(this.user.login, this.user.password)
                .then(tkn => {
                    token = tkn
                })
        })
    })

    beforeEach(function () {
        cy.fixture('user').as('user').then(() =>{
            cy.appResetRest(this.user.login, this.user.password)
        })
    })

    it('Should create a bank account', function () {
        
        
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: {
                Authorization: `JWT ${token}`
            },
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')
        
        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    

    })

    it.only('Should update an account', function ()  {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: {Authorization: `JWT ${token}`},
            qs: {
                nome: 'Conta para alterar'
            }
        }).then(res => {

            cy.request({
                url: `https://barrigarest.wcaquino.me/contas/${res.body[0].id}`,
                method: 'PUT',
                headers: {Authorization: `JWT ${token}`},
                body: {
                    nome: 'Account updated using rest'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Should delete an account', function () {
        
    })

    it('Should not create two accounts with the same name', function() {
        
    })

    it('Should create a transaction', function() {
        
    })

    it('Should get balance', function() {
        
    })

    it('Should delete a transaction', function() {
        
    })
})

