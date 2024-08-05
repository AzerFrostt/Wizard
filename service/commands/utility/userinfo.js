const { SlashCommandBuilder } = require('@discordjs/builders');
const { ComponentType } = require('discord.js');
const { IDs } = require('../../../config.json')
const client = require('../../../utils/client')
const { hasMediumPerms } = require('../../../utils/permissions');
const { verificationPageEmbed } = require('../../../utils/embeds/userinfo/infoPage')
const { getVerifications } = require('../../../dao/mongo/verification/connections')
const { getRow } = require('../../../utils/rows/pagination')
const { containsOnlyNumbers } = require('../../../utils/arguments/discordID')
const PAGE_LENGTH = 20

const paginateVerifications = (acc, verifications) => {
    const pageLength = Math.min(verifications.length, PAGE_LENGTH)
    if (verifications.length > PAGE_LENGTH) {
        const page = verifications.slice(0, pageLength)
        const remainder = verifications.slice(pageLength)
        acc.push(page)
        return paginateVerifications(acc, remainder)
    }
    if (verifications.length > 0) {
        acc.push(verifications)
        return acc
    }
    return acc
}

module.exports = {
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Mod only - gets all verifications for a given user.')
      .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('User ID.')
        .setRequired(true)
      ),
    async execute(interaction) {
        if (!hasMediumPerms(interaction.member)) return interaction.reply({content: `You do not have permission to use this command.`, ephemeral: false})

        const targetUserID = interaction.options.getString('id')
        if (!containsOnlyNumbers(targetUserID)) return interaction.reply({content: `Invalid ID format.`, ephemeral: false})
        const userVerifications = await getVerifications(targetUserID)
        if (userVerifications.length <= 0) {
            interaction.reply({content: `No verifications found for user <@${targetUserID}>.`, ephemeral: false})
            return
        }

        let index = 0
        const verificationsPaginated = paginateVerifications([], userVerifications)
        const numberOfPages = verificationsPaginated.length

        const guildID = IDs.guild
        const guild = client.guilds.cache.get(guildID)
        const targetUserData = await guild.members.fetch({ user: targetUserID }).catch(_ => null)

        const embeds = verificationsPaginated.map((casePage, index) => verificationPageEmbed(targetUserData, casePage, index, PAGE_LENGTH))

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