'use client';
import {useCallback, useSyncExternalStore} from 'react';

const EVENTO = 'autoestudos:storage';

function ler(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function assinar(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(EVENTO, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(EVENTO, cb);
  };
}

/**
 * Estado JSON persistido no localStorage. No SSR e na hidratação devolve
 * `initial`, então não há mismatch. Falhas de storage viram no-op.
 */
export function usePersistent<T>(key: string, initial: T): [T, (next: T) => void, () => void] {
  const k = `autoestudos:${key}`;
  const raw = useSyncExternalStore(assinar, () => ler(k), () => null);
  let value = initial;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
  }
  const set = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(k, JSON.stringify(next));
      } catch {}
      window.dispatchEvent(new Event(EVENTO));
    },
    [k],
  );
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(k);
    } catch {}
    window.dispatchEvent(new Event(EVENTO));
  }, [k]);
  return [value, set, reset];
}
