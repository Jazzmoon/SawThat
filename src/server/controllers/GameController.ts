/**
 * @file GameController.ts
 * @author Mark Hutchison
 * The Game Controller controls the logic for a game.
 * It handles the modification of the Games within the Models module,
 * as well as handles the logic for a standard turn in game.
 */

import { generateJWT } from "./AuthController";

import Game from "../models/Game";
import User from "../models/User";
import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";

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
 * @param {FastifyRequest} req  Incoming request object from the game node.
 * @param {FastifyReply} res Outgoing response handler.
 * @returns {Promise<FastifyReply>} Returns a response wrapped in a promise to be handled by the Fastify router.
 */
export const createGame = async (
  req: FastifyRequest<{
    Body: {
      themePack: string;
    };
  }>,
  res: FastifyReply
) => {
  const { themePack } = req.body;
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
    themePack: themePack,
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
 * @param {string} gameID The Model Game ID within the database.
 * @return {Promise<string>} The username of the player first in the rotation.
 */
export const startGame = async (gameID: string): Promise<string> => {
  // Look-Up the game in the database
  const game = await Game.findOne({ game_code: gameID });
  // If no game exists, reject with custom error.
  if (!game) return Promise.reject("There is no game with this game id.");
  // Verify that the game isn't already started
  if (!game!.started) {
    // Check if there are enough players to start the game
    if (game.players.length < 2)
      return Promise.reject(
        "The game doesn't have enough players to start yet."
      );
    // Randomize the players array and save it
    game.players = new mongoose.Types.DocumentArray(
      game!.players
        .map((value) => ({
          value,
          sort: Math.random(),
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
    game.started = true;
    await game.save();
    const player = await User.findById(game.players[0].player);
    return Promise.resolve(player!.username);
  } else {
    // Return custom error
    return Promise.reject("The game has already started.");
  }
};

/**
 * Given a game id, prepare to start the game. To do so:
 * 1. Randomize the player array to determine turn order.
 * 2. Change the boolean in the game model to be True.
 * 3. Return the username of the first player in the turn order.
 * @param {string} gameID The Model Game ID within the database.
 * @param {string} currentPlayer The username of the player who's turn it just was.
 * @return {string} The username of the player next in the rotation.
 */
export const nextPlayer = async (
  gameID: string,
  currentPlayer: string
): Promise<string> => {
  // Look-Up the game in the database
  const game = await Game.findOne({ game_code: gameID });
  // If no game exists, reject with custom error.
  if (!game) return Promise.reject("There is no game with this game id.");
  // Verify that the game isn't already started
  if (game!.started) {
    // Get a list of player usernames
    let players: string[] = [];
    for (let i = 0; i < game.players.length; i++) {
      const user = await User.findById(game.players[i].player);
      players.push(user!.username);
    }
    // Find the index of the username provided
    const user_index = players.indexOf(currentPlayer);
    if (user_index === -1)
      return Promise.reject(
        "There is no user with that name playing the game."
      );
    return Promise.resolve(players[(user_index + 1) % players.length]);
  } else {
    // Return custom error
    return Promise.reject("The game hasn't started yet.");
  }
};
