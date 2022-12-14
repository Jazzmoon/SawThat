import { generateJWT } from "./AuthController";

import Game from "../models/Game";

const generateGameID = async (): Promise<string> => {
  // Generate 7 digit alphanumeric game code
  let gameID = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 7; i++)
    gameID += characters.charAt(Math.floor(Math.random() * characters.length));

  // Check if Game object can be found by Mongoose using this id
  try {
    let game = await Game.findById(gameID);
    return game === null ? gameID : generateGameID();
  } catch (err) {
    console.error(err);
    return "ABCDEFG";
  }
};

export const createGame = async (req: any, res: any) => {
  const { themePack } = req.body;
  const gameCode: string = await generateGameID(),
    accessToken = await generateJWT({
      username: `game${gameCode}`,
      gameCode: gameCode,
      userType: "Game",
    }),
    game = new Game({
      hostID: accessToken,
      players: [],
      themePack: themePack,
      used_questions: [],
      used_consequences: [],
    });
  try {
    const newGame = await game.save();
    res.status(200).json({
      game: newGame,
      gameID: gameCode,
      userToken: accessToken,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err, message: err.message });
    } else {
      res.status(400).json({ error: err, message: "Unknown Error Type" });
    }
  }
};
