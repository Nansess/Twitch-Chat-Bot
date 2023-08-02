# Twitch Chat Bot 

## Overview

This is a  chat bot built using Node.js and the `tmi.js` library
## Features

- **Moderation**: The bot can detect and delete messages containing blocked words, and timeout the user for a specified duration.
- **Custom Commands**: You can define custom commands that the bot will respond to when users type them in the chat.
- **Cooldowns**: To avoid spamming, the bot has command cooldowns, which limit how often a command can be used.
- **Greetings**: The bot sends a greeting message when users type `!hello`.
- **Chat Clearing**: Moderators can use the `!clear` command to clear the chat.
- **Ping-Pong**: The bot responds with "Pong!" when users type `!ping`.
- **Random Dice Roll**: Users can roll a 100-sided dice with the `!roll` command.
- **List of Commands**: The bot displays the list of available commands when users type `!commands`.
- **Sending Love**: Users can receive some love from the bot with the `!love` command.
- **Shoutout**: Moderators can give a shoutout to other users with the `!shoutout` command.
- **Uptime**: The bot can show its uptime when users type `!uptime`.
- **Random Quote**: The bot displays a random quote when users type `!quote`.
- **Followage**: The bot acknowledges users and mentions that they have been following for a while when they type `!followage` (Please note that the followage functionality requires the use of the Twitch API or a third-party service to get the actual followage information).

## Getting Started

To run this bot on your Twitch channel, follow these steps:

1. Clone the repository: `git clone https://github.com/nansess/TwitchNan/`
2. Navigate to the project folder: `cd TwitchNan`
3. Install dependencies: `npm install`
4. Replace the following lines in the code with your own Twitch bot credentials:

```javascript
const twitchBotOptions = {
  identity: {
    username: 'YOUR_BOT_USERNAME',
    password: 'YOUR_OAUTH_TOKEN' // Get the OAuth token from Twitch: https://twitchapps.com/tmi/
  },
  channels: ['YOUR_CHANNEL_NAME'], // Replace this with your Twitch channel name
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
};
```

5. Save the changes and run the bot: `npm run test`

The bot should now be connected to your Twitch channel and ready to respond to commands and perform moderation tasks.

## Adding More Commands

To add more custom commands to the bot, you can extend the `switch` statement in the `twitchClient.on('message')` event handler. Follow the existing examples to implement new commands and functionalities.

## Contributing

If you'd like to contribute to this project, feel free to create a pull request with your proposed changes. We welcome any improvements, bug fixes, or additional features that can enhance the bot's capabilities.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as per the terms of the license.

## Credits

This Twitch chat bot is built using the `tmi.js` library and inspired by the Twitch community's passion for creating interactive and engaging experiences for their viewers.

## Disclaimer

Please use this bot responsibly and adhere to Twitch's terms of service and community guidelines. Always prioritize user experience and ensure that any moderation actions are fair and appropriate.

---
