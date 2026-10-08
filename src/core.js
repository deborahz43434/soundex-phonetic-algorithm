/**
 * Soundex phonetic algorithm implementation.
 *
 * Uses the classic four-character form (one letter prefix + three digits).
 * The chosen ruleset is the Knuth/Census "American Soundex":
 *
 *   - Retain the first letter unchanged.
 *   - Map remaining letters to digits via the standard table.
 *   - Two adjacent letters that map to the same digit collapse to a single
 *     digit, even across an intervening H or W. (This is the divisive
 *     Knuth rule; the Census variant treats H/W as invisible separators.)
 *     We commit to the Knuth interpretation because it is the one widely
 *     cited in algorithm references and is simpler to implement without
 *     special-casing.
 *   - Letters separated by a vowel or by H/W *between different digits*
 *     do not collapse.
 *   - Drop the first letter's own digit from the output if it would appear
 *     there (handled by not encoding the first letter's body).
 *   - Pad with zeros to length 4; truncate to 4 if longer.
 *   - Non-alphabetic characters are skipped entirely.
 *   - Empty/whitespace input returns "0000".
 *
 * @param {string} word - Word to encode.
 * @returns {string} Four-character Soundex code.
 */
export function soundex(word) {
  if (typeof word !== 'string') {
    throw new TypeError('soundex expects a string');
  }

  const digit = {
    b: '1', f: '1', p: '1', v: '1',
    c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
    d: '3', t: '3',
    l: '4',
    m: '5', n: '5',
    r: '6',
  };

  // Uppercase once for uniform handling; vowels/semivowels are treated as
  // separators (they break same-digit runs) but themselves encode to nothing.
  const upper = word.toUpperCase();
  const letters = [];
  for (const ch of upper) {
    if (ch >= 'A' && ch <= 'Z') letters.push(ch);
  }
  if (letters.length === 0) return '0000';

  let code = letters[0];
  let prev = digit[letters[0].toLowerCase()] || '';

  for (let i = 1; i < letters.length && code.length < 4; i++) {
    const letter = letters[i];
    const d = digit[letter.toLowerCase()] || '';
    // Skip H and W: they do not break a run but also contribute no digit.
    // Vowels (A E I O U Y) break a run: they reset prev to '' so the next
    // consonant's digit is emitted even if it matches the pre-vowel digit.
    if (letter === 'H' || letter === 'W') {
      continue;
    }
    if (d === '') {
      prev = '';
      continue;
    }
    if (d !== prev) {
      code += d;
      prev = d;
    }
  }

  while (code.length < 4) code += '0';
  return code;
}
