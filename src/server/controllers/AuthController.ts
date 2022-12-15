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
  // Find the Game in the database to link to user
  const gameID = Game.exists(
    { game_code: requestData.gameCode },
    (res) => res !== null
  );
  if (gameID) {
    const game = Game.findById(gameID);
    // Create User
    let user = new User({
      username: requestData.username,
      userType: requestData.userType,
      token: accessToken,
      game: game,
    });

    try {
      const newUser = user.save();
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve(accessToken);
  } else {
    return Promise.reject("Game with that ID doesn't exist.");
  }
};
