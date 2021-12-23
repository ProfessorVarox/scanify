var moment = require("moment")
module.exports.notify = function ntfy(msg) {
    const Discord = require("discord.js")
    let wh = new Discord.WebhookClient("**REMOVED**","**REMOVED**")
    let embed = new Discord.MessageEmbed()
    embed.setColor("#5BE5B5")
    embed.setTitle("Scanify Log")
    embed.setDescription(msg)
    embed.setTimestamp(moment().format("x"))
    wh.send(embed)
}
