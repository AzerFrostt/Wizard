const mongoose = require("mongoose")
const Schema = mongoose.Schema

const leaderboardSnapshotSchema = Schema({
    discordID: String,
    discordUsername: String,
    gameName: String,
    gameTag: String,
    trophiesLegends: Number,
    trophiesBuilders: Number
})

const leaderboardSnapshots = mongoose.model("Leaderboard_Snapshot", leaderboardSnapshotSchema)

module.exports = leaderboardSnapshots