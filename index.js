const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: config.bdd.host,
    user: config.bdd.user,
    password: config.bdd.password,
    database: config.bdd.database,
    port: config.bdd.port
});
const fs = require('fs');
const client = new CommandoClient({
	commandPrefix: 'wh!',
    owner: '332514331516207105',
    config,
    pool,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["main_commands", "Main commands"]
    ])
    .registerDefaultGroups()
	.registerDefaultCommands({
        help: false,
        prefix: false,
        eval: false,
        ping: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
    fs.readdir('./events/', (err, files) => { 
        if (err) return console.error(err); 
        console.log(`${files.length} évènement(s) chargé(s)`)
;        files.forEach(file => {
            const eventFunction = require(`./events/${file}`); 
            if (eventFunction.disabled) return; 
    
            const event = eventFunction.event || file.split('.')[0]; 
            const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
            const once = eventFunction.once;
    
            try {
                emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
            } catch (error) {
                console.error(error.stack);
            }
        });
    });

client.once('ready', () => {
    console.log(`Connecté avec ${client.user.tag}! (${client.user.id}) dans ${client.guilds.cache.size} serveur(s)`);
    setInterval(() => {
        client.user.setActivity(`Modère vos serveurs ;)`, {type: "WATCHING"});
    }, 5000);
    });
    
client.on('error', console.error);


client.login(config.token)