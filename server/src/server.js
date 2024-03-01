
const http = require('http')

require('dotenv').config();

const app = require('./app')

const { mongoConnect } = require('./services.js/mongo')

const { loadPlanetsData } = require('./models/planets.model');

const { loadLaunchesData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchesData()
}


startServer()

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})
