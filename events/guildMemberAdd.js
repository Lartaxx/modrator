const config = require('../config.json');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: config.bdd.host,
    user: config.bdd.user,
    password: config.bdd.password,
    database: config.bdd.database,
    port: config.bdd.port
});
module.exports = {
    event: "guildMemberAdd",
    once: false,
    run(member) {
        if ( config.whitelist == true ) {
            pool.query(`SELECT * FROM whitelist WHERE guild_id = ${member.guild.id.toString()}`, async function(err, results) {
                if (err) throw err;
                const user_find = results.find(r => r?.user_id === member?.user.id);
                if (!user_find) await member.kick();
                else message.guild.channels.cache.get("your_channel_id").send(`✅ | ${member.user.tag} est arrivé sachant qu'il est whitelist !`);
            })
        }
        else {
            return; // the whitelist isn't activated
        }
    }
};