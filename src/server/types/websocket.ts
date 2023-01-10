export enum WebsocketType {
  Error = 0,
  GameSetup = 1,
  GameSetupAck = 2,
  GameJoin = 3,
  GameJoinAck = 4,
  GameEnded = 5,
  GameEndedAck = 6,
  TextQuestion = 7,
  MultipleChoiceQuestion = 8,
  QuestionAck = 9,
  QuestionTimerTick = 10,
  QuestionTimerTickAck = 11,
  QuestionEnded = 12,
  QuestionEndedAck = 13,
  QuestionAnswer = 14,
  Consequence = 15,
  ConsequenceAck = 16,
  ConsequenceEnded = 17,
  ConsequenceEndedAck = 18,
  QuestionTimeOut = 19,
}

export interface WebsocketMessage {
  Type: WebsocketType;
  Data: any;
}
