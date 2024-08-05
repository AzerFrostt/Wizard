const { EmbedBuilder } = require('discord.js')

const getInvalidTagEmbed = () => new EmbedBuilder()
    .setTitle('Invalid Tag! ❌')
    .setColor('#D10202')
    .addFields({
        name: 'How can I find my clan tag?',
        value: 'Your clan tag can be found on your in-game clan page.'
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/1013012741084164137/findclan.jpg?width=959&height=443'
    )

module.exports = {
    getInvalidTagEmbed
};
      