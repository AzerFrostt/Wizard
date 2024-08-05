const { ActionRowBuilder, ButtonBuilder } = require('discord.js')

const verifyingIDButton = new ButtonBuilder()
    .setCustomId('getVerifyingID')
    .setLabel('Get user ID')
    .setStyle('Primary')

const verifiedIDButton = new ButtonBuilder()
    .setCustomId('getVerifiedID')
    .setLabel('Get ID of linked account')
    .setStyle('Primary')

const getNewVerifationID = () => 
    new ActionRowBuilder().addComponents(
        verifyingIDButton
    )

const getCrossVerificationIDs = () => 
    new ActionRowBuilder().addComponents(
        verifyingIDButton, verifiedIDButton
    )

module.exports = {
    getNewVerifationID,
    getCrossVerificationIDs
};
  