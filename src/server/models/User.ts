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
});

UserSchema.index({ username: 1, game: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
export default User;
