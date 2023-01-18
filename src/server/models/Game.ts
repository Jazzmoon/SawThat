import mongoose from "mongoose";
const { Schema } = mongoose;

const playerPosition = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: { type: Number, required: true, default: 0 },
});

const GameSchema = new Schema({
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  game_code: { type: String, require: true, unique: true },
  theme_pack: { type: String, require: true },
  used_questions: [{ type: String, require: false }],
  used_consequences: [{ type: String, require: false }],
  players: [playerPosition],
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
