const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getGeneralHelp, getVerificationHelp, getColoursHelp, getStatsHelp, getLeaderboardHelp
  } = require('../../../utils/embeds/help');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tells you how to use the bot.')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Commands you want to know about.')
        .setRequired(false)
        .addChoices(
            { name: 'verification', value: 'verification' },
            { name: 'colours', value: 'colours' },
            { name: 'stats', value: 'stats' },
            { name: 'leaderboards', value: 'leaderboards' },
          )
    ),
  async execute(interaction) {
    switch(interaction.options.getString('command')){
        case 'verification':
        await interaction.reply({embeds: [getVerificationHelp()], ephemeral: true,})
        return
        case 'colours':
        await interaction.reply({embeds: [getColoursHelp()], ephemeral: true,})
        return
        case 'stats':
        await interaction.reply({embeds: [getStatsHelp()], ephemeral: true,})
        return
        case 'leaderboards':
        await interaction.reply({embeds: [getLeaderboardHelp()], ephemeral: true,})
        return
        default:
        await interaction.reply({embeds: [getGeneralHelp()], ephemeral: true,})
        return
    }
  },
};
