var Discord = require("discord.js")
const utils = require("../utils/discordtools")
var moment = require("moment")
module.exports = {
    name: 'manage',
    description: 'Verwaltet den Bot',
    execute(message, args, client, db) {
        const module = args[0]
        const sub = args[1]
        const entity = args[2]
        const value = args[3]

        const setdb = new db({name:"settings"})
        const globdb = new db({name:"global"})

        const haspl = globdb.has(message.member.id)
        if (haspl) {
            const permlevel = globdb.get(message.member.id,"permlevel")

            if (module === "tokens") {
                if (permlevel < 8 && message.member.id !== "559458018048344064") return message.reply("🔒 Dieser Command ist nur für Nutzer mit Permission Level `8` (Globaler Administrator) oder höher verfügbar")
                if (sub === "add") {
                    const oldTokens = setdb.get(entity,"tokens")
                    const newTokens = Number(oldTokens) + Number(value)
                    setdb.set(entity,newTokens,"tokens")
                    message.channel.send("✅ Die Tokens für " + entity + " wurden erfolgreich von `" + oldTokens + "` auf `" + newTokens + "` erhöht")
                }
                else if (sub === "set") {
                    setdb.set(entity,Number(value),"tokens")
                    message.channel.send("✅ Die Tokens für " + entity + " wurden erfolgreich auf `" + value + "` gesetzt")
                }
                else {
                    message.reply("⚠ `" + sub + "` ist kein gültiger Subcommand")
                }
            }
            if (module === "server") {
                if (permlevel < 7 && message.member.id !== "559458018048344064") return message.reply("🔒 Dieser Command ist nur für Nutzer mit Permission Level `7` (Globaler Supporter) oder höher verfügbar")
                if (sub === "block") {
                    if (!entity) return message.reply("⚠ Du musst eine Server ID angeben")
                    if (!args[3]) return message.reply("⚠ Du musst einen Grund für die Sperrung angeben")
                    const payload = {
                        reason: args.splice(3).join(" "),
                        staff: message.member.id,
                        timestamp: message.timestamp
                    }
                    try {
                        setdb.set(entity,payload,"blockmeta")
                        setdb.set(entity,true,"blocked")
                    } catch (error) {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Fehler beim Setzen der Daten. Bitte einen Administrator kontaktieren');
                    }
                    client.guilds.fetch(entity).then(server => {
                        const embed = new Discord.MessageEmbed();
                        embed.setTitle("Server gesperrt")
                        embed.setColor("RED")
                        embed.setFooter("Der Bot hat deinen Server automatisch verlassen")
                        embed.setDescription("Du bist der Inhaber des Servers **" + server.name + "** \n\n" +
                            "Wir haben deinen Server gesperrt, da dieser gegen die Nutzungsbedingungen von Discord verstößt oder den Bot ausnutzt \n" +
                            "Mehr Informationen zu deiner Sperrung erhältst du auf [unserem Support Server](https://discord.gg/y8kXVkQ), wo du auch einen Antrag auf Entsperrung stellen kannst")
                        server.owner.send(embed).then(sent => {
                            if (sent.id) utils.notify("✅ Die Nachricht der Sperrung hat " + server.owner + " erhalten")
                            else utils.notify("⚠ " + server.owner + " blockiert die Direktnachrichten und hat keine Nachricht der Sperrung erhalten")
                        })
                        server.leave()
                        message.channel.send("✅ Der Server wurde erfolgreich gesperrt und der Bot hat den Server verlassen")
                    }).catch(error => {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Der Bot ist nicht auf dem Server mit der ID **' + entity + "**");
                    })
                }
                else if (sub === "unblock") {
                    if (!entity) return message.reply("⚠ Du musst eine Server ID angeben")
                    if (!(setdb.has(entity) ? setdb.has(entity,"blocked") : false)) return message.reply("⚠ Der Server mit der ID **" + entity + "** ist nicht gesperrt")
                    try {
                        setdb.delete(entity,"blocked")
                    } catch (error) {
                        console.error("Fehler auf Server " + message.guild.id + " : " + error);
                        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Fehlermeldung")
                        embed.addField("Text",error.message)
                        embed.setColor("RED")
                        wh.send(embed)
                        message.reply('❌ Fehler beim Setzen der Daten. Bitte einen Administrator kontaktieren');
                    } finally {
                        message.channel.send("✅ Der Server mit der ID **" + entity + "** wurde erfolgreich entsperrt")
                        utils.notify("Teammitglied **" + message.member.username + "#" + message.member.discriminator + "** hat den Server mit der ID **" + entity + "** entsperrt")
                    }
                }
                else if (sub === "lookupblock") {
                    if (!entity) return message.reply("⚠ Du musst eine Server ID angeben")
                    if (!(setdb.has(entity) ? setdb.has(entity,"blockedmeta") : false)) return message.reply("⚠ Der Server mit der ID **" + entity + "** hat keine Informationen zu einer Sperrung")
                    const meta = setdb.get(entity,"blockmeta")
                    const lkbembed = new Discord.MessageEmbed();
                    lkbembed.setTitle("Informationen zu Sperrung")
                    lkbembed.addFields([
                        {
                            "name": "Gesperrt von",
                            "value": "<@" + meta.staff + "> (" + meta.staff + ")"
                        },
                        {
                            "name": "Gesperrt am",
                            "value": moment(meta.timestamp).format("LLLL")
                        },
                        {
                            "name": "Grund",
                            "value": meta.reason
                        }
                    ])
                }
                else {
                    message.reply("⚠ `" + sub + "` ist kein gültiger Subcommand")
                }
            }
        }
        else {
            const basicData = {
                permlevel: 0
            }
            globdb.set(message.author.id,basicData)
            message.reply("🔒 Dieser Command ist nur für `GLOBAL_DEVELOPER` verfügbar")
        }
    }
}