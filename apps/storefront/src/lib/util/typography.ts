/**
 * Typography helpers for editorial polish.
 * - smartQuotes: converts straight "quotes" → curly “quotes” and 'apostrophes' → ’apostrophes’
 *   Safe to run on any string; idempotent on already-curly text.
 * - smartDashes: converts -- → — (em dash) for Markdown/CMS content authored with ASCII.
 */

export function smartQuotes(input: string): string {
  if (!input) return input
  return input
    // Double quotes: pairs (open → close)
    .replace(/(^|[\s(\[{—\-])"(\S)/g, "$1\u201C$2") // opening "
    .replace(/"/g, "\u201D") // remaining " → closing ”
    // Single quotes / apostrophes
    .replace(/(^|[\s(\[{])'(\S)/g, "$1\u2018$2") // opening ‘
    .replace(/'/g, "\u2019") // remaining ' → ’ (covers apostrophes too)
}

export function smartDashes(input: string): string {
  if (!input) return input
  return input
    .replace(/--/g, "\u2014") // em dash
}

export function smartTypography(input: string): string {
  return smartQuotes(smartDashes(input))
}
