const mongoose = require("mongoose")
const Schema = mongoose.Schema

const restrictionSchema = Schema({
    playerTag: String,
    restrictions: { leaderboard: Boolean }
})

const restrictions = mongoose.model("Restriction", restrictionSchema)

module.exports = restrictions