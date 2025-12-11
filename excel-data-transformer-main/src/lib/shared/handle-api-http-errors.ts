import { messages } from '@/constants/messages'

export function handleApiHttpError(status: number): never {
  if (status === 400) {
    throw new Error(messages.BAD_REQUEST)
  }

  if (status === 401) {
    throw new Error(messages.SESSION_EXPIRED)
  }

  if (status === 403) {
    throw new Error(messages.FORBIDDEN)
  }

  if (status === 404) {
    throw new Error(messages.NOT_FOUND)
  }

  if (status === 500) {
    throw new Error(messages.SERVER_ERROR)
  }

  throw new Error(messages.SERVER_ERROR)
}
