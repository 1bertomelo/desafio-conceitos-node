const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* middleware */
function validateRepositorieUuid(request, response, next) {
  const { id } = request.params;
  if (!validate(id)) {
    return response.status(400).json({ "error": "Invalid repositorie id" });
  }
  return next();
}

app.use('/projects/:id', validateRepositorieUuid);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepositorie = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(newRepositorie);
  return response.json(newRepositorie);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;


  const repositorieIndex = repositories.findIndex(respositorie => respositorie.id == id);
  if (repositorieIndex < 0) {

    return response.status(400).json({ "error": "Repositorie not found" });
  }

  const updatedRepositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  };

  repositories[repositorieIndex] = updatedRepositorie;
  return response.json(updatedRepositorie);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(respositorie => respositorie.id == id);
  if (repositorieIndex < 0) {

    return response.status(400).json({ "error": "Repositorie not found" });
  }
  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(respositorie => respositorie.id == id);
  if (repositorieIndex < 0) {

    return response.status(400).json({ "error": "Repositorie not found" });
  }
  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex]);

});

module.exports = app;
