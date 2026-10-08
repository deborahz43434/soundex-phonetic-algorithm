import { test } from 'node:test';
import assert from 'node:assert/strict';
import { soundex } from '../src/index.js';

test('classic examples match the canonical table', () => {
  assert.equal(soundex('Robert'), 'R163');
  assert.equal(soundex('Rupert'), 'R163');
  assert.equal(soundex('Ashcraft'), 'A261');
  assert.equal(soundex('Tymczak'), 'T522');
  assert.equal(soundex('Pfister'), 'P236');
  assert.equal(soundex('Honeyman'), 'H555');
});

test('identical-sounding names share a code', () => {
  assert.equal(soundex('Robert'), soundex('Rupert'));
});

test('case is normalised', () => {
  assert.equal(soundex('robert'), 'R163');
  assert.equal(soundex('ROBERT'), 'R163');
  assert.equal(soundex('rObErT'), 'R163');
});

test('code is padded to four characters', () => {
  assert.equal(soundex('B'), 'B000');
  assert.equal(soundex('Ba'), 'B000');
  assert.equal(soundex('Bad'), 'B300');
});

test('code is truncated at four characters', () => {
  assert.equal(soundex('Ashcraft').length, 4);
  assert.equal(soundex('Tymczak').length, 4);
});

test('empty and whitespace-only input returns zeros', () => {
  assert.equal(soundex(''), '0000');
  assert.equal(soundex('   '), '0000');
  assert.equal(soundex('\t\n'), '0000');
});

test('non-alphabetic characters are skipped', () => {
  assert.equal(soundex("O'Brien"), 'O165');
  assert.equal(soundex('Saint-Clair'), soundex('SaintClair'));
  assert.equal(soundex('R.E. Lee'), soundex('RELee'));
});

test('first letter digit is suppressed when it would duplicate', () => {
  // "Pfister": P and F both map to 1; the leading P is kept as the letter
  // and its digit is not emitted, so the run starts fresh at F -> 1, S -> 2,
  // T -> 3. Result P236.
  assert.equal(soundex('Pfister'), 'P236');
});

test('adjacent same-digit letters collapse across H and W', () => {
  // Knuth rule: H/W do not break a run. "Hughes" -> H, then (u separates),
  // g=2, h invisible (keeps run), e resets, s=2 -> H220.
  assert.equal(soundex('Hughes'), 'H220');
});

test('letters separated by a vowel do not collapse', () => {
  // "Robert": R, o (reset), b=1, e (reset), r=6, t=3 -> R163.
  assert.equal(soundex('Robert'), 'R163');
  assert.equal(soundex('Tymczak'), 'T522');
});

test('non-string input throws TypeError', () => {
  assert.throws(() => soundex(42), TypeError);
  assert.throws(() => soundex(null), TypeError);
  assert.throws(() => soundex(undefined), TypeError);
});
