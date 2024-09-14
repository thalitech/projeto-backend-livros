const express = require("express") //aqui estou iniciando o express
const router = express.Router() //aqui estou configurando a primeira parte da rota

const cors = require('cors') // aqui estou trazendo o pacote cors que permite consumir api no frontend
const conectaBancoDeDados = require('./bancoDeDados') //ligando ao arquivo banco de dados
conectaBancoDeDados() //chamando a função que conecta o banco de dados

const Livro = require('./livroModel')

const app = express() //iniciando o app
app.use(express.json())
app.use(cors())
const porta = 3333 //iniciando a porta

//GET com banco de dados
async function mostraLivros(request, response){
    try{
        const livrosVindosDoBancoDeDados = await Livro.find()
        response.json(livrosVindosDoBancoDeDados)
    } catch(erro){
        console.log(erro)
    }
}

//POST com banco de dados
async function criaLivro(request,response){
    const novoLivro = new Livro ({
        nome: request.body.nome,
        autora: request.body.autora,
        categoria: request.body.categoria,
    })

    try{
        const livroCriado = await novoLivro.save()
        response.status(201).json(livroCriado)
    } catch (erro) {
        console.log(erro)
    }
}

//PATCH com banco de dados
async function corrigeLivro(request, response){
    try{
        const livroEncontrado = await Livro.findById(request.params.id)

        if(request.body.nome){
            livroEncontrado.nome = request.body.nome
        }
        if(request.body.autora){
            livroEncontrado.autora = request.body.autora
        }
        if(request.body.categoria){
            livroEncontrado.categoria = request.body.categoria
        }

        const LivroAtualizadoNoBancoDeDados = await livroEncontrado.save()
        response.json(LivroAtualizadoNoBancoDeDados)

    } catch (erro){
        console.log(erro)
    }
    
}

//DELETE com banco de dados
async function deletaLivro(request,response){
    try{
        await Livro.findByIdAndDelete(request.params.id)
        response.json({messagem: 'Livro deletado com sucesso!'})
    } catch (erro) {
        console.log(erro)
    }
}

//PORTA
function mostraPorta() {
    console.log('Servidor criado e rodando na porta', porta)
}
app.use(router.get('/livros', mostraLivros)) //configurei rota GET 
app.use(router.post('/livros', criaLivro)) //configurei rota post 
app.use(router.patch('/livros/:id', corrigeLivro)) //configurei rota patch 
app.use(router.delete('/livros/:id', deletaLivro)) //configurei rota delete 
app.listen(porta, mostraPorta) //servidor ouvindo a porta

