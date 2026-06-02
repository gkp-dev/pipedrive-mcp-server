export function requireAtLeastOneField(input: Record<string, unknown>, fields: string[], message: string): void {
  const hasField = fields.some((field) => {
    const value = input[field];
    return value !== undefined && value !== null && value !== "";
  });

  if (!hasField) {
    throw new Error(message);
  }
}

