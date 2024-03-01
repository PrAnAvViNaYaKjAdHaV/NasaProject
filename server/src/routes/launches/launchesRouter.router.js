/** @format */

const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpRemoveLaunch,
} = require('./launchesController');

const express = require('express');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpRemoveLaunch);

module.exports = launchesRouter;
