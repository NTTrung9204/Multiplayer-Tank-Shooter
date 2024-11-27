const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Match = new Schema({
    dogPlayers: { type: Array, required: true, default: [] },
    catPlayers: { type: Array, required: true, default: [] },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, required: true, default: null },
    winnerTeam: { type: String, required: true },
    map_id: { type: Schema.Types.ObjectId, ref: 'maps', required: true },
    gameMode: { type: String, required: true },
    history: { type: String, required: true },
    // status: { type: String, required: true },
})

module.exports = mongoose.model('Match', Match)