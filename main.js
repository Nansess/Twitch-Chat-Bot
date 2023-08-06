const tmi = require('tmi.js');
require('dotenv').config();

const defaultBlockedWords = ['badword1', 'badword2', 'fword', 'inappropriate'];

let blockedWords = [...defaultBlockedWords];

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

const twitchClient = new tmi.client(twitchBotOptions);
twitchClient.connect();

const commandCooldowns = new Set();
const COMMAND_COOLDOWN_TIME = 5000; // 5 seconds

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

twitchClient.on('message', (channel, userstate, message, self) => {
  if (self) return; //

  console.log(`Received message: ${message}`);

  const lowercaseMessage = message.toLowerCase();
  for (const blockedWord of blockedWords) {
    if (lowercaseMessage.includes(blockedWord)) {
      twitchClient.deletemessage(channel, userstate.id)
        .catch((err) => {
          console.error('Error deleting message:', err);
        });

      twitchClient.timeout(channel, userstate.username, 10, 'Inappropriate language detected.')
        .catch((err) => {
          console.error('Error timing out user:', err);
        });

      console.log(`Blocked message from ${userstate.username}: ${message}`);
      return; 
    }
  }

  // Command handling
  if (message.startsWith('!')) {
    const args = message.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    console.log(`Received command: ${command} from ${userstate.username}`);

    if (userstate.mod && command === 'addblockedword') {
      const customWord = args[0];
      if (customWord) {
        blockedWords.push(customWord.toLowerCase());
        twitchClient.say(channel, `Word "${customWord}" added to the blocked list.`);
        console.log(`Word "${customWord}" added to the blocked list.`);
      } else {
        twitchClient.say(channel, 'Please provide a word to add to the blocked list.');
        console.log('Please provide a word to add to the blocked list.');
      }
      return;
    }

    if (commandCooldowns.has(command)) {
      twitchClient.say(channel, `@${userstate.username}, command "${command}" is on cooldown.`);
      console.log(`Command "${command}" is on cooldown for ${userstate.username}.`);
      return;
    }

    switch (command) {
      case 'hello':
        twitchClient.say(channel, `Hello, @${userstate.username}!`);
        console.log(`Sent greeting to ${userstate.username}.`);
        break;
      case 'clear':
        if (userstate.mod) {
          twitchClient.clear(channel);
          twitchClient.say(channel, 'Chat cleared by a moderator.');
          console.log(`Chat cleared by ${userstate.username}.`);
        } else {
          twitchClient.say(channel, `@${userstate.username}, you are not a moderator.`);
          console.log(`${userstate.username} tried to use the !clear command but is not a moderator.`);
        }
        break;
      case 'ping':
        twitchClient.say(channel, 'Pong! 🏓');
        console.log('Pong!');
        break;
      case 'roll':
        const rollResult = Math.floor(Math.random() * 100) + 1;
        twitchClient.say(channel, `@${userstate.username}, you rolled a ${rollResult}! 🎲`);
        console.log(`${userstate.username} rolled a ${rollResult} on a 100-sided dice.`);
        break;
      case 'commands':
        twitchClient.say(channel, `Available commands: !hello, !clear, !ping, !roll, !commands, !love, !shoutout, !uptime, !quote, !followage`);
        console.log('Displayed list of available commands.');
        break;
      case 'love':
        twitchClient.say(channel, `Sending love to @${userstate.username}! ❤️`);
        console.log(`Sent love to ${userstate.username}.`);
        break;
      case 'shoutout':
        const shoutoutUser = args[0];
        if (shoutoutUser) {
          twitchClient.say(channel, `Shoutout to @${shoutoutUser}! Go check out their channel.`);
          console.log(`Sent shoutout to ${shoutoutUser}.`);
        } else {
          twitchClient.say(channel, 'Please provide a username for the shoutout.');
          console.log('Please provide a username for the shoutout.');
        }
        break;
      case 'uptime':
        const uptimeInSeconds = process.uptime();
        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);
        twitchClient.say(channel, `@${userstate.username}, I've been live for ${hours}h ${minutes}m ${seconds}s.`);
        console.log(`Bot uptime: ${hours}h ${minutes}m ${seconds}s.`);
        break;
      case 'quote':
        const quotes = [
          "Be yourself; everyone else is already taken. - Oscar Wilde",
          "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
          "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
          "Life is what happens when you're busy making other plans. - John Lennon",
          "The only way to do great work is to love what you do. - Steve Jobs"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        twitchClient.say(channel, `Random Quote: ${randomQuote}`);
        console.log(`Displayed a random quote.`);
        break;
      case 'followage':
        // (Note: This requires using the Twitch API or a third-party service)
        twitchClient.say(channel, `@${userstate.username}, you have been following for a while!`);
        console.log(`${userstate.username} asked for their followage.`);
        break;
      default:
        break;
    }

    commandCooldowns.add(command);
    setTimeout(() => {
      commandCooldowns.delete(command);
      console.log(`Command "${command}" is no longer on cooldown.`);
    }, COMMAND_COOLDOWN_TIME);
  }
});

twitchClient.on('connected', (address, port) => {
  console.log(`Connected to Twitch at ${address}:${port}`);
});

twitchClient.on('error', (err) => {
  console.error('error:', err);
});
