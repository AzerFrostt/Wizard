require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const profile = require('./schema');

const findTag = async (discordID) => 
    profile.findOne({
        discordID
    }).then((result) => result?.tag)

const saveDefaultProfile = async (tag, discordID) => 
    profile.updateOne({
        discordID
    }, 
    { $set: { tag: tag }},
    { upsert: true })

const removeDefaultProfile = async (discordID) =>
    profile.deleteOne({discordID}).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

module.exports = {
    findTag,
    saveDefaultProfile,
    removeDefaultProfile
}