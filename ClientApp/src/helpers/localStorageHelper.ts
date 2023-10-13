export const getItem = (key: string): string | null => window.localStorage.getItem(key);

export const setItem = (key: string, value: string): void => window.localStorage.setItem(key, value);
