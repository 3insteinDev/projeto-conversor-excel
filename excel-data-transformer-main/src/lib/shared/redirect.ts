'use client'

import { useRouter } from 'next/navigation'

let _router: ReturnType<typeof useRouter> | null = null

export function setRouter(router: ReturnType<typeof useRouter>) {
  _router = router
}

export function redirectToLogin() {
  if (_router) {
    _router.push('/login')
  } else {
    window.location.href = '/login'
  }
}
