express = require('express');
const { httpGetAllPlanets } = require('./planets.controllers')

planetsRouter = express.Router();
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;