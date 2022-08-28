const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const {
  toggleLeaderboard,
} = require('../../../dao/mongo/toggle/connections');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockleaderboard')
    .setDescription('Mod only - Enable/disable people from participating on the leaderboard.')
    .addBooleanOption((option) =>
      option
        .setName('lock')
        .setDescription('Should the leaderboard be locked.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    if(hasMediumPerms(interaction.member)){
      const shouldLock = interaction.options.getBoolean('lock');
      toggleLeaderboard(shouldLock)
      await interaction.editReply(`Leaderboard ${shouldLock ? 'locked' : 'unlocked'}.`)        
    } else await interaction.editReply(`Insufficient permissions to use this command.`)
  }
};
