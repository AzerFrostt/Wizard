const mongoose = require("mongoose")
const Schema = mongoose.Schema

const profileSchema = Schema({
    discordID: String,
    tag: String
})

const profile = mongoose.model("Profile", profileSchema)

module.exports = profile