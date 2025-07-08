import { REST, Routes, SlashCommandBuilder } from "discord.js";
import fs from "fs";

export default (client) => {
    client.handleCommands = async (folder) => {
        client.commandArray = [];

        console.log(`\nLoading ${folder.length} commands...`);

        for (const path of folder) {
            const isDir = fs.statSync(`src/commands/${path}`).isDirectory();

            if (isDir) {
                const subcommandFiles = fs.readdirSync(`src/commands/${path}`).filter(f => f.endsWith(".js"));

                let cmd = new SlashCommandBuilder()
                    .setName(path)
                    .setDescription("(no description");
                
                for (const subcommandFile of subcommandFiles) {
                    try {
                        const { default: command } = await import(`../commands/${path}/${subcommandFile}`);
                        cmd.addSubcommand(command.data);
                        
                        console.log(`Command /${path} ${command.data.name} loaded successfully`);
                    } catch (error) {
                        console.error(`Error loading command /${path} ${command.data.name}:`, error);
                    }
                }

                const execute = async (interaction) => {
                    const subcommand = interaction.options.getSubcommand();

                    try {
                        const { default: command } = await import(`../commands/${path}/${subcommand}.js`);

                        await command.execute(interaction);
                    } catch (error) {
                        console.error(`Error executing command /${path} ${subcommand}:`, error);
                        await interaction.reply({
                            content: "An error occurred while executing this command.",
                            ephemeral: true,
                        });
                    }
                }

                const data = {
                    data: cmd,
                    execute,
                }

                client.commands.set(path, data);
                client.commandArray.push(data.data.toJSON());
            } else {
                try {
                    const { default: command } = await import(`../commands/${path}`);
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());

                    console.log(`Command /${command.data.name} loaded successfully`);
                } catch (error) {
                    console.error(`Error loading command /${path}:`, error);
                }
            }
        }

        console.log(`Loaded ${client.commands.size} commands successfully\n`);


        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        try {
            console.log("Refreshing application (/) commands...");

            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: client.commandArray,
            });

            console.log("Successfully reloaded application (/) commands\n");
        } catch (error) {
            console.error("Error reloading application (/) commands:", error);
        }
    }
}