import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        writeStorage(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, update];
}
