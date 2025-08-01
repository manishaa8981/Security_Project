// src/utils/sanitizeHTML.ts
import * as DOMPurify from "dompurify";
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}
