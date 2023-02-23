/**
 * @file QuizController.test.ts
 * @author Mark Hutchison
 * Tests the quiz question and consequence generation functions.
 */
import MathUtil from "../../shared/util/MathUtil";
import {
  formatConsequence,
  formatQuestion,
  getThemePacks,
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

describe("Validate Answer", () => {
  test("Correct answers", () => {
    expect(
      validateAnswer(theme_pack, 1, "Take Three", "Parr", "Multiple Choice")
    ).resolves.toBe(true);
    expect(
      validateAnswer(theme_pack, 2, "Musical", "Alice", "Multiple Choice")
    ).resolves.toBe(true);
    expect(
      validateAnswer(
        theme_pack,
        3,
        "Miscellaneous",
        "England",
        "Multiple Choice"
      )
    ).resolves.toBe(true);
  });
  test("Incorrect answers", () => {
    for (let user_answer in [
      "Peterson",
      "Phillips",
      "Parker",
      "Perry",
      "Powell",
      "Patterson",
      "Porter",
      "Palmer",
      "Peters",
      "Price",
      "Pierce",
      "Payne",
    ])
      expect(
        validateAnswer(
          theme_pack,
          1,
          "Take Three",
          user_answer,
          "Multiple Choice"
        )
      ).resolves.toBe(false);

    for (let user_answer in [
      "Anna",
      "Ariel",
      "Aurora",
      "Belle",
      "Cinderella",
      "Dot",
      "Elsa",
      "Merida",
      "Mulan",
      "Snow White",
      "Tiana",
    ])
      expect(
        validateAnswer(theme_pack, 2, "Musical", user_answer, "Multiple Choice")
      ).resolves.toBe(false);

    for (let user_answer in ["America", "France", "Germany", "Spain"])
      expect(
        validateAnswer(
          theme_pack,
          3,
          "Miscellaneous",
          user_answer,
          "Multiple Choice"
        )
      ).resolves.toBe(false);
  });
  test("Invalid id-category combos", () => {
    for (let i = 2; i < 10; i++)
      expect(
        validateAnswer(theme_pack, i, "Take Three", "Parr", "Multiple Choice")
      ).rejects.toBe(`No question in Take Three has ID number ${i}.`);
    for (let i = 3; i < 10; i++)
      expect(
        validateAnswer(theme_pack, i, "Musical", "Alice", "Multiple Choice")
      ).rejects.toBe(`No question in Musical has ID number ${i}.`);
    for (let i = 4; i < 10; i++)
      expect(
        validateAnswer(
          theme_pack,
          i,
          "Miscellaneous",
          "England",
          "Multiple Choice"
        )
      ).rejects.toBe(`No question in Miscellaneous has ID number ${i}.`);
  });
});

test("Fetch theme packs", async () => {
  // This test case must be updated if the number of theme packs changes
  let theme_packs = await getThemePacks();
  expect(theme_packs).toHaveLength(2);
  expect(theme_packs).toContain("disney");
  expect(theme_packs).toContain("test");
});
