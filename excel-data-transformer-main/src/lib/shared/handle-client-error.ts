import { messages } from '@/constants/messages'

export function handleClientError(error: unknown): never {
  if (
    error instanceof TypeError &&
    error.message === 'Network request failed'
  ) {
    throw new Error(messages.ERROR_ON_NETWORK_REQUEST_FAILED)
  }

  if (error instanceof SyntaxError) {
    throw new Error(messages.INVALID_JSON_RESPONSE)
  }

  if (!(error instanceof Error)) {
    throw new Error(String(error))
  }

  throw error
}
