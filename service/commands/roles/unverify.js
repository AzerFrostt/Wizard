const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const { unverifyUser } = require('../../../dao/mongo/verification/connections');
const { uncompeteAllAccounts } = require('../../../dao/mongo/participant/connections');
const { removeRoles } = require('../../../utils/removeRoles')
const { getUnverifiedEmbed } = require('../../../utils/embeds/verify')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unverify')
    .setDescription('Unverifies a user and removes their roles.')
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Mod only - Discord ID of account to unverify.')
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (interaction.options.getString('id') && !hasMediumPerms(interaction.member)) {
        interaction.editReply('Insufficient permissions to unverify other users.')
        return
    }
    
    const discordID = interaction.options.getString('id') ?? interaction.member.id

    uncompeteAllAccounts(discordID)

    interaction.guild.members.fetch(discordID)
        .then(member => unverifyOnServer(member, interaction))
        .catch(_ => unverifyOffServer(discordID, interaction))
  },
};

const unverifyOnServer = async (member, interaction) => {
    const result = await unverifyUser(member.id)
    if (result.deletedCount > 0) {
        const rolesRemoved = removeRoles(member)
        interaction.editReply({embeds: [getUnverifiedEmbed(rolesRemoved)], ephemeral: true})
    } else interaction.editReply('User does not have a verification.')
}

const unverifyOffServer = async (id, interaction) => {
    const result = await unverifyUser(id)
    if (result.deletedCount > 0) interaction.editReply('User not on server, unverified from database.')
    else interaction.editReply('Could not find user from database.')
}
