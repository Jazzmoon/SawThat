/**
 * @file GameController.ts
 * @author Mark Hutchison, Luna Yao
 * The Game Controller controls the logic for a game.
 * It handles the modification of the Games within the Models module,
 * as well as handles the logic for a standard turn in game.
 */

import { FastifyReply, FastifyRequest } from "fastify";
import mongoose, { Mongoose } from "mongoose";
import { Mutex } from "async-mutex";

import { generateJWT } from "./AuthController";
import {
  formatConsequence,
  formatQuestion,
  getThemePacks,
  validateAnswer,
} from "./QuizController";

import Game from "../models/Game";
import User, { UserType } from "../models/User";
import {
  ConsequenceData,
  GameJoinAckData,
  QuestionAnswerData,
  QuestionData,
} from "../../shared/apis/WebSocketAPIType";
import { ConsequenceType } from "../../shared/enums/ConsequenceType";
import { QuestionCategory } from "../../shared/enums/QuestionCategory";
import { TurnModifier } from "../../shared/enums/TurnModifier";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import type { Player } from "../../shared/types/Player";
import {
  WebsocketRequest,
  WebsocketResponse,
} from "../../shared/types/Websocket";
import { Consequence } from "../../shared/types/Consequence";
import { Context } from "../../shared/types/Context";
import MathUtil from "../../shared/util/MathUtil";
import { Connection } from "./WebSocketController";

/**
 * Generates a unique game code that is a minimum of 4 characters long,
 * but can grow in size if is a conflict with an existing game.
 * @returns Unique Alpha-Numeric Game Code
 */
const generateGameID = async (): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Generate random game code
  let gameID: string = "";
  for (let i = 0; i < 4; i++)
    gameID += characters.charAt(Math.floor(Math.random() * characters.length));
  if (gameID === "0000") gameID = "0001"; // Testing ID
  console.log(`Starting GameID: ${gameID}`);

  // Check if Game object can be found by Mongoose using this id
  try {
    let exists: boolean = await Game.exists({ game_code: gameID }).then(
      (res) => res !== null
    );
    while (exists) {
      gameID += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      exists = await Game.exists({ game_code: gameID }).then(
        (res) => res !== null
      );
    }
    return gameID;
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }
    throw err;
  }
};

export const getThemePacksAPI = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const themePacks = await getThemePacks();
    res.code(200).type("application/json").send(themePacks);
  } catch (err) {
    res
      .code(400)
      .type("application/json")
      .send(
        err instanceof Error
          ? { error: err, message: `[GC] Get Theme Packs: ${err.message}` }
          : { error: err, message: "[GC] Get Theme Packs: Unknown Error Type" }
      );
  }
  return res;
};

/**
 * Creates a game object from an incoming request.
 * @param req - Incoming request object from the game node.
 * @param res - Outgoing response handler.
 * @returns Returns a response wrapped in a promise to be handled by the Fastify router.
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
    return res;
  }
  let gameCode: string, accessToken: string;
  try {
    gameCode = await generateGameID();
  } catch (err) {
    res
      .code(400)
      .type("application/json")
      .send(
        err instanceof Error
          ? { error: err, message: `[GC] Create gameCode: ${err.message}` }
          : { error: err, message: "[GC] Create gameCode: Unknown Error Type" }
      );
    return res;
  }
  try {
    accessToken = await generateJWT({
      username: `game${gameCode}`,
      gameCode: gameCode,
      userType: "Game",
    });
  } catch (err) {
    res
      .code(400)
      .type("application/json")
      .send(
        err instanceof Error
          ? { error: err, message: `[GC] Create Access Token: ${err.message}` }
          : {
              error: err,
              message: "[GC] Create Access Token: Unknown Error Type",
            }
      );
    return res;
  }

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
    try {
      const host = await User.findOneAndUpdate(
        {
          username: `game${gameCode}`,
          userType: "Game",
          token: accessToken,
        },
        { game: newGame._id }
      )
        .orFail()
        .exec();
      const game_update = await Game.findByIdAndUpdate(newGame._id, {
        hostId: host._id,
      })
        .orFail()
        .exec();

      // Send back response
      res.code(200).type("application/json").send({
        game: newGame,
        gameID: gameCode,
        userToken: accessToken,
      });
      return res;
    } catch (err) {
      res
        .code(400)
        .type("application/json")
        .send(
          err instanceof Error
            ? { error: err, message: `[GC] Game Host Update: ${err.message}` }
            : {
                error: err,
                message: "[GC] Game Host Update: Unknown Error Type",
              }
        );
      return res;
    }
  } catch (err) {
    res
      .code(400)
      .type("application/json")
      .send(
        err instanceof Error
          ? { error: err, message: `[GC] Game Save: ${err.message}` }
          : { error: err, message: "[GC] Game Save: Unknown Error Type" }
      );
    return res;
  }
};

/**
 * Returns the player list in the turn order.
 * @param context - The context of the user and game the message are connected to.
 * @param method - Indicates function operation method. 0 for game start, 1 for next player, 2 for game rankings.
 * @returns A player list, sorted according to the method.
 */
