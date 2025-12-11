

import { normalizeError } from '@/utils/error'
import { redirectToLogin } from './redirect'

interface FetchOptions extends RequestInit {
  authRedirect?: boolean
  authRequired?: boolean
}

export async function fetcher<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const authRequired = options.authRequired ?? true
  let headers: HeadersInit = {
    projeto: 'OTM',
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authRequired) {
    const userInfoString = sessionStorage.getItem('user-info')
    if (!userInfoString) {
      if (options.authRedirect) redirectToLogin()
      throw new Error('Nenhum usuário logado.')
    }
    const userInfo = JSON.parse(userInfoString)
    const token = userInfo.JWT
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const res = await fetch(url, { ...options, headers })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errorMessage =
        (data?.errors as string) ??
        (data?.data?.errors as string) ??
        (data?.message as string) ??
        'Erro desconhecido.'
      if (res.status === 401 && options.authRedirect) redirectToLogin()
      throw new Error(errorMessage)
    }

    return data
  } catch (error: unknown) {
    throw new Error(normalizeError(error))
  }
}
