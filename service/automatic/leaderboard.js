const { getLeaderboardAccounts } = require('../../dao/mongo/participant/connections');
const { refreshLeaderboardSnapshot } = require('../../dao/mongo/leaderboard_snapshot/connections');
const { findProfile } = require('../../dao/clash/verification');
const { getLegendaryLeaderboard, getBuilderLeaderboard } = require('../../utils/embeds/leaderboard')
const { getHowToCompete } = require('../../utils/buttons/leaderboard')
const { IDs } = require('../../config.json')
const Bottleneck = require('bottleneck');
const client = require('../../utils/client')
const {Promise} = require('bluebird');
const participants = require('../../dao/mongo/participant/schema');

const MAX_LEADERBOARD_PARTICIPANTS = 5

const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  
const createLeaderboard = async() => {
    const participants = await getLeaderboardAccounts()
    const discordData = await appendDiscordData(participants)
    const filteredDiscordData = filterInvalidAccounts(discordData)
    const playerData = await fetchAllAccounts(filteredDiscordData).then((x) => pruneIncompleteData(x))
    
    const participantsSplit = splitParticipants(playerData)

    const topLegends = takeTopPlayers(sortLegends(participantsSplit.legendParticipants))
    const topBuilders = takeTopPlayers(sortBuilders(participantsSplit.builderParticipants))

    const legendParticipantCount = participantsSplit.legendParticipants.length
    const builderParticipantCount = participantsSplit.builderParticipants.length

    const legendsChannel = client.channels.cache.get(IDs.leaderboardChannels.legendary)
    const builderChannel = client.channels.cache.get(IDs.leaderboardChannels.builder)

    refreshLeaderboardSnapshot(playerData)

    legendsChannel.send({embeds: [getLegendaryLeaderboard(formatToSnapshot(topLegends), legendParticipantCount, 0, MAX_LEADERBOARD_PARTICIPANTS)], components: [getHowToCompete()] })
    builderChannel.send({embeds: [getBuilderLeaderboard(formatToSnapshot(topBuilders), builderParticipantCount, 0, MAX_LEADERBOARD_PARTICIPANTS)], components: [getHowToCompete()] })
}

const appendDiscordData = async(participants) => {
    const participantsIDs = participants.map((participant) => participant.discordID)
    const guild = client.guilds.cache.get(IDs.guild)
    
    const participantIDChunks = chunk(participantsIDs, 100)

    const memberDataAsync = participantIDChunks.reduce((acc, participantIDChunk) => {
        const members = guild.members.fetch({ user: participantIDChunk })
        return acc.concat(members)
    }, [])

    const memberDataArray = (await Promise.all(memberDataAsync))
    const memberData = new Map(memberDataArray.map(x => [...x]).flat())

    return participants.map((participant) => ({ ...participant._doc, discordUsername: findDiscordUsername(participant, memberData) }))
}

const findDiscordUsername = (participant, memberData) => {
    const discordUser = memberData.get(participant.discordID)?.user
    return discordUser ? `${discordUser.username}#${discordUser.discriminator}` : null
}

const filterInvalidAccounts = (participants) => 
    participants.filter((participant) => participant.discordUsername)

const fetchAllAccounts = (participants) => 
    promiseAllProps(participantDatas = participants.map((participant) => 
        limiter.schedule(() => ({
            discordUsername: participant.discordUsername,
            clash: findProfile(participant.playerTag),
            discordID: participant.discordID,
            leaderboard: participant.leaderboard,
            builderleaderboard: participant.builderleaderboard
        }))
    ))

const splitParticipants = (participants) => 
    participants.reduce((acc, x) => {
        if (x.leaderboard) acc.legendParticipants.push(x)
        if (x.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })

const pruneIncompleteData = (playerData) =>
    playerData.reduce((acc, x) => {
        if (x.clash.response?.found) acc.push(x)
        return acc
    }, [])

const sortLegends = (legendParticipants) => 
    legendParticipants.sort((a, b) => b.clash.response.data.trophies - a.clash.response.data.trophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const sortBuilders = (builderParticipants) => 
    builderParticipants.sort((a, b) => b.clash.response.data.builderBaseTrophies - a.clash.response.data.builderBaseTrophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const takeTopPlayers = (participants) => participants.slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const promiseAllProps = (arrayOfObjects) => 
    Promise.map(arrayOfObjects, (obj) => Promise.props(obj));

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    )

const formatToSnapshot = (participants) => participants.map(participant => ({
    discordID: participant.discordID,
    discordUsername: participant.discordUsername,
    gameName: participant.clash.response.data.name,
    gameTag: participant.clash.response.data.tag,
    trophiesLegends: participant.leaderboard ? participant.clash.response.data.trophies : null,
    trophiesBuilders: participant.builderleaderboard ? participant.clash.response.data.builderBaseTrophies : null
}))

module.exports = {
    createLeaderboard,
    splitParticipants,
    sortLegends,
    sortBuilders
}