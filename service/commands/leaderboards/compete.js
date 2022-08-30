const { SlashCommandBuilder } = require('@discordjs/builders');
const { findProfile } = require('../../../dao/clash/verification');
const { isOwnerOfAccount } = require('../../../dao/mongo/verification/connections')
const {
  checkIfCompetingInBoth,
  updateLeaderboardParticipation
} = require('../../../dao/mongo/participant/connections');
const { isLeaderboardLocked } = require('../../../dao/mongo/toggle/connections')
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/tagHandling');

const LEGENDARY_MINIMUM = 5000
const BUILDER_MINIMUM = 5000

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compete')
    .setDescription('Allows you to compete on the server leaderboard.')
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

    if (await isLeaderboardLocked()) {
      await interaction.editReply('Leaderboard participation is currently locked.')
      return
    }

    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }

    const isOwner = isOwnerOfAccount(tag, id)
    const competingInBoth = checkIfCompetingInBoth(tag, id)

    if (!await isOwner) {
      await interaction.editReply('You have not verified with this tag, to do so type `/verify <player tag> <api token>`')
      return
    }

    if (await competingInBoth) {
      await interaction.editReply('You are competing in both leaderboards already!')
      return
    }

    const accountResponse = await findProfile(tag)

    if (accountResponse.error) {
      await interaction.editReply(
        `An error has occured: ${accountResponse.error}`
      );
      return;
    }

    if (!accountResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }

    const account = accountResponse.response.data

    const legends = account.trophies >= LEGENDARY_MINIMUM
    const builder = account.versusTrophies >= BUILDER_MINIMUM

    updateLeaderboardParticipation(tag, id, legends, builder)

    const msg = x => `You are now competing under the ${x}, good luck!`

    if (legends && builder) interaction.editReply(msg('legends and builder ladder'))
    else if (legends) interaction.editReply(msg('legends ladder'))
    else if (builder) interaction.editReply(msg('builder ladder'))
    else interaction.editReply('You are not eligible to compete under any of the leaderboards (must have 5000 cups in either ladder or builder base).')
  },
};