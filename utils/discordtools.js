var moment = require("moment")
module.exports.notify = function ntfy(msg) {
    const Discord = require("discord.js")
    let wh = new Discord.WebhookClient("765226444556206120","***REMOVED***")
    let embed = new Discord.MessageEmbed()
    embed.setColor("#5BE5B5")
    embed.setTitle("Scanify Log")
    embed.setDescription(msg)
    embed.setTimestamp(moment().format("x"))
    wh.send(embed)
}
