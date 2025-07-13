import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import Starboard from "../models/Starboard.js";
import Guild from "../models/Guild.js";

export default {
    name: "messageReactionAdd",
    async execute(reaction, client) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error("Error fetching reaction:", error);
                return;
            }
        }

        let mesasge = reaction.message;

        if (mesasge.partial) {
            try {
                await mesasge.fetch();
            } catch (error) {
                console.error("Error fetching message:", error);
                return;
            }
        }

        if (!mesasge.guild) return;
        if (reaction.emoji.name !== "⭐") return;

        const data = await Guild.findOne({ id: mesasge.guild.id });
        if (!data || !data.starboard || !data.starboard.channel || !data.starboard.enabled) return;

        const reactionCount = mesasge.reactions.cache.get("⭐")?.count || 0;
        if (reactionCount < data.starboard.threshold) return;

        const channel = mesasge.guild.channels.cache.get(data.starboard.channel);

        if (!channel) {
            console.error(`Starboard channel ${data.starboard.channel} not found in guild ${mesasge.guild.name} :(`);
            return;
        }

        const starboardMessageData = await Starboard.findOne({
            message_id: mesasge.id,
        });

        if (starboardMessageData) {
            try {
                const starboardMessage = await channel.messages.fetch(starboardMessageData.starboard_id);

                if (starboardMessage) {
                    await starboardMessage.edit({
                        content: `⭐ ${reactionCount}`,
                    });

                    return;
                }
            } catch (error) {
                console.error("Error fetching or editing starboard message:", error);
            }
        }

        try {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: mesasge.author.tag,
                    iconURL: mesasge.author.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(mesasge.content || "No content")
                .setColor("#FFD700")
                .setTimestamp(mesasge.createdAt);
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Jump to Message")
                        .setStyle("Link")
                        .setURL(`https://discord.com/channels/${mesasge.guild.id}/${mesasge.channel.id}/${mesasge.id}`),
                );

            const starboardMessage = await channel.send({
                content: `⭐ ${reactionCount}`,
                embeds: [embed],
                files: mesasge.attachments.map((attachment) => attachment.url),
                components: [row],
            });

            await Starboard.create({
                message_id: mesasge.id,
                starboard_id: starboardMessage.id,
            });
        } catch (error) {
            console.error("Error sending starboard message:", error);
        }
    }
}