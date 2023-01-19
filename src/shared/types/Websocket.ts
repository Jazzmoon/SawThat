import type { WebsocketType } from "../enums/WebsocketTypes";

export type WebsocketMessage = {
  type: WebsocketType;
  data: any;
};

export type WebsocketRequest = WebsocketMessage & {
  type:
    | WebsocketType.GameSetup
    | WebsocketType.GameJoin
    | WebsocketType.GameEnded
    | WebsocketType.TextQuestion
    | WebsocketType.MultipleChoiceQuestion
    | WebsocketType.QuestionTimerTick
    | WebsocketType.QuestionEnded
    | WebsocketType.QuestionAnswer
    | WebsocketType.Consequence
    | WebsocketType.ConsequenceEnded
    | WebsocketType.Ping;
  token: string;
};

export type WebsocketResponse = WebsocketMessage & {
  type:
    | WebsocketType.Error
    | WebsocketType.GameSetupAck
    | WebsocketType.GameJoinAck
    | WebsocketType.GameEndedAck
    | WebsocketType.QuestionAck
    | WebsocketType.QuestionTimerTickAck
    | WebsocketType.QuestionEndedAck
    | WebsocketType.ConsequenceAck
    | WebsocketType.ConsequenceEndedAck
    | WebsocketType.PlayerDisconnectAck
    | WebsocketType.Pong;
};
