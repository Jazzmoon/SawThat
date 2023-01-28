import { Player } from "./Player";

/**
 * The format of a game object as data in the system.
 * This is what the game and client would see, but may not be all relevant information about them.
 */
export type Game = {
  game_code: string;
  board: Player[];
  used_questions: number[];
  used_consequences: number[];
};
