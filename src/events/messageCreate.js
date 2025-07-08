import User from "../models/User.js";
import { LEVELS } from "../utils/levels.js";

export default {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const data = await User.findOne({
            id: message.author.id,
            guild_id: message.guild.id,
        });

        if (!data) {
            await User.create({
                id: message.author.id,
                guild_id: message.guild.id,
                xp: 0,
                level: 0,
            });
            return;
        }

        const xpToAdd = Math.floor(Math.random() * 3) + 1;
        data.xp += xpToAdd;

        if (data.xp >= LEVELS[data.level + 1]) {
            data.xp = 0;
            data.level += 1;
            message.reply({
                content: `:tada: Congratulations ${message.author}, you leveled up to level **${data.level}**!`,
            });
        }

        await data.save().catch(console.error);
    }
}