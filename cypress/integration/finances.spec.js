const { describe, utils } = require("mocha");
/// <reference types="Cypress" />
/// <reference path="../support/index.d.ts" />
/// <reference types="Cypress" />
import { format } from '../support/utils'

context('Dev Finances Agilizei', () => {
    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/');
    })

    it('Cadastrar entradas', () => {
        //cy.get -> mapear um elemento    
        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type('Mesada') //id = descrição
        cy.get('[name=amount]').type(12) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 1) // a tabela deve ter o tamanho 1 depois que fizer a inserção
    })
    it('Cadastrar saídas', () => {
        //cy.get -> mapear um elemento    
        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type('Bombom') //id = descrição
        cy.get('[name=amount]').type(-6) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 1) // a tabela deve ter o tamanho 1 depois que fizer a inserção
    })

    it('Remove entrada e saída', () => {
        const entrada = 'Mesada'
        const saida = 'Blusa'

        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type(entrada) //id = descrição
        cy.get('[name=amount]').type(60) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type(saida) //id = descrição
        cy.get('[name=amount]').type(-6) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.contains(entrada)
            .parent()
            .find('img[onclick*=remove]')
            .click()
        cy.get('#data-table tbody tr').should('have.length', 1)
    })

    it('Validar saldo com diversas transações', () => {
        //capturar as linhas da tabela com as transações e as colunas com valores
        //capturar o texto das colunas
        //formatar valores das colunas
        //somar os valores de  entrada e saídas
        // validações matemáticas -> caputar o texto do total
        // comparar o somatório de entradas  e saídas com total
        let incomes = 0
        let expenses = 0

        const entrada = 'Mesada'
        const saida = 'Blusa'

        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type(entrada) //id = descrição
        cy.get('[name=amount]').type(60) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.get('#transaction .button').click() //#(id).(classe) -> mapeando o botão "nova transação"
        cy.get('#description').type(saida) //id = descrição
        cy.get('[name=amount]').type(-6) //atributo do campo quantidade de dinheiro
        cy.get('[type=date]').type('2021-03-17') //atributo do campo data
        cy.get('button').contains('Salvar').click() //tipo e valor 

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                //cy.log(index)
                cy.get($el).find('td.income, td.expense').invoke('text').then(text => { //capturar as linhas da tabela com as transações e as colunas com valores
                    //cy.log(text) //Valor sem formatação
                    //cy.log(format(text)) //tira o R$

                    if (text.includes('-')) {
                        expenses = expenses + format(text)
                    } else {
                        incomes = incomes + format(text)
                    }

                    cy.log('entradas', incomes)
                    cy.log('saidas', expenses)
                })
            })
        cy.get('#totalDisplay').invoke('text').then(text => {
            //cy.log('valor total', format(text))

            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })
    })
})