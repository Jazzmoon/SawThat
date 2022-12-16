import mongoose from "mongoose";
const { Schema } = mongoose;

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
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
