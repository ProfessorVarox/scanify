const fs = require('fs');
var Discord = require('discord.js');
const prefix = ">"
const token = "***REMOVED***"
const testtoken = "***REMOVED***"
const dctools = require("./utils/discordtools")

const db = require("enmap")
var settings = new db({name:"settings",fetchAll:false})

var moment = require("moment")
moment.locale("de")

const utils = require("./utils/discordtools")

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.login(token)

client.once("ready", () => {
    console.log("Der Bot ist bereit")
    const data = require("./package.json")
    client.user.setActivity("Prefix > | >help")
})

client.on("guildCreate", (guild) => {
    const isBlocked = (settings.has(guild.id)) ? settings.has(guild.id,"blocked") : false;
    if (isBlocked) {
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Server gesperrt")
        embed.setColor("RED")
        embed.setFooter("Der Bot hat deinen Server automatisch verlassen")
        embed.setDescription("Du bist der Inhaber des Servers **" + guild.name + "** \n\n" +
            "Wir haben deinen Server gesperrt, da dieser gegen die Nutzungsbedingungen von Discord verstößt oder den Bot ausnutzt \n" +
            "Mehr Informationen zu deiner Sperrung erhältst du auf [unserem Support Server](https://discord.gg/y8kXVkQ), wo du auch einen Antrag auf Entsperrung stellen kannst")
        guild.owner.send(embed).then(sent => {
            if (sent.id) utils.notify("✅ " + guild.owner + " hat den Bot auf den gesperrten Server **" + guild.name + "** (" + guild.id + ") eingeladen und die Nachricht erhalten")
            else utils.notify("⚠ " + guild.owner + " hat den Bot auf den gesperrten Server **" + guild.name + "** (" + guild.id + ") eingeladen, aber die Nachricht nicht erhalten")
        })
        guild.leave()
    }
    const embed = new Discord.MessageEmbed()
        .setTitle('Server hinzugefügt')
        .setDescription(`Scanify wurde auf Server **` + guild.name + "** (" + guild.id + ") von " + guild.owner + " (" + guild.ownerID + ") hinzugefügt")
        .setColor('#37D9E7');
    // https://canary.discord.com/api/webhooks/765226444556206120/***REMOVED***
    const logwh = new Discord.WebhookClient("765226444556206120","***REMOVED***")
    logwh.send(embed).catch(error => {
        console.error("Fehler auf Server " + message.guild.id + " : " + error);
        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Fehlermeldung")
        embed.addField("Text",error.message)
        embed.setColor("RED")
        wh.send(embed)
        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf https://discord.gg/y8kXVkQ kontaktieren');
    })
})

client.on("guildDelete", (guild) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Server entfernt')
        .setDescription(`Scanify wurde von Server **` + guild.name + "** (" + guild.id + ") von " + guild.owner + " (" + guild.ownerID + ") entfernt")
        .setColor('#37D9E7');
    // https://canary.discord.com/api/webhooks/765226444556206120/***REMOVED***
    const logwh = new Discord.WebhookClient("765226444556206120","***REMOVED***")
    logwh.send(embed).catch(error => {
        console.error("Fehler auf Server " + message.guild.id + " : " + error);
        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Fehlermeldung")
        embed.addField("Text",error.message)
        embed.setColor("RED")
        wh.send(embed)
        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf https://discord.gg/y8kXVkQ kontaktieren');
    })
})

