require('dotenv').config()

const clashHeader = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CLASH_TOKEN
    }
  }

module.exports = {
    clashHeader
}