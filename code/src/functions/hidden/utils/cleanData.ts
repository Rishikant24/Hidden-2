/**
 * Parses a JSON string and returns the parsed object if valid JSON is found.
 * @param inputString The input string to check for valid JSON.
 * @returns The parsed JSON object if valid JSON is found, otherwise null.
 */
export function checkJSON(inputString: string | null) {
  if (inputString === null) return null;

  const startIndex = inputString.indexOf('{');
  const endIndex = inputString.lastIndexOf('}');

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return JSON.parse(inputString.substring(startIndex, endIndex + 1));
  }

  return null;
}
