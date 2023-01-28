/**
 * @file Question.ts
 * @author Mark Hutchison
 * A file that details the typing information for trivia questions.
 */

/**
 * The format of a question as data in the system.
 */
export type Question = {
  id: number;
  question_type: "Multiple Choice" | "Text Question";
  question: string;
  answer: string;
  clue_list: string[];
  fake_answers: [];
  media_type: "image" | "video" | null;
  media_url: string | null;
};
