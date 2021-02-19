const Discord = require("discord.js")
const utils = require("../utils/discordtools")
module.exports = {
    name: 'settings',
    description: 'Verwaltet die Einstellungen des Servers',
    execute(message, args, client, db) {
        if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.hasPermission("MANAGE_GUILD")) return message.reply("🔒 Dieser Command kann nur von Nutzern mit der ADMINISTRATOR oder MANAGE_GUILD Berechtigung ausgeführt werden")
        var settings = new db({name:"settings"})
        const setting = args[0]
        const value = args[1]
        if (!setting) {
            function ebd(autoDelete,notify,notifyChannel,tokens,channelMode) {
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
                embed.addField("channelMode [all|blacklist|whitelist]",channelMode,true)
                embed.addField("Scan Tokens verfügbar", "`" + tokens + "`")
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
                const cm = "`" + ((settings.has(message.guild.id)) ? (settings.has(message.guild.id,"channelmode")) ? settings.get(message.guild.id,"channelmode") : "all"  : "all") + "`"
                ebd(ad, not, notCnl, tokens, cm)
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
                    channelmode: "all",
                    tokens: 500
                }
                settings.set(message.guild.id,data)
                getdb()
            }
        }
        if (setting === "autoDelete") {
            switch (value) {
                case "on" :
                    settings.set(message.guild.id,true,"autodelete")
                    message.channel.send("✅ Die Einstellung AutoDelete wurde erfolgreich `aktiviert`")
                    break
                case "off" :
                    settings.set(message.guild.id,false,"autodelete")
                    message.channel.send("✅ Die Einstellung AutoDelete wurde erfolgreich `deaktiviert`")
                    break
                default :
                    message.reply("❌ `" + value + "` ist keine gültige Einstellung")
            }
        }
        else if (setting === "notify") {
            switch (value) {
                case "on" :
                    settings.set(message.guild.id,true,"notify")
                    message.channel.send("✅ Die Einstellung Notify wurde erfolgreich `aktiviert`")
                    break
                case "off" :
                    settings.set(message.guild.id,false,"notify")
                    message.channel.send("✅ Die Einstellung Notify wurde erfolgreich `deaktiviert`")
                    break
                default :
                    message.reply("❌ `" + value + "` ist keine gültige Einstellung")
            }
        }
        else if (setting === "notifyChannel") {
            if (message.mentions.channels.first() || value === "clear") {
                switch (value) {
                    case "clear" :
                        settings.set(message.guild.id,false,"notifychannel")
                        break
                    default :
                        settings.set(message.guild.id,message.mentions.channels.first().id,"notifychannel")
                }
            }
            else {
                message.reply("❌ Du musst entweder einen Channel oder `clear` eingeben")
            }
        }
        else if (setting === "channels") {
            if (value === "set") {
                let ids = message.mentions.channels.map(id => id.id)
                settings.set(message.guild.id,ids,"channels")
                message.channel.send("✅ Die Channel Liste wurde aktualisiert")
            }
            else if (value === "add") {
                let vals = message.mentions.channels.map(channel => channel.id)
                vals.forEach(channel => {
                    settings.push(message.guild.id,channel,"channels")
                })
                message.channel.send("✅ Die Channel Liste wurde aktualisiert")
            }
            else if (value === "remove") {
                const vals = message.mentions.channels.map(channel => channel.id)
                vals.forEach(channel => {
                    settings.remove(message.guild.id,channel,"channels")
                })
                message.channel.send("✅ Die Channel Liste wurde aktualisiert")
            }
            else if (value === "list") {
                const array = settings.get(message.guild.id,"channels") || "Keine Einträge vorhanden"
                const list = array.join(">\n - <#")
                let embed = new Discord.MessageEmbed()
                embed.setTitle("Channel Liste")
                embed.setColor("YELLOW")
                embed.setDescription(" - <#" + list + ">")
                embed.addField("Scan Modus", (settings.has(message.guild.id)) ? (settings.has(message.guild.id,"channelmode")) ? settings.get(message.guild.id,"channelmode") : "all"  : "all")
                message.channel.send(embed).catch(error => {
                    console.error("Fehler auf Server " + message.guild.id + " : " + error);
                    let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Fehlermeldung")
                    embed.addField("Text",error.message)
                    embed.setColor("RED")
                    wh.send(embed)
                    message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
                })
            }
        }
        else if (setting === "channelMode") {
            switch (value) {
                case "all" :
                    try {
                        settings.set(message.guild.id,"all","channelmode")
                    }
                    catch (error) {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message || error)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
                    } finally {
                        message.channel.send("✅ Der Channel Mode wurde erfolgreich auf `" + value + "` gestellt")
                    }
                    break
                case "blacklist" :
                    try {
                        settings.set(message.guild.id,"blacklist","channelmode")
                    }
                    catch (error) {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message || error)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
                    } finally {
                        message.channel.send("✅ Der Channel Mode wurde erfolgreich auf `" + value + "` gestellt")
                    }
                    break
                case "whitelist" :
                    try {
                        settings.set(message.guild.id,"whitelist","channelmode")
                    }
                    catch (error) {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message || error)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
                    } finally {
                        message.channel.send("✅ Der Channel Mode wurde erfolgreich auf `" + value + "` gestellt")
                    }
                    break
                default :
                    message.reply("❌ " + value + " ist keine gültige Einstellung für den Channel Mode\nGültige Einstellungen sind `all | blacklist | whitelist`. Mehr Informationen sind mit `>settings help` verfügbar")
            }
        }
        else if (setting === "help") {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Settings Command Hilfe")
            embed.setDescription("Der Syntax für den Settings Command lautet \n\n`>settings <Einstellungsname> <Wert>`")
            embed.setColor("DARK_BLUE")
            embed.addField(">settings autoDelete <on | off>","Wenn ein Bild als unangemessen erkannt wurde, wird mit dieser Einstellung das Bild automatisch gelöscht")
            embed.addField(">settings notify <on | off>","Wenn ein Bild als unangemessen erkannt wurde, wird mit dieser Einstellung das Team automatisch informiert")
            embed.addField(">settings notifyChannel <#channel | clear","Wenn ein Bild als unangemessen erkannt wurde, wird das Team in diesem Channel informiert \n_Warnung!_ Funktioniert nur, wenn die Einstellung `notify` aktiviert ist")
            embed.addField(">settings channelmode <all | whitelist | blacklist","Diese Einstellung bestimmt, in welchem Channel Bilder gescannt werden \n\n`all`: In allen Channeln auf dem Server werden Bilder gescannt \n_Warnung!_ Auf Servern mit vielen gesendeten Bilden kann das zu einem schnellen Verbrauch der Tokens führen \n`blacklist`: In allen Channeln, außer in ausgewählten Channeln werden Bilder gescannt \n`whitelist`: Nur in ausgewählten Channeln werden Bilder gescannt")
            embed.addField(">settings channels <add | set | remove | list> [#channel1] [#channel2] [#channel3] ...", "Stellt die Channel ein, die geblacklistet/gewhitelistet werden sollen (s. \"channelmode\" Einstellung) \n\n`add`: Fügt Channel der Liste hinzu \n`set`: Ersetzt alle Channel durch die Angegebenen \n`remove`: Entfernt alle angegebenen Channel aus der Liste \n`list`: Zeigt alle gewählten Channel")
            message.channel.send(embed).catch(error => {
                console.error("Fehler auf Server " + message.guild.id + " : " + error);
                let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Fehlermeldung")
                embed.addField("Text",error.message || error)
                embed.setColor("RED")
                wh.send(embed)
                message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
            })
        }
    }
}