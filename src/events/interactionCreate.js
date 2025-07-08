export default {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Command ${interaction.commandName} not found`);
            return interaction.reply({ content: "This command does not exist.", ephemeral: true });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            return interaction.reply({ content: "There was an error while executing this command.", ephemeral: true });
        }
    }
}