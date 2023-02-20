/**
 * @file GameController.test.ts
 * @author Mark Hutchison
 * Tests the quiz question and consequence generation functions.
 */
import mongoose from "mongoose";

import Game from "../models/Game";
import User, { UserType } from "../models/User";

import {
  checkWinner,
  generateQuestion,
  playerTurnOrder,
  startGame,
} from "../controllers/GameController";

import { Color } from "../../shared/enums/Color";
import { Context } from "../../shared/types/Context";
import { Player } from "../../shared/types/Player";
import { TurnModifier } from "../../shared/enums/TurnModifier";
import { QuestionCategory } from "../../shared/enums/QuestionCategory";
import exp from "constants";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import {
  ConsequenceData,
  QuestionData,
} from "../../shared/apis/WebSocketAPIType";
import MathUtil from "../../shared/util/MathUtil";

const DATABASE_URL = `mongodb://localhost:27017`,
  DATABASE_USER = `sawthat`,
  DATABASE_PASS = `sawthatsecretpass`;

// Constants and Variables
const theme_pack = "test";

// Set-Up and Teardown
beforeAll(async () => {
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
    let users: UserType[] = [];
    for (let i = 0; i < 8; i++) {
      const user = await User.findOne({
        username: `user0000_${i + 1}`,
        token: `Client-user0000_${i + 1}-0000`,
      }).exec();
      if (user) users.push(user);
    }
    // This order will never change
    const order = await playerTurnOrder(context, 0);
    for (let i = 0; i < 100; i++) {
      expect(order).toEqual(
        users.map((u: UserType) => {
          return {
            username: u.username,
            color: u.color,
            position: u.position,
          } as Player;
        })
      );
    }
  });
  test("Test Turn Order Incrementally", async () => {
    // Build context for the test
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    const game = await Game.findOne({
      game_code: "0000",
    })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    let users: UserType[] = game.players;
    // This order will never change
    for (let i = 0; i < 100; i++) {
      let order = await playerTurnOrder(context, 0);
      expect(order.map((u) => u.username)).toEqual(
        users.map((u) => u.username)
      );
    }
    // Increment the position using method 1 repeatedly
    for (let i = 0; i < 100; i++) {
      users = users.concat(users.shift()!);
      let next_order = await playerTurnOrder(context, 1);
      expect(next_order.map((u) => u.username)).toEqual(
        users.map((u: UserType) => u.username)
      );
      for (let i = 0; i < 10; i++) {
        let order = await playerTurnOrder(context, 0);
        expect(order.map((u) => u.username)).toEqual(
          users.map((u) => u.username)
        );
      }
    }
  });
  test("Test Rankings", async () => {
    // Build context for the test
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    const game = await Game.findOne({
      game_code: "0000",
    })
      .orFail()
      .exec();
    // Manually set the positions of the users
    for (let i = 0; i < 8; i++) {
      await User.findOneAndUpdate(
        {
          username: `user0000_${i + 1}`,
          token: `Client-user0000_${i + 1}-0000`,
        },
        {
          $inc: {
            position: i + 1,
          },
        }
      ).exec();
    }
    // Fetch the updated users
    let users: (mongoose.Document<unknown, any, UserType> &
      UserType & {
        _id: mongoose.Types.ObjectId;
      })[] = await User.find({ game: game._id, userType: "Client" })
      .orFail()
      .exec();
    // Check the rankings
    const rankings = await playerTurnOrder(context, 2);
    expect(rankings).toEqual(
      users
        .map((u: UserType) => {
          return {
            username: u.username,
            color: u.color,
            position: u.position,
          } as Player;
        })
        .sort((a: Player, b: Player) => a.position - b.position)
    );
  });
});

// Test Starting the Game
test("Test Starting the Game", async () => {
  const context: Context = {
    username: "game0000",
    userType: "Game",
    token: "Game-game0000-0000",
    gameID: "0000",
  };

  // Start the game
  const player_order = await startGame(context);
  // Ensure that the game is started
  const game = await Game.findOne({
    game_code: "0000",
  })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();
  expect(game.started).toBeTruthy();
  expect(
    game.players.map((player: UserType) => {
      return {
        username: player.username,
        color: player.color,
        position: player.position,
      } as Player;
    })
  ).toEqual(player_order);

  // Run start game again to ensure that it fails
  await expect(startGame(context)).rejects.toThrow(
    "[GC] The game has already started."
  );
});

