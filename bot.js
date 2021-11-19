var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const INARA_API = "https://inara.cz/inapi/v1/"

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'cg':
                var now = new Date();
                var params = {
                    "header": {
                        "appName": 'Discord CG-Bot',
                        "appVersion": '1.0.0',
                        "isBeingDeveloped": true,
                        "APIkey": auth.inaraAPIKey
                    },
                    "events": {
                        "eventName": "getCommunityGoalsRecent",
                        "eventTimestamp": now.toISOString(),
                        "eventData": []
                    }   
                }
                fetch(INARA_API, {
                    method: 'post',
                    body: JSON.stringify(params),
                    headers: { "Content-Type": 'application/json' }
                }).then(response => {
                    if (!response.ok) {
                        logger.info("error")
                        return
                    } 
                    response.json().then(cgdata => {
                        bot.sendMessage({
                            to: channelID,
                            message: formatInaraCG(cgdata)
                        });
                    });
                });            
            break;
            // Just add any case commands if you want to.
         }
     }
});

var formatInaraCG = cgdata => {
    return JSON.stringify(cgdata)
}