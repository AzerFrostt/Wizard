const { getLeaderboardAccounts } = require('../../dao/mongo/participant/connections');
const { findProfile } = require('../../dao/clash/verification');
const { getLegendaryLeaderboard, getBuilderLeaderboard } = require('../../utils/embeds/leaderboard')
const { getHowToCompete } = require('../../utils/buttons/leaderboard')
const { IDs } = require('../../config.json')
const Bottleneck = require('bottleneck');
const client = require('../../utils/client')
const {Promise} = require('bluebird');

const MAX_LEADERBOARD_PARTICIPANTS = 5

const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  
const createLeaderboard = async() => {
    const participants = await getLeaderboardAccounts()
    const discordData = await appendDiscordData(participants)
    const playerData = await fetchAllAccounts(discordData).then((x) => pruneIncompleteData(x))
    
    const participantsSplit = splitParticipants(playerData)

    const topLegends = getTopLegends(participantsSplit.legendParticipants)
    const topBuilders = getTopBuilders(participantsSplit.builderParticipants)

    const legendParticipantCount = participantsSplit.legendParticipants.length
    const builderParticipantCount = participantsSplit.builderParticipants.length

    const legendsChannel = client.channels.cache.get(IDs.leaderboardChannels.legendary)
    const builderChannel = client.channels.cache.get(IDs.leaderboardChannels.builder)

    legendsChannel.send({embeds: [getLegendaryLeaderboard(topLegends, legendParticipantCount)], components: [getHowToCompete()] })
    builderChannel.send({embeds: [getBuilderLeaderboard(topBuilders, builderParticipantCount)], components: [getHowToCompete()] })
}

const appendDiscordData = async(participants) => {
    const participantsIDs = participants.map((participant) => participant.discordID)
    const guild = client.guilds.cache.get(IDs.guild)
    const memberData = await guild.members.fetch({ user: participantsIDs })

    return participants.map((participant) => ({ ...participant._doc, discordUsername: findDiscordUsername(participant, memberData) }))
}

const findDiscordUsername = (participant, memberData) => memberData.find(x => x.user.id === participant.discordID)

const fetchAllAccounts = (participants) => 
    promiseAllProps(participantDatas = participants.map((participant) => 
        limiter.schedule(() => ({
            discord: participant.discordUsername ? participant.discordUsername : '[Could not find name]',
            clash: findProfile(participant.playerTag),
            db: {
                discordID: participant.discordID,
                leaderboard: participant.leaderboard,
                builderleaderboard: participant.builderleaderboard
            }
        }))
    ))

const splitParticipants = (participants) => 
    participants.reduce((acc, x) => {
        if (x.db.leaderboard) acc.legendParticipants.push(x)
        if (x.db.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })

const pruneIncompleteData = (playerData) =>
    playerData.reduce((acc, x) => {
        if (x.clash.response) acc.push(x)
        return acc
    }, [])

const getTopLegends = (legendParticipants) => 
    legendParticipants.sort((a, b) => b.clash.response.data.trophies - a.clash.response.data.trophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const getTopBuilders = (builderParticipants) => 
    builderParticipants.sort((a, b) => b.clash.response.data.versusTrophies - a.clash.response.data.versusTrophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const promiseAllProps = (arrayOfObjects) => 
    Promise.map(arrayOfObjects, (obj) => Promise.props(obj));

module.exports = {
    createLeaderboard
}