/** @format */
const axios = require('axios')
const { launchesModel } = require('./launches.mongoose');
const { PlanetModel } = require('./planets.mongoose');


const DEFAULT_FLIGHT_NUMBER = 100;


const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }

                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading launch data ...')
        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs;



    for (let launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customer = payloads.flatMap((payload) => {
            return payload['customers']
        })
        console.log(customer)
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customer,
        }
        console.log(`${launch.flightNumber} ${launch.mission}`)
        //TODO:populate launhhes collection
        await saveLaunch(launch)
    }

}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })
    if (firstLaunch) {
        console.log('we have launches');
        return;
    }
    await populateLaunches()
}

const findLaunch = async (filter) => {
    return await launchesModel.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesModel.findOne().sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}
async function getAllLaunches(skip, limit) {
    return await launchesModel.find({}, { _id: 0, __v: 0 })
        .skip(skip)
        .limit(limit)
        ;
}

async function saveLaunch(launch) {
    try {

        await launchesModel.updateOne(
            {
                flightNumber: launch.flightNumber,
            },
            launch,
            {
                upsert: true,
            }
        );
    } catch (err) {
        console.log(err);
    }
}

async function addNewLaunches(launch) {
    console.log(launch)
    const planet = await PlanetModel.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        console.log('error');
        throw new Error('no matching planet found');
    }
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

async function removeLaunches(launchId) {
    const aborted = await launchesModel.updateOne(
        { flightNumber: launchId },
        { upcoming: false, success: false }
    );
    return aborted.modifiedCount === 1
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    addNewLaunches,
    removeLaunches,
    existsLaunchWithId,
};
