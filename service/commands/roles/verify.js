const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  verifyProfile,
  findProfile,
} = require('../../../dao/clash/verification');
const {
  tagVerified,
  alreadyTaken,
  insertVerification,
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/connections');
const {
  getInvalidApiTokenEmbed,
  getInvalidTagEmbed,
  alertAttemptCrossVerification,
  alertAttemptNewVerification
} = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/tagHandling');
const { setRoles } = require('../../../utils/setRoles');
const { IDs } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verifies a user and sets their roles.')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('The API token of the account.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const tag = parseTag(interaction.options.getString('tag'))
    const token = interaction.options.getString('token');
    const logChannel = interaction.guild.channels.cache.get(IDs.logChannels.alert)
    const memberId = interaction.member.id

    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const findProfileResponse = await findProfile(tag);

    if (findProfileResponse.error) {
      await interaction.editReply(
        `An error has occured: ${findProfileResponse.error}`
      );
      return;
    }

    if (!findProfileResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const profileData = findProfileResponse.response.data;

    const verifyResponse = await verifyProfile(tag, token);
    if (verifyResponse.error) {
      await interaction.editReply(
        `An error has occured: ${verifyResponse.error}`
      );
      return;
    }

    const isValid = verifyResponse.response.status === 'ok';
    if (!isValid) {
      await interaction.editReply({
        embeds: [getInvalidApiTokenEmbed()],
        ephemeral: true,
      });
      return;
    }

    if (await tagVerified(tag)) {
      if (await alreadyTaken(tag, interaction.member.id)) {
        const originalAccountId = getDiscordOfTag(tag)
        await interaction.editReply('This account is already taken!');
        await logChannel.send({embeds: [alertAttemptCrossVerification(memberId, await originalAccountId, tag)]})
        return;
      } else {
        await interaction.editReply({
          embeds: [setRoles(profileData, interaction.member)],
          ephemeral: true,
        });
        return;
      }
    } else {
      insertVerification(tag, interaction.member.id);
      await interaction.editReply({
        embeds: [setRoles(profileData, interaction.member)],
        ephemeral: true
      });
      await logChannel.send({embeds: [alertAttemptNewVerification(memberId, tag)]})
      return;
    }
  },
};
