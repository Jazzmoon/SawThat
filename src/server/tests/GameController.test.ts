/**
 * @file GameController.test.ts
 * @author Mark Hutchison
 * Tests the quiz question and consequence generation functions.
 */
import mongoose from "mongoose";
import Game from "../models/Game";
import User, { UserType } from "../models/User";
import {} from "../controllers/GameController";
import { Color } from "../../shared/enums/Color";

const DATABASE_URL = `mongodb://localhost:27017`,
  DATABASE_USER = `sawthat`,
  DATABASE_PASS = `sawthatsecretpass`;

// Constants and Variables
const theme_pack = "test";

// Set-Up and Teardown
beforeAll(async () => {
  await mongoose.connect(DATABASE_URL, {
    user: DATABASE_USER,
    pass: DATABASE_PASS,
  });
  const newGame = new Game({
    hostId: null,
    game_code: "0000",
    theme_pack: theme_pack,
    players: [],
    used_consequences: [],
    used_questions: [],
  });
  let game = await newGame.save();
  const newHost = new User({
      userType: "Game",
      username: "game0000",
      game: game._id,
      token: "Game-game0000-0000",
    }),
    host = await newHost.save();
  for (let i = 0; i < 8; i++) {
    let color: Color = {
        0: Color.RED,
        1: Color.ORANGE,
        2: Color.YELLOW,
        3: Color.GREEN,
        4: Color.BLUE,
        5: Color.PURPLE,
        6: Color.PINK,
        7: Color.BROWN,
      }[i]!,
      newUser = new User({
        userType: "Client",
        username: `user0000_${i + 1}`,
        game: game._id,
        token: `Client-user0000_${i + 1}-0000`,
        color: color,
        position: 0,
      }),
      user = await newUser.save();
    game.players = game.players.concat(user._id);
  }
  // Link the game to the host
  game.hostId = host._id;
  game = await game.save();
  return;
});

afterAll(async () => {
  // Retrieve the game for the game information
  await Game.findOneAndDelete({
    game_code: "0000",
  }).exec();
  // Delete users
  await User.findOneAndDelete({
    username: "game0000",
    token: "Game-game0000-0000",
  }).exec();
  for (let i = 0; i < 8; i++)
    await User.findOneAndDelete({
      username: `user0000_${i + 1}`,
      token: `Client-user0000_${i + 1}-0000`,
    }).exec();
  // Disconnect mongoose
  await mongoose.disconnect();
});

// Run Tests on the mock data
