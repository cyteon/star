import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  id: {
    type: BigInt,

    set: (v) => BigInt(v),
    get: (v) => v.toString(),
  },
  level_roles: Map,
  starboard: {
    channel: {
      type: BigInt,
      set: (v) => BigInt(v),
      get: (v) => v?.toString(),
    },
    threshold: {
      type: Number,
      default: 2,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  }
});

export default mongoose.model("Guild", guildSchema, "guilds");
