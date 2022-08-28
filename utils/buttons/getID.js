const { MessageButton, MessageActionRow } = require('discord.js')

const verifyingIDButton = new MessageButton()
    .setCustomId('getVerifyingID')
    .setLabel('Get user ID')
    .setStyle('PRIMARY')

const verifiedIDButton = new MessageButton()
    .setCustomId('getVerifiedID')
    .setLabel('Get ID of linked account')
    .setStyle('PRIMARY')

const getNewVerifationID = () => 
    new MessageActionRow().addComponents(
        verifyingIDButton
    )

const getCrossVerificationIDs = () => 
    new MessageActionRow().addComponents(
        verifyingIDButton, verifiedIDButton
    )

module.exports = {
    getNewVerifationID,
    getCrossVerificationIDs
};
  