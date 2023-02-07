/**
 * @file Websocket.ts
 * @author Mark Hutchison
 * A file that details the typing information for all Websocket
 * requests and responses sent over the stream.
 */
import type { WebsocketType } from "../enums/WebsocketTypes";

/**
 * The generic interface of all messages sent across the websocket.
 */
export type WebsocketMessage = {
  type: WebsocketType;
  requestId?: string;
  data: any;
};

/**
 * Extending WebsocketMessage, a websocket request limits the legal types and adds a token parameter.
 */
export type WebsocketRequest = WebsocketMessage & {
  type:
    | WebsocketType.GameSetup
    | WebsocketType.GameJoin
    | WebsocketType.GameStart
    | WebsocketType.GameEnded
    | WebsocketType.QuestionRequest
    | WebsocketType.QuestionTimerTick
    | WebsocketType.QuestionEnded
    | WebsocketType.QuestionAnswer
    | WebsocketType.Consequence
    | WebsocketType.ConsequenceEnded
    | WebsocketType.NextPlayer
    | WebsocketType.Ping;
  token: string;
};

/**
 * Extending WebsocketMessage, a websocket response limits the legal types.
 */
export type WebsocketResponse = WebsocketMessage & {
  type:
    | WebsocketType.Error
    | WebsocketType.GameSetupAck
    | WebsocketType.GameJoinAck
    | WebsocketType.GameStartAck
    | WebsocketType.GameEndedAck
    | WebsocketType.QuestionAck
    | WebsocketType.QuestionTimerTickAck
    | WebsocketType.QuestionEndedAck
    | WebsocketType.QuestionTimeOut
    | WebsocketType.ConsequenceAck
    | WebsocketType.ConsequenceEndedAck
    | WebsocketType.ConsequenceTimeOut
    | WebsocketType.PlayerDisconnectAck
    | WebsocketType.NextPlayerAck
    | WebsocketType.Pong;
};
