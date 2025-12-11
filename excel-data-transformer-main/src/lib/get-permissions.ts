import { Permissoes } from '@/types/auth/api/permissions'
import { env } from '@/constants/env'
import { fetcher } from './shared/fetcher'


export const getTokenFromSearchParams = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('E')
}

export async function getPermissions(
  token: string,
  projeto: string
): Promise<Permissoes> {
  const url = `${env.GESTAO_CADASTRO_API}/api/app/v1/Cadastro/Permissoes`

  const response = await fetcher<Permissoes>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      projeto: `${projeto}`,
    },
    authRequired: false,
  })

  return response
}