client.on('message', message => {
    if (message.guild && message.channel.type === "text") if (!settings.has(message.guild.id)) settings.set(message.guild.id,"all","channelmode")
    if (message.attachments.first()) {
        const cm = settings.has(message.guild.id) ? settings.has(message.guild.id, "channelmode") ? settings.get(message.guild.id, "channelmode") : "all" : "all"
        switch (cm) {
            case "all" :
                autoScan()
                break
            case "blacklist" :
                const cnlArr = settings.get(message.guild.id, "channels")
                if (!cnlArr.includes(message.channel.id)) {
                    autoScan()
                }
                break
            case "whitelist" :
                const cnlArrr = settings.get(message.guild.id, "channels")
                if (cnlArrr.includes(message.channel.id)) {
                    autoScan()
                }
                break
        }

        function autoScan() {
            const att = message.attachments.first()
            const url = att.url
            const server = message.guild

            function check(autoDelete, notify, notifyChannel) {
                async function getTokens() {
                    return new Promise((resolve, reject) => {
                        try {
                            settings.evict(message.guild.id)
                            if (!(settings.has(server.id) ? settings.has(server.id, "tokens") : false)) settings.set(server.id, 500 ,"tokens")
                            settings.evict(message.guild.id)
                            let oldTokens = (settings.has(server.id) ? settings.has(server.id, "tokens") ? Number(settings.get(server.id, "tokens")) : 500 : 500) + (settings.has(server.id) ? settings.has(server.id, "bstokens") ? Number(settings.get(server.id, "bstokens")) : 0 : 0)
                            resolve(oldTokens)
                        } catch (e) {
                            reject(e)
                        }
                    })
                }
                getTokens().then(oldTokens => {
                    if (oldTokens < 3) { return }
                    if (oldTokens < 39 && oldTokens > 34) {
                        let warnEbd = new Discord.MessageEmbed()
                        warnEbd.setTitle("⚠ Tokens fast aufgebraucht")
                        warnEbd.setColor("YELLOW")
                        warnEbd.setDescription("Du bist der Besitzer des Server **" + message.guild.name + "** \n\n" +
                            "Auf diesem Server sind fast alle Scan Tokens aufgebraucht. Es können nur noch ca. 10 Bilder gescannt werden, bis das monatliche Limit erreicht ist.\n\n" +
                            "Zu Beginn jedes Monats werden allerdings alle Tokens wieder auf 500 erhöht, solltest du deine Tokens komplett aufbrauchen, kannst du [unseren Support](https://discord.gg/y8kXVkQ) freundlich um mehr Tokens bitten")
                        warnEbd.addField("Aktuell noch verfügbare Tokens",oldTokens,true)
                        warnEbd.addField("Tokens werden aufgefüllt",moment().endOf('month').fromNow(),true)
                        message.guild.owner.send(warnEbd)
                    }
                    if (settings.has(message.guild.id) ? settings.has(message.guild.id,"bstokens") : false) {
                        const bonustokens = settings.get(message.guild.id,"bstokens")
                        if (bonustokens > 3) settings.math(message.guild.id,"-",3,"bstokens")
                        else settings.math(message.guild.id,"-",3,"tokens")
                    }
                    else settings.math(message.guild.id,"-",3,"tokens")
                    var sightengine = require('sightengine')('***REMOVED***', '***REMOVED***');
                    sightengine.check(['nudity', 'wad', 'offensive']).set_url(url).then(function (result) {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Scan Ergebnis");
                        embed.addField('Waffen', result.weapon, true)
                        embed.addField('Alkohol', result.alcohol, true)
                        embed.addField('Nacktheit', result.nudity.raw, true)
                        if (result.weapon > 0.3 || result.alcohol > 0.3 || result.nudity.raw > 0.3) {
                            embed.setColor("RED")
                            embed.setDescription("**Achtung!** Es wurde unangemessener Inhalt gefunden");
                            message.channel.send(embed);
                            if (notify && notifyChannel) {
                                client.channels.fetch(notifyChannel).then(notcnl => {
                                    notcnl.send("Achtung! in <#" + message.channel + "> wurde ein anstößiges Bild gefunden!")
                                    const imgur = require('imgur');
                                    imgur.uploadUrl(url).then(function (json) {
                                        notcnl.send(json.data.link);
                                        if (autoDelete) {
                                            message.delete();
                                        }
                                    }).catch(function (err) {
                                        console.error(err.message);
                                    });
                                })
                            }
                        }
                    }).catch(function (err) {
                        const debugWH = new Discord.WebhookClient("776106264622792746", "***REMOVED***");
                        if (err.includes("Cannot read property 'raw' of undefined")) {
                        } else {
                            debugWH.send("Achtung! Ein Fehler ist aufgetreten: " + err);
                        }
                    });
                }).catch(error => {
                    console.error("Fehler auf Server " + message.guild.id + " : " + error);
                    let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Fehlermeldung")
                    embed.addField("Text",error.message)
                    embed.setColor("RED")
                    wh.send(embed)
                    message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf https://discord.gg/y8kXVkQ kontaktieren');
                })
            }

        const hasval = settings.has(server.id)
        if (hasval) {
            const ad = settings.get(server.id, "autodelete")
            const not = settings.get(server.id, "notify")
            const notCnl = settings.get(server.id, "notifychannel")
            check(ad, not, notCnl)
        } else {
            check(false, false, undefined)
        }
    }
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        message.guild.members.fetch(client.user.id).then(bot => {
            if (!bot.hasPermission("EMBED_LINKS")) return message.reply("⚠ Die Berechtigung `EMBED_LINKS` wird dringend für eine ordnungsgemäße Nutzung empfohlen")
        })
        client.commands.get(command).execute(message, args, client, db);
    } catch(error) {
        console.error("Fehler auf Server " + message.guild.id + " : " + error);
        let wh = new Discord.WebhookClient("776106264622792746", "***REMOVED***")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Fehlermeldung")
        embed.addField("Text",error.message)
        embed.setColor("RED")
        wh.send(embed)
        message.reply('❌ Fehler beim Ausführen des Commands! Bitte Support auf https://discord.gg/y8kXVkQ kontaktieren');
    }
});

var schedule = require('node-schedule');

const tokenRefill = schedule.scheduleJob("00 00 01 * *", function(){
    const settings = new db({name:"settings"})
    client.guilds.cache.forEach(guild => {
        try {
            settings.set(guild.id, {tokens: 500})
        } catch (err) {
            console.error("Fehler beim Resetten der Tokens von Server " + guild.id + " : " + err)
        }
    })
    dctools.notify("Die Tokens wurden resettet \nBitte sehe nach, ob Fehler aufgetreten sind")
})
