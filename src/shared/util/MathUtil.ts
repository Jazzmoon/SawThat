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
  public static choice<T>(choices: Array<T>, amount: number = 1): Array<T> | T {
    let randomized_arr = this.shuffle(choices);
    return amount === 1 ? randomized_arr[0] : choices.splice(0, amount);
  }
}
