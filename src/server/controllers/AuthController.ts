import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Game from "../models/Game";
import User from "../models/User";

dotenv.config();

export const generateJWT = async (requestData: {
  username: string;
  gameCode: string;
  userType: "Game" | "Client";
}) => {
  // Create JWT
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
  // If userType is Game, simply create the user
  if (requestData.userType === "Game") {
    let user = new User({
      username: requestData.username,
      userType: requestData.userType,
      token: accessToken,
      game: null,
    });
    console.log(user);

    try {
      const newUser = user.save();
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve(accessToken);
  } else {
    // Find the Game in the database to link to user
    const game = await Game.findOne({ game_code: requestData.gameCode }).lean();
    if (game) {
      // Create User
      let user = new User({
        username: requestData.username,
        userType: requestData.userType,
        token: accessToken,
        game: game._id,
      });

      try {
        const newUser = user.save();
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve(accessToken);
    } else {
      return Promise.reject("Game with that ID doesn't exist to join.");
    }
  }
};
