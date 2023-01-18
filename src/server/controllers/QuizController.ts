import { generateJWT } from "./AuthController";
import { readFile } from "node:fs/promises";

import Game from "../models/Game";
import User from "../models/User";

// Returns whether or not a user's answer to a question is correct.
export const validateAnswer = async (
  themePackName: string,
  questionID: number,
  userAnswer: string
) => {
  try {
    var themePack = JSON.parse(
      await readFile(`../themes/${themePackName}.json`, "utf-8")
    );
  } catch (error) {
    console.error(error);
    return false;
  }
  var potentialQuestions = themePack.questions.filter((q: any) => {
    return q.id == questionID;
  });
  if (potentialQuestions.length < 1) {
    console.error(
      `The specified question does not exist in the ${themePackName} theme pack.`
    );
    return false;
  }
  // Might be sketchy depending on whether the questions are always multiple choice.
  return userAnswer == potentialQuestions[0].answer;
};
