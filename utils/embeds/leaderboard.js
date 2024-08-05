const { EmbedBuilder } = require('discord.js')

const getLegendaryLeaderboard = (topLegends, legendParticipantCount, index, pageSize) => {
    const topRankRange = (index * pageSize) % pageSize
    const bottomRankRange = (Math.min((index * pageSize) + pageSize, legendParticipantCount) -1 ) % pageSize

    const embed = new EmbedBuilder()
    .setTitle('Legendary leaderboard')
    .setColor('#9650DC');
    for (let i = topRankRange; i <= bottomRankRange; i++){
        embed.addFields({
            name: `Rank ${formatRank((index*pageSize) + i+1)} - ${topLegends[i].trophiesLegends} 🏆`,
            value: `Discord tag: <@${topLegends[i].discordID}>\n` +
            `Discord username: ${topLegends[i].discordUsername}\n` +
            `In-game name: ${topLegends[i].gameName}\n` +
            `Player tag: ${topLegends[i].gameTag}\n`
        })
    }
    embed.setFooter({text: `Participants: ${legendParticipantCount}`});
    return embed
}

const getBuilderLeaderboard = (topBuilders, builderParticipantCount, index, pageSize) => {
    const topRankRange = (index * pageSize) % pageSize
    const bottomRankRange = (Math.min((index * pageSize) + pageSize, builderParticipantCount) -1 ) % pageSize
    const embed = new EmbedBuilder()
    .setTitle('Builder base leaderboard')
    .setColor('#0B0B3B');
    for (let i = topRankRange; i <= bottomRankRange; i++){
        embed.addFields({
            name: `Rank ${formatRank((index*pageSize) + i+1)} - ${topBuilders[i].trophiesBuilders} 🏆`,
            value: `Discord tag: <@${topBuilders[i].discordID}>\n` +
            `Discord username: ${topBuilders[i].discordUsername}\n` +
            `In-game name: ${topBuilders[i].gameName}\n` +
            `Player tag: ${topBuilders[i].gameTag}\n`
        })
    }
    embed.setFooter({text: `Participants: ${builderParticipantCount}`});
    return embed
}

const formatRank = (rank) => {
    if (rank == 1) return `${rank} 🥇`
    if (rank == 2) return `${rank} 🥈`
    if (rank == 3) return `${rank} 🥉`
    else return rank
}
module.exports = {
    getLegendaryLeaderboard,
    getBuilderLeaderboard
};
  