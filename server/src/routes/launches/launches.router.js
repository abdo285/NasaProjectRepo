express = require('express');
const {
    httpAbortLaunch,
    httpGetAllLaunches,
    httpAddNewLaunch,
} = require('./launches.controllers')

launchesRouter = express.Router();
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id',httpAbortLaunch)

module.exports = launchesRouter;