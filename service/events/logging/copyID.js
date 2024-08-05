const idRegExp = /\<\@([^>]+)\>/g
const parseBracketsExp = /\<\@|\>/g

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const sendID = (result) => {
            const id = result.replace(parseBracketsExp, '')
            interaction.reply({
                content: id,
            })
        }

        if (!interaction.isButton()) return;
        if (interaction.customId === 'getVerifyingID') 
            sendID(interaction.message.embeds[0].description.match(idRegExp)[0])    
        else if (interaction.customId === 'getVerifiedID') 
            sendID(interaction.message.embeds[0].description.match(idRegExp)[1])

        
    },
};

