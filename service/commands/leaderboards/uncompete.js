const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const {
  uncompete,
  uncompeteAnyone
} = require('../../../dao/mongo/participant/connections');
const {
  getInvalidTagEmbed,
} = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uncompete')
    .setDescription('Allows you to uncompete on the server leaderboard.')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag that you have verified with.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    
    const tag = parseTag(interaction.options.getString('tag'))
    const id = interaction.member.id

    if (!isTagValid(tag)) {
        await interaction.editReply({
          embeds: [getInvalidTagEmbed()],
          ephemeral: true,
        });
        return;
    }

    const success = hasMediumPerms(interaction.member) ? await uncompeteAnyone(tag) : await uncompete(tag, id)

    if (success) interaction.editReply(`Leaderboard withdrawal successful for \`#${tag}\`. To compete again use \`/compete <player tag>\``) 
    else interaction.editReply(`Couldn't uncompete \`#${tag}\`. Make sure the tag is correct and that you have verified under it.`)
  },
};