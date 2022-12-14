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

const Game = mongoose.model("Game", GameSchema);
export default Game;
