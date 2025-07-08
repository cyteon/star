import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { // has to be compatible with a db a discord.py bot uses too
        type: BigInt,

        set: (v) => BigInt(v),
        get: (v) => v.toString(),
    },
    guild_id: {
        type: BigInt,

        set: (v) => BigInt(v),
        get: (v) => v.toString(),
    },
    xp: Number,
    level: Number,
});

export default mongoose.model("User", userSchema, "users");