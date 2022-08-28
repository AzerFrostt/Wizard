require('dotenv').config()
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { IDs } = require('./config.json')
const fs = require('node:fs')

const commands = []
const commandFolders = fs.readdirSync('./service/commands')

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./service/commands/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`./service/commands/${folder}/${file}`)
      commands.push(command.data.toJSON())
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.')

		await rest.put(
			Routes.applicationGuildCommands(IDs.client, IDs.guild),
			{ body: commands },
		)

		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
})()