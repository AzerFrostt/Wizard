# WizardBot

Utility bot created for Clash of Clans to support stat tracking with in the discord server.

## Deployment

Directions on creating an app and getting credentials may be found [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

Invite your bot to your server, make sure you select the `bot` and `applications.commands` options while creating the invite.

Get your Clash of Clans API Token from [here](https://developer.clashofclans.com/).

### Setting up

1. Clone this repository

2. Make a copy of `.env.copy` and rename it to `.env`.
   Fill in your Discord Token, your Mongo_URI and your Clash Token. Make sure you include Bearer before your clash token like `"Bearer eyJ0eXAiOiJKV..."`

3. Make a copy of the `config.json.copy` file and rename it to `config.json`. Then go to the `config.json` file and change all the ids to ids in your server.

### Installation

Install all the dependencies using

```bash
npm install
```

Register slash commands to a single guild by running

```bash
node deploy-commands.js
```

You only need to run `node deploy-commands.js` once. You should only run it again if you add or edit existing commands

Finally start the application using

```bash
node index
```

and hopefully everything works right :)

## License

[ISC](https://choosealicense.com/licenses/isc/)

## Authors

- [@Azer](https://www.github.com/JamesAUre)
- [@Hawk Eye](https://github.com/hawkeye7662)
