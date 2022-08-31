const { SlashCommandBuilder } = require('@discordjs/builders');
const { IDs } = require('../../../config.json');
const {
  getSuccessfulColourEmbed,
  getUnsatisfiedRequirementEmbed,
  getColoursListEmbed,
  getAvailableColoursListEmbed,
} = require('../../../utils/embeds/colour');
const colours = IDs.verificationRoles.colour;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('colour')
    .setDescription('Manage colour roles.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription(
          'Adds colour override to user if they have the in-game role.'
        )
        .addStringOption((option) =>
          option
            .setName('colour')
            .setDescription('The colour override you want.')
            .setRequired(true)
            .addChoices(
              { name: 'Purple', value: 'PURPLE' },
              { name: 'Yellow', value: 'YELLOW' },
              { name: 'FarmersRUs Pink', value: 'FARMERPINK' },
              { name: 'Black', value: 'BLACK' },
              { name: 'Blue', value: 'BLUE' },
              { name: 'Pink', value: 'PINK' },
              { name: 'Gold', value: 'GOLD' },
              { name: 'Red', value: 'RED' },
              { name: 'Alchemist Pink', value: 'ALCEHMISTPINK' },
              { name: 'Grey', value: 'GREY' },
              { name: 'Green', value: 'GREEN' },
              { name: 'Orange', value: 'ORANGE' },
              { name: 'Turquoise', value: 'TURQUOISE' },
              { name: 'White', value: 'WHITE' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('remove').setDescription('Remove colour overrides.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List all colour overrides available.')
        .addBooleanOption((option) =>
          option
            .setName('onlyavailable')
            .setDescription('List only the colour roles you can switch to.')
        )
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommand() === 'remove') {
      await removeColourRoles(interaction.member);
      await interaction.editReply(`Removed colour override!`);
      return;
    } else if (interaction.options.getSubcommand() === 'add') {
      const colour = interaction.options.getString('colour');
      await setColorRoles(colour, interaction);
      return;
    } else if (interaction.options.getSubcommand() === 'list') {
      if (interaction.options.getBoolean('onlyavailable')) {
        await interaction.editReply({
          embeds: [getAvailableColoursListEmbed(interaction.member)],
        });
        return;
      } else {
        await interaction.editReply({
          embeds: [getColoursListEmbed()],
        });
        return;
      }
    }
  },
};

const setColorRoles = async (colour, interaction) => {
  const user = interaction.member;
  const userRoles = user.roles.cache;
  for (let l in colours.norequirement) {
    if (colour == colours.norequirement[l].arg) {
      await interaction.editReply({
        embeds: [getSuccessfulColourEmbed(colours.norequirement[l].colourid)],
      });
      await successfulColour(user, colours.norequirement[l].colourid);
      return;
    }
  }
  for (let i in colours.requirement) {
    if (colour == colours.requirement[i].arg) {
      const wantedColorRoleReq = colours.requirement[i].roleid;
      if (userRoles.has(wantedColorRoleReq)) {
        await interaction.editReply({
          embeds: [getSuccessfulColourEmbed(colours.requirement[i].colourid)],
        });
        await successfulColour(user, colours.requirement[i].colourid);
      } else {
        await interaction.editReply({
          embeds: [getUnsatisfiedRequirementEmbed(wantedColorRoleReq)],
        });
      }

      break;
    }
  }
};

const successfulColour = async (user, colorToAdd) => {
  await removeColourRoles(user);
  await user.roles.add(colorToAdd);
};
const removeColourRoles = async (user) => {
  const removeableRoles = [];
  for (let k in colours.requirement) {
    removeableRoles.push(colours.requirement[k].colourid);
  }
  for (let k in colours.norequirement) {
    removeableRoles.push(colours.norequirement[k].colourid);
  }
  await user.roles.remove(removeableRoles);
};
