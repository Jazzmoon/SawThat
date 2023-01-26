/**
 * @file GameController.ts
 * @author Mark Hutchison
 * The Game Controller controls the logic for a game.
 * It handles the modification of the Games within the Models module,
 * as well as handles the logic for a standard turn in game.
 */

import { FastifyReply, FastifyRequest } from "fastify";
import { SocketStream } from "@fastify/websocket";
import mongoose from "mongoose";

import { generateJWT } from "./AuthController";
import { formatQuestion, validateAnswer } from "./QuizController";

import {
  QuestionAnswerData,
  QuestionData,
} from "../../shared/apis/WebSocketAPIType";
import { QuestionCategory } from "../../shared/enums/QuestionCategory";
import { TurnModifier } from "../../shared/enums/TurnModifier";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import {
  WebsocketRequest,
  WebsocketResponse,
} from "../../shared/types/Websocket";

import MathUtil from "../../shared/util/MathUtil";

import Game, { GameType } from "../models/Game";
import User, { UserType } from "../models/User";

type ClientConn = {
  username: string;
  conn: SocketStream;
};

type PopulatedGame = Omit<
  Omit<
    mongoose.Document<unknown, any, GameType> &
      GameType & {
        _id: mongoose.Types.ObjectId;
      },
    "hostId"
  > & { hostId: UserType },
  "players"
> & { players: UserType[] };

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
  if (!game) return Promise.reject("There is no game with this game id.");
  if (game!.started === true)
    return Promise.reject("The game has already started.");
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  )
    return Promise.reject("The players didn't populate");
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
export const nextPlayer = async (gameID: string): Promise<string> => {
  // Look-Up the game in the database
  let game = await Game.findOne({ game_code: gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .exec();

  // Perform error checks.
  if (!game) return Promise.reject("There is no game with this game id.");
  if (!game!.started) return Promise.reject("The game has not yet started.");
  if (game.players.length < 2)
    return Promise.reject(
      new Error("There is not enough players to perform this task.")
    );
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  )
    return Promise.reject("The players didn't populate");

  // Verify that the game isn't already started
  // Shift the player list left
  let current_player = game.players.shift();
  game.players.push(current_player!);

  const save_state = await game.save();

  return Promise.resolve(game.players[0].username);
};

/**
 * Handle the turn logic for a single round of the game, triggered by the game node sending a message.
 * @param {{
 *  host: ClientConn;
 *  clients: Array<ClientConn>;
 *  turn?: { answer_index: number; turn_timer: Date; };}
 * } connections - List of all Websockets relevant to the game that this turn is for.
 * @param {WebsocketRequest} data - Any relevant data that the game node sends across the websocket stream.
 * @param {GameType} game - The game state. We know that the sender of these messages is the game node.
 */
export const turn = async (
  connections: {
    host: ClientConn;
    clients: Array<ClientConn>;
    turn?: {
      turn_end: number;
      movement_die: number;
    };
  },
  data: WebsocketRequest,
  game: PopulatedGame
): Promise<boolean> => {
  // Generate dice values for the game node:
  // Get turn modifier information for player
  // Return Turn Modifier for Question Generation
  let turn_modifier: TurnModifier = TurnModifier.Normal;
  switch (game.players[0].position) {
    case 9:
    case 19:
    case 28:
      turn_modifier = TurnModifier.DoubleFeature;
      break;
    case 37:
      turn_modifier = TurnModifier.AllPlayToWin;
      break;
    case 38:
      turn_modifier = TurnModifier.FinalCut3;
      break;
    case 39:
      turn_modifier = TurnModifier.FinalCut2;
      break;
    case 40:
      turn_modifier = TurnModifier.FinalCut1;
      break;
    case 41:
    default:
      turn_modifier = TurnModifier.Winner;
      break;
  }
  // generate random integer between 1 and 6
  const movement_die: number =
      turn_modifier === TurnModifier.DoubleFeature
        ? MathUtil.randInt(1, 6) * 2
        : MathUtil.randInt(1, 6),
    challenge_die = MathUtil.randInt(0, 7),
    question_type = "Multiple Choice";
  let category: string = "Consequence";
  switch (challenge_die) {
    case QuestionCategory.TakeThreeAllPlay:
    case QuestionCategory.TakeThreeMyPlay:
      category = "Take Three";
      break;
    case QuestionCategory.MusicalAllPlay:
    case QuestionCategory.MusicalMyPlay:
      category = "Musical";
      break;
    case QuestionCategory.MiscellaneousAllPlay:
    case QuestionCategory.MiscellaneousMyPlay:
      category = "Miscellaneous";
      break;
    default:
      category = "Consequence";
      break;
  }
  return formatQuestion(
    game.theme_pack,
    category,
    question_type,
    game.used_questions
  )
    .then(async (res) => {
      let question_data: QuestionData = {
        id: res.id,
        category: category,
        question_type: question_type,
        question: res.question,
        options: res.options,
        media_type: res.media_type,
        media_url: res.media_url,
        all_play: 0 <= challenge_die && challenge_die >= 2,
        movement_die: movement_die,
        challenge_die: challenge_die,
        timer_length: 15,
      };
      // Add game to the database, making sure it is appended (so we know which is the most recent question)
      game.used_questions.push(question_data.id);
      await game.save();

      // Start timer and send question:
      connections.turn = {
        turn_end: Date.now(),
        movement_die: movement_die,
      };
      question_data.timer_end = connections.turn.turn_end;
      connections.host.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.QuestionAck,
          requestId: data.requestId,
          data: question_data,
        } as WebsocketResponse)
      );
      if (question_data.all_play) {
        // All_play
        connections.clients.forEach((c) => {
          c.conn.socket.send(
            JSON.stringify({
              type: WebsocketType.QuestionAck,
              requestId: data.requestId,
              data: question_data,
            } as WebsocketResponse)
          );
        });
      } else if ([3, 7].includes(challenge_die)) {
        // Consequence Card
        connections.clients
          .find((c) => c.username === game.players[0].username)!
          .conn.socket.send(
            JSON.stringify({
              type: WebsocketType.QuestionAck,
              requestId: data.requestId,
              data: question_data,
            } as WebsocketResponse)
          );
      } else {
        // My Play
        connections.clients
          .find((c) => c.username === game.players[0].username)!
          .conn.socket.send(
            JSON.stringify({
              type: WebsocketType.QuestionAck,
              requestId: data.requestId,
              data: question_data,
            } as WebsocketResponse)
          );
      }
      // Start the timer async timeout
      setTimeout(() => {
        questionEnd(connections, game, data);
      }, Math.abs(Date.now() - question_data.timer_end));
      return Promise.resolve(true);
    })
    .catch((err) => {
      console.log(
        `[WS] Error fetching question for request id ${data.requestId}:`,
        err
      );
      return Promise.reject(
        `[WS] Error fetching question for request id ${data.requestId}: ${err}`
      );
    });
};

