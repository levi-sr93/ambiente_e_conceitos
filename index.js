const express = require('express');

const server = express();

server.use(express.json());


//localhost:3000/teste

//Query params = ?teste=1
//Route params = /users/1
//Request Body = { "name": "Diego", "email": "Diego@rocketseat.com"}

const users = ['Diego', 'Robson', 'Victor']

server.use((req, res, next) => {
    console.time('Request')
    console.log(`Método ${req.method} URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

//Função para ser usada como middleware para checar se há info no request.body

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Username is required' });
    }

    return next();
}

//Criando um middleware local que verifica se existe user com o indice passado na url
function checkUserInArray(req, res, next) {
    const user = users[req.params.index];
    
    if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    req.user = user;
    return next();
}

//Obtendo todos os usuários
server.get('/users', (req, res) => {
    return res.json(users);
})

//Obtendo um usuário específico
server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
})

//Criando um novo usuário
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    
    return res.json(users);
})

//Alterações de usuários
server.put('/users/:index', checkUserInArray,  checkUserExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});


server.listen(3000);

