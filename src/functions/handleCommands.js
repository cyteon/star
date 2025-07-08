import { REST, Routes } from "discord.js";

export default (client) => {
    client.handleCommands = async (files) => {
        client.commandArray = [];

        console.log(`\nLoading ${files.length} commands...`);

        for (const file of files) {
            try {
                const { default: command } = await import(`../commands/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                console.log(`Command ${command.data.name} loaded successfully`);
            } catch (error) {
                console.error(`Error loading command ${file}:`, error);
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