const { SlashCommandBuilder } = require('@discordjs/builders');
const { ComponentType } = require('discord.js');
const { IDs } = require('../../../config.json')
const client = require('../../../utils/client')
const { verificationPageEmbed } = require('../../../utils/embeds/userinfo/infoPage')
const { getLegendaryLeaderboard, getBuilderLeaderboard } = require('../../../utils/embeds/leaderboard')
const { getLeaderboardSnapshotsLegendary, getLeaderboardSnapshotsBuilder } = require('../../../dao/mongo/leaderboard_snapshot/connections')
const { getRow } = require('../../../utils/rows/pagination')
const PAGE_LENGTH = 5

const paginateLeaderboard = (acc, participants) => {
    const pageLength = Math.min(participants.length, PAGE_LENGTH)
    if (participants.length > PAGE_LENGTH) {
        const page = participants.slice(0, pageLength)
        const remainder = participants.slice(pageLength)
        acc.push(page)
        return paginateLeaderboard(acc, remainder)
    }
    if (participants.length > 0) {
        acc.push(participants)
        return acc
    }
    return acc
}

const sortLegends = (legendParticipants) => 
    legendParticipants.sort((a, b) => b.trophiesLegends - a.trophiesLegends)

const sortBuilders = (builderParticipants) => 
    builderParticipants.sort((a, b) => b.trophiesBuilders - a.trophiesBuilders)

module.exports = {
    data: new SlashCommandBuilder()
      .setName('leaderboard')
      .setDescription('Check the standings of the last leaderboard snapshot.')
      .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('The type of leaderboard to display.')
            .setRequired(true)
            .addChoices(
              { name: 'Legends', value: 'LEGENDS' },
              { name: 'Builder', value: 'BUILDER' },
            )
        ),
    async execute(interaction) {
        const leaderboardType = interaction.options.getString('type');
        const participants = leaderboardType == "LEGENDS" ? 
            sortLegends(await getLeaderboardSnapshotsLegendary()) :
            sortBuilders(await getLeaderboardSnapshotsBuilder())
        const leaderboardSize = participants.length 

        if (participants.length <= 0) {
            interaction.reply({content: `No participants currently on this leaderboard`, ephemeral: false})
            return
        }

        let index = 0
        const participantsPaginated = paginateLeaderboard([], participants)
        const numberOfPages = participantsPaginated.length

        const embeds = participantsPaginated.map((leaderboardPage, index) => leaderboardType == "LEGENDS" ?
            getLegendaryLeaderboard(leaderboardPage, leaderboardSize, index, 5) :
            getBuilderLeaderboard(leaderboardPage, leaderboardSize, index, 5)
        )

        const reply = await interaction.reply({ embeds: [embeds[index]], components: [getRow(index, numberOfPages)] })

        const time = 1000 * 60 * 5

        const collector = await reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        })

        collector.on('collect', async i => {
            if (!i) return
            if (i.customId !== "prev_page" && i.customId !== "next_page") return
            if (i.customId === "prev_page" && index > 0) index--
            if (i.customId === "next_page" && index < numberOfPages - 1) index++
            if (reply) i.update({
                embeds: [embeds[index]],
                components: [getRow(index, numberOfPages)]
            }) 
        })
    },
  };