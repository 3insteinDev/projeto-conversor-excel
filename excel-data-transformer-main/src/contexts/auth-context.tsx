'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'


import { Permissoes } from '@/types/auth/api/permissions'
import { useSessionStorage } from '@/hooks/use-session-storage'
import { getPermissions } from '@/lib/get-permissions'
import { login, UserProps } from '@/lib/security-user'

type AuthContextData = {
  user: UserProps | null
  permissions: Permissoes | null
  isLoadingUser: boolean
  error?: string
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [user, setUser] = useSessionStorage<UserProps | null>('user-info', null)
  const [permissions, setPermissions] = useSessionStorage<Permissoes | null>(
    'user-permissions',
    null
  )
  const [error, setError] = useState<string | undefined>(undefined)

  function getTokenFromSearchParams() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('E')
    }
    return null
  }

  useEffect(() => {
    const token = getTokenFromSearchParams()

    if (token) {
      loginWithToken(token)
    } else {
      setIsLoadingUser(false)
    }
  }, [])

  async function loginWithToken(token: string) {
    try {
      const user = await login(token)
      const permissions = await getPermissions(user.JWT, user.Projeto)
      setUser(user)
      setPermissions(permissions)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      }
      console.error('Erro no login', error)
      // Limpar usuário e permissões em caso de erro
      setUser(null)
      setPermissions(null)
    } finally {
      setIsLoadingUser(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isLoadingUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
