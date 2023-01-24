/**
 * @file QuizController.ts
 * @author Luna Yao
 * Handles any logic for generating trivia content for the game.
 * This module handles the interaction between the Themes module
 * and the remainder of the system.
 */
import { readFile } from "fs/promises";
import { resolve } from "path";

import { Question } from "../../shared/types/Question";

import StringUtil from "../../shared/util/StringUtil";
import MathUtil from "../../shared/util/MathUtil";

/**
 * Returns whether or not a user's answer to a question is correct.
 * @param {string} themePackName - Name of the Theme Pack file in which a question needs to be validated against.
 * @param {string} questionID - The specific question id within that question file.
 * @param {string} userAnswer - The user answer to the question, in which needs to be validated.
 * @returns {Promise<boolean>}
 */
export const validateAnswer = async (
  themePackName: string,
  questionID: number,
  userAnswer: string
): Promise<boolean> => {
  // Read file located at ../themes/disney.json
  const theme_path: string = resolve(
    __dirname,
    "..",
    "themes",
    `${themePackName}.json`
  );
  console.log("[QC] Trying theme pack:", theme_path);
  try {
    var themePack = JSON.parse(await readFile(theme_path, "utf-8"));
  } catch (error) {
    return Promise.reject(`Theme pack not found: ${error}`);
  }
  var potentialQuestions = themePack.questions.filter((q: any) => {
    return q.id == questionID;
  });
  if (potentialQuestions.length < 1) {
    return Promise.reject(
      new Error(
        `The specified question does not exist in the ${themePackName} theme pack.`
      )
    );
  }
  // Might be sketchy depending on whether the questions are always multiple choice.
  return Promise.resolve(userAnswer == potentialQuestions[0].answer);
};

/**
 * Fetches a random question from the given theme pack, formatted for display.
 * @param {string} theme_pack_name - Name of the Theme Pack file in which a question is being generated for.
 * @param {string} category - The name of the category that the question must belong to.
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

      // Choose random question from list to ask:
      let question: Question = themePack.questions[category].find(
        (q: Question) => q.id === MathUtil.choice(question_ids, 1)
      );

      // Plug clues into string where ever there is a "<_>" delimiter
      let number_clues = (question.question.match(/<_>/g) || []).length,
        clues: string[] = [];

      if (question.clue_list.includes(question.answer)) {
        number_clues -= 1;
        clues = [question.answer];
      }

      clues = MathUtil.shuffle(
        clues.concat(
          MathUtil.choice(
            question.clue_list.filter((c) => c !== question.answer),
            number_clues
          )
        )
      );

      let question_text = question.question;
      for (let i = 0; i < number_clues; i++)
        question_text = question_text.replace(/<_>/, clues[i]);

      // Choose 4 answers to provide to user
      // ASSUMPTION: Fake answers is populated with 3 or more options.
      const answers = MathUtil.shuffle(
        [question.answer].concat(MathUtil.choice(question.fake_answers, 3))
      );

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
