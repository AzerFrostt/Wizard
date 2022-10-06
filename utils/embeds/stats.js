const { MessageEmbed } = require('discord.js')
const MAX_MEMBERS = 3
const { IDs } = require('../../config.json') 
const getProfileEmbed = (profile, verified) => {
    const embed = new MessageEmbed()
    .setTitle(`${getLeagueEmote(profile.trophies)} ${profile.name} ${profile.tag}`)
    .setURL(`https://www.clashofstats.com/players/${getURLName(profile)}-${getURLTag(profile)}/summary`)
    .setColor('#33E3FF')
    .addFields(
    {
        name: 'Townhall Level',
        value: `${getTownhallEmote(profile.townHallLevel)} ${profile.townHallLevel}`,
        inline: true,
    },
    {
        name: 'Exp Level',
        value: `<:xp:935754903882702938> ${prettyNumbers(profile.expLevel)}`,
        inline: true,
    },
    {
        name: 'Clan',
        value: `<a:looking_for_clanmates:584303569809834005> ${isInClan(profile) ? `[${profile.clan.name}](https://www.clashofstats.com/clans/${getURLPlayerClanName(profile)}-${getURLPlayerClanTag(profile)}/summary)` : "No clan found"}`,
        inline: true,
    }, 

    {
        name: 'Trophies',
        value: `<:trophy:927704647089676369> ${prettyNumbers(profile.trophies)}`,
        inline: true,
    }, 
    {
        name: 'Personal Best',
        value: `<:ChampionKing:834433636756750367> ${prettyNumbers(profile.bestTrophies)}`,
        inline: true,
    }, 
    {
        name: 'War Stars',
        value: `<:star:927704564914860052> ${prettyNumbers(profile.warStars)}`,
        inline: true,
    }, 

    {
        name: 'Troop Donations',
        value: `<:speedup:927704617981190205> ${prettyNumbers(profile.achievements[14].value)}`,
        inline: true,
    }, 
    {
        name: 'Spell Donations',
        value: `<:haste:927704540621463643> ${prettyNumbers(profile.achievements[23].value)}`,
        inline: true,
    }, 
    {
        name: 'Siege Donations',
        value: `<:wallwrecker:935755961220616192> ${prettyNumbers(profile.achievements[40].value)}`,
        inline: true,
    }, 

    {
        name: 'Multiplayer Wins',
        value: `⚔️ ${prettyNumbers(profile.achievements[12].value)}`,
        inline: true,
    }, 
    {
        name: 'Multiplayer Defenses',
        value: `🛡️ ${prettyNumbers(profile.achievements[13].value)}`,
        inline: true,
    }, 
    {
        name: 'Clan Game Points',
        value: `<:clangames:927703762561286176> ${prettyNumbers(profile.achievements[31].value)}`,
        inline: true,
    }, 

    {
        name: 'Builderhall Level',
        value: `<:bh:341677900698877952> ${profile.builderHallLevel ? profile.builderHallLevel : 'No builder hall'}`,
        inline: true,
    }, 
    {
        name: 'Builder Trophies',
        value: `<:versustrophy:927704667960528926> ${prettyNumbers(profile.versusTrophies)}`,
        inline: true,
    }, 
    {
        name: 'Builder Personal Best',
        value: `<:nightwitch:316157731297820672> ${prettyNumbers(profile.bestVersusTrophies)}`,
        inline: true,
    });
    if (profile.legendStatistics?.legendTrophies) embed.addFields({name: 'Legend Trophies', value: `<:legend_trophy:935757690020429844> ${prettyNumbers(profile.legendStatistics.legendTrophies)}`, inline: true})
    if (profile.legendStatistics?.bestSeason) embed.addFields({name: 'Best Legend Rank', value: `<:globe:777311138789851167> ${prettyNumbers(profile.legendStatistics.bestSeason.rank)}`, inline: true})
    if (profile.legendStatistics?.bestVersusSeason) embed.addFields({name: 'Best Builder Rank', value: `<:globe:777311138789851167> ${prettyNumbers(profile.legendStatistics.bestVersusSeason.rank)}`, inline: true})    
    if(verified) embed.setFooter({text: 'Verified under this account', iconURL: "https://media.discordapp.net/attachments/582092054264545280/935702845183918160/check-mark_2714-fe0f.png"})
    return embed
}

const getClanEmbed = (clan) => {
    const embed = new MessageEmbed()
        .setTitle(`<:versusbattle:777311333649219594> ${clan.name} ${clan.tag}`)
        .setURL(`https://www.clashofstats.com/clans/${getURLClanName(clan)}-${getURLClanTag(clan)}/summary`)
        .setDescription(clan.description)
        .setThumbnail(clan.badgeUrls.medium)
        .setColor('#33E3FF')
        .addFields(
        {
            name: 'War wins',
            value: `:zap: ${prettyNumbers(clan.warWins)}`,
            inline: true
        },
        {
            name: 'War losses',
            value: `:dash: ${clan.warLosses ? prettyNumbers(clan.warLosses) : 'Private'}`,
            inline: true
        },
        {
            name: 'War league',
            value: `${getWarLeagueEmote(clan.warLeague.id)} ${clan.warLeague.name}`,
            inline: true
        }, 

        {
            name: 'Required trophies',
            value: `<:trophy:927704647089676369> ${prettyNumbers(clan.requiredTrophies)}`,
            inline: true
        },
        {
            name: 'Clan trophies',
            value: `<:trophy:927704647089676369> ${clan.clanPoints ? prettyNumbers(clan.clanPoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Members',
            value: `:bust_in_silhouette: ${prettyNumbers(clan.members)}/50`,
            inline: true
        },

        {
            name: 'Required builder cups',
            value: `<:versustrophy:927704667960528926> ${prettyNumbers(clan.requiredVersusTrophies)}`,
            inline: true
        },
        {
            name: 'Clan builder cups',
            value: `<:versustrophy:927704667960528926> ${clan.clanVersusPoints ? prettyNumbers(clan.clanVersusPoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Language',
            value: `:speech_balloon: ${clan.chatLanguage ? prettyNumbers(clan.chatLanguage.name) : 'Not set'}`,
            inline: true
        },

        {
            name: 'Top players',
            value: getTopMemberNames(clan) ?? "No players",
            inline: true
        },
        {
            name: 'Tag',
            value: getTopMemberTags(clan) ?? "-",
            inline: true
        },
        {
            name: 'Trophies',
            value: getTopMemberTrophies(clan) ?? "-",
            inline: true
        });
        
        if(clan.labels.length > 0) embed.setFooter({text: `${clan.labels[0].name}`, iconURL: `${clan.labels[0].iconUrls.small}` });
        return embed
}

const getLeagueEmote = (trophycount) => {
    if (trophycount >= 5000) return "<:legend:590895411284410407>"
    if (trophycount >= 4100) return "<:titan:613349333584052237>"
    if (trophycount >= 3200) return "<:champion:613349285852872725>"
    if (trophycount >= 2600) return "<:master:613349394724552712>"
    if (trophycount >= 2000) return "<:crystal:613349239271063553>"
    if (trophycount >= 1400) return "<:gold:613349361715249182>"
    if (trophycount >= 800) return "<:silver:613349425317806085>"
    if (trophycount >= 400) return "<:bronze:613349202528960534>"
    return "<:unranked:935678512822616074>"
}

const getTownhallEmote = (thlvl) => {
    const townhallDatas = IDs.verificationRoles.townhall

    for (let index in townhallDatas) {
        if (thlvl === townhallDatas[index].lvl) {
            return townhallDatas[index].icon
        }
    }
    return townhallDatas['TH8'].icon
}

function getWarLeagueEmote(warLeagueId){
    if (warLeagueId > 48000015) return "<:champion:613349285852872725>"
    if (warLeagueId > 48000012) return "<:master:613349394724552712>"
    if (warLeagueId > 48000009) return "<:crystal:613349239271063553>"
    if (warLeagueId > 48000006) return "<:gold:613349361715249182>"
    if (warLeagueId > 48000003) return "<:silver:613349425317806085>"
    if (warLeagueId > 48000000) return "<:bronze:613349202528960534>"
    else return "<:unranked:935678512822616074>"
}

const prettyNumbers = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const getURLTag = (profile) => profile.tag.substr(1)
const getURLName = (profile) => profile.name.replace(/\s+/g, '-').toLowerCase()
const getURLPlayerClanTag = (profile) => profile?.clan?.tag?.substr(1)
const getURLPlayerClanName = (profile) => profile?.clan?.name?.replace(/\s+/g, '-').toLowerCase()
const getURLClanTag = (clan) => clan.tag.substr(1)
const getURLClanName = (clan) => clan.name.replace(/[\s+]/g, '-').toLowerCase()
const isInClan = (profile) => !!profile.clan
const getTopMemberNames = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.name).join("\n"))
const getTopMemberTags = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.tag).join("\n"))
const getTopMemberTrophies = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.trophies).join("\n"))
const getTopMembers = (memberList) => memberList.slice(0, MAX_MEMBERS)

const fillEmptyString = (str) => str == '' ? '-' : str
module.exports = {
    getProfileEmbed,
    getClanEmbed
} 