export const questionAnswer = async (
  connections: {
    host: ClientConn;
    clients: Array<ClientConn>;
    turn?: {
      turn_end: number;
      movement_die: number;
    };
  },
  data: WebsocketRequest,
  username: string,
  game: PopulatedGame
): Promise<boolean> => {
  // Verify that the question is still open to be answered
  if (connections.turn === undefined)
    return Promise.reject("This question is no longer available for answer");
  // Verify that the question is the same as the one being asked
  if (
    game.used_questions[game.used_questions.length - 1] !==
    (data.data as QuestionAnswerData).id
  )
    return Promise.reject(
      "Player is answering a different question than was asked."
    );

  // Check user answer against actual answer
  const correct: boolean = await validateAnswer(
    game.theme_pack,
    (data.data as QuestionAnswerData).id,
    (data.data as QuestionAnswerData).category,
    (data.data as QuestionAnswerData).answer,
    (data.data as QuestionAnswerData).question_type
  );
  if (correct) {
    // If it is the players turn. move them.
    if (game.players[0].username === username)
      game.players[0].position += connections.turn.movement_die;
    // If correct, kill the timeout and move player accordingly
    connections.turn = undefined;
    await game.save();
    await questionEnd(connections, game, data);
  }
  // return if answer is correct
  return Promise.resolve(correct);
};

const questionEnd = async (
  connections: {
    host: ClientConn;
    clients: Array<ClientConn>;
    turn?: {
      turn_end: number;
      movement_die: number;
    };
  },
  game: PopulatedGame,
  data: WebsocketRequest
) => {
  // Check if it is a timeout, or the question ended early
  let early = connections.turn === undefined;
  connections.host.conn.socket.send(
    JSON.stringify({
      type: early
        ? WebsocketType.QuestionEndedAck
        : WebsocketType.QuestionTimeOut,
      requestId: data.requestId,
      data: {
        players: game.players,
      },
    } as WebsocketResponse)
  );
  connections.clients.forEach((c) => {
    c.conn.socket.send(
      JSON.stringify({
        type: early
          ? WebsocketType.QuestionEndedAck
          : WebsocketType.QuestionTimeOut,
        requestId: data.requestId,
        data: {
          players: game.players,
        },
      } as WebsocketResponse)
    );
  });
  // Force the timeout to be undefined to be safe
  connections.turn = undefined;
};

/**
 * Check if any players are in the winner state.
 * @param {string} gameID - The game code string for the game you want to check the winner of.
 * @returns {Promise<string | boolean>}
 */
export const checkWinner = async (
  gameID: string
): Promise<string | boolean> => {
  // Get the game
  let game = await Game.findOne({ game_code: gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .exec();

  // Perform error checks.
  if (!game) return Promise.reject("There is no game with this game id.");
  if (!game!.started) return Promise.reject("The game has not yet started.");
  if (game.players.length < 2)
    return Promise.reject(
      new Error("There is not enough players to perform this task.")
    );
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  )
    return Promise.reject("The players didn't populate");

  // Check if any players report a position of 41 (Victory Space)
  const winners = game.players.filter((p) => p.position < 41);
  if (winners.length === 0) {
    // A winner does not exist
    return Promise.resolve(false);
  } else if (winners.length === 1) {
    // A winner was found, return their username
    return Promise.resolve(winners[0].username);
  } else {
    return Promise.reject("[GC] An error state has been detected.");
  }
};
