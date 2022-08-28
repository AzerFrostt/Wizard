const {clashHeader} = require('../../utils/headers')
const axios = require('axios').default
const {parseClashStatus} = require('../../utils/statusLogger')

const SUCCESS = 200
const NOT_FOUND = 404

const responseObject = (response, fallback) => ({
  response: response,
  error: fallback
})

const findClanRequest = async ({ tag }) => 
    axios.get(
        `https://api.clashofclans.com/v1/clans/%23${tag.toUpperCase()}`, 
        clashHeader
    ).then((response) => response)
    .catch((error) => error.response)

const findClan = async( tag ) => {
    const response = await findClanRequest({ tag })
    if (response.status === SUCCESS) return responseObject ({found: true, data: response.data}, null)
    if (response.status === NOT_FOUND) return responseObject ({found: false}, null)
    return responseObject(null, parseClashStatus(response.status))
}

module.exports = {
  findClan
}

