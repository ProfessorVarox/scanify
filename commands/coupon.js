var Discord = require("discord.js")
var utils = require("../utils/discordtools")
const uniqid = require("uniqid")
var moment = require("moment")
moment.locale("de")
module.exports = {
    "name": "coupon",
    "description": "Verwaltet Gutscheine",
    execute(message, args, client, db) {
        var settings = new db({name:"settings"})
        var users = new db({name:"global"})
        var coupons = new db({name:"coupons"})
        const permlvl = (users.has(message.member.id)) ? users.has(message.member.id,"permlevel") ? users.get(message.member.id,"permlevel") : 0 : 0
        const action = args[0]
        if (permlvl < 7) if (action !== "redeem") return message.reply("🔒 Dazu hast du keine Berechtigung")
        const value = args[1]
        const entity = args[2]
        if (!action || action === "help") {
            let helpEbd = new Discord.MessageEmbed()
            helpEbd.setTitle("Gutschein Verwaltung")
            helpEbd.setColor("#EFD010")
            helpEbd.setDescription("Hier können Gutscheine erstellt und verwaltet werden")
            helpEbd.addFields([
                {
                    "name": "create <Anzahl Tokens> [Anzahl Benutzungen]",
                    "value": "Erstellt einen Gutschein"
                },
                {
                    "name": "delete <Gutscheincode> [-r]",
                    "value": "Löscht einen Gutscheincode aus dem System \n" +
                        "`-r` Entfernt die Tokens auf allen Servern, die den Gutschein eingelöst haben"
                },
                {
                    "name": "list [active | redeemed]",
                    "value": "Listet alle Gutscheincodes auf \n\n" +
                        "`active` Listet nur aktive Gutscheincodes \n" +
                        "`redeemed` Listet nur eingeladene Gutscheincodes"
                },
                {
                    "name": "info <Gutscheincode>",
                    "value": "Zeigt Informationen über einen bestimmten Gutscheincode"
                }
            ])
            message.channel.send(helpEbd)
            message.delete()
        }
        else if (action === "create") {
            if (!value) return message.reply("⚠ Du musst eine Anzahl von Tokens angeben")
            const code = uniqid.process()
            try {
                let data = {
                    created: message.createdTimestamp,
                    staff: message.member.id,
                    tokens: value,
                    servers: [],
                    uses: Number(entity) || 1,
                    maxuses: Number(entity) || 1,
                    code: code
                }
                coupons.set(code,data)
            } catch (error) {
                console.error("Fehler auf Server " + message.guild.id + " : " + error);
                let wh = new Discord.WebhookClient("**REMOVED**", "**REMOVED**")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Fehlermeldung")
                embed.addField("Text",error.message)
                embed.setColor("RED")
                wh.send(embed)
                message.reply('❌ Fehler beim Ausführen des Commands! Bitte einen Administrator kontaktieren');
            } finally {
                message.channel.send("✅ Der Gutschein `" + code + "` wurde für **" + (entity || "1") + "** Server mit **" + value + "** Tokens erstellt")
                utils.notify("Der Gutschein `" + code + "` wurde für **" + (entity || "1") + "** Server mit **" + value + "** Tokens von " + message.member + " (" +
                message.member.id + ") erstellt")
            }
        }
        else if (action === "redeem") {
            settings.evict(message.guild.id)
            if (!value) return message.reply("⚠ Du musst einen Gutscheincode eingeben")
            if (!coupons.has(value)) return message.reply("⚠ `" + value + "` ist kein gültiger Gutscheincode")
            const cdata = coupons.get(value)
            if (cdata.uses < 1) return message.reply("⚠ Dieser Gutscheincode wurde bereits eingelöst")
            if (cdata.servers.includes(message.guild.id)) return message.reply("⚠ Es kann pro Server ein Gutschein nur einmal eingelöst werden")
            try {
                coupons.dec(value,"uses")
                coupons.push(value,message.guild.id,"servers")
                if (!settings.has(message.guild.id,"bstokens")) settings.set(message.guild.id,Number(cdata.tokens),"bstokens")
                else settings.math(message.guild.id,"+",Number(cdata.tokens),"bstokens")
            } catch (error) {
                console.error("Fehler auf Server " + message.guild.id + " : " + error);
                let wh = new Discord.WebhookClient("**REMOVED**", "**REMOVED**")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Fehlermeldung")
                embed.addField("Text",error.message)
                embed.setColor("RED")
                wh.send(embed)
                message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf <https://discord.gg/y8kXVkQ> kontaktieren');
            } finally {
                message.channel.send("✅ Der Gutschein wurde erfolgreich eingelöst und es wurden `" + cdata.tokens + "` Tokens gutgeschrieben")
            }
        }
        else if (action === "delete") {
            if (!value) return message.reply("⚠ Du musst einen Gutscheincode eingeben")
            if (!coupons.has(value)) return message.reply("⚠ `" + value + "` ist kein gültiger Gutscheincode")
            try {
                console.log(entity)
                if (entity === "-r") {
                    if (permlvl < 8) return message.reply("🔒 Nur Globale Administratoren und höher können `-r` benutzen")
                    const cdata = coupons.get(value)
                    cdata.servers.forEach(id => {
                        if (settings.has(id)) {
                            settings.math(id,"-",cdata.tokens,"tokens")
                        }
                    })
                }
                coupons.delete(value)
            } catch (error) {
                console.error("Fehler auf Server " + message.guild.id + " : " + error);
                let wh = new Discord.WebhookClient("**REMOVED**", "**REMOVED**")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Fehlermeldung")
                embed.addField("Text",error.message)
                embed.setColor("RED")
                wh.send(embed)
                message.reply('❌ Fehler beim Ausführen des Commands! Bitte einen Administrator kontaktieren');
            } finally {
                message.channel.send("✅ Der Gutschein `" + value + "` wurde erfolgreich aus dem System gelöscht")
                utils.notify("Der Gutschein **" + value + "** wurde von " + message.member + " (" + message.member.id + ") aus dem System gelöscht" +
                    ((entity === "-r") ? "\nAuf allen Server wurden die Tokens entfernt" : ""))
            }
        }
        else if (action === "info") {
            if (!value) return message.reply("⚠ Du musst einen Gutscheincode eingeben")
            if (!coupons.has(value)) return message.reply("⚠ `" + value + "` ist kein gültiger Gutscheincode")
            const cdata = coupons.get(value)
            let listEbd = new Discord.MessageEmbed()
            listEbd.setTitle("Gutscheincode Übersicht")
            listEbd.setColor("BLUE")
            listEbd.addFields([
                {
                    "name": "Code",
                    "value": value
                },
                {
                    "name": "Erstellt am",
                    "value": moment(cdata.created).format("LLLL")
                },
                {
                    "name": "Erstellt von",
                    "value": "<@" + cdata.staff + "> (" + cdata.staff + ")"
                },
                {
                    "name": "Vergebene Tokens",
                    "value": cdata.tokens
                },
                {
                    "name": "Eingelöst/Anzahl Codes",
                    "value": cdata.servers.length + "/" + cdata.maxuses
                },
                {
                    "name": "Noch verfügbare Codes",
                    "value": cdata.uses
                },
                {
                    "name": "Auf Server eingelöst",
                    "value": cdata.servers.join("\n") || "`Auf keinem Server eingelöst`"
                }
            ])
            message.channel.send(listEbd).catch(error => {
                console.error("Fehler auf Server " + message.guild.id + " : " + error);
                let wh = new Discord.WebhookClient("**REMOVED**", "**REMOVED**")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Fehlermeldung")
                embed.addField("Text",error.message)
                embed.setColor("RED")
                wh.send(embed)
                message.reply('❌ Fehler beim Ausführen des Commands! Bitte einen Administrator kontaktieren');
            })
        }
        else if (action === "list") {
            if (!value) {
                let lEbd1 = new Discord.MessageEmbed()
                lEbd1.setTitle("Gutscheincode Liste")
                lEbd1.setDescription("- " + coupons.keyArray().join("\n- "))
                lEbd1.addField("Anzahl", coupons.keyArray().length)
                message.channel.send(lEbd1)
            }
            /*else if (value === "active") {
                let lEbd2 = new Discord.MessageEmbed()
                lEbd2.setTitle("Gutscheincode Liste (Nur Aktive)")
                lEbd2.setDescription("- " + coupons.filterArray(coupon => coupon.uses > 0).join("\n- "))
                lEbd2.addField("Anzahl", coupons.filterArray(coupon => coupon.uses > 0).length)
                message.channel.send(lEbd2)
            }
            else if (value === "redeemed") {
                return console.log(coupons.filterArray(coupon => Number(coupon.uses) === 0))
                let lEbd3 = new Discord.MessageEmbed()
                lEbd3.setTitle("Gutscheincode Liste (Nur Eingelöste)")
                lEbd3.setDescription("- " + coupons.filterArray(coupon => Number(coupon.uses) === 0).join("\n- "))
                lEbd3.addField("Anzahl", coupons.keyArray().length)
                message.channel.send(lEbd3)
            }*/
        }
    }
}