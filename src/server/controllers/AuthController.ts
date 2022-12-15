import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";

dotenv.config();

export const generateJWT = async (requestData: {
  username: string;
  gameCode: string;
  userType: "Game" | "Client";
}) => {
  const accessToken = jwt.sign(
    {
      currentTime: new Date().getTime(),
      userType: requestData.userType,
      username: requestData.username,
      gameCode: requestData.gameCode,
    },
    process.env.ACCESS_TOKEN_SECRET! as Secret,
    {
      expiresIn: "1000m",
    }
  );
  let user = new User({
    username: requestData.username,
    userType: requestData.userType,
    token: accessToken,
  });

  try {
    const newUser = user.save();
  } catch (e) {
    console.error(e);
  }
  return Promise.resolve(accessToken);
};
