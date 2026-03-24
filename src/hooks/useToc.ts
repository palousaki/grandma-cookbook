import { useState, useCallback } from 'react';
import seedToc from '../data/toc.json';

export type TocItem = { title: string; startPage: number; endPage: number };

const STORAGE_KEY = 'grandma-cookbook-toc';

export function useToc() {
  const [items, setItems] = useState<TocItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : (seedToc as TocItem[]);
    } catch {
      return seedToc as TocItem[];
    }
  });

  const save = useCallback((newItems: TocItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  return { items, save };
}
