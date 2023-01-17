export enum WebsocketType {
  // Requests
  Error = 0,
  GameSetup = 1,
  GameJoin = 3,
  GameEnded = 5,
  TextQuestion = 7,
  MultipleChoiceQuestion = 8,
  QuestionTimerTick = 10,
  QuestionEnded = 12,
  QuestionAnswer = 14,
  Consequence = 15,
  ConsequenceEnded = 17,
  Pong = 21,

  // Responses
  GameSetupAck = 2,
  GameJoinAck = 4,
  GameEndedAck = 6,
  QuestionAck = 9,
  QuestionTimerTickAck = 11,
  QuestionEndedAck = 13,
  ConsequenceAck = 16,
  ConsequenceEndedAck = 18,
  QuestionTimeOut = 19,
  Ping = 20,
}

export interface WebsocketMessage {
  type: WebsocketType;
  data: any; // TODO define predefined types for data and then make WebsocketMessage type generic. It will help a lot in the client
}

export interface WebsocketRequest extends WebsocketMessage {
  token: string;
}
