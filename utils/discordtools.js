module.exports.notify = function ntfy(msg) {
    const Discord = require("discord.js")
    let wh = new Discord.WebhookClient("804301322584588308","HqqgLq6Kr7itS9mu_T0Uv2Qm_Do6_bg6FdLRN9v8dckTd7e9CH-qF7l1xVOcXviAx3FC")
    wh.send(msg)
}
