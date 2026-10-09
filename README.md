# soundex

Computes a four-character Soundex phonetic code for an English word, using the classic Knuth/Census rules.

```js
import { soundex } from './src/index.js';

soundex('Robert');   // 'R163'
soundex('Rupert');   // 'R163'
soundex('Ashcraft'); // 'A261'
soundex('');         // '0000'
```

## Why this exists

Soundex clusters names that sound alike into a shared code, so "Robert" and "Rupert" collide. It is cheap, deterministic, and good enough for genealogy and fuzzy name search where a full phonetic model is overkill. The trade-off is coarseness: many distinct names share a code, and the algorithm is tuned for English surnames.

## Interpretation chosen

The divisive Soundex rule is how H and W behave between two letters that map to the same digit. We follow the **Knuth** interpretation: H and W are transparent to a run, so `Pf`, `gh`, etc. collapse to a single digit even when an H or W sits between the letters. The Census variant instead treats H and W as separators. Pick the one your data expects; this library does Knuth.

## Awkward edges

- Non-alphabetic characters (apostrophes, hyphens, periods) are silently skipped, so `O'Brien` and `OBrien` agree.
- Empty or whitespace-only input returns `0000` rather than throwing.
- The first letter is always retained as-is (uppercased); its own digit is suppressed from the body, so `Pfister` is `P236`, not `P136`.
- Input is uppercased internally; the original case does not affect the result.

## Exports

- `soundex(word: string): string` — the sole function, from `src/index.js`.
