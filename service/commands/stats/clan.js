const { SlashCommandBuilder } = require('@discordjs/builders');
const { getClanEmbed } = require('../../../utils/embeds/stats');
const { getInvalidTagEmbed } = require('../../../utils/embeds/clanTag')
const { parseTag, isTagValid } = require('../../../utils/tagHandling');
const { findClan } = require('../../../dao/clash/clans')

  module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan')
    .setDescription('Get information about a clans in-game stats.')
    .addStringOption((option) =>
        option
        .setName('tag')
        .setDescription('The clan tag you want to look up.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    
    const tag = parseTag(interaction.options.getString('tag'))

    if (!isTagValid(tag)) {
        sendInvalidTagReply(interaction)
        return
    }
    const clanResponse = await findClan(tag)

    if (!clanResponse.response) {
        await interaction.editReply(`An error occured: ${clanResponse.error}`)
        return
    }

    if (!clanResponse.response.found) {
        sendInvalidTagReply(interaction)
        return
    }

    const clanData = clanResponse.response.data

    interaction.editReply({embeds: [getClanEmbed(clanData)], ephemeral: true})
  }
};

const sendInvalidTagReply = async(interaction) => await interaction.editReply({embeds: [ getInvalidTagEmbed()], ephemeral: true});
