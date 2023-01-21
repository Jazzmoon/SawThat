/**
 * @file AuthController.ts
 * @author Mark Hutchison
 * Handles any logic for generating user authentication tokens.
 */
import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Game from "../models/Game";
import User from "../models/User";
import { Color } from "../../shared/enums/Color";

dotenv.config();

/**
 * Generate the user access token that identifies each connected user.
 * @param requestData The username, game code, and type of user in which is generating their authentication token.
 * @returns {Promise<string>} Resolution code with JWT embedded.
 */
export const generateJWT = async (requestData: {
  username: string;
  gameCode: string;
  userType: "Game" | "Client";
  color?: Color;
}): Promise<string> => {
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

    try {
      const newUser = user.save();
    } catch (e) {
      return Promise.reject(`User could not be created: ${e}`);
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
        color: requestData.color,
        position: 0,
      });

      try {
        const newUser = user.save();
      } catch (e) {
        return Promise.reject(`User could not be created: ${e}`);
      }
      return Promise.resolve(accessToken);
    } else {
      return Promise.reject("Game with that ID doesn't exist to join.");
    }
  }
};
