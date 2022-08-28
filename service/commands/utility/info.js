const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getInfo
  } = require('../../../utils/embeds/info');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives information about the bot!'),
  async execute(interaction) {
    interaction.reply({embeds: [getInfo()], ephemeral: false})
  },
};
