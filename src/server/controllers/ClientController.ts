import { generateJWT } from "./AuthController";

import Game from "../models/Game";
import User from "../models/User";
import { FastifyReply, FastifyRequest } from "fastify";

export const joinGame = async (
  req: FastifyRequest<{
    Body: {
      username: string;
      game_code: string;
    };
  }>,
  res: FastifyReply
) => {
  // Decompose the request body
  const { game_code, username } = req.body;
  // Verify that a game with the game code exists
  const game = await Game.findOne({ game_code: game_code }).lean();
  console.log(`Checking if game exists with game code ${game_code}: ${game}`);
  if (!game) {
    res
      .code(400)
      .type("application/json")
      .send({
        err: new Error("A game with that game code cannot be found."),
        message: "A game with that game code cannot be found.",
      });
    return Promise.resolve(res);
  }
  // Verify that a user with the same username is not already in game
  // Fetch all users of type "Client" within game
  const players = await User.find({
    userType: "Client",
    game: game._id,
  });

  if (players.map((rec) => rec.username).includes(username)) {
    res
      .code(400)
      .type("application/json")
      .send({
        err: new Error("A user with that username is already in game."),
        message: "A user with that username is already in game.",
      });
    return Promise.resolve(res);
  }

  // Verify that the game is not full
  if (players?.length >= 8) {
    res
      .code(400)
      .type("application/json")
      .send({
        err: new Error("This game already has the maximum players allowed."),
        message: "This game already has the maximum players allowed.",
      });
    return Promise.resolve(res);
  }

  // Create a user and link them to the game
  // Note: Generating a JWT will create a user, so no need to do it here.
  const accessToken = await generateJWT({
    username: username,
    gameCode: game_code,
    userType: "Client",
  });
  res.code(200).type("application/json").send({
    username: username,
    token: accessToken,
  });

  // Return relevant information to the user
  return Promise.resolve(res);
};
