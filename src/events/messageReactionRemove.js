import Starboard from "../models/Starboard.js";
import Guild from "../models/Guild.js";

export default {
    name: "messageReactionRemove",
    async execute(reaction, client) {
        console.log("Message reaction removed:", reaction.emoji.name, reaction.message.id);

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error("Error fetching reaction:", error);
                return;
            }
        }

        let message = reaction.message;

        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error("Error fetching message:", error);
                return;
            }
        }

        if (!message.guild) return;
        if (reaction.emoji.name !== "⭐") return;

        const data = await Guild.findOne({ id: message.guild.id });
        if (!data || !data.starboard || !data.starboard.channel || !data.starboard.enabled) return;

        const reactionCount = message.reactions.cache.get("⭐")?.count || 0;
        const channel = message.guild.channels.cache.get(data.starboard.channel);

        if (!channel) {
            console.error(`Starboard channel ${data.starboard.channel} not found in guild ${message.guild.name} :(`);
            return;
        }

        const starboardMessageData = await Starboard.findOne({
            message_id: message.id,
        });

        try {
            const starboardMessage = await channel.messages.fetch(starboardMessageData.starboard_id);

            if (starboardMessage) {
                if (reactionCount < data.starboard.threshold) {
                    await starboardMessage.delete();
                    await Starboard.deleteOne({ message_id: message.id });
                    return;
                } else {
                    await starboardMessage.edit({
                        content: `⭐ ${reactionCount}`,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching starboard message:", error);
            return;
        }
    }
}