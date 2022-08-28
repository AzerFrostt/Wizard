const mongoose = require("mongoose")
const Schema = mongoose.Schema

const participantSchema = Schema({
    discordID: String,
    playerTag: String,
    leaderboard: Boolean,
    builderleaderboard: Boolean
})

const participants = mongoose.model("Participant", participantSchema)

module.exports = participants