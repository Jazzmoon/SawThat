/**
 * @file QuizController.ts
 * @author Luna Yao
 * Handles any logic for generating trivia content for the game.
 * This module handles the interaction between the Themes module
 * and the remainder of the system.
 */
import { readFile } from "node:fs/promises";

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
  try {
    var themePack = JSON.parse(
      await readFile(`../themes/${themePackName}.json`, "utf-8")
    );
  } catch (error) {
    return Promise.reject(new Error(`Theme pack not found: ${error}`));
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
 * @param {string} themePackName - Name of the Theme Pack file in which a question is being generated for.
 * @param {string} questionType - The name of the category that the question must belong to.
 * @returns {Promise<{ question: string, prompt: string[], media_type: string, media_url: string }>} Formatted question data, loaded from file.
 */
export const formatQuestion = async (
  themePackName: string,
  questionType: string
): Promise<{
  question: string;
  options: string[];
  media_type?: string;
  media_url?: string;
}> => {
  try {
    var themePack = JSON.parse(
      await readFile(`../themes/${themePackName}.json`, "utf-8")
    );
  } catch (error) {
    return Promise.reject(new Error(`Theme pack not found: ${error}`));
  }
  if (
    !themePack.questions[questionType] ||
    themePack.questions[questionType].length < 1
  ) {
    return Promise.reject(
      new Error("The desired theme pack/category combination has no questions.")
    );
  }
  var questionList = themePack.questions[questionType],
    questionIndex: number = MathUtil.randInt(0, questionList.length),
    questionData = questionList[questionIndex],
    numClues: number = StringUtil.occurrences(questionData.question, "<_>"),
    ansPosition: number = MathUtil.randInt(0, numClues),
    prompt: string = questionData.question,
    clues: Array<string> = [];
  for (let i = 0; i < numClues; i++) {
    var chosenClue: string;
    if (questionData.clues.includes(questionData.answer)) {
      chosenClue =
        ansPosition == i
          ? questionData.answer
          : questionData.fake_answers[
              MathUtil.randInt(0, questionData.fake_answers.length)
            ];
    } else {
      chosenClue =
        questionData.clues[MathUtil.randInt(0, questionData.clues.length)];
    }
    prompt = prompt.replace("<_>", chosenClue);
    clues.push(chosenClue);
  }

  return Promise.resolve({
    question: prompt,
    options: clues,
    media_type: questionData.media_type,
    media_url: questionData.media_url,
  });
};
