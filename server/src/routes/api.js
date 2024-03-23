
const express = require('express')

const planetsRouter = require('./planets/planets.router')
const launchesRouter = require('./launches/launchesRouter.router.js')
const authRouter = require('./auth/auth.router.js')
const api = express.Router()

api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)
api.use('/auth', authRouter)

module.exports = api