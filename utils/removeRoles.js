
const { IDs } = require('../config.json');

const removeRoles = (member) => {
    const user_roles = member.roles.cache

    const noReqColourRolesRemoved = removeColourRoles(IDs.verificationRoles.colour.norequirement, user_roles)
    const reqColourRolesRemoved = removeColourRoles(IDs.verificationRoles.colour.requirement, user_roles)
    const prestigeRolesRemoved = removePrestigeRoles(IDs.verificationRoles.prestige, user_roles)
    const townhallRolesRemoved = removePrestigeRoles(IDs.verificationRoles.townhall, user_roles)
    const allRolesRemoved = noReqColourRolesRemoved.concat(reqColourRolesRemoved, prestigeRolesRemoved, townhallRolesRemoved)

    const allRoleIDs = allRolesRemoved.map((role) => role.id)
    member.roles.remove(allRoleIDs)
    return allRolesRemoved
}

const removeColourRoles = (rolesConfig, user_roles) => Object.values(rolesConfig).reduce((acc, x) => {
    if (user_roles.has(x.colourid)) acc.push({icon: x.icon, id: x.colourid}) 
    return acc
}, [])

const removePrestigeRoles = (rolesConfig, user_roles) => Object.values(rolesConfig).reduce((acc, x) => {
    if (user_roles.has(x.roleid)) acc.push({icon: x.icon, id: x.roleid}) 
    return acc
}, [])

module.exports = {
    removeRoles
};
  

