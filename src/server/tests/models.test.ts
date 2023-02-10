/**
 * @file ModelTest.ts
 * @author Mark Hutchison
 * Tests the Game Logic and Mongoose interactions.
 */

import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Game, { GameType } from "../models/Game";
import User, { UserType } from "../models/User";

dotenv.config();

// Constants and Variables
const theme_pack = "disney";

// Set-Up and Teardown
beforeAll(async () => {
  mongoose.connect(`${process.env.DATABASE_URL!}`, {
    user: process.env.DATABASE_USER!,
    pass: process.env.DATABASE_PASS!,
  });
  const db = mongoose.connection;
  db.on("error", console.error);
  db.once("open", () => console.log("Database connection established."));
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
    newUser1 = new User({
      userType: "Client",
      username: "user0000_1",
      game: game._id,
      token: "Client-user0000_1-0000",
      color: "#FF0000",
      position: 0,
    }),
    newUser2 = new User({
      userType: "Client",
      username: "user0000_2",
      game: game._id,
      token: "Client-user0000_2-0000",
      color: "#FF0000",
      position: 0,
    });
  const host = await newHost.save(),
    user1 = await newUser1.save(),
    user2 = await newUser2.save();
  // Link the game to the host
  game.hostId = host._id;
  game.players = [user1._id, user2._id];
  game = await game.save();
  return;
});

afterAll(async () => {
  // Retrieve the game for the game information
  const game = await Game.findOne({
    game_code: "0000",
  })
    .orFail()
    .exec();
  // Delete users
  for (let userId in game.players) await User.findByIdAndDelete(userId).exec();
  await User.findByIdAndDelete(game.hostId).exec();

  // Delete game
  await game.delete();
});

// Test Population
describe("Population and De-Population", async () => {
  const game = await Game.findOne({ game_code: "0000" })
    .populate<UserType>("hostId")
    .populate<UserType[]>("players")
    .orFail()
    .exec();
  test("Population", async () => {
    expect(game.populated("hostId")).toBeTruthy();
    expect(game.hostId).not.toBeInstanceOf(mongoose.Types.ObjectId);
    expect(game.populated("players")).toBeTruthy();
    expect(game.players[0]).not.toBeInstanceOf(mongoose.Types.ObjectId);
  });
  game.depopulate("hostId").depopulate("players");
  test("De-Population", async () => {
    expect(game.populated("hostId")).toBeFalsy();
    expect(game.hostId).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(game.populated("players")).toBeFalsy();
    expect(game.players[0]).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

// Test De-Population

// Test Changing Turn Order

// Test Deleting a User

// Test Deleting the Game
