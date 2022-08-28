const mongoose = require("mongoose")
const Schema = mongoose.Schema

const guildTogglesSchema = Schema({
    guildID: String,
    lockLeaderboard: Boolean
})

const guildToggles = mongoose.model("Toggle", guildTogglesSchema)

module.exports = guildToggles