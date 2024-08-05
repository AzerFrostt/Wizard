const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/connections');
const { parseTag } = require('../../../utils/arguments/tagHandling');
const { hasMediumPerms } = require('../../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('taginfo')
    .setDescription('Mod only - gets verification for a given tag.')
    .addStringOption((option) =>
      option.setName('playertag').setDescription('Player Tag').setRequired(true)
    ),
  async execute(interaction) {
    if (!hasMediumPerms(interaction.member))
      return interaction.reply({
        content: `You do not have permission to use this command.`,
        ephemeral: false,
      });
    const targetPlayerTag = parseTag(
      interaction.options.getString('playertag')
    );
    const playersDiscordID = await getDiscordOfTag(targetPlayerTag);
    if (!playersDiscordID) {
      return interaction.reply({
        content: `No verifications found for tag ${targetPlayerTag}.`,
        ephemeral: false,
      });
    }

    interaction.reply(playersDiscordID);
  },
};
