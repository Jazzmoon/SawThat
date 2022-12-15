import mongoose from "mongoose";
const { Schema } = mongoose;

const GameSchema = new Schema({
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  game_code: { type: String, require: true },
  theme_pack: { type: String, require: true },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  used_questions: [{ type: String }],
  used_consequences: [{ type: String }],
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
