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

module.exports = mongoose.model("User", UserSchema);
