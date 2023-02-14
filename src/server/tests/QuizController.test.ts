/**
 * @file QuizController.test.ts
 * @author Mark Hutchison
 * Tests the quiz question and consequence generation functions.
 */
import MathUtil from "../../shared/util/MathUtil";
import {
  formatConsequence,
  formatQuestion,
  validateAnswer,
} from "../controllers/QuizController";

// Constants and Variables
const theme_pack = "test";

test("Fetch Question", async () => {
  let question = await formatQuestion(
    theme_pack,
    "Take Three",
    "Multiple Choice",
    []
  );
  expect(question.id).toEqual(1);
  expect(question.options).toHaveLength(4);
  expect(question.options).toContain("Parr");
  question = await formatQuestion(theme_pack, "Musical", "Multiple Choice", []);
  expect(question.id).toEqual(2);
  expect(question.options).toHaveLength(4);
  expect(question.options).toContain("Alice");
  question = await formatQuestion(
    theme_pack,
    "Miscellaneous",
    "Multiple Choice",
    []
  );
  expect(question.id).toEqual(3);
  expect(question.options).toHaveLength(4);
  expect(question.options).toContain("England");
});

test("Fetch Used Question", async () => {
  const categories = ["Take Three", "Musical", "Miscellaneous"];
  let used_questions = [];

  // I should be able to select questions at random infinite times and they will never be null
  for (let i = 0; i < 100; i++) {
    let category = MathUtil.choice(categories, 1) as string,
      question = await formatQuestion(
        theme_pack,
        category,
        "Multiple Choice",
        used_questions
      );
    expect(question).not.toBeNull();
    expect(question.options).toHaveLength(4);
    switch (category) {
      case "Take Three":
        expect(question.id).toEqual(1);
        expect(question.options).toContain("Parr");
        break;
      case "Musical":
        expect(question.id).toEqual(2);
        expect(question.options).toContain("Alice");
        break;
      case "Miscellaneous":
        expect(question.id).toEqual(3);
        expect(question.options).toContain("England");
        break;
    }
  }
});

test("Fetch Consequence", async () => {
  let used: number[] = [],
    unused: number[] = Array(8)
      .fill(0)
      .map((e, i) => i + 1);
  for (let i = 0; i < 8; i++) {
    let consequence = await formatConsequence(theme_pack, used);
    expect(consequence).not.toBeNull();
    expect(consequence.story).not.toBeNull();
    expect(consequence.id).toBeGreaterThan(consequence.consequenceType);
    used = used.concat(consequence.id);
    unused = unused.filter((id) => id !== consequence.id);
  }
});

test("Fetch Used Consequence", async () => {
  let used: number[] = [],
    unused: number[] = Array(8)
      .fill(0)
      .map((e, i) => i + 1);
  for (let i = 0; i < 8; i++) {
    let consequence = await formatConsequence(theme_pack, used);
    expect(consequence).not.toBeNull();
    expect(consequence.story).not.toBeNull();
    expect(consequence.id).toBeGreaterThan(consequence.consequenceType);
    used = used.concat(consequence.id);
    unused = unused.filter((id) => id !== consequence.id);
  }

  for (let i = 0; i < 100; i++) {
    let consequence = await formatConsequence(theme_pack, used);
    expect(consequence).not.toBeNull();
    expect(consequence.story).not.toBeNull();
    expect(consequence.id).toBeGreaterThan(consequence.consequenceType);
    used = used.concat(consequence.id);
    expect(used).toHaveLength(9 + i);
  }
});

test("Validate answer", async () => {});
