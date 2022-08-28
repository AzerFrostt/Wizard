
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        interaction.reply({
            content: 'Run `/compete <player tag>` in <#328964121871777793>',
            ephemeral: true,
        })
        
    },
};