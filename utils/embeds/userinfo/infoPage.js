const { EmbedBuilder } = require('discord.js');

const addRows = (vericationsPage, embedTemplate, pageCount, pageSize) => {
    if (vericationsPage.length > 0) {
        const description = vericationsPage.reduce((acc, verification, index) => acc + `${(pageCount*pageSize)+index+1}. #${verification.playerTag}\n`, '')
        return embedTemplate.setDescription(description)
    }
    return embedTemplate
}

const verificationPageEmbed = (targetUserData, verificationsPage, index, pageSize) => {
    const embedTemplate = new EmbedBuilder()
    .setTitle(`Verifications for ${targetUserData ? targetUserData.user.username + `#` + targetUserData.user.discriminator : `[Can't find user]`} - Page ${index + 1}`)
    .setColor('#34C6EB')
    return addRows(verificationsPage, embedTemplate, index, pageSize)
}

module.exports = {
    verificationPageEmbed
};