import { Player } from "./Player";

export type Game = {
  game_code: string;
  board: Player[];
  used_questions: number[];
  used_consequences: number[];
};
