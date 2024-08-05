const { EmbedBuilder } = require('discord.js');

const getGeneralHelp = () => new EmbedBuilder()
    .setTitle("Guide to use wizard")
    .setColor('#34C6EB')
    .setDescription(
        `Wizard enables you to verify and connect your Clash of Clans account to the discord server! To get more information on a specific feature, type \`/help command\` and enter one of the subcommands below.`)
    .addFields({
        name: 'Help subcommands',
        value: `<:bullet:840654524213231716> \`verification\` - How to verify your account\n`+
        `<:bullet:840654524213231716> \`colours\` - Information about setting your name color\n` +
        `<:bullet:840654524213231716> \`stats\` - Displaying your in-game statistics\n` +
        `<:bullet:840654524213231716> \`leaderboards\` - Competing with other players on the server leaderboard\n`,
    })
  
const getVerificationHelp = () => new EmbedBuilder()
    .setTitle("Help for verification")
    .setColor('#34C6EB')
    .setDescription(
        `Verification allows Wizard to know you own the corresponding Clash of Clans account. A list of commands for verifying can be found below:`)
    .addFields({
        name: '/verify <player tag> <API token>',
        value: `Your in-game tag can be found on your profile page in clash of clans and your API token is found in the in-game settings <:bullet:840654524213231716> more settings <:bullet:840654524213231716> show API token.`,
    },
    {
        name: '/unverify',
        value: `This will unverify and remove data for all accounts connected to your discord account.`,
    },
    {
        name: '/refresh',
        value: `A quick short cut to verify again on the same account, useful for updating achievement roles.`,
    });

const getColoursHelp = () => new EmbedBuilder()
    .setTitle("Help for colours")
    .setColor('#34C6EB')
    .setDescription(
        `If you own achievement roles through verifying, you can select the achievement color you like and make it your name colour. A list of commands for colours can be found below:`)
    .addFields({
        name: '/colour list [onlyavailable]',
        value: `This will show all colours that we offer through achievements. \`onlyavailable\` is an optional argument to limit the list to colours you are eligible for.`,
    },
    {
        name: '/colour add <colour>',
        value: `Give your name a colour of your preference.`,
    },
    {
        name: '/colour remove',
        value: `If you have a colour role, remove it.`,
    })

const getStatsHelp = () => new EmbedBuilder()
    .setTitle("Help for stats")
    .setColor('#34C6EB')
    .setDescription(
        `Wizard lets you see in-game statistics of player profiles and clans. It shows whether you verified under an account, but is not necessary.`)
    .addFields({
        name: '/profile show <player tag>',
        value: `Displays the stats of a player with the specified tag.`,
    },
    {
        name: '/profile show',
        value: `An easy shortcut to display your default profile.`,
    },
    {
        name: '/profile save <player tag>',
        value: `If you verified under an account, you can save it to make it your default profile.`,
    },
    {
        name: '/profile remove <player tag>',
        value: `If you have a default profile saved, you can remove it as your default.`,
    },
    {
        name: '/clan <clan tag>',
        value: `Displays the stats of a clan with the specified tag.`,
    })

const getLeaderboardHelp = () => new EmbedBuilder()
    .setTitle("Help for leaderboard participation")
    .setColor('#34C6EB')
    .setDescription(
        `If you have 5000 trophies in either the home or builder base and have verified your account, you are eligible to participate on the server leaderboards! Sign ups close 2 weeks before each season ends and participants reset after each season.`)
    .addFields({
        name: '/compete <player tag>',
        value: `This will sign you up for participating on the leaderboards you are eligible for.`,
    },
    {
        name: '/uncompete <player tag>',
        value: `If you verified under an account, you can save it to make it your default profile.`,
    })
    
module.exports = {
    getGeneralHelp,
    getVerificationHelp,
    getColoursHelp,
    getStatsHelp,
    getLeaderboardHelp
};
