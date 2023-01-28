/**
 * The format of a player as data in the system.
 * This is what the game and client would see, but may not be all relevant information about them.
 */
export type Player = {
  username: string;
  color: string;
  position: number;
};
