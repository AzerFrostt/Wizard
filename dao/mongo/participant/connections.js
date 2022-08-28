require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const participants = require('./schema');

const getLeaderboardAccounts = async () => 
    participants.find().then((result) => result)

const checkIfCompetingInBoth = async (tag, discordID) => 
    participants.findOne({
        discordID,
        playerTag: tag,
        leaderboard: true,
        builderleaderboard: true
    }).then((result) => { 
        if (result) return true
        return false
    })

const updateLeaderboardParticipation = async (tag, discordID, leaderboard, builderleaderboard) =>
    participants.updateOne({ discordID, playerTag: tag },
    { $set: { leaderboard: leaderboard, builderleaderboard: builderleaderboard } },
    { upsert: true })

const uncompete = async ( tag, discordID ) =>
    participants.deleteOne({ discordID, playerTag: tag }).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

const uncompeteAnyone = async ( tag ) =>
    participants.deleteOne({ playerTag: tag }).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

const uncompeteAllAccounts = async ( discordID ) =>
    participants.deleteMany({
        discordID
    }).then(result => result)
    .catch((e) => console.log(e))

const resetLeaderboards = async () =>
    participants.deleteMany( { } ).catch(e => console.log(e))


module.exports = {
    getLeaderboardAccounts,
    checkIfCompetingInBoth,
    updateLeaderboardParticipation,
    uncompete,
    uncompeteAnyone,
    uncompeteAllAccounts,
    resetLeaderboards
}