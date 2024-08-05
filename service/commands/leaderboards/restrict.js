const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { saveLeaderboardRestriction } = require('../../../dao/mongo/restriction/connections')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restrict')
    .setDescription('Mod only - Restrict a discord user from participating on the leaderboard.')
    .addStringOption((option) =>
          option
            .setName('action')
            .setDescription('What they are restricted from.')
            .setRequired(true)
            .addChoices(
              { name: 'Leaderboard', value: 'LEADERBOARD' },
            )
        )
    .addBooleanOption((option) =>
        option
          .setName('trigger')
          .setDescription('Turn restrictions on/off.')
          .setRequired(true)
      )
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Their in-game player tag.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    
    if(!hasMediumPerms(interaction.member)) {
      await interaction.editReply(`Insufficient permissions to use this command.`)
      return
    }

    const tag = parseTag(interaction.options.getString('tag'))
    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }

    const restricted = interaction.options.getBoolean('trigger')
    switch(interaction.options.getString('action')){
      case 'LEADERBOARD':
        restrictLeaderboard(tag, restricted, interaction)
        return;
    }

  },
};

const restrictLeaderboard = async (tag, restricted, interaction) => {
  saveLeaderboardRestriction(tag, restricted)
  await interaction.editReply(`Set leaderboard restriction for player tag \`#${tag}\` to \`${restricted}\``)
}