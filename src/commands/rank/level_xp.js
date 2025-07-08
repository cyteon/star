import { LEVELS } from "../../utils/levels.js";
import { SlashCommandSubcommandBuilder } from "discord.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("level_xp")
    .setDescription("See what level you will reach with amount of XP")
    .addIntegerOption(option =>
        option.setName("xp")
            .setDescription("The amount of XP to check")
            .setRequired(true)
    );

const execute = async (interaction) => {
    let xp = interaction.options.getInteger("xp");

    if (xp < 0) {
        return interaction.reply({
            content: "XP cannot be negative.",
            ephemeral: true,
        });
    }

    let level = 0;
    while (xp >= LEVELS[level + 1]) {
        xp -= LEVELS[level + 1];
        level++;
    }

    return interaction.reply({
        content: `With **${interaction.options.getInteger("xp")}** XP, you will reach level **${level}** and **${xp}**/${LEVELS[level + 1]} XP to the next level.`,
    });
}

export default { data, execute };