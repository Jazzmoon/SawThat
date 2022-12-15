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
  const game_exists = Game.exists(
    { game_code: game_code },
    (res) => res !== null
  );
  if (!game_exists) {
    res
      .code(400)
      .type("application/json")
      .send({
        err: new Error("A game with that game code cannot be found."),
        message: "A game with that game code cannot be found.",
      });
    return Promise.resolve(res);
  }
  const game = Game.findById(game_exists);
  // Verify that a user with the same username is not already in game
  const user_exists = await User.exists(
    { game: game, username: username, userType: "Client" },
    (res) => res !== null
  );
  if (user_exists) {
    res
      .code(400)
      .type("application/json")
      .send({
        err: new Error("A user with that username is already in game."),
        message: "A user with that username is already in game.",
      });
    return Promise.resolve(res);
  }
  // Create a user and link them to the game
  const accessToken = await generateJWT({
      username: username,
      gameCode: game_code,
      userType: "Client",
    }),
    user = new User({
      userType: "Client",
      username: username,
      game: game,
      token: accessToken,
    }),
    newUser = await user.save();
  res.code(200).type("application/json").send({
    username: username,
    token: accessToken,
  });

  // Return relevant information to the user
  return Promise.resolve(res);
};
