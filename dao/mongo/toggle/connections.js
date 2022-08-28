const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const guildToggles = require('./schema');

const { IDs } = require('../../../config.json');

const toggleLeaderboard = async (lockLeaderboard) => 
    guildToggles.updateOne({
        guildID: IDs.guild
    }, 
    { $set: { lockLeaderboard: lockLeaderboard } },
    { upsert: true })

const isLeaderboardLocked = async () =>
    guildToggles.findOne({
        guildID: IDs.guild,
    }).then((result) => result.lockLeaderboard)

module.exports = {
    toggleLeaderboard,
    isLeaderboardLocked
}