const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const getRow = (pageIndex, limit) => 
    new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prev_page')
                .setStyle('Secondary')
                .setEmoji('⬅️')
                .setDisabled(pageIndex == 0)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('next_page')
                .setStyle('Secondary')
                .setEmoji('➡️')
                .setDisabled(pageIndex == limit - 1)
        )

module.exports = {
    getRow
};