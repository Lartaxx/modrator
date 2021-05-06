const { Command } = require('discord.js-commando');
module.exports = class AddWhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add_whitelist',
			group: 'main_commands',
			memberName: 'add_whitelist',
			description: 'Ajouter un membre à la blacklist',
            userPermissions: ["BAN_MEMBERS"],
            args: [
                {
                    key: "whitelist_member",
                    type: "member",
                    prompt: "Veuillez mentionner un membre"
                }
            ]
		});
        this.pool = client.options.pool;
        this.config = client.options.config;
    }
    
    run(message, {whitelist_member}) {
        const pool = this.pool;
          this.pool.query(`SELECT * FROM whitelist WHERE guild_id = ${message.guild.id} AND user_id = ${whitelist_member?.user.id.toString()}`, async function(err, results) {
              if (err) return message.channel.send(`Erreur : ${err}`);
              if (results.length) return message.channel.send(`❌ | ${whitelist_member.user.tag} est déjà whitelist !`);
              pool.query(`INSERT INTO whitelist(user_tag, user_id, guild_id) VALUES('${whitelist_member.user.tag}', '${whitelist_member.user.id}', '${message.guild.id}')`, function(err) {if (err) throw err;});
              message.channel.send(`✅ | ${whitelist_member.user.tag} a bien été whitelist.`);
          });
    }}