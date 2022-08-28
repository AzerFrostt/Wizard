const { MessageEmbed } = require('discord.js');
const client = require('../../utils/client')

const getInfo = () => new MessageEmbed()
    .setTitle("Wizard")
    .setColor('#34C6EB')
    .setDescription(
        `Wizard enables more cohesion between between Clash of Clans and your Discord server. Track your stats with your community and show off your achievements!`)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
    {
        name: 'Contributors',
        value: `• Azer - Coding\n• Hawk Eye - Coding\n• Vibe - Testing`,
        inline: true
    },
    {
        name: 'Source code',
        value: '[Click to view](https://github.com/AzerFrostt/Wizard)',
        inline: true
    })
    .setFooter({text: 'Show support by using code Azer', iconURL: 'https://www.deckshop.pro/img/creatorcode/creator_code.png'})

module.exports = {
    getInfo
};
