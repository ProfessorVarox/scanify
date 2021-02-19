module.exports = {
    name: 'permlevel',
    description: 'Zeigt oder stellt das globale Permlevel ein',
    execute(message, args, client, db) {
        const globdb = new db({name:"global"})
        if (!args[0]) {
            const permlvl = globdb.get(message.member.id,"permlevel")
                const Discord = require("discord.js")
                let embed = new Discord.MessageEmbed();
                function permEbd(loc) {
                    embed.setTitle("Permission Level")
                    embed.setDescription("Das Permssion Level wird benutzt um Bot Befehle nur bestimmten Nutzern zugänglich zu machen")
                    embed.setColor("DARK_PURPLE")
                    embed.addField("Lokales Permission Level",loc)
                    switch (permlvl) {
                        case "7" :
                            embed.addField("Globales Permission Level", "`7` Bot Supporter")
                            message.channel.send(embed)
                            break
                        case "8" :
                            embed.addField("Globales Permission Level", "`8` Bot Administrator")
                            message.channel.send(embed)
                            break
                        case "10" :
                            embed.addField("Globales Permission Level", "`10` Bot Developer")
                            message.channel.send(embed)
                            break
                        default :
                            embed.addField("Globales Permission Level", "`Kein Globales Level`")
                            message.channel.send(embed)
                            break
                    }
                    message.delete()
                }
            if (message.member.hasPermission("MANAGE_GUILD") && !message.member.hasPermission("ADMINISTRATOR")) {
                const loc = "`4` Server Operator"
                permEbd(loc)
            }
            else if (message.member.hasPermission("ADMINISTRATOR") && message.member.id !== message.guild.owner.id) {
                const loc = "`5` Server Administrator"
                permEbd(loc)
            }
            else if (message.member.id === message.guild.owner.id) {
                const loc = "`6` Server Owner"
                permEbd(loc)
            }
        }
        if (args[0]) {
            const permlevel = globdb.get(message.member.id,"permlevel")
            if (permlevel < 8 && message.member.id !== "559458018048344064") {
                return message.reply("🔒 Um Subcommands auszuführen benötigst du mindestens Permlevel `8`")
            }
            else {
                if (!args[0] || args[0] !== "set") {
                    return message.reply("❌ Du musst einen gültigen Subcommand angeben")
                }
                else {
                    if (!args[1]) {
                        return message.reply("❌ Du musst eine Nutzer ID eingeben")
                    }
                    else {
                        if (!args[2]) {
                            return message.reply("❌ Du musst ein gültiges Permlevel angeben")
                        }
                        else {
                            globdb.set(args[1],args[2],"permlevel")
                            message.channel.send("✅ Das Permlevel für <@" + args[1] + "> wurde auf `" + args[2] + "` gesetzt")
                        }
                    }
                }
            }
        }
    }
}