module.exports = {
    name: 'manage',
    description: 'Verwaltet den Bot',
    execute(message, args, client, db) {
        const module = args[0]
        const sub = args[1]
        const entity = args[2]
        const value = Number(args[3])

        const setdb = new db({name:"settings"})
        const globdb = new db({name:"global"})

        const haspl = globdb.has(message.member.id)
        if (haspl) {
            const permlevel = globdb.get(message.member.id,"permlevel")

            if (permlevel < 8 && message.member.id !== "559458018048344064") {
                message.reply("🔒 Dieser Command ist nur für `GLOBAL_DEVELOPER` verfügbar")
            }
            else {
                if (module === "tokens") {
                    if (sub === "add") {
                        const oldTokens = setdb.get(entity,"tokens")
                        const newTokens = Number(oldTokens) + value
                        setdb.set(entity,{tokens:newTokens})
                        message.channel.send("✔ Die Tokens für " + entity + " wurden erfolgreich von `" + oldTokens + "` auf `" + newTokens + "` erhöht")
                    }
                    else if (sub === "set") {
                        setdb.set(entity,{tokens:value})
                        message.channel.send("✅ Die Tokens für " + entity + " wurden erfolgreich auf `" + value + "` gesetzt")
                    }
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