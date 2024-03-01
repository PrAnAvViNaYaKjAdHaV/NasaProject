const path = require('path');
const { parse } = require('csv-parse');
const fs = require('fs');
const { PlanetModel } = require('./planets.mongoose')

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, rejects) => {
        fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err);
                rejects(err)
            })
            .on('end', async () => {
                const countPlanets = (await getAllplanets()).length;
                console.log(`${countPlanets} habitable planets found!`);
                resolve();
            });
    })
}

async function getAllplanets() {
    return await PlanetModel.find({}, { '_id': 0, '__v': 0 })
}

async function savePlanet(planet) {
    try {
        await PlanetModel.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loadPlanetsData,
    getAllplanets,
}