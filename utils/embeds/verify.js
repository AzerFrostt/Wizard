const { MessageEmbed } = require('discord.js')

const getInvalidTagEmbed = () => new MessageEmbed()
    .setTitle('Invalid Tag! ❌')
    .setColor('#D10202')
    .addFields({
        name: 'How can I find my player tag?',
        value: 'Your player tag can be found on your in-game profile page.'
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/1013012740861853696/findprofile.jpg?width=959&height=443'
    )

const getInvalidApiTokenEmbed = () => new MessageEmbed()
    .setTitle('Invalid API token! ❌')
    .setColor('#D10202')
    .addFields({
      name: 'How can I find my API token?',
      value: 'You can find your API token by going into settings -> advanced settings.',
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/813606623519703070/image0.png?width=1440&height=665'
    )

const getValidVerificationEmbed = desc => new MessageEmbed()
    .setTitle('Verification successful! ✅')
    .setColor('#00DE30')
    .addFields({
        name: 'Roles added',
        value: desc
    })
    
const getUnverifiedEmbed = rolesRemoved => new MessageEmbed()
    .setTitle('Unverification successful! ✅')
    .setColor('#00DE30')
    .addFields({
        name: 'Roles removed',
        value: rolesRemoved.reduce((acc, x) => acc += `${x.icon ?? '•'} <@&${x.id}> removed!\n` , '') ?? '• No roles to remove'
    });

const alertAttemptCrossVerification = (newUserId, originalOwnerId, tag) => new MessageEmbed()
    .setTitle('Attempted cross verification⚠️')
    .setColor('FFFF00')
    .setDescription(`User <@${newUserId}> tried to verify an account linked to <@${originalOwnerId}> using the tag \`#${tag}\``)

const alertAttemptNewVerification = (newUserId, tag) => new MessageEmbed()
    .setTitle('New verification⚠️')
    .setColor('00DE30')
    .setDescription(`User <@${newUserId}> verified a new account under the tag \`#${tag}\``)

module.exports = {
    getInvalidTagEmbed,
    getInvalidApiTokenEmbed,
    getValidVerificationEmbed,
    getUnverifiedEmbed,
    alertAttemptCrossVerification,
    alertAttemptNewVerification
} 

