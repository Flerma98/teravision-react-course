/**
 * Converts an unknown error into a safe, human-readable message.
 * Keeps types strict (no `any`) and works on both server and client.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
