/**
 * Class containing math utility functions.
 */
export default class MathUtil {
  /**
   * Generate a random integer between 2 integral bounds, inclusive.
   * @param {number} a - Lower bound, rounded down if not integral.
   * @param {number} b - Upper bound, rounded down if not integral.
   * @returns A random integer between a and b, inclusive.
   */
  public static randInt(a: number, b: number): number {
    let min = Math.floor(a < b ? a : b),
      max = Math.floor(b > a ? b : a);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Return random entity from an array of choices.
   * @param {Array<T>} choices - Options to choose from.
   * @returns {T} The randomly selected option from the array.
   */
  public static choice<T>(choices: Array<T>): T {
    return choices[this.randInt(0, choices.length - 1)];
  }
}