// Next Turn is tested already via combining the two tests above

// Test Generating a question
describe("Test Generating a Question", () => {
  test("Generate a question with no modifiers", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    for (let challenge = 0; challenge < 8; challenge++) {
      const [socketType, data] = await generateQuestion(
        context,
        3,
        TurnModifier.Normal,
        challenge
      );
      if (
        challenge === QuestionCategory.Consequence ||
        challenge === QuestionCategory.ConsequenceB
      ) {
        expect(socketType).toEqual(WebsocketType.ConsequenceAck);
        expect((data as ConsequenceData).id).toBeGreaterThanOrEqual(1);
        expect((data as ConsequenceData).id).toBeLessThanOrEqual(8);
        switch (data.id) {
          case 1:
          case 2:
            expect((data as ConsequenceData).consequence_type).toEqual(0);
            break;
          case 3:
          case 4:
            expect((data as ConsequenceData).consequence_type).toEqual(1);
            break;
          case 5:
          case 6:
            expect((data as ConsequenceData).consequence_type).toEqual(2);
            break;
          default:
            expect((data as ConsequenceData).consequence_type).toEqual(3);
            break;
        }
        expect((data as ConsequenceData).story).not.toBeNull();
        expect((data as ConsequenceData).timer_length).toEqual(10);
      } else {
        expect(socketType).toEqual(WebsocketType.QuestionAck);
        expect((data as QuestionData).id).toBeGreaterThanOrEqual(1);
        expect((data as QuestionData).id).toBeLessThanOrEqual(3);
        expect((data as QuestionData).question).not.toBeNull();
        expect((data as QuestionData).options).toHaveLength(4);
        expect((data as QuestionData).movement_die).toEqual(3);
        expect((data as QuestionData).timer_length).toEqual(15);
        switch (challenge) {
          case QuestionCategory.TakeThreeAllPlay:
          case QuestionCategory.TakeThreeMyPlay:
            expect((data as QuestionData).media_type).not.toBeNull();
            expect((data as QuestionData).media_url).not.toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.TakeThreeAllPlay
            );
            break;
          case QuestionCategory.MusicalAllPlay:
          case QuestionCategory.MusicalMyPlay:
            expect((data as QuestionData).media_type).toBeNull();
            expect((data as QuestionData).media_url).toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.MusicalAllPlay
            );
            break;
          case QuestionCategory.MiscellaneousAllPlay:
          case QuestionCategory.MiscellaneousMyPlay:
            expect((data as QuestionData).media_type).not.toBeNull();
            expect((data as QuestionData).media_url).not.toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.MiscellaneousAllPlay
            );
            break;
        }
      }
    }
  });

  test("Generate a question with 2x modifiers", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    for (let challenge = 0; challenge < 8; challenge++) {
      const [socketType, data] = await generateQuestion(
        context,
        3,
        TurnModifier.DoubleFeature,
        challenge
      );
      if (
        challenge === QuestionCategory.Consequence ||
        challenge === QuestionCategory.ConsequenceB
      ) {
        expect(socketType).toEqual(WebsocketType.ConsequenceAck);
        expect((data as ConsequenceData).id).toBeGreaterThanOrEqual(1);
        expect((data as ConsequenceData).id).toBeLessThanOrEqual(8);
        switch (data.id) {
          case 1:
          case 2:
            expect((data as ConsequenceData).consequence_type).toEqual(0);
            break;
          case 3:
          case 4:
            expect((data as ConsequenceData).consequence_type).toEqual(1);
            break;
          case 5:
          case 6:
            expect((data as ConsequenceData).consequence_type).toEqual(2);
            break;
          default:
            expect((data as ConsequenceData).consequence_type).toEqual(3);
            break;
        }
        expect((data as ConsequenceData).story).not.toBeNull();
        expect((data as ConsequenceData).timer_length).toEqual(10);
      } else {
        expect(socketType).toEqual(WebsocketType.QuestionAck);
        expect((data as QuestionData).id).toBeGreaterThanOrEqual(1);
        expect((data as QuestionData).id).toBeLessThanOrEqual(3);
        expect((data as QuestionData).question).not.toBeNull();
        expect((data as QuestionData).options).toHaveLength(4);
        expect((data as QuestionData).movement_die).toEqual(6);
        expect((data as QuestionData).timer_length).toEqual(15);
        switch (challenge) {
          case QuestionCategory.TakeThreeAllPlay:
          case QuestionCategory.TakeThreeMyPlay:
            expect((data as QuestionData).media_type).not.toBeNull();
            expect((data as QuestionData).media_url).not.toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.TakeThreeAllPlay
            );
            break;
          case QuestionCategory.MusicalAllPlay:
          case QuestionCategory.MusicalMyPlay:
            expect((data as QuestionData).media_type).toBeNull();
            expect((data as QuestionData).media_url).toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.MusicalAllPlay
            );
            break;
          case QuestionCategory.MiscellaneousAllPlay:
          case QuestionCategory.MiscellaneousMyPlay:
            expect((data as QuestionData).media_type).not.toBeNull();
            expect((data as QuestionData).media_url).not.toBeNull();
            expect((data as QuestionData).all_play).toEqual(
              challenge === QuestionCategory.MiscellaneousAllPlay
            );
            break;
        }
      }
    }
  });
});

