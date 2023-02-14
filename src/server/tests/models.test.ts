/**
 * @file models.test.ts
 * @author Mark Hutchison
 * Tests the Game Logic and Mongoose interactions.
 */

import mongoose from "mongoose";
import Game from "../models/Game";
import User, { UserType } from "../models/User";

const DATABASE_URL = `mongodb://localhost:27017`,
  DATABASE_USER = `sawthat`,
  DATABASE_PASS = `sawthatsecretpass`;

// Constants and Variables
const theme_pack = "disney";

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
  await Game.findOneAndDelete({
    game_code: "0000",
  }).exec();
  // Delete users
  await User.findOneAndDelete({
    username: "game0000",
    token: "Game-game0000-0000",
  }).exec();
  await User.findOneAndDelete({
    username: "user0000_1",
    token: "Client-user0000_1-0000",
  }).exec();
  await User.findOneAndDelete({
    username: "user0000_2",
    token: "Client-user0000_2-0000",
  }).exec();
  // Disconnect mongoose
  await mongoose.disconnect();
});

// Test Population
describe("Population and De-Population", () => {
  test("Population", async () => {
    const game = await Game.findOne({ game_code: "0000" })
      .populate<UserType>("hostId")
      .populate<UserType[]>("players")
      .orFail()
      .exec();
    expect(game.populated("hostId")).toBeTruthy();
    expect(game.hostId).not.toBeInstanceOf(mongoose.Types.ObjectId);
    expect(game.populated("players")).toBeTruthy();
    expect(game.players[0]).not.toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test("De-Population", async () => {
    const game = await Game.findOne({ game_code: "0000" })
      .populate<UserType>("hostId")
      .populate<UserType[]>("players")
      .orFail()
      .exec();
    game.depopulate("hostId").depopulate("players");
    expect(game.populated("hostId")).toBeFalsy();
    expect(game.hostId).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(game.populated("players")).toBeFalsy();
    expect(game.players[0]).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

// Test Changing Turn Order
describe("Turn Order", () => {
  test("Game Order", async () => {
    const game = await Game.findOne({ game_code: "0000" })
        .populate<UserType>("hostId")
        .populate<UserType[]>("players")
        .orFail()
        .exec(),
      user1 = await User.findOne({
        username: "user0000_1",
        token: "Client-user0000_1-0000",
      })
        .orFail()
        .exec(),
      user2 = await User.findOne({
        username: "user0000_2",
        token: "Client-user0000_2-0000",
      })
        .orFail()
        .exec();
    expect(game.players.map((p) => p._id)).toEqual([user1._id, user2._id]);
    game.players = game.players.concat(game.players.shift()!);
    await game.save();
    expect(game.players.map((p) => p._id)).toEqual([user2._id, user1._id]);
  });
  test("Game Order Remains Saved", async () => {
    const game = await Game.findOne({ game_code: "0000" })
        .populate<UserType>("hostId")
        .populate<UserType[]>("players")
        .orFail()
        .exec(),
      user1 = await User.findOne({
        username: "user0000_1",
        token: "Client-user0000_1-0000",
      })
        .orFail()
        .exec(),
      user2 = await User.findOne({
        username: "user0000_2",
        token: "Client-user0000_2-0000",
      })
        .orFail()
        .exec();
    expect(game.players.map((p) => p._id)).toEqual([user2._id, user1._id]);
  });
});

// Test Deleting a User
describe("Deleting a User", () => {
  test("Check if User is Deleted", async () => {
    await User.findOneAndDelete({
      username: "user0000_1",
      token: "Client-user0000_1-0000",
    })
      .orFail()
      .exec();
    const user1 = await User.findOne({
        username: "user0000_1",
        token: "Client-user0000_1-0000",
      }).exec(),
      user2 = await User.findOne({
        username: "user0000_2",
        token: "Client-user0000_2-0000",
      }).exec();
    expect(user1).toBeFalsy();
    expect(user1).toBeNull();
    expect(user2).toBeTruthy();
    expect(user2).not.toBeNull();
  });
});

// Test Deleting the Game
describe("Deleting a Game", () => {
  test("Check if Game is Deleted", async () => {
    await Game.findOneAndDelete({
      game_code: "0000",
    }).exec();
    const game = await Game.findOne({
      game_code: "0000",
    }).exec();
    expect(game).toBeFalsy();
    expect(game).toBeNull();
  });
});
