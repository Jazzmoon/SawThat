/**
 * @file Game.ts
 * @author Mark Hutchison
 * The structure for the Game object stored in the database, as well as ORM logic.
 */
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
  used_questions: [{ type: Number, require: false }],
  used_consequences: [{ type: Number, require: false }],
  players: [playerPosition],
  started: { type: Boolean, require: true, default: false },
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
