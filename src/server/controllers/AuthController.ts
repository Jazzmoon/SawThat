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
 * Generate the user access token that identifies each connected user, and create their user within the database.
 * @param requestData - The username, game code, and type of user in which is generating their authentication token.
 * @param {string} requestData.username - The username of the user sending te request to generate a JWT token.
 * @param {string} requestData.gameCode - The game code for the game that the user is going to be related to.
 * @param {"Game" | "Client"} requestData.userType - Whether the user being created is a game or client node user.
 * @param {Color | undefined} requestData.color - If the user is a client node user, they will provide the color for their player piece.
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

    const newUser = await user.save();
    return accessToken;
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
      const newUser = await user.save();
      return accessToken;
    } else {
      throw "Game with that ID doesn't exist to join.";
    }
  }
};
