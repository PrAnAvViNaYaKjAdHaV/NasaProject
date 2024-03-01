const { Schema, model } = require('mongoose')

const PlanetSchema = new Schema({
    keplerName: { type: 'string', required: true }
})
const PlanetModel = model('Planet', PlanetSchema)
module.exports = {
    PlanetSchema,
    PlanetModel
}