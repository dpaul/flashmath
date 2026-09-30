import { describe, it, expect } from 'vitest';
import { computeSpellingDiff } from './spellingDiff';

describe('computeSpellingDiff', () => {
  it('identifies exact matches with 0 distance and no errors', () => {
    const result = computeSpellingDiff('dictate', 'dictate');
    expect(result.distance).toBe(0);
    expect(result.hasErrors).toBe(false);
    expect(result.summary.matches).toBe(7);
    expect(result.summary.substitutions).toBe(0);
    expect(result.summary.insertions).toBe(0);
    expect(result.summary.deletions).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('handles case-insensitivity gracefully', () => {
    const result = computeSpellingDiff('DiCtAtE', 'dictate');
    expect(result.distance).toBe(0);
    expect(result.hasErrors).toBe(false);
    expect(result.summary.matches).toBe(7);
  });

  it('detects a transformed letter (substitution)', () => {
    const result = computeSpellingDiff('dictater', 'dictator');
    expect(result.distance).toBe(1);
    expect(result.hasErrors).toBe(true);
    expect(result.summary.substitutions).toBe(1);
    expect(result.summary.insertions).toBe(0);
    expect(result.summary.deletions).toBe(0);
    expect(result.summary.matches).toBe(7);

    const sub = result.errors.find((e) => e.type === 'transformed');
    expect(sub).toBeDefined();
    expect(sub?.userChar).toBe('e');
    expect(sub?.targetChar).toBe('o');
  });

  it('detects an added letter (user inserted extra character)', () => {
    const result = computeSpellingDiff('auditiion', 'audition');
    expect(result.distance).toBe(1);
    expect(result.hasErrors).toBe(true);
    expect(result.summary.insertions).toBe(1);
    expect(result.summary.substitutions).toBe(0);
    expect(result.summary.deletions).toBe(0);

    const added = result.errors.find((e) => e.type === 'added');
    expect(added).toBeDefined();
    expect(added?.userChar).toBe('i');
  });

  it('detects a removed letter (user omitted character)', () => {
    const result = computeSpellingDiff('visble', 'visible');
    expect(result.distance).toBe(1);
    expect(result.hasErrors).toBe(true);
    expect(result.summary.deletions).toBe(1);
    expect(result.summary.insertions).toBe(0);
    expect(result.summary.substitutions).toBe(0);

    const removed = result.errors.find((e) => e.type === 'removed');
    expect(removed).toBeDefined();
    expect(removed?.targetChar).toBe('i');
  });

  it('detects multiple errors including added, removed, and transformed letters', () => {
    // Target: "dictionary"
    // User typed: "diktionary" -> 'k' instead of 'c' (transformed)
    const result1 = computeSpellingDiff('diktionary', 'dictionary');
    expect(result1.summary.substitutions).toBe(1);
    expect(result1.summary.insertions).toBe(0);
    expect(result1.summary.deletions).toBe(0);

    // Target: "invisible"
    // User typed: "invisable" -> 'a' instead of 'i' (transformed)
    const result2 = computeSpellingDiff('invisable', 'invisible');
    expect(result2.summary.substitutions).toBe(1);
    expect(result2.errors[0].userChar).toBe('a');
    expect(result2.errors[0].targetChar).toBe('i');

    // Target: "laudable"
    // User typed: "laudbale"
    const result3 = computeSpellingDiff('laudbale', 'laudable');
    expect(result3.hasErrors).toBe(true);
    expect(result3.distance).toBe(2);
  });

  it('correctly handles empty or whitespace input', () => {
    const result = computeSpellingDiff('', 'vision');
    expect(result.distance).toBe(6);
    expect(result.summary.deletions).toBe(6);
    expect(result.summary.matches).toBe(0);
    expect(result.hasErrors).toBe(true);
  });

  it('produces an aligned sequence matching total operations', () => {
    const result = computeSpellingDiff('audtor', 'auditor');
    expect(result.aligned.length).toBe(7);
    const deletedSlot = result.aligned.find((a) => a.type === 'delete');
    expect(deletedSlot).toBeDefined();
    expect(deletedSlot?.userChar).toBeNull();
    expect(deletedSlot?.targetChar).toBe('i');
  });
});
