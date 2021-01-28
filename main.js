const fs = require('fs');
const Discord = require('discord.js');
const prefix = ">"
const token = "***REMOVED***"
const testtoken = "***REMOVED***"
const dctools = require("./utils/discordtools")

const db = require("enmap")

// const du = require("./utils/discord")

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("Der Bot ist bereit")
    const data = require("./package.json")
    client.user.setActivity("v" + data.version + " of Scanify")
})

client.on('message', message => {
    const settings = new db({name:"settings"})
    if (message.attachments.first()) {
        message.react("⚙")
        const att = message.attachments.first()
        const url = att.url
        const server = message.guild
        const hasval = settings.has(server.id)
        function check(autoDelete,notify,notifyChannel) {
            const oldTokens = settings.get(server.id,"tokens")
            const newTokens = Number(oldTokens) - 3
            settings.set(server.id,{tokens:newTokens})
            const Discord = require("discord.js")

            var sightengine = require('sightengine')('***REMOVED***','***REMOVED***');
            sightengine.check(['nudity','wad','offensive']).set_url(url).then(function(result) {
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Scan Ergebnis");
                embed.addField('Waffen', result.weapon, true)
                embed.addField('Alkohol', result.alcohol, true )
                embed.addField('Nacktheit', result.nudity.raw, true )
                if (result.weapon > 0.1 || result.alcohol > 0.1 || result.nudity.raw > 0.1) {
                    embed.setColor("RED")
                    embed.setDescription("**Achtung!** Es wurde unangemessener Inhalt gefunden");
                    message.channel.send(embed);
                    if (autoDelete){
                        message.delete();
                    }
                    if (notify && notifyChannel) {
                        const notcnl = guild.channels.get(cnl);
                        notcnl.send("Achtung! in " + message.channel + " wurde ein anstößiges Bild gefunden!")
                        const imgur = require('imgur');
                        imgur.uploadUrl(url)
                            .then(function (json) {
                                notcnl.send(json.data.link);
                            })
                            .catch(function (err) {
                                console.error(err.message);
                            });

                    }
                }
            }).catch(function(err) {
                const debugWH = new Discord.WebhookClient("776106264622792746","***REMOVED***");
                if (err === "TypeError: Cannot read property 'raw' of undefined") {return}
                else {debugWH.send("Achtung! Ein Fehler ist aufgetreten: " + err);}
            });
        }
        if (hasval) {
            const ad = settings.get(server.id,"autodelete")
            const not = settings.get(server.id,"notify")
            const notCnl = settings.get(server.id,"notifychannel")
            check(ad,not,notCnl)
        }
        else {
            check(false,false,undefined)
        }
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
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

client.login(testtoken)

var schedule = require('node-schedule');

const tokenRefill = schedule.scheduleJob("00 00 01 * *", function(){
    const settings = new db({name:"settings"})
    client.guilds.cache.forEach(guild => {
        settings.set(guild.id, {tokens:500}).catch(err => {
            console.log("Fehler beim Resetten der Tokens von Server " + guild.id + " : " + err)
        })
    })
    dctools.notify("Die Tokens wurden resettet")
})