require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const restrictions = require('./schema');

const saveLeaderboardRestriction = async (playerTag, restricted) => 
    restrictions.updateOne({
        playerTag
    }, 
    { $set: { restrictions: { leaderboard: restricted } } },
    { upsert: true })

const isLeaderboardRestricted = async ( playerTag ) =>
    restrictions.findOne({
        playerTag
    }).then((result) => result?.restrictions?.leaderboard)

module.exports = {
    saveLeaderboardRestriction,
    isLeaderboardRestricted
}