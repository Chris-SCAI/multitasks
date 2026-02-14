import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitise une chaîne pour prévenir les attaques XSS.
 * Retire tout HTML/JS, ne conserve que le texte pur.
 */
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
