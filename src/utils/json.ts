export function toJsonText(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function compactObject<T extends object>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Partial<T>;
}
