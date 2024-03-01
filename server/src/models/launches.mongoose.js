const { Schema, model } = require('mongoose')

const LaunchSchema = new Schema({
    flightNumber: { type: Number, required: true },
    mission: { type: String, required: true },
    rocket: { type: String, required: true },
    launchDate: { type: Date, required: true },
    target: { type: String },
    customer: [String],
    upcoming: { type: Boolean, required: true },
    success: { type: Boolean, required: true, default: true },
})
const launchesModel = model('Launch', LaunchSchema)
module.exports = {
    launchesModel
}