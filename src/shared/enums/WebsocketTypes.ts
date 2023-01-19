export enum WebsocketType {
  // Requests
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
  Ping = 20,

  // Responses
  Error = 0,
  GameSetupAck = 2,
  GameJoinAck = 4,
  GameEndedAck = 6,
  QuestionAck = 9,
  QuestionTimerTickAck = 11,
  QuestionEndedAck = 13,
  ConsequenceAck = 16,
  ConsequenceEndedAck = 18,
  QuestionTimeOut = 19,
  PlayerDisconnectAck = 22,
  Pong = 21,
}
