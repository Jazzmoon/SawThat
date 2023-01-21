/**
 * @file User.ts
 * @author Mark Hutchison
 * The structure for the User object stored in the database, as well as ORM logic.
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  userType: {
    type: String,
    enum: ["Client", "Game"],
    required: true,
  },
  username: { type: String, required: true },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: false,
  },
  token: { type: String, required: false },
  color: { type: String, required: false },
  position: { type: Number, required: true, default: 0 },
});

UserSchema.index({ username: 1, game: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
export default User;
