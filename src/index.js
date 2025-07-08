import {
  Client,
  GatewayIntentBits,
  Collection,
} from "discord.js";
import mongoose from "mongoose";
import cache from "ts-cache-mongoose";
import fs from "fs";

import { config } from "dotenv";
config();

console.log("Connecting to MongoDB...");
cache.init(mongoose, {
    engine: "memory",
});
mongoose.connect(process.env.MONGODB_URL);

console.log("Connected to MongoDB");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const events = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commands = fs.readdirSync("./src/commands");

(async () => {
    for (const file of functions) {
        const module = await import(`./functions/${file}`);
        module.default(client);
    }

    client.handleEvents(events);
    client.handleCommands(commands);
    client.login(process.env.TOKEN);
})()