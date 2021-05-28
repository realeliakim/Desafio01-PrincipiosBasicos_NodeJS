const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function ProjectExists(req, res, next){
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if(!project){
        return res.status(400).json({ error: 'Projeto não encontrado' });
    }

    return next();
}

function logRequests(req, res, next){
    console.count("Número de requisições");

    return next();
}

server.use(logRequests);


//Retorna todos os projetos

server.get('/projects', (req, res) => {
    return res.json(projects);
});

//Cadastra um novo projeto
server.post('/projects', (req, res) =>{
    const { id, title } = req.body;
    
    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});


//Altera o título do projeto pegando o id do projeto.
server.put('/projects/:id', ProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});


//Deleta o projeto passando o id do projeto
server.delete('/projects/:id', ProjectExists, (req, res) => {
    const { id } = req.params;
    const project = projects.findIndex(p => p.id == id);

    projects.splice(project, 1);

    return res.json({message: `Projeto ${project} deletado com sucesso`});
});


//Adiciona uma nova tarefa através de um determinado id do projeto
server.post('/projects/:id/tasks', ProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3000);