import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
    id: {
        type: BigInt,

        set: (v) => BigInt(v),
        get: (v) => v.toString(),
    },
    level_roles: Map,
});

export default mongoose.model("Guild", guildSchema, "guilds");