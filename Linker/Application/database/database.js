const express = require('express')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const server  = require('./server')
const Pool = require('pg').Pool

const app = express();

// Configuração do middleware para tratar o corpo das requisições
app.use(express.json());

// Configuração do middleware de sessão
app.use(session({
  secret: 'mysecret', // Chave secreta para assinar a sessão (pode ser qualquer valor)
  resave: false,
  saveUninitialized: false
}));


class Database {
    constructor(session){
        this.db =  new Pool(server) // Configurando o banco de dados
        this.session = session || {}; // Inicializando this.session como um objeto vazio se não for fornecido
    }

    // Nesse método vamos criar novos usuários via suas informações enviada pelo cliente (POST method)
    async registro(user){
        // Verificando se o usuário já não existe no banco de dados, caso contrário criando o usuário novo
        const database_response = await this.db.query("SELECT id, name, email, password FROM users WHERE email = $1", [user.email]);
        const account = database_response.rows
        if (account.length > 0) {
            return {"info": "este usuário já existe","email": account[0].email, "status": 409 }; // usuário existente
        }
        else {
            // Criando Hash para criptografar a senha antes de armazenar no banco de dados
            const _hashed_password = await bcrypt.hash(user.password, 10);
            // Adicionando o novo usuário ao banco de dados
            await this.db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [user.name, user.email, _hashed_password]);
            // Retorno da API
            return {"novo usuario cadastrado": user, "status": 201}
        }
    }

    // Neste método vamos autenticar o usuário com suas credenciais e criar uma sessão para ele
    async login(user){
        // Verificando se o usuário existe no banco de dados
        const database_response = await this.db.query("SELECT id, name, email, password FROM users WHERE email = $1", [user.email])
        const account = database_response.rows
        if (account.length > 0) {
            // Validando suas credenciais de login
            const password_userlogin = user.password
            const hashedPassword_useraccount = account[0].password
            
            return new Promise((resolve, reject) => { // Comparação da senha no body com a do banco de dados
                bcrypt.compare(password_userlogin, hashedPassword_useraccount, (err, isMatch) => {
                    if (err) {
                    console.log('[Erro inesperado]: ', err);
                    reject(err);
                    }
                    if (isMatch) {
                        this.session.isAuthenticated = true; 
                        const userId =  account[0].id
                        const userEmail =  account[0].email
                        this.session.user = { id: userId, email: userEmail };
                        const token = jwt.sign({ id: userId, email: userEmail}, 'chave_secreta_do_jwt'); // gerar um token JWT com informações da sessão
                        console.log('ID/EMAIL: ', userId, userEmail)
                        resolve({"login bem sucedido": this.session, "token": token, "status": 200}); // exportar o token e a sessão para main.js
                    } 
                    else {
                        resolve({ "info": "senha incorreta, autenticação não autorizada", "email": user.email, "status": 401 }); // senha incorreta
                    }

                    console.log('isMatch:', isMatch);
                });
                
              });

        } 
        else {
            return {"info": "este usuário não possui cadastro", "email": user.email, "status": 404} // usuário inexistente
        }
    }
    // Aqui vamos retornar dados do usuário logado na sessão, ou negar o acesso
    async dashboard(userEmail) {
        const user_database_response = await this.db.query("SELECT id, name, email FROM users WHERE email = $1", [userEmail])
        const account = user_database_response.rows
        const itemUser_id = account[0].id
        const item_database_response = await this.db.query("SELECT title, content FROM linker_storage WHERE user_id=$1", [itemUser_id])
        const items = item_database_response.rows

        const response = {"user": account, "user items": items,"status": 200}
        return response
    }
    // Neste método vamos possibilitar o usuário criar novos itens no banco de dados
    async createItem(item) {
        /* Nessa aplicação não será necessário verificar se o item já existe 
        no banco de dados a partir do title pois diferentes usuários podem armazenar links
        e notas com o mesmo título.
        */
        const __user_id = item.userId.id;
        console.log('userid: ', __user_id)
        await this.db.query("INSERT INTO linker_storage (title, content, user_id) VALUES ($1, $2, $3)", [item.title, item.content, item.userId.id]);
        const response = {"info":"novo item criado com linker!","title": item.title, "content": item.content,"status": 201}
        return response
    }
}


module.exports = Database;