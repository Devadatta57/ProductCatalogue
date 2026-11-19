const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Wraps every search word found in `text` in <mark>.
 * `query` is the result of parseQuery(): { words } or { hsn } or null.
 */
export default function Highlight({ text, query }) {
  if (!query) return text;
  const words = (query.words ?? [query.hsn]).filter((word) => word.length >= 2);
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'ig');
  return text.split(pattern).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}
