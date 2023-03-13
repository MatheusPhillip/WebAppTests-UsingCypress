Cypress.Commands.add('getToken', (user, password) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            return token
        })
})

Cypress.Commands.add('appResetRest', (user, password) =>{
    
    cy.getToken(user, password)
    .then(token=>{
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: {Authorization: `JWT ${token}`}
        })
    }).its('status').should('be.equal', 200)
    
})