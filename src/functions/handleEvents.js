export default (client) => {
    client.handleEvents = async (files) => {
        for (const file of files) {
            const event = await import(`../events/${file}`);
            const handler = event.default || event;

            if (handler.once) {
                client.once(handler.name, (...args) => {
                    try {
                        handler.execute(...args, client);
                    } catch (error) {
                        console.error(`Error in event ${handler.name}:`, error);
                    }
                })
            } else {
                client.on(handler.name, (...args) => {
                    try {
                        handler.execute(...args, client);
                    } catch (error) {
                        console.error(`Error in event ${handler.name}:`, error);
                    }
                });
            }
        }
    }
}