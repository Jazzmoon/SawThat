/**
 * @file WebSocketAPIType.ts
 * @author Mark Hutchison
 * Details the structure of data that will be transferred over the
 * websocket connection.
 */
import type { ConsequenceType } from "../enums/ConsequenceType";
import type { QuestionCategory } from "../enums/QuestionCategory";
import type { Player } from "../types/Player";

export type TimedData = {
  timer_start: Date;
  timer_length: number;
};

export type QuestionData = {
  id: number;
  category: string;
  question_type: "Multiple Choice";
  question: string;
  options: string[];
  media_type?: "image" | "video" | null;
  media_url?: string | null;

  movement_die: 1 | 2 | 3 | 4 | 5 | 6;
  challenge_die: QuestionCategory;
} & TimedData;

export type ConsequenceData = {
  id: number;
  consequence_type: ConsequenceType;
  story: string;
  spaces?: number;
} & TimedData;

export type GameEndAckData = {
  ranking: {
    username: string;
    final_ranking: number;
  }[];
};

export type QuestionEndedData = {
  players: Player[];
};

export type QuestionAnswerData = {
  id: number;
  category: string;
  question_type?: string;
  answer: string;
};

export type ConnectionEstablished = {
  message: string;
  username: string;
  userType: string;
  gameCode: string;
  JWT: string;
};

export type GameJoinAckData = {
  players: Player[];
};

export type NextPlayerData = {
  player: Player;
};
