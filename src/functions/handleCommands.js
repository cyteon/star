export default (client) => {
    client.handleCommands = async (files, path) => {
        client.commandArray = [];

        console.log(`\nLoading ${files.length} commands...`);

        for (const file of files) {
            try {
                const { default: command } = await import(`../commands/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                console.log(`Command ${command.data.name} loaded successfully.`);
            } catch (error) {
                console.error(`Error loading command ${file}:`, error);
            }
        }

        console.log(`Loaded ${client.commands.size} commands successfully\n`);
    }
}