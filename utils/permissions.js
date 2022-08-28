const { IDs } = require('../config.json');

const hasMediumPerms = (member) => member.roles.cache.find(r => IDs.mediumPermRoles.includes(r.id) || IDs.fullPermRoles.includes(r.id))

const hasFullPerms = (member) => member.roles.cache.find(r => IDs.fullPermRoles.includes(r.id))

module.exports = {
    hasMediumPerms,
    hasFullPerms
}