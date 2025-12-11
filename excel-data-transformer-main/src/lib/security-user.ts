import { env } from '@/constants/env'
import { handleApiHttpError } from './shared/handle-api-http-errors'
import { normalizeError } from '@/utils/error'


export type UserProps = {
  IdUsuario: string
  Projeto: string
  Tokens: string[]
  TipoUsuario: number
  JWT: string | null
  IdToken: number
}

export const getTokenFromSearchParams = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('E')
}

const url = `${env.WEB_API_FR}/api/security/user`;
console.log("VITE ENV:", import.meta.env.NEXT_PUBLIC_PORTA_API_FR);
export async function login(token: string) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: token,
    })

    if (!res.ok) {
      handleApiHttpError(res.status)
    }

    return res.json()
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}
