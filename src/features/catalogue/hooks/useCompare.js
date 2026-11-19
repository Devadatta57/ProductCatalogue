import { useCallback, useEffect, useState } from 'react';
import catalogueSheets from '../data/catalogueSheets.json';

/*
 * Product families ticked for Compare, kept in the browser (same key as the
 * FEED Export Catalogue Explorer) so the home page and the table page share
 * one selection, and it survives a reload.
 */

export const COMPARE_LIMIT = 6;
const STORAGE_KEY = 'feedCmp';
const validSheets = new Set(catalogueSheets.map((sheet) => sheet.n));

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((n) => validSheets.has(n)).slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
}

function save(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked (private mode etc.): compare still works for this visit
  }
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState(load);

  useEffect(() => save(compareIds), [compareIds]);

  const toggleCompare = useCallback((n) => {
    setCompareIds((ids) => {
      if (ids.includes(n)) return ids.filter((id) => id !== n);
      return ids.length < COMPARE_LIMIT ? [...ids, n] : ids;
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return { compareIds, toggleCompare, clearCompare, compareLimit: COMPARE_LIMIT };
}
