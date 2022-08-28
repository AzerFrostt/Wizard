require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const verifation = require('./schema');

const tagVerified = async (tag) => 
    verifation.findOne({
        playerTag: tag
    }).then((result) => {
        if (result) return true
        return false
    })

const alreadyTaken = async (tag, discordID) => 
    verifation.findOne({
        discordID: { $ne: discordID },
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })

const isOwnerOfAccount = async (tag, discordID) => 
    verifation.findOne({
        discordID,
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })

const getDiscordOfTag = async (tag) => 
    verifation.findOne({
        playerTag: tag
    }).then((result) => result.discordID)

const insertVerification = async (tag, discordID) =>
    verifation.create({
        discordID,
        playerTag: tag
    }).catch((e) => console.log(e))
    
const tagVerifiedBySameUser = async (tag, discordID) => 
    verifation.findOne({
      discordID,
      playerTag: tag,
    })
    .then((result) => {
      if (result) return true;
      return false;
    });

const unverifyUser = async (discordID) =>
    verifation.deleteMany({
        discordID: discordID
    }).then(result => result)
    .catch((e) => console.log(e))

module.exports = {
    tagVerified,
    alreadyTaken,
    isOwnerOfAccount,
    getDiscordOfTag,
    insertVerification,
    tagVerifiedBySameUser,
    unverifyUser
}