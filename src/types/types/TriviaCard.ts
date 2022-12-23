export type TriviaCard = {
  id: number;
  answer: string;
  clue_list: string[];
  mediaType?: string;
  mediaURL?: string;
  timerLength?: number;
};
