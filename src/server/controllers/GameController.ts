import { generateJWT } from "./AuthController";

import Game from "../models/Game";
import User from "../models/User";
import { FastifyReply, FastifyRequest } from "fastify";

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
