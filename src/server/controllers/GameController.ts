/**
 * @file GameController.ts
 * @author Mark Hutchison
 * The Game Controller controls the logic for a game.
 * It handles the modification of the Games within the Models module,
 * as well as handles the logic for a standard turn in game.
 */

import { generateJWT } from "./AuthController";

import Game from "../models/Game";
import User, { UserType } from "../models/User";
import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import MathUtil from "../../shared/util/MathUtil";

/**
 * Generates a unique game code that is a minimum of 4 characters long,
 * but can grow in size if is a conflict with an existing game.
 * @returns {Promise<string>} Unique Alpha-Numeric Game Code
 */
const generateGameID = async (): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Generate random game code
  let gameID = "";
  for (let i = 0; i < 4; i++)
    gameID += characters.charAt(Math.floor(Math.random() * characters.length));
  console.log(`Starting GameID: ${gameID}`);

  // Check if Game object can be found by Mongoose using this id
  try {
    let exists = await Game.exists({ game_code: gameID }).then((res) => {
      console.log(`Verifying Game Code Existence: ${res}`);
      return res !== null;
    });
    while (exists) {
      gameID += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      exists = await Game.exists({ game_code: gameID }).then((res) => {
        console.log(`Verifying Game Code Existence: ${res}`);
        return res !== null;
      });
    }
  } catch (err) {
    console.error("An error in game ID generation occurred.", err);
    gameID = "ABCDEFG";
  }
  return Promise.resolve(gameID);
};

/**
 * Creates a game object from an incoming request.
 * @param {FastifyRequest} req - Incoming request object from the game node.
 * @param {FastifyReply} res - Outgoing response handler.
 * @returns {Promise<FastifyReply>} Returns a response wrapped in a promise to be handled by the Fastify router.
 */
export const createGame = async (
  req: FastifyRequest<{
    Body: {
      theme_pack: string;
    };
  }>,
  res: FastifyReply
) => {
  const { theme_pack } = req.body;

  if (!theme_pack || typeof theme_pack !== "string") {
    res
      .code(400)
      .type("application/json")
      .send({
        error: new Error(
          "Request Body missing parameter `theme_pack`. Please ensure this value exists and is a string."
        ),
        message:
          "Request Body missing parameter `theme_pack`. Please ensure this value exists and is a string.",
      });
    return Promise.resolve(res);
  }
  const gameCode: string = await generateGameID(),
    accessToken = await generateJWT({
      username: `game${gameCode}`,
      gameCode: gameCode,
      userType: "Game",
    });

  // Create game object
  const game = new Game({
    hostID: null,
    game_code: gameCode,
    theme_pack: theme_pack,
    players: [],
    used_questions: [],
    used_consequences: [],
  });

  try {
    const newGame = await game.save();

    // Link Game and User objects together
    const updateUser = User.findOneAndUpdate(
        {
          username: `game${gameCode}`,
          userType: "Game",
          token: accessToken,
        },
        { game: newGame._id }
      ).exec(),
      gameUpdate = newGame
        .updateOne({
          hostId: await User.findOne({
            username: `game${gameCode}`,
            userType: "Game",
            token: accessToken,
          })
            .lean()
            .then((rec) => rec!._id),
        })
        .exec();

    // Send back response
    res.code(200).type("application/json").send({
      game: newGame,
      gameID: gameCode,
      userToken: accessToken,
    });
  } catch (err) {
    if (err instanceof Error) {
      res
        .code(400)
        .type("application/json")
        .send({ error: err, message: err.message });
    } else {
      res
        .code(400)
        .type("application/json")
        .send({ error: err, message: "Unknown Error Type" });
    }
  }
  return Promise.resolve(res);
};

/**
 * Given a game id, prepare to start the game. To do so:
 * 1. Randomize the player array to determine turn order.
 * 2. Change the boolean in the game model to be True.
 * 3. Return the username of the first player in the turn order.
 * @param {string} gameID - The Model Game ID within the database.
 * @return {Promise<string>} The username of the player first in the rotation.
 */
export const startGame = async (gameID: string): Promise<string> => {
  // Look-Up the game in the database
  let game = await Game.findOne({ game_code: gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .exec();
  // Perform Error Checking
  if (!game)
    return Promise.reject(new Error("There is no game with this game id."));
  if (game!.started === true)
    return Promise.reject(new Error("The game has already started."));
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  )
    return Promise.reject(new Error("The players didn't populate"));
  if (game.players.length < 2)
    return Promise.reject(
      new Error(
        `The game doesn't have enough players to start yet. ${game.players.length}/2 connected.`
      )
    );
  // Randomize the players array and save it
  game.players = MathUtil.shuffle(game!.players);
  game.started = true;
  return game
    .save()
    .then(() => Promise.resolve(game!.players[0].username))
    .catch((e) => Promise.reject(e));
};

/**
 * Given a game id, prepare to start the game. To do so:
 * 1. Randomize the player array to determine turn order.
 * 2. Change the boolean in the game model to be True.
 * 3. Return the username of the first player in the turn order.
 * @param {string} gameID - The Model Game ID within the database.
 * @return {Promise<string>} The username of the player next in the rotation.
 */
export const nextPlayer = async (
  gameID: string
): Promise<string | undefined> => {
  // Look-Up the game in the database
  return Game.findOne({ game_code: gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .exec()
    .then((game) => {
      // Perform error checks.
      if (!game)
        return Promise.reject(new Error("There is no game with this game id."));
      if (!game!.started)
        return Promise.reject(new Error("The game has not yet started."));
      if (game.players.length < 2)
        return Promise.reject(
          new Error("There is not enough players to perform this task.")
        );
      if (
        game!.players[0] instanceof mongoose.Types.ObjectId ||
        game!.players[0] === null
      )
        return Promise.reject(new Error("The players didn't populate"));

      // Verify that the game isn't already started
      // Shift the player list left
      let current_player = game.players.shift();
      game.players.push(current_player!);
      return game
        .save()
        .then(() => Promise.resolve(game.players[0].username))
        .catch((e) => Promise.reject(e));
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};
