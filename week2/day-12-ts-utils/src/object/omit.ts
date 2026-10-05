export function omit<T, K extends keyof T>(
  object: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...object } as T;

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<T, K>;
}