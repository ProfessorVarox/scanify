var Discord = require("discord.js")
module.exports = {
    name: 'support',
    description: 'Gibt Infos, wie man Support erhält',
    execute(message, args, client, db) {
        const embed = new Discord.MessageEmbed();
        embed.setColor("#6FFA87")
        embed.setDescription("Trete unserem [Support Server](https://discord.com/invite/y8kXVkQ) bei. Dort helfen dir unsere geschulten Supporter jederzeit weiter")
        embed.setTitle("Support")
        embed.setFooter("by Infinity Sytems Group | Professor Varox#5360", "https://share.professorvarox.xyz/caYO8/wocuriyI23.png/raw")
        message.channel.send(embed)
    }
}