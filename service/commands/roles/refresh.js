const { SlashCommandBuilder } = require('@discordjs/builders');
const { findProfile } = require('../../../dao/clash/verification');
const { tagVerifiedBySameUser } = require('../../../dao/mongo/verification/connections');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { setRoles } = require('../../../utils/setRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Updates your profile roles if already verified.')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const tag = parseTag(interaction.options.getString('tag'));
    const discordID = interaction.member.id;
    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    if (await tagVerifiedBySameUser(tag, discordID)) {
      const findProfileResponse = await findProfile(tag);
      const profileData = findProfileResponse.response.data;
      await interaction.editReply({
        embeds: [setRoles(profileData, interaction.member)],
        ephemeral: true,
      });
      return;
    } else {
      await interaction.editReply(
        'You did not verify under this tag, to verify use the /verify command.'
      );
      return;
    }
  },
};
