const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let apiCalls = 0;

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);

  if (index < 0) {
    return res.status(400).json({ error: 'Project id not found!' });
  }

  req.projectIndex = index;

  return next();
}

server.use((req, res, next) => {
  apiCalls++;

  console.log(`This API was called ${apiCalls} time(s)`);

  return next();
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  project['tasks'] = [];

  projects.push(project);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.projectIndex].tasks.push(title);

  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.projectIndex].title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  projects.splice(req.projectIndex, 1);

  return res.send();
});

server.listen(3000);