// Test Check Winner
describe("Check Winner", () => {
  // You can't win a game that hasn't started yet
  test("Game that hasn't started will error", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    let game = await Game.findOne({ game_code: context.gameID })
      .orFail()
      .exec();
    game.started = false;
    await game.save();
    try {
      await checkWinner(context);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toEqual("[GC] The game has not yet started.");
    }
  });

  // No winner should exist yet
  test("No winners", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    await Game.findOneAndUpdate(
      { game_code: context.gameID },
      {
        started: true,
      }
    ).exec();
    const game = await Game.findOne({ game_code: context.gameID })
      .orFail()
      .exec();
    expect(game.started).toBeTruthy();
    const winner = await checkWinner(context);
    expect(winner).toBeFalsy();
  });

  // Manufacture a single winner
  test("One winner", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    await Game.findOneAndUpdate(
      { game_code: context.gameID },
      {
        started: true,
      }
    ).exec();
    const game = await Game.findOne({ game_code: context.gameID })
      .orFail()
      .exec();
    expect(game.started).toBeTruthy();
    // Update user 3 to be at the finish line, space 41
    await User.findOneAndUpdate(
      {
        userType: "Client",
        username: `user0000_3`,
        token: `Client-user0000_3-0000`,
      },
      { position: 41 }
    );
    const winner = await checkWinner(context);
    expect(winner).toBeTruthy();
  });

  // Multiple winner error test
  test("Multiple winner", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    await Game.findOneAndUpdate(
      { game_code: context.gameID },
      {
        started: true,
      }
    ).exec();
    const game = await Game.findOne({ game_code: context.gameID })
      .orFail()
      .exec();
    expect(game.started).toBeTruthy();
    // Update users 3 and 7 to be at the finish line, space 41
    await User.findOneAndUpdate(
      {
        userType: "Client",
        username: `user0000_3`,
        token: `Client-user0000_3-0000`,
      },
      { position: 41 }
    );
    await User.findOneAndUpdate(
      {
        userType: "Client",
        username: `user0000_7`,
        token: `Client-user0000_7-0000`,
      },
      { position: 41 }
    );
    try {
      await checkWinner(context);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toEqual("[GC] An winning error state has been detected.");
    }
  });

  // Reset winners and test again
  test("Reset winners", async () => {
    // Create context for the game
    const context: Context = {
      username: "game0000",
      userType: "Game",
      token: "Game-game0000-0000",
      gameID: "0000",
    };
    await Game.findOneAndUpdate(
      { game_code: context.gameID },
      {
        started: true,
      }
    ).exec();
    const game = await Game.findOne({ game_code: context.gameID })
      .orFail()
      .exec();
    expect(game.started).toBeTruthy();
    // Reset all users to positions less than 41
    await User.updateMany(
      {
        userType: "Client",
        game: game._id,
      },
      { position: MathUtil.randInt(0, 40) }
    );
    const winner = await checkWinner(context);
    expect(winner).toBeFalsy();
  });
});
