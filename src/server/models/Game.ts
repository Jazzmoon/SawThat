import mongoose from "mongoose";
const { Schema } = mongoose;

const GameSchema = new Schema({
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  game_code: { type: String },
  theme_pack: { type: String },
  used_questions: [{ type: String }],
  used_consequences: [{ type: String }],
});

module.exports = mongoose.model("Game", GameSchema);
