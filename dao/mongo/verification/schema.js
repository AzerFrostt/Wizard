const mongoose = require("mongoose")
const Schema = mongoose.Schema

const verifationSchema = Schema({
    discordID: String,
    playerTag: String
})

const verification = mongoose.model("Verification", verifationSchema)

module.exports = verification