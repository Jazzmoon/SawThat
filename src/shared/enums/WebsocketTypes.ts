/**
 * @file WebsocketTypes.ts
 * @author Mark Hutchison
 * An enum that details the exact options allowed within the websocket "type" field.
 */
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
  GameStart = 23,
  NextPlayer = 22,

  // Responses
  Error = 0,
  GameSetupAck = 2,
  GameJoinAck = 4,
  GameStartAck = 24,
  GameEndedAck = 6,
  QuestionAck = 9,
  QuestionTimerTickAck = 11,
  QuestionEndedAck = 13,
  ConsequenceAck = 16,
  ConsequenceEndedAck = 18,
  QuestionTimeOut = 19,
  PlayerDisconnectAck = 22,
  NextPlayerAck = 25,
  Pong = 21,
}
