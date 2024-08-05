const { ActionRowBuilder, ButtonBuilder } = require('discord.js')

const getHowToCompete = () => 
    new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('howToCompete')
            .setLabel('How To Compete')
            .setStyle('Primary')
    )

module.exports = {
    getHowToCompete
};
  