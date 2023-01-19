import { generateJWT } from "./AuthController";
import { readFile } from "node:fs/promises";

import Game from "../models/Game";
import User from "../models/User";
import StringUtil from "../../shared/util/StringUtil";
import MathUtil from "../../shared/util/MathUtil";

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
    console.error(`Theme pack not found: ${error}`);
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

// Fetches a random question from the given theme pack, formatted for display.
export const formatQuestion = async (
  themePackName: string,
  questionType: string
) => {
  try {
    var themePack = JSON.parse(
      await readFile(`../themes/${themePackName}.json`, "utf-8")
    );
  } catch (error) {
    console.error(`Theme pack not found: ${error}`);
    return;
  }
  if (
    !themePack.questions[questionType] ||
    themePack.questions[questionType].length < 1
  ) {
    console.error(
      "The desired theme pack/category combination has no questions."
    );
    return;
  }
  var questionList = themePack.questions[questionType];
  var questionIndex: number = MathUtil.randInt(0, questionList.length);
  var questionData = questionList[questionIndex];
  var numClues: number = StringUtil.occurrences(questionData.question, "<_>");
  var ansPosition: number = MathUtil.randInt(0, numClues);
  var prompt: string = questionData.question;
  var clues: Array<string> = [];
  for (var i = 0; i < numClues; i++) {
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

  return {
    prompt,
    clues,
    media_type: questionData.media_type,
    media_url: questionData.media_url,
  };
};
