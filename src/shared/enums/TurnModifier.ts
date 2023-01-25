/**
 * @file QuestionCategory.ts
 * @author Mark Hutchison
 * An enum that details the exact options for the turn modifiers for special squares on the board.
 */

/**
 * An enum detailing the exact options for position modifiers.
 */
export enum TurnModifier {
  Normal = 0,
  DoubleFeature = 1,
  AllPlayToWin = 2,
  FinalCut3 = 3,
  FinalCut2 = 4,
  FinalCut1 = 5,
  Winner = 6,
}
