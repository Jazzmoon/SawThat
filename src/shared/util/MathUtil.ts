/**
 * Class containing math utility functions.
 */
export default class MathUtil {
  /**
   * @param a Lower bound, rounded down if not integral.
   * @param b Upper bound, rounded down if not integral.
   * @returns A random integer between a and b.
   */
  public static randInt(a: number, b: number) {
    var min = Math.floor(a < b ? a : b);
    var max = Math.floor(b > a ? b : a);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
