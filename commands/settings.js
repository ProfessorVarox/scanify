module.exports = {
    name: 'settings',
    description: 'Verwaltet die Einstellungen des Servers',
    execute(message, args, client, db) {
        let settings = new db({name:"settings"})
        const setting = args[0]
        const value = args[1]
        if (!setting) {
            function ebd(autoDelete,notify,notifyChannel,tokens) {
                const Discord = require("discord.js")
                let embed = new Discord.MessageEmbed()
                embed.setTitle("Einstellungen")
                embed.setDescription("Hier siehst du alle Einstellungen, die du an deinem Server vornehmen kannst\n" +
                    "\n" +
                    "Du kannst Einstellungen wir folgt bearbeiten:\n" +
                    "> >settings [Einstellungsname] [Option]\n" +
                    "z.B >settings notifyChannel #scan-alarm")
                embed.addField("autoDelete [on|off]",autoDelete,true)
                embed.addField("notify [on|off]",notify,true)
                embed.addField("notifyChannel [#channel|clear]",notifyChannel,true)
                embed.addField("Scan Tokens verfügbar", "`" + tokens + "/500`")
                embed.setColor("BLURPLE")
                message.channel.send(embed)
                message.delete()
            }
            function getdb() {
                const Vad = settings.get(message.guild.id, "autodelete")
                const Vnot = settings.get(message.guild.id, "notify")
                const Vchan = settings.get(message.guild.id, "notifychannel")
                const Vtokens = settings.get(message.guild.id,"tokens")
                const ad = (Vad) ? "`on`" : "`off`"
                const not = (Vnot) ? "`on`" : "`off`"
                const notCnl = (!Vchan) ? "`Kein Channel angegeben`" : "<#" + Vchan + ">"
                const tokens = (Vtokens) ? Vtokens : 500
                ebd(ad, not, notCnl, tokens)
            }
            const hasval = settings.has(message.guild.id)
            if (hasval) {
                getdb()
            }
            else {
                const data = {
                    autodelete: false,
                    notify: false,
                    notifychannel: false,
                    tokens: 500
                }
                settings.set(message.guild.id,data)
                getdb()
            }
        }
        if (setting === "autoDelete") {
            switch (value) {
                case "on" :
                    settings.set(message.guild.id,{autodelete:true})
                    message.channel.send("✔ Die Einstellung AutoDelete wurde erfolgreich `aktiviert`")
                    break
                case "off" :
                    settings.set(message.guild.id,{autodelete:false})
                    message.channel.send("✔ Die Einstellung AutoDelete wurde erfolgreich `deaktiviert`")
                    break
                default :
                    message.reply("❌ `" + value + "` ist keine gültige Einstellung")
            }
        }
        else if (setting === "notify") {
            switch (value) {
                case "on" :
                    settings.set(message.guild.id,{notify:true})
                    message.channel.send("✔ Die Einstellung Notify wurde erfolgreich `aktiviert`")
                    break
                case "off" :
                    settings.set(message.guild.id,{notify:false})
                    message.channel.send("✔ Die Einstellung Notify wurde erfolgreich `deaktiviert`")
                    break
                default :
                    message.reply("❌ `" + value + "` ist keine gültige Einstellung")
            }
        }
        else if (setting === "notifyChannel") {
            if (message.mentions.channels.first() || value === "clear") {
                switch (value) {
                    case "clear" :
                        settings.set(message.guild.id,{notifychannel:false})
                        break
                    default :
                        settings.set(message.guild.id,{notifychannel: message.mentions.channels.first().id})
                }
            }
            else {
                message.reply("❌ Du musst entweder einen Channel oder `clear` eingeben")
            }
        }
    }
}