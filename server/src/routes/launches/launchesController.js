/** @format */

const {
    getAllLaunches,
    addNewLaunches,
    removeLaunches,
    existsLaunchWithId,
} = require('../../models/launches.model');


const {
    getPagination,
} = require('../../services.js/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query)
    const Launches = await getAllLaunches(skip, limit)
    return res.status(200).json(Launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (
        !launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target
    ) {
        return res.status(400).json({
            error: 'Missing required launch property'
        })
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }

    await addNewLaunches(launch);

    return res.status(201).json(launch);
}

async function httpRemoveLaunch(req, res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await existsLaunchWithId(launchId)
    if (!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    } else {
        const aborted = await removeLaunches(launchId)
        if (!aborted) {
            return res.status(400).json({ error: 'Launch not aborted' })
        }
        return res.status(200).json({
            ok: true
        })
    }

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpRemoveLaunch
};
