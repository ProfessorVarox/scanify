var Discord = require("discord.js")
module.exports = {
    name: 'invite',
    description: 'Schickt einen Invite Link für den Bot',
    execute(message, args, client, db) {
        const embed = new Discord.MessageEmbed();
        embed.setColor("#6F97FA")
        embed.setDescription("Lade [hier](https://discord.com/oauth2/authorize?client_id=754268516051451924&scope=bot&permissions=8) unseren Bot ein")
        embed.setFooter("by Infinity Sytems Group | Professor Varox#5360", "https://share.professorvarox.xyz/caYO8/wocuriyI23.png/raw")
        message.channel.send(embed)
    }
}