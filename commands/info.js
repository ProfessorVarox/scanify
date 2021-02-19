var Discord = require("discord.js")
const readTime = require('pretty-ms');
module.exports = {
    name: 'info',
    description: 'Zeigt Infos zum Bot an',
    execute(message, args, client, db) {
        const embed = new Discord.MessageEmbed();
        embed.setColor("DARK_RED")
        embed.setDescription("⌚ Uptime: " + readTime(Number(client.uptime)) + "\n\n🏓 Latenz " + Math.round(Number(client.ws.ping))+ "ms \n\n📥 RAM Nutzung: " + Math.round(Number(process.memoryUsage().heapUsed) / 1000000) + "MB \n\n[Lade hier den Bot ein](https://discord.com/oauth2/authorize?client_id=754268516051451924&scope=bot&permissions=8)")
        embed.setTitle("Bot Informationen")
        embed.setFooter("by Infinity Sytems Group | Professor Varox#5360", "https://share.professorvarox.xyz/caYO8/wocuriyI23.png/raw")
        message.channel.send(embed)
    }
}