const express = require ('express')
const { response, request } = require('express')
const app = express()
app.use(express.json())

const produtos = [{idProd: '1317', nome: 'Pipa', quantidade: 150, valorUnitario: 2}]

app.use((request, response, next) => {
    console.log("Controle de Estoque da Empresa ABC")
    return next()
})

const testador = (request, response, next) =>{
    const {idProd, nome, quantidade, valorUnitario} = request.body
    if(!idProd || !nome || !quantidade || !valorUnitario) {
        return response
            .status(400)
            .json({error: "O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição"})
    }
    if (idProd === produtos.idProd) {
        return response
        .status(400)
        .json({error: "Este id ja foi cadastrado."})
    }
    return next()
}

for (let i in produtos) {
    produtos[i].pTotal = produtos[i].quantidade * produtos[i].valorUnitario;
    produtos[i].pVenda = (produtos[i].valorUnitario * 0.20) + produtos[i].valorUnitario;
    produtos[i].lucro = produtos[i].pVenda - produtos[i].valorUnitario;

    if (produtos[i].quantidade < 50) {
        produtos[i].pSituacao = 'Estavel'
    }
    else if (produtos[i].quantidade > 50 && produtos[i].quantidade < 100) {
        produtos[i].pSituacao = 'Boa'
    }
    else if (produtos[i].quantidade >= 100) {
        produtos[i].pSituacao = 'Excelente'
    }
}

app.get('/produtos', (request, response,) => {
    return response.json(produtos)
})

app.get("/produtos/:id", (request, response) => {
    const { id } = request.params;
    for (let i in produtos) {
        if (id === produtos[i].idProd) {
            idProd = produtos[i] 
        }
        // else {
        //     return response
        //     .status(400)
        //     .json ({error: 'Não existe Produto com este id.'})
        // }
    }
    return response.json(idProd)
})

app.post("/produtos", testador, (request, response) => {
    const prod = request.body
    const {idProd, nome, quantidade, valorUnitario} = prod

    prod.pTotal = quantidade * valorUnitario
    prod.pVenda = (valorUnitario * 0.20) + prod.valorUnitario;
    prod.lucro = prod.pVenda - valorUnitario

    if(quantidade < 50) {
        prod.pSituacao = "Estavel"
    } else if(quantidade >= 50 && quantidade < 100){
        prod.pSituacao = "Boa"
    } else {
        prod.pSituacao = "Excelente"
    }
    
    produtos.push(prod)
    return response.json(prod)
})

app.put("/produtos/:id", testador, (request, response) =>{
    const { id } = request.params
    const prod = request.body
    const {idProd, nome, quantidade, valorUnitario} = prod
    prod.pTotal = quantidade*valorUnitario
    prod.pVenda = (valorUnitario * 0.20) + prod.valorUnitario;
    prod.lucro = prod.pVenda - valorUnitario

    if(quantidade < 50) {
        prod.pSituacao = "Estavel"
    } else if(quantidade >= 50 && quantidade < 100){
        prod.pSituacao = "Boa"
    } else {
        prod.pSituacao = "Excelente"
    }

    produtos[ id ] = prod
    return response.json(prod)
})

app.delete("/produtos/:id" , testador, (request, response) => {
    const { id } = request.params
    const {deletar} = request.body
    const filtradorDEL = produtos.find(prodt => prodt.idProd == id)
    filtradorDEL.deletar.splice (id, 1)
    return response.json(produto)
})

app.post("/produtos/:id/complemento", (request, response) => {
    const {id} = request.params
    const {complemento} = request.body
    const filtradorr = produtos.find(prodt => prodt.idProd == id)
    filtradorr.complemento.push (complemento)
    return response.json(produtos)
})

app.listen(3333, () => {
    console.log(`Servidor Rodando`)
})