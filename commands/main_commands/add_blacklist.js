const { Command } = require('discord.js-commando');
module.exports = class AddBlacklistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add_blacklist',
			group: 'main_commands',
			memberName: 'add_blacklist',
			description: 'Ajouter un membre à la blacklist',
            userPermissions: ["BAN_MEMBERS"],
            args: [
                {
                    key: "blacklist_member",
                    type: "member",
                    prompt: "Veuillez mentionner un membre"
                },
                {
                    key: "reason",
                    type: "string",
                    prompt: "Veuillez écrire une raison"
                }
            ]
		});
        this.pool = client.options.pool;
        this.config = client.options.config;
    }
    
    run(message, {blacklist_member, reason}) {
        const pool = this.pool;
          this.pool.query(`SELECT * FROM blacklist WHERE guild_id = ${message.guild.id} AND user_id = ${blacklist_member?.user?.id.toString()}`, async function(err, results) {
              if (err) return message.channel.send(`Erreur : ${err}`);
              if (results.length) return message.channel.send(`❌ | ${blacklist_member.user.tag} est déjà blacklist !`);
              pool.query(`INSERT INTO blacklist(user_tag, user_id, guild_id) VALUES('${blacklist_member.user.tag}', '${blacklist_member.user.id}', '${message.guild.id}')`, function(err) {if (err) throw err;});
              await blacklist_member.kick()
              .then(() => {
                  message.channel.send(`✅ | ${blacklist_member.user.tag} a été expulsé du serveur et blacklist. \n Il/Elle ne pourra pas revenir sur le serveur tant qu'il est sur liste noire. \n Raison : ${reason}`);
              })
              .catch(() => {
                  message.channel.send(`❌ | Une erreur est survenue..., le membre n'est pas expulsable ou une autre erreur est apparue.`);
              })

          });
    }}