import { ConsequenceType } from "../enums/ConsequenceType";

type Timed = {
  timer_start: Date;
  timer_length: number;
};

type MultipleChoice = {
  id: number;
  category: string;
  question_type: "Multiple Choice";
  question: string;
  options: string[];
  media_type?: "image" | "video" | null;
  media_url?: string | null;
} & Timed;

type TextQuestion = {
  id: number;
  category: string;
  question_type: "Text";
  question: string;
} & Timed;

type Consequence = {
  id: number;
  consequence_type: ConsequenceType;
  story: string;
  spaces?: number;
} & Timed;

type GameEndAck = {
  ranking: {
    username: string;
    final_ranking: number;
  }[];
};

type QuestionEnded = {
  players: {
    username: string;
    color: string;
    position: number;
  }[];
};

type QuestionAnswer = {
  id: number;
  answer: string;
};
