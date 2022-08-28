const { MessageEmbed } = require('discord.js');
const { IDs } = require('../../config.json');
const colours = IDs.verificationRoles.colour;
const getSuccessfulColourEmbed = (roleID) =>
  new MessageEmbed()
    .setTitle('🔥 Color override added! 🔥')
    .setColor('#00de30')
    .setDescription(`I have added <@&${roleID}> as your override`);

const getUnsatisfiedRequirementEmbed = (roleID) =>
  new MessageEmbed()
    .setTitle("💨 Couldn't add color override! 💨")
    .setColor('#d10202')
    .setDescription(`For this override you need <@&${roleID}>`);

const getColoursListEmbed = () => {
  let colourList = '';
  for (let k in colours.requirement) {
    colourList += `<:bullet:840654524213231716> <@&${colours.requirement[k].colourid}> requires <@&${colours.requirement[k].roleid}>\n\n`;
  }
  for (let k in colours.norequirement) {
    colourList += `<:bullet:840654524213231716> <@&${colours.norequirement[k].colourid}> requires no additional roles\n\n`;
  }
  colourList += `\nUse /colour remove to remove your colour roles.`;
  return new MessageEmbed()
    .setTitle('Colours List')
    .setColor('#4CF7D6')
    .setDescription(
      'These are all the available colour roles\nUse /colour add to change your colour override\n\n' +
        colourList
    );
};
const getAvailableColoursListEmbed = (user) => {
  const userRoles = user.roles.cache;
  let colourList = '';
  for (let k in colours.requirement) {
    colourList += userRoles.has(colours.requirement[k].roleid)
      ? `${colours.requirement[k].icon} <@&${colours.requirement[k].colourid}>\n`
      : ``;
  }
  for (let k in colours.norequirement) {
    colourList += `<:unranked:935678512822616074> <@&${colours.norequirement[k].colourid}>\n`;
  }
  colourList += `\nLooks wrong? Make sure you have the required roles first. Use \`/verify\` to get any applicable roles\nUse \`/colour remove\` to remove your colour roles.`;
  return new MessageEmbed()
    .setTitle('Colours List')
    .setColor('#4CF7D6')
    .setDescription(
      'These are all colour roles you can switch to\nUse `/colour add` to change your colour override\n\n' +
        colourList
    );
};

module.exports = {
  getUnsatisfiedRequirementEmbed,
  getSuccessfulColourEmbed,
  getColoursListEmbed,
  getAvailableColoursListEmbed,
};
