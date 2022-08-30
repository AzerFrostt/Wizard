const { SlashCommandBuilder } = require('@discordjs/builders');
const { findTag, saveDefaultProfile, removeDefaultProfile } = require('../../../dao/mongo/profile/connections');
const { isOwnerOfAccount } = require('../../../dao/mongo/verification/connections');
const { parseTag, isTagValid } = require('../../../utils/tagHandling');
const { findProfile } = require('../../../dao/clash/verification');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { getProfileEmbed } = require('../../../utils/embeds/stats')

  module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Get information about players in-game stats.')
    .addSubcommand((subcommand) => 
        subcommand
          .setName('show')
          .setDescription('Gets the stats of an in-game account.')
          .addStringOption((option) =>
            option
            .setName('tag')
            .setDescription('The player tag to get the stats of.')
            .setRequired(false)
        ),
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('save')
            .setDescription('Save an account as your default profile.')
            .addStringOption((option) =>
                option
                .setName('tag')
                .setDescription('The verified tag you want to save.')
                .setRequired(true)
            )
      
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove your default profile.')
      ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    if (interaction.options.getSubcommand() === 'show'){
        const unsanitizedTag = interaction.options.getString('tag') ?? await findTag(interaction.member.id)
        
        if (!unsanitizedTag) {
            await interaction.editReply(`You have not set a default profile. To do so type \`/profile save <player tag>\``)
            return
        }
        
        const tag = parseTag(unsanitizedTag);
        if (!isTagValid(tag)) {
            sendInvalidTagReply(interaction)
            return
        }
        const playerResponse = await findProfile(tag)

        if (!playerResponse.response) {
            await interaction.editReply(`An error occured: ${playerResponse.error}`)
            return
        }

        if (!playerResponse.response.found) {
            sendInvalidTagReply(interaction)
            return
        }

        const verified = isOwnerOfAccount(tag, interaction.member.id)
        const playerData = playerResponse.response.data
        
        interaction.editReply({embeds: [getProfileEmbed(playerData, await verified)], ephemeral: true})
    } else if (interaction.options.getSubcommand() === 'save') {
        const tag = parseTag(interaction.options.getString('tag'))
        if (!isTagValid(tag)) {
            sendInvalidTagReply(interaction)
            return
        }

        const playerResponse = await findProfile(tag)

        if (!playerResponse.response) {
            await interaction.editReply(`An error occured: ${playerResponse.error}`)
            return
        }

        if (!playerResponse.response.found) {
            sendInvalidTagReply(interaction)
            return
        }

        const verified = isOwnerOfAccount(tag, interaction.member.id)

        if (await verified) {
            saveDefaultProfile(tag, interaction.member.id)
            await interaction.editReply(`I have successfully saved your profile #${tag} as the default one!`)
            return
        }
        else {
            await interaction.editReply(`This tag is not verified under this account. To verify an account, type \`/verify <player tag> <api token>\``)
            return
        }
    } else if ( interaction.options.getSubcommand() === 'remove') {
        const foundDefaultProfile = await removeDefaultProfile(interaction.member.id)
        if (foundDefaultProfile) await interaction.editReply(`I have removed your default profile.`)
        else await interaction.editReply(`You don't have a default profile to remove!`)
        return
    }
  }
};

const sendInvalidTagReply = async(interaction) => await interaction.editReply({
    embeds: [getInvalidTagEmbed()],
    ephemeral: true,
});
