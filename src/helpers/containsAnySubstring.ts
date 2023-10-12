/**
 * Checks if any string in the first array is part of a string in the second array.
 *
 * @param array1 The first array of strings.
 * @param array2 The second array of strings.
 * @returns A boolean value indicating whether any string in the first array is part of a string in the second array.
 * @source google bard
 */
export default function containsAnySubstring(
  array1: string[],
  array2: string[],
): boolean {
  for (const string2 of array1) {
    for (const string1 of array2) {
      if (string1.includes(string2)) {
        return true;
      }
    }
  }
  return false;
}
