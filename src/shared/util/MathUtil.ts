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
   * Ensure a number remains within a minimum and maximum bound range.
   * @param {number} bound_a - One of two bounds for the value.
   * @param {number} bound_b - One of two bounds for the value.
   * @param {number} value - The value in which potentially could fall outside the bounds.
   * @returns {number} A value constrained within the bounds provided.
   */
  public static bound(bound_a: number, bound_b: number, value: number): number {
    let min = Math.min(bound_a, bound_b),
      max = Math.max(bound_a, bound_b);
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Shuffle an array of values.
   * @param {Array<T>} arr - The original array.
   * @returns {Array<T>} The shuffled array.
   */
  public static shuffle<T>(arr: Array<T>): Array<T> {
    return arr
      .map((value) => ({
        value,
        sort: Math.random(),
      }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  /**
   * Return random entity from an array of choices.
   * @param {Array<T>} choices - Options to choose from.
   * @returns {T} The randomly selected option from the array.
   */
  public static choice<T>(choices: Array<T>, amount: number = 1): Array<T> {
    console.log(`[MU] Selecting ${amount} Choice(s) from: ${choices}`);
    let randomized_arr = this.shuffle(choices);
    let selectedArr = randomized_arr.slice(0, amount);
    console.log(`[MU] Selecting Choice: ${selectedArr}`);
    return selectedArr;
  }
}
