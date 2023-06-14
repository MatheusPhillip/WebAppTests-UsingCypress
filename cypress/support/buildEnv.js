const buildEnv = () => {

    cy.intercept('POST', '/signin', {
        body: {
          id: 1000,
          nome:'Fake user',
          token:"An enormous string that shouldn't be accepted, but it will"
        }
      }).as('signin')

    cy.intercept('GET', '/saldo', {
        body: [{
          conta_id: 999,
          conta:"Wallet",
          saldo:"100.00"
        },
        {
          conta_id: 99909,
          conta:"Bank",
          saldo:"10000000.00"
        }]
  
      }).as('balance')

    cy.intercept('GET', '/contas', {
        body:[
          {id: 1, nome:"Wallet", visivel: true, usuario_id: 1},
          {id: 2, nome:"Bank", visivel: true, usuario_id: 2}
        ]
      }).as('accounts')

      cy.intercept('GET', '/extrato/**', {
        body:[
          {
              "conta": "Conta com movimentacao",
              "id": 1666129,
              "descricao": "Movimentacao de conta",
              "envolvido": "BBB",
              "observacao": null,
              "tipo": "DESP",
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
          },
          {
              "conta": "Conta para saldo",
              "id": 1666131,
              "descricao": "Movimentacao 2, calculo saldo",
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
              "descricao": "Movimentacao 3, calculo saldo",
              "envolvido": "EEE",
              "observacao": null,
              "tipo": "REC",
              "data_transacao": "2023-06-13T03:00:00.000Z",
              "data_pagamento": "2023-06-13T03:00:00.000Z",
              "valor": "1534.00",
              "status": true,
              "conta_id": 1778503,
              "usuario_id": 36921,
              "transferencia_id": null,
              "parcelamento_id": null
          },
          {
              "conta": "Conta para extrato",
              "id": 1666133,
              "descricao": "Movimentacao para extrato",
              "envolvido": "FFF",
              "observacao": null,
              "tipo": "DESP",
              "data_transacao": "2023-06-13T03:00:00.000Z",
              "data_pagamento": "2023-06-13T03:00:00.000Z",
              "valor": "-220.00",
              "status": true,
              "conta_id": 1778504,
              "usuario_id": 36921,
              "transferencia_id": null,
              "parcelamento_id": null
          },
          {
              "conta": "Conta para movimentacoes",
              "id": 1666134,
              "descricao": "Desc",
              "envolvido": "Bank name",
              "observacao": null,
              "tipo": "REC",
              "data_transacao": "2023-06-13T03:00:00.000Z",
              "data_pagamento": "2023-06-13T03:00:00.000Z",
              "valor": "123.00",
              "status": true,
              "conta_id": 1778501,
              "usuario_id": 36921,
              "transferencia_id": null,
              "parcelamento_id": null
          },
          {
              "conta": "Conta mesmo nome",
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
      ]
      }).as('accountsForTransaction')
    
}

export default buildEnv