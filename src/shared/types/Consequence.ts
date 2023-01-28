import { ConsequenceType } from "../enums/ConsequenceType";

/**
 * The format of a consequence card as data in the system.
 */
export type Consequence = {
  id: number;
  story: string;
  consequenceType: ConsequenceType;
  timerLength?: number;
};
