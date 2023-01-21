/**
 * @file Websocket.ts
 * @author Mark Hutchison
 * An file that details the typing information for all Websocket
 * requests and responses sent over the stream.
 */
import type { AllowedPayloads } from "../apis/WebSocketAPIType";
import type { WebsocketType } from "../enums/WebsocketTypes";

export type WebsocketMessage<T extends AllowedPayloads> = {
  type: WebsocketType;
  requestId?: string;
  data: T;
};

export type WebsocketRequest<T extends AllowedPayloads> = WebsocketMessage<T> & {
  type:
    | WebsocketType.GameSetup
    | WebsocketType.GameJoin
    | WebsocketType.GameStart
    | WebsocketType.GameEnded
    | WebsocketType.TextQuestion // todo this is a message that the server sends to the client why is it a request and not a response? (there are other examples of this as well)
    | WebsocketType.MultipleChoiceQuestion
    | WebsocketType.QuestionTimerTick
    | WebsocketType.QuestionEnded
    | WebsocketType.QuestionAnswer
    | WebsocketType.Consequence
    | WebsocketType.ConsequenceEnded
    | WebsocketType.NextPlayer
    | WebsocketType.Ping;
  token: string;
};

export type WebsocketResponse<T extends AllowedPayloads> = WebsocketMessage<T> & {
  type:
    | WebsocketType.Error
    | WebsocketType.GameSetupAck
    | WebsocketType.GameJoinAck
    | WebsocketType.GameStartAck
    | WebsocketType.GameEndedAck
    | WebsocketType.QuestionAck
    | WebsocketType.QuestionTimerTickAck
    | WebsocketType.QuestionEndedAck
    | WebsocketType.ConsequenceAck
    | WebsocketType.ConsequenceEndedAck
    | WebsocketType.PlayerDisconnectAck
    | WebsocketType.NextPlayerAck
    | WebsocketType.Pong;
};
