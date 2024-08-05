const { Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const client = require('./utils/client')
const { scheduleLeaderboards } = require('./utils/scheduler')

require('dotenv').config();

client.commands = new Collection();

const commandFolders = fs.readdirSync('./service/commands');
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./service/commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./service/commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

const eventFolders = fs.readdirSync('./service/events');
for (const folder of eventFolders) {
  const eventFiles = fs
    .readdirSync(`./service/events/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./service/events/${folder}/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args));
    else client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (e) {
    console.log(`${new Date().toString()} - ${e}`);
    await interaction.editReply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({ activities: [{ name: 'with fireballs 🔥', type: ActivityType.Playing }], status: 'online'})
  scheduleLeaderboards()
});

client.login(process.env.DISCORD_TOKEN);
