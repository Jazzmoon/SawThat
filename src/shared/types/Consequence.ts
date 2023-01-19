import { ConsequenceType } from "../enums/ConsequenceType";

export type Consequence = {
  id: number;
  story: string;
  consequenceType: ConsequenceType;
  timerLength?: number;
};
