/**
 * @file WebSocketAPIType.ts
 * Details the structure of data that will be transferred over the
 * websocket connection.
 */
import type { ConsequenceType } from "../enums/ConsequenceType";
import type { Color } from "../enums/Color";

export type TimedData = {
  timer_start: Date;
  timer_length: number;
};

export type WebSocketError = {
  error: Error | string,
  token: string
}

export type WebSocketPong = {
  message: string,
}

export type MultipleChoiceData = {
  id: number;
  category: string;
  question_type: "Multiple Choice";
  question: string;
  options: string[];
  media_type?: "image" | "video" | null;
  media_url?: string | null;
} & TimedData;

export type TextQuestionData = {
  id: number;
  category: string;
  question_type: "Text";
  question: string;
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
  players: {
    username: string;
    color: string;
    position: number;
  }[];
};

export type QuestionAnswerData = {
  id: number;
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
  username: string;
  color: Color;
  position: number;
  players: string[];
};

export type NextPlayerData = {
  username: string;
};

export type PlayerDisconnectAckData = {
  username: string
}

// TODO SPLIT INTO FROM SERVER AND TO SERVER. THIS WILL ENSURE THAT ALL PAYLOADS ARE LEGAL
// TODO ALSO FIGURE OUT A WAY TO MAP TYPE TO PAYLOAD. ALTHOUGH THIS IS LESS IMPORTANT
export type AllowedPayloads = {} | TimedData | WebSocketError | WebSocketPong | MultipleChoiceData | TextQuestionData | ConsequenceData | GameEndAckData | QuestionEndedData | QuestionAnswerData | ConnectionEstablished | GameJoinAckData | NextPlayerData | PlayerDisconnectAckData;