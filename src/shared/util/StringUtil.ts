/**
 * Class containing string utility functions.
 */
export default class StringUtil {
  /**
   * Counts and returns the number of occurrences of the given term in the given string.
   * Does not escape any regex special characters in the given term.
   * @param s String to search.
   * @param term Term to count.
   */
  public static occurrences(s: string, term: string) {
    var matchArray = s.match(`/${term}/g`);
    return matchArray ? matchArray.length : 0;
  }
}
