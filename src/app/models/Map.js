const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Map = new Schema({
    mapName: { type: String, required: true },
    dogPosition: {type: Object, required: true, default: {x: 0, y: 0}},
    catPosition: {type: Object, required: true, default: {x: 0, y: 0}},
    obstacles: {type: Array, required: true, default: []},
    previousMapId: {type: String, required: false, default: null},
    disabled: {type: Boolean, required: true, default: false},
})

module.exports = mongoose.model('Map', Map)