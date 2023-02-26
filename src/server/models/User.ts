/**
 * @file User.ts
 * @author Mark Hutchison
 * The structure for the User object stored in the database, as well as ORM logic.
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * The definition of what a user looks like within the database.
 */
export type UserType = {
  userType: string;
  username: string;
  game: mongoose.Types.ObjectId;
  token: string;
  color: string;
  position: number;
};

/**
 * The UserSchema in which mongoose uses to generate rows in the database.
 */
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
  position: { type: Number, required: true, default: 0, min: 0, max: 41 },
});

UserSchema.index({ username: 1, game: 1 }, { unique: true });

const User = mongoose.model<UserType>("User", UserSchema);
export default User;
