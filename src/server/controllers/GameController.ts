import { generateJWT } from "./AuthController";

import Game from "../models/Game";
import { FastifyReply, FastifyRequest } from "fastify";

const generateGameID = async (): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Generate random game code
  let gameID = characters.charAt(Math.floor(Math.random() * characters.length));
  console.log(`Starting GameID: ${gameID}`);

  // Check if Game object can be found by Mongoose using this id
  try {
    const exists = await Game.exists({ game_code: gameID }).then((res) => {
      console.log(`Verifying Game Code Existence: ${res}`);
      return res !== null;
    });
    if (exists) {
      gameID += await generateGameID();
      console.log(`Game Code exists, generating new code: ${gameID}`);
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
    }),
    gameData = {
      hostID: accessToken,
      game_code: gameCode,
      themePack: themePack,
      players: [],
      used_questions: [],
      used_consequences: [],
    },
    game = new Game(gameData);
  try {
    const newGame = await game.save();
    res.code(200).type("application/json").send({
      game: gameData,
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
