export function normalizeError(
  error: unknown,
  fallback = 'Erro inesperado'
): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return fallback
}
