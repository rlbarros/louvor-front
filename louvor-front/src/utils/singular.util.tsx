export default function singularFromPlural(word: string): string {
  if (word.endsWith("s")) {
    return word.substring(0, word.length - 1);
  }
  return word;
}
