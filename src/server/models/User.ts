import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  userType: {
    type: String,
    enum: ["Client", "Game"],
    required: true,
  },
  username: { type: String },
  token: { type: String, required: false },
});

const User = mongoose.model("User", UserSchema);
export default User;
