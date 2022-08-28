const { MessageButton, MessageActionRow } = require('discord.js')

const getHowToCompete = () => 
    new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('howToCompete')
            .setLabel('How To Compete')
            .setStyle('PRIMARY')
    )

module.exports = {
    getHowToCompete
};
  