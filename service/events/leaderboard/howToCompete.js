
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'howToCompete') return;
        interaction.reply({
            content: 'Run `/compete <player tag>` in <#328964121871777793>',
            ephemeral: true,
        })
        
    },
};