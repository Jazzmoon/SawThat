/**
 * @file AuthController.ts
 * @author Mark Hutchison
 * Handles any logic that is specific to the client node only.
 */
import { generateJWT } from "./AuthController";

import { Color } from "../../shared/enums/Color";

import Game from "../models/Game";
import User from "../models/User";
import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";

/**
 * Allow user to join a game assuming they provide
 * their username and the game code.
 * @param {FastifyRequest} req The user request containing their username and the game id.
 * @param {FastifyResponse} res The response to indicate to the user whether that their request succeeded.
 * @returns A resolution, or rejection, to indicate if the request was successful.
 */
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
        error: new Error("A game with that game code cannot be found."),
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
        error: new Error("A user with that username is already in game."),
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
        error: new Error("This game already has the maximum players allowed."),
        message: "This game already has the maximum players allowed.",
      });
    return Promise.resolve(res);
  }

  // Create a user
  // Note: Generating a JWT will create a user, so no need to do it here.
  const accessToken = await generateJWT({
    username: username,
    gameCode: game_code,
    userType: "Client",
  });

  // Link user to the game and update their information accordingly
  let color: Color = Color.RED;
  switch (players!.length) {
    case 0:
    default:
      color = Color.RED;
      break;
    case 1:
      color = Color.ORANGE;
      break;
    case 2:
      color = Color.YELLOW;
      break;
    case 3:
      color = Color.GREEN;
      break;
    case 4:
      color = Color.BLUE;
      break;
    case 5:
      color = Color.PINK;
      break;
    case 6:
      color = Color.PURPLE;
      break;
    case 7:
      color = Color.BROWN;
      break;
  }

  return Promise.resolve(
    User.findOne({
      username: username,
      userType: "Client",
      token: accessToken,
    })
      .exec()
      .then((user) => {
        user!.updateOne({ color: color, position: 0 }).exec();
        game.players.push(user!._id);
        Game.findOneAndUpdate(
          {
            game_code: game_code,
          },
          {
            players: game.players,
          }
        ).exec();
        res.code(200).type("application/json").send({
          username: username,
          token: accessToken,
        });
        return res;
      })
      .catch((err) => {
        res
          .code(400)
          .type("application/json")
          .send({
            data: {
              error: err,
              message:
                "An error occurred while connecting the user to the game.",
            },
          });
        return res;
      })
  );
};
