const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasFullPerms } = require('../../../utils/permissions');
const { resetLeaderboards } = require('../../../dao/mongo/participant/connections')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetleaderboard')
    .setDescription('Admin only - Uncompete all participants on every leaderboard.'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if(hasFullPerms(interaction.member)){
      resetLeaderboards()
      await interaction.editReply(`Leaderboards have been reset.`)        
    } else await interaction.editReply(`Insufficient permissions to use this command.`)
  }
};
