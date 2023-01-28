/**
 * @file WebSocketAPIType.ts
 * @author Mark Hutchison
 * Details the structure of data that will be transferred over the
 * websocket connection.
 */
import type { ConsequenceType } from "../enums/ConsequenceType";
import type { QuestionCategory } from "../enums/QuestionCategory";
import type { Player } from "../types/Player";

/**
 * Any response from the server that involves the server starting a timer will include the following information.
 */
export type TimedData = {
  timer_start?: Date | number;
  timer_length: number;
};

/**
 * Detailing the question data that the server sends to the game and client nodes.
 */
export type QuestionData = {
  id: number;
  category: string;
  question_type: "Multiple Choice";
  question: string;
  options: string[];
  media_type?: "image" | "video" | null;
  media_url?: string | null;
  all_play?: boolean;
  movement_die: number;
  challenge_die: QuestionCategory;
} & TimedData;

/**
 * Detailing the consequence data that the server sends to the game and client nodes.
 */
export type ConsequenceData = {
  id: number;
  consequence_type: ConsequenceType;
  story: string;

  movement_die: number;
} & TimedData;

/**
 * When a game has ended, the final rankings of the players is sent.
 */
export type GameEndAckData = {
  ranking: Player[];
};

/**
 * Upon each question ending, send an array detailing where each player is located.
 */
export type QuestionEndedData = {
  players: Player[];
};

/**
 * When a client sends their answer to the server via a request, this is how that answer is formatted.
 */
export type QuestionAnswerData = {
  id: number;
  category: string;
  question_type?: string;
  answer: string;
};

/**
 * This data structure is to act as a confirmation that the user has connected to the websocket with the correct information.
 */
export type ConnectionEstablished = {
  message: string;
  username: string;
  userType: string;
  gameCode: string;
  JWT: string;
};

/**
 * When a player connects to the websocket, send a player list to everyone to notify them.
 */
export type GameJoinAckData = {
  players: Player[];
};

/**
 * When the game progresses to the next turn, the game node must know whose turn it is next.
 */
export type NextPlayerData = {
  player: Player;
};

/**
 * If an error occurs, send back data of this format to ensure it can be handled.
 */
export type ErrorData = {
  error: string | Error;
  message?: string;
  fatal: boolean;
  token: string;
};
