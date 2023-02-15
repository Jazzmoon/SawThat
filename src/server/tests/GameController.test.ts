/**
 * @file GameController.test.ts
 * @author Mark Hutchison
 * Tests the quiz question and consequence generation functions.
 */
import mongoose from "mongoose";
import { SocketStream } from "@fastify/websocket";
import { Server } from "mock-socket";

import Game from "../models/Game";
import User, { UserType } from "../models/User";

import { ClientConn, Connections } from "../controllers/WebSocketController";
import {} from "../controllers/GameController";

import { Color } from "../../shared/enums/Color";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import { Context } from "../../shared/types/Context";
import { WebsocketRequest } from "../../shared/types/Websocket";

const DATABASE_URL = `mongodb://localhost:27017`,
  DATABASE_USER = `sawthat`,
  DATABASE_PASS = `sawthatsecretpass`,
  APP_PORT = 3000,
  SERVER_URL = `ws://localhost:${APP_PORT}/ws`;

// Constants and Variables
const theme_pack = "test";
let mockServer: Server,
  connections: Connections = {};

const deconstructToken = (token: string) => {
  const [userType, username, gameID] = token.split("-");
  return {
    userType: userType,
    username: username,
    gameID: gameID,
  };
};

// Set-Up and Teardown
beforeAll(async () => {
  // Create mock-server
  mockServer = new Server(SERVER_URL);
  mockServer.on("connection", (conn) => {
    conn.on("message", (message) => {
      const data: WebsocketRequest = JSON.parse(message.toString());
      switch (data.type) {
        case WebsocketType.GameSetup:
          break;
        case WebsocketType.GameJoin:
          break;
      }
    });
  });

  // Establish connection to database
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
describe("Test Player Turn Order", () => {
  test("Test starting order", async () => {
    // Build context for the test
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
  });
  test("Test Turn Order Incrementally", () => {});
  test("Test Rankings", () => {});
});
