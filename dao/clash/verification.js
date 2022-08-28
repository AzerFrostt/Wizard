const {clashHeader} = require('../../utils/headers')
const axios = require('axios').default
const {parseClashStatus} = require('../../utils/statusLogger')

const SUCCESS = 200
const NOT_FOUND = 404

const responseObject = (response, fallback) => ({
  response: response,
  error: fallback
})

const verifyProfileRequest = async ({ tag, token }) => 
    axios.post(
      `https://api.clashofclans.com/v1/players/%23${tag.toUpperCase()}/verifytoken`, 
      { token: token },
      clashHeader
    ).then((response) => response )
    .catch((error) => error.response )


const verifyProfile = async( tag, token ) => {
  const response = await verifyProfileRequest({tag, token})
  if (response.status === SUCCESS) return responseObject(response.data, null)
  return responseObject(null, parseClashStatus(response.status))
}

const findProfileRequest = async ({ tag }) => 
  axios.get(
    `https://api.clashofclans.com/v1/players/%23${tag.toUpperCase()}`, 
    clashHeader
  ).then((response) => response )
  .catch((error) => error.response )

const findProfile = async( tag ) => {
const response = await findProfileRequest({ tag })
if (response.status === SUCCESS) return responseObject ({found: true, data: response.data}, null)
if (response.status === NOT_FOUND) return responseObject ({found: false}, null)
return responseObject(null, parseClashStatus(response.status))
}

module.exports = {
  verifyProfile,
  findProfile
}

