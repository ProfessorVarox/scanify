var Discord = require("discord.js")
module.exports = {
    name: 'help',
    description: 'Zeigt Hilfe zum Bot an',
    execute(message, args, client, db) {
        message.guild.members.fetch(client.user.id).then(bot => {
        if (bot.hasPermission("EMBED_LINKS")) {
            let embed = new Discord.MessageEmbed()
            embed.setTitle("Hilfe")
            embed.setDescription("Hier werden alle verfügbaren Commands aufgelistet")
            embed.setColor("GREEN")
            embed.setFooter("by Infinity Sytems Group | Professor Varox#5360", "https://share.professorvarox.xyz/caYO8/wocuriyI23.png/raw")
            embed.addFields([
                {
                    "name": ">info",
                    "value": "Zeigt Informationen zum Bot an"
                },
                {
                    "name": ">invite",
                    "value": "Sendet einen Invite Link für den Bot"
                },
                {
                    "name": ">permlevel",
                    "value": "Zeigt das Permission Level an, welches benutzt wird, um bestimmte Commands nur Nutzern mit bestimmten Berechtigungen zugänglich zu machen"
                },
                {
                    "name": ">settings",
                    "value": "Stellt die Einstellungen des Servern ein \n\nMehr Informationen sind mit `.settings help` zu finden"
                },
                {
                    "name": ">support",
                    "value": "Sendet Informationen, wie Support kontaktiert werden kann"
                }
            ])
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
        } else {
            console.log("So n Affe auf Server " + message.guild.name + " (" + message.guild.id + ") hat dem Bot wieder keine Perms gegeben...")
            message.channel.send("\n" +
                "                    \">info\",\n" +
                "                    \"Zeigt Informationen zum Bot an\"\n" +
                "                \n" +
                "                \n" +
                "                    \">invite\",\n" +
                "                    \"Sendet einen Invite Link für den Bot\"\n" +
                "                \n" +
                "                \n" +
                "                    \">permlevel\",\n" +
                "                    \"Zeigt das Permission Level an, welches benutzt wird, um bestimmte Commands nur Nutzern mit bestimmten Berechtigungen zugänglich zu machen\"\n" +
                "                \n" +
                "                \n" +
                "                    \">settings\",\n" +
                "                    \"Stellt die Einstellungen des Servern ein \\n\\nMehr Informationen sind mit `.settings help` zu finden\"\n" +
                "                \n" +
                "                \n" +
                "                    \">support\",\n" +
                "                    \"Sendet Informationen, wie Support kontaktiert werden kann\"\n" +
                "                ")
        }
        }).catch(error => {
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