const { MessageEmbed } = require('discord.js')

const getLegendaryLeaderboard = (topLegends, legendParticipantCount) => {
    const embed = new MessageEmbed()
    .setTitle('Legendary leaderboard')
    .setColor('#9650DC');
    for (let i = 0; i < topLegends.length; i++){
        const discord = topLegends[i].discord
        embed.addFields({
            name: `Rank ${i+1} - ${topLegends[i].clash.response.data.trophies} 🏆`,
            value: `Discord tag: <@${topLegends[i].db.discordID}>\n` +
            `Discord username: ${discord.user.username}#${discord.user.discriminator}\n` +
            `In-game name: ${topLegends[i].clash.response.data.name}\n` +
            `Player tag: ${topLegends[i].clash.response.data.tag}\n`
        })
    }
    embed.setFooter({text: `Participants: ${legendParticipantCount}`});
    return embed
}

const getBuilderLeaderboard = (topBuilders, builderParticipantCount) => {
    const embed = new MessageEmbed()
    .setTitle('Builder base leaderboard')
    .setColor('#0B0B3B');
    for (let i = 0; i < topBuilders.length; i++){
        const discord = topBuilders[i].discord
        embed.addFields({
            name: `Rank ${i+1} - ${topBuilders[i].clash.response.data.versusTrophies} 🏆`,
            value: `Discord tag: <@${topBuilders[i].db.discordID}>\n` +
            `Discord username: ${discord.user.username}#${discord.user.discriminator}\n` +
            `In-game name: ${topBuilders[i].clash.response.data.name}\n` +
            `Player tag: ${topBuilders[i].clash.response.data.tag}\n`
        })
    }
    embed.setFooter({text: `Participants: ${builderParticipantCount}`});
    return embed
}

module.exports = {
    getLegendaryLeaderboard,
    getBuilderLeaderboard
};
  