export const playerTurnOrder = async (
  context: Context,
  method: 0 | 1 | 2
): Promise<Player[]> => {
  // Populate the player list
  let game = await Game.findOne({ game_code: context.gameID })
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();

  // If rotate - initiate next turn logic
  if (method === 1) {
    // Shift the player list left{ turn: (game.turn + 1) % game.players.length }
    game = await Game.findByIdAndUpdate(
      game._id,
      { turn: (game.turn + 1) % game.players.length },
      { returnDocument: "after" }
    )
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
  }

  // Convert the UserType[] to Player[]
  let players = [...game.players].map((player) => {
    return {
      username: player.username,
      color: player.color,
      position: player.position,
    } as Player;
  });

  // Shift the player list to the current player
  players = players.slice(game.turn).concat(players.slice(0, game.turn));

  // Return players
  return method === 2
    ? players.sort((a, b) => a.position - b.position)
    : players;
};

/**
 * Given a game id, prepare to start the game. To do so:
 * 1. Randomize the player array to determine turn order.
 * 2. Change the boolean in the game model to be True.
 * 3. Return the username of the first player in the turn order.
 * @param context - The context of the user who sent the message, and the game it is connected to.
 * @return The the player order, with the first in the list being the player who has first turn.
 */
export const startGame = async (context: Context): Promise<Player[]> => {
  // Look-Up the game in the database
  let game = await Game.findOne({ game_code: context.gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();
  // Perform Error Checking
  if (!game) {
    throw "[GC] There is no game with this game id.";
  }
  if (game!.started === true) {
    throw "[GC] The game has already started.";
  }
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  ) {
    throw "[GC] The players didn't populate";
  }
  if (game.players.length < 2) {
    throw `[GC] The game doesn't have enough players to start yet. ${game.players.length}/2 connected.`;
  }
  // Randomize the players array and save it
  game = await Game.findByIdAndUpdate(
    game._id,
    {
      players: MathUtil.shuffle(game!.players),
      started: true,
    },
    { returnDocument: "after" }
  )
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();
  console.log(`[GC] Game ${game.game_code} has started.`);
  // Return the player order, with the first in the list being the player who has first turn.
  return await playerTurnOrder(context, 0);
};

/**
 * Given a game id, shift the player list left and return the next player
 * in the turn order.
 * @param context - The context of the user who sent the message, and the game it is connected to.
 * @return The the player order, with the first in the list being the player who has first turn.
 */
export const nextPlayer = async (context: Context): Promise<Player[]> => {
  // Look-Up the game in the database
  let game = await Game.findOne({ game_code: context.gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();

  // Perform error checks.
  if (!game) {
    throw "[GC] There is no game with this game id.";
  }
  if (game.started === false) {
    throw "[GC] The game has not yet started.";
  }
  if (game.players.length < 2) {
    throw "[GC] There is not enough players to perform this task.";
  }
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  ) {
    throw "[GC] The players didn't populate";
  }

  // Return the player order, with the first in the list being the player who has first turn.
  return await playerTurnOrder(context, 1);
};

/**
 * Fetches a question, or consequence, and formats it appropriately.
 * @param context - The context of the request sender.
 * @param movement_die - The original value of the movement die.
 * @param turn_modifier - The turn modifier, if any exists.
 * @param challenge_die - The value of the challenge dice.
 * @returns The formatted question and request type.
 */
export const generateQuestion = async (
  context: Context,
  movement_die: number,
  turn_modifier: TurnModifier,
  challenge_die: number
): Promise<[WebsocketType, ConsequenceData | QuestionData]> => {
  // Define variable constants
  const question_type: "Multiple Choice" | "Text Question" = "Multiple Choice";
  let game = await Game.findOne({ game_code: context.gameID }).orFail().exec(),
    category: string = "Consequence";
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

  if (category === "Consequence") {
    // Fetch consequence
    let consequence: Consequence = await formatConsequence(
      game.theme_pack,
      game.used_consequences
    );
    switch (consequence.consequenceType) {
      case ConsequenceType.MoveBackward:
      case ConsequenceType.LoseATurn:
        movement_die =
          turn_modifier === TurnModifier.Normal
            ? MathUtil.randInt(-3, -1)
            : MathUtil.randInt(-3, -1) * 2;
        break;
      case ConsequenceType.MoveForward:
      case ConsequenceType.SkipATurn:
        movement_die =
          turn_modifier === TurnModifier.Normal
            ? MathUtil.randInt(1, 3)
            : MathUtil.randInt(1, 3) * 2;
        break;
    }
    let consequence_data: ConsequenceData = {
      id: consequence.id,
      consequence_type: consequence.consequenceType,
      story: consequence.story,
      movement_die: movement_die,
      timer_length: 10,
    };
    // Add consequence ID to used list
    game = await Game.findByIdAndUpdate(
      game._id,
      { used_consequences: game.used_consequences.concat(consequence.id) },
      { returnDocument: "after" }
    )
      .orFail()
      .exec();
    if (
      game.used_consequences[game.used_consequences.length - 1] !==
      consequence.id
    ) {
      throw "[GC] Consequences did not update properly";
    }
    // Move the player
    await movePlayer(context.gameID, movement_die);
    return [WebsocketType.ConsequenceAck, consequence_data];
  } else {
    let question = await formatQuestion(
        game.theme_pack,
        category,
        question_type,
        game.used_questions
      ),
      question_data: QuestionData = {
        id: question.id,
        category: category,
        question_type: question_type,
        question: question.question,
        options: question.options,
        media_type: question.media_type,
        media_url: question.media_url,
        all_play:
          challenge_die === QuestionCategory.TakeThreeAllPlay ||
          challenge_die === QuestionCategory.MusicalAllPlay ||
          challenge_die === QuestionCategory.MiscellaneousAllPlay,
        movement_die:
          turn_modifier === TurnModifier.DoubleFeature
            ? movement_die * 2
            : movement_die,
        challenge_die: challenge_die,
        timer_length: 15,
      };

    // Add question ID to used list
    game = await Game.findByIdAndUpdate(
      game._id,
      {
        used_questions: game.used_questions.concat(question.id),
      },
      { returnDocument: "after" }
    )
      .orFail()
      .exec();
    if (game.used_questions[game.used_questions.length - 1] !== question.id) {
      throw "Questions did not update properly";
    }
    return [WebsocketType.QuestionAck, question_data];
  }
};

/**
 * Handle the turn logic for a single round of the game, triggered by the game node sending a message.
 * @param connections - List of all WebSockets relevant to the game that this turn is for.
 * @param data - Any relevant data that the game node sends across the websocket stream.
 * @param context - The context of the request sender.
 */
export const turn = async (
  connections: Connection,
  data: WebsocketRequest,
  context: Context
) => {
  const game = await Game.findOne({
    game_code: context.gameID,
  })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();
  // Generate dice values for the game node:
  // Get turn modifier information for player
  // Return Turn Modifier for Question Generation
  let turn_modifier: TurnModifier = TurnModifier.Normal,
    movement_die: number = MathUtil.randInt(1, 6);
  switch (game.players[game.turn].position) {
    case 9:
    case 19:
    case 28:
      turn_modifier = TurnModifier.DoubleFeature;
      movement_die = MathUtil.randInt(1, 6) * 2;
      break;
    case 37:
      turn_modifier = TurnModifier.AllPlayToWin;
      movement_die = 1;
      break;
    case 38:
      turn_modifier = TurnModifier.FinalCut3;
      movement_die = 1;
      break;
    case 39:
      turn_modifier = TurnModifier.FinalCut2;
      movement_die = 1;
      break;
    case 40:
      turn_modifier = TurnModifier.FinalCut1;
      movement_die = 1;
      break;
    case 41:
      turn_modifier = TurnModifier.Winner;
      movement_die = 0;
      break;
    default:
      turn_modifier = TurnModifier.Normal;
      movement_die = MathUtil.randInt(1, 6);
  }
  // Generate challenge depending on user location
  const challenge_die: number =
    turn_modifier === TurnModifier.Normal ||
    turn_modifier === TurnModifier.DoubleFeature
      ? MathUtil.randInt(0, 7)
      : MathUtil.choice([0, 1, 2, 4, 5, 6], 1)[0];

  let [res_type, res_data] = await generateQuestion(
    context,
    movement_die,
    turn_modifier,
    challenge_die
  );

  // Prepare turn in connections record
  const release = await connections.mutex.acquire();
  connections.turn = {
    turn_start: Date.now(),
    turn_modifier: turn_modifier,
    all_play: 0 <= challenge_die && challenge_die <= 2,
    movement_die: res_data.movement_die,
    answered: [],
  };
  try {
    res_data.timer_start = connections.turn.turn_start;
    res_data.recipient_name = connections.turn.all_play
      ? undefined
      : game.players[game.turn].username;
    // Send data blast
    connections.host.conn.socket.send(
      JSON.stringify({
        type: res_type,
        requestId: data.requestId,
        data: res_data,
      } as WebsocketResponse)
    );
    if (connections.turn.all_play) {
      if ((res_data as QuestionData).question) {
        console.log("[GC] Sending All Play question");
      }
      // All Play
      connections.clients.forEach((c) => {
        c.conn.socket.send(
          JSON.stringify({
            type: res_type,
            requestId: data.requestId,
            data: res_data,
          } as WebsocketResponse)
        );
      });
    } else {
      console.log(`[GC] Sending My Play to Player ${res_data.recipient_name}`);
      // My Play
      // As such, recipient_name should always be defined
      connections.clients
        .find((c) => c.username === res_data.recipient_name)!
        .conn.socket.send(
          JSON.stringify({
            type: res_type,
            requestId: data.requestId,
            data: res_data,
          } as WebsocketResponse)
        );
    }
    console.log(`[GC] STARTING TIMEOUT TIMER FOR ${Date.now() - (res_data.timer_start + res_data.timer_length * 1000)} ms`);
    connections.turn!.timeout = setTimeout(() => {
      questionEnd(
        connections,
        data,
        context,
        false,
        res_type === WebsocketType.QuestionAck
      );
    }, Math.abs(Date.now() - (res_data.timer_start + res_data.timer_length * 1000)));
  } finally {
    release();
  }
  return connections.turn;
};

/**
 * Handle a user sending an answer request to the server
 * @param connections - The websocket information of all players connected to the specific game.
 * @param data - Information related to the request, such as request id and the question answer.
 * @param context - The context of the request sender.
 * @returns Whether the answer submitted is, or is not, correct.
 */
export const questionAnswer = async (
  connections: Connection,
  data: WebsocketRequest,
  context: Context
): Promise<boolean> => {
  /*
    Verify that the question is still open to be answered,
    that the user hasn't already answered,
    and that the question is the same as the one being asked.
  */
  if (
    connections.turn === undefined ||
    connections.turn.timeout === undefined ||
    connections.turn.answered.includes(context.username)
  )
    return false;
  // Acquire the turn mutex
  const release = await connections.mutex.acquire();
  // Determine if answer is correct
  let correct: boolean = false;
  try {
    const game = await Game.findOne({
      game_code: context.gameID,
    })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    if (
      game.used_questions[game.used_questions.length - 1] !==
      (data.data as QuestionAnswerData).id
    )
      return false;
    // Add the user to the list of people who answered
    connections.turn.answered.push(context.username);

    // Check user answer against actual answer
    console.log(
      `[GC] User ${context.username} has submitted answer ${
        (data.data as QuestionAnswerData).answer
      } for question (${(data.data as QuestionAnswerData).id} | ${
        (data.data as QuestionAnswerData).category
      })`
    );

    correct = await validateAnswer(
      game.theme_pack,
      (data.data as QuestionAnswerData).id,
      (data.data as QuestionAnswerData).category,
      (data.data as QuestionAnswerData).answer,
      (data.data as QuestionAnswerData).question_type
    ).catch((err) => {
      console.log(`[GC] Validate answer encountered the following error:`, err);
      return false;
    });
    if (correct) {
      console.log(`[GC] User ${context.username} was correct.`);
      // If it is the players turn. Move them.
      if (game.players[game.turn].username === context.username) {
        const movement = await movePlayer(
          context.gameID,
          connections.turn.movement_die
        );
        console.log(`[GC] Player moved: ${movement}`);
      }
      // If correct, kill the timeout and move player accordingly
      const question_end = await questionEnd(
        connections,
        data,
        context,
        true,
        true
      );
      console.log(`[GC] Ending Question Early: ${question_end}`);
    }

    // If this player was the last player required before timeout, kill the question
    else if (
      (connections.turn.all_play === false &&
        connections.turn.answered.length === 1) ||
      connections.turn.answered.length === game.players.length
    ) {
      const question_end = await questionEnd(
        connections,
        data,
        context,
        true,
        true
      );
      console.log(`[GC] Ending Question Early: ${question_end}`);
    }
  } finally {
    release();
  }
  return correct;
};

/**
 * Takes the player whose current turn it is, and moves them forward.
 * @param gameID The game ID of the player who must move.
 * @param movement_die How far the player is moving forward.
 * @returns The updated user data to ensure they moved.
 */
export const movePlayer = async (gameID: string, movement_die: number) => {
  // Fetch the game's player
  const game = await Game.findOne({
    game_code: gameID,
  })
    .populate<{ players: (UserType & mongoose.Document)[] }>("players")
    .orFail()
    .exec();

  // Update the player's movement
  let user = await User.findByIdAndUpdate(
    game.players[game.turn]._id,
    {
      position: MathUtil.bound(
        0,
        41,
        game.players[game.turn].position + movement_die
      ),
    },
    { returnDocument: "after" }
  )
    .orFail()
    .exec();
  return user;
};

/**
 * The question has ended, either by timeout or by answer. Handle accordingly.
 * @param connections - The websocket information of all players connected to the specific game.
 * @param data - Information related to the request, such as request id.
 * @param context - The populated game instance to fetch information about the current game state.
 * @param early - Is this request ending the game before the timeout?
 * @param question - Are we ending a question or consequence?
 * @returns This is a mutation function in which modifies the next game state and sends it to the players.
 */
export const questionEnd = async (
  connections: Connection,
  data: WebsocketRequest,
  context: Context,
  early: boolean,
  question: boolean
): Promise<boolean> => {
  const release = await connections.mutex.acquire();
  try {
    console.log("4");
    if (connections.turn === undefined) return false;
    console.log("3");
    if (connections.turn.timeout === undefined) return false;
    // Force the timeout to be undefined so no other requests go through
    console.log("2");
    clearTimeout(connections.turn.timeout!);
    connections.turn = undefined;
    const game = await Game.findOne({
      game_code: context.gameID,
    })
      .orFail()
      .exec();

    console.log("1");

    // Get updated players array
    const players = await User.find({
      userType: "Client",
      game: game._id,
    })
      .orFail()
      .exec();

    // TODO I DID THIS TO TEST AND FIX THE CONSEQUENCES NOT DISAPPEARING BUT DIDN"T FINISH. TODO KEEP GOING
    console.log(`[GC] SENDING ${question ? 'QUESTION' : 'CONSEQUENCE'} ${early ? 'ENDED' : 'TIMEOUT'} ACK`);
    connections.host.conn.socket.send(
      JSON.stringify({
        type: question
          ? (early
            ? WebsocketType.QuestionEndedAck
            : WebsocketType.QuestionTimeOut
          )
          : (early
            ? WebsocketType.ConsequenceEndedAck
            : WebsocketType.ConsequenceTimeOut
          ),
        requestId: data.requestId,
        data: {
          players: players
            .map((p) => {
              return {
                username: p.username,
                color: p.color,
                position: p.position,
              } as Player;
            })
            .sort((a, b) => a.position - b.position),
        },
      } as WebsocketResponse)
    );
    connections.clients.forEach((c) => {
      c.conn.socket.send(
        JSON.stringify({
          type: question
            ? early
              ? WebsocketType.QuestionEndedAck
              : WebsocketType.QuestionTimeOut
            : early
            ? WebsocketType.ConsequenceEndedAck
            : WebsocketType.ConsequenceTimeOut,
          requestId: data.requestId,
          data: {
            players: players
              .map((p) => {
                return {
                  username: p.username,
                  color: p.color,
                  position: p.position,
                } as Player;
              })
              .sort((a, b) => a.position - b.position),
          },
        } as WebsocketResponse)
      );
    });
  } finally {
    release();
  }
  return true;
};

/**
 * Check if any players are in the winner state.
 * @param gameID - The context of the user and game of origin.
 * @returns Whether there is a winning player in the game.
 */
export const checkWinner = async (context: Context): Promise<boolean> => {
  // Get the game
  const game = await Game.findOne({ game_code: context.gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();

  // Perform error checks.
  if (game.started === false) {
    throw "[GC] The game has not yet started.";
  }
  if (game.players.length < 2) {
    throw "[GC] There is not enough players to perform this task.";
  }
  if (
    game!.players[0] instanceof mongoose.Types.ObjectId ||
    game!.players[0] === null
  ) {
    throw "[GC] The players didn't populate";
  }

  // Check if any players report a position of 41 (Victory Space)
  const winners = await User.find({
    game: game._id,
    position: { $gte: 41 },
  }).exec();
  if (winners === null) return false;
  if (0 === winners.length || winners.length === 1) {
    return winners.length === 1; // true means winner. false means none.
  } else {
    throw "[GC] An winning error state has been detected.";
  }
};
