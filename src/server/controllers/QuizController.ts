/**
 * @file QuizController.ts
 * @author Luna Yao
 * Handles any logic for generating trivia content for the game.
 * This module handles the interaction between the Themes module
 * and the remainder of the system.
 */
import { readFile, readdir } from "fs/promises";
import { resolve } from "path";

import { Consequence } from "../../shared/types/Consequence";
import { Question } from "../../shared/types/Question";

import MathUtil from "../../shared/util/MathUtil";

/**
 * Returns whether or not a user's answer to a question is correct.
 * @param {string} themePackName - Name of the Theme Pack file in which a question needs to be validated against.
 * @param {string} questionID - The specific question id within that question file.
 * @param {string} questionCategory - The category in which the question can be found in.
 * @param {string} userAnswer - The user answer to the question, in which needs to be validated.
 * @param {string | undefined} questionType - The specific type of question asked, if known.
 * @returns {Promise<boolean>}
 */
export const validateAnswer = async (
  themePackName: string,
  questionID: number,
  questionCategory: string,
  userAnswer: string,
  questionType?: string
): Promise<boolean> => {
  // Read file located at ../themes/disney.json
  const theme_path: string = resolve(
    __dirname,
    "..",
    "themes",
    `${themePackName}.json`
  );
  return readFile(theme_path, "utf-8")
    .then((fstream) => {
      let themePack = JSON.parse(fstream);
      // Find question
      let question = questionType
        ? themePack.questions[questionCategory].find(
            (q: Question) =>
              q.id === questionID && q.question_type === questionType
          )
        : themePack.questions[questionCategory].find(
            (q: Question) => q.id === questionID
          );
      if (!question)
        return Promise.reject(
          `No question in ${questionCategory} has ID number ${questionID}.`
        );
      return Promise.resolve(question.answer === userAnswer);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * Fetches a random question from the given theme pack, formatted for display.
 * @param {string} theme_pack_name - Name of the Theme Pack file in which a question is being generated for.
 * @param {string} category - The name of the category that the question must belong to.
 * @param {string} question_type - Denotes whether the question is multiple choice or text.
 * @param {Array<number>} used_questions - A list of question ids in which have already been used by the game.
 * @returns {Promise<{ question: string, prompt: string[], media_type: string, media_url: string }>} Formatted question data, loaded from file.
 */
export const formatQuestion = async (
  theme_pack_name: string,
  category: string,
  question_type: "Multiple Choice" | "Text Question",
  used_questions: number[]
): Promise<{
  id: number;
  question: string;
  options: string[];
  media_type: "image" | "video" | null;
  media_url: string | null;
}> => {
  // Read file located at ../themes/disney.json
  const theme_path: string = resolve(
    __dirname,
    "..",
    "themes",
    `${theme_pack_name}.json`
  );

  return readFile(theme_path, "utf-8")
    .then((fstream) => {
      let themePack = JSON.parse(fstream);
      if (
        !themePack.questions[category] ||
        themePack.questions[category].length < 1
      )
        return Promise.reject(
          new Error(
            "The desired theme pack/category combination has no questions."
          )
        );

      // Prepare a list of legal questions that can be asked
      let question_ids: number[] = themePack.questions[category]
        .filter(
          (q: Question) =>
            !used_questions.includes(q.id) && q.question_type === question_type
        )
        .map((q: Question) => q.id);

      // All questions asked, allow repeats.
      if (question_ids.length === 0)
        question_ids = themePack.questions[category]
          .filter((q: Question) => q.question_type === question_type)
          .map((q: Question) => q.id);
      console.log(`[QC] Selecting Question Options: ${question_ids}`);

      // Choose random question from list to ask:
      const question_id: number = MathUtil.choice(question_ids, 1)[0];
      let question: Question = themePack.questions[category].find(
        (q: Question) => q.id === question_id
      );
      console.log(`[QC] Preparing Question: ${JSON.stringify(question)}`);

      // Plug clues into string where ever there is a "<_>" delimiter
      let number_clues = (question.question.match(/<_>/g) || []).length,
        clues: string[] = [];

      if (question.clue_list.includes(question.answer)) {
        number_clues -= 1;
        clues = [question.answer];
      }

      console.log(`[QC] -------- BEFORE: ${clues}`);
      const otherClues = MathUtil.choice(
        question.clue_list.filter((c) => c !== question.answer),
        number_clues
        );
      console.log(`[QC] -------- DURING: ${clues}`);
      const joinedClues = clues.concat(otherClues);
      console.log(`[QC] -------- AFTER: ${clues}`);
      clues = MathUtil.shuffle(joinedClues);
      console.log(`[QC] Preparing Clue List: ${clues}`);

      let question_text = question.question;
      for (let i = 0; i < number_clues; i++)
        question_text = question_text.replace(/<_>/, clues[i]);

      // Choose 4 answers to provide to user
      // ASSUMPTION: Fake answers is populated with 3 or more options.
      const answers = MathUtil.shuffle(
        [question.answer].concat(MathUtil.choice(question.fake_answers, 3))
      );
      console.log(`[QC] Selecting Fake Answer Options: ${answers}`);

      return Promise.resolve({
        id: question.id,
        question: question_text,
        options: answers,
        media_type: question.media_type,
        media_url: question.media_url,
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * Generate a consequence for the game.
 * @param {string} theme_pack_name - The name of the theme pack file.
 * @param {number} used_consequences - List of already used consequence ids.
 * @returns {Promise<Consequence>} The consequence fetched for the game.
 */
export const formatConsequence = async (
  theme_pack_name: string,
  used_consequences: number[]
): Promise<Consequence> => {
  // Read file located at ../themes/disney.json
  const theme_path: string = resolve(
    __dirname,
    "..",
    "themes",
    `${theme_pack_name}.json`
  );

  return readFile(theme_path, "utf-8")
    .then((fstream) => {
      let themePack = JSON.parse(fstream);
      if (!themePack.consequences || themePack.consequences.length < 1) {
        return Promise.reject("The desired theme pack has no consequnces.");
      }

      // All consequences given, allow repeats.
      let consequences: Consequence[] = themePack.consequences.filter(
        (c: Consequence) => !used_consequences.includes(c.id)
      ) as Consequence[];
      if (consequences.length === 0)
        consequences = themePack.consequences as Consequence[];
      console.log(`[QC] Selecting Consequence Options: ${consequences}`);

      // Pick random consequence
      let consequence = MathUtil.choice(consequences, 1)[0];
      console.log(`[QC] Selecting Consequence: ${consequence}`);

      return Promise.resolve(consequence);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * Gets a list of all available theme pack options for the game.
 * @returns {Promise<string[]>} A list of all available theme packs.
 */
export const getThemePacks = async (): Promise<string[]> => {
  const theme_path: string = resolve(__dirname, "..", "themes");
  return readdir(theme_path)
    .then((files) => {
      return Promise.resolve(
        files
          .filter((file) => file.includes(".json") && !file.includes("test"))
          .map((file) => file.replace(".json", ""))
      );
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
