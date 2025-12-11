'use client'

import { useCallback, useEffect, useState } from 'react'

function getItemFromSessionStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error)
    return null
  }
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    const stored = getItemFromSessionStorage<T>(key)
    return stored !== null ? stored : initialValue
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const newValue =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value

        try {
          sessionStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.warn(`Error setting sessionStorage key "${key}":`, error)
        }

        return newValue
      })
    },
    [key]
  )

  useEffect(() => {
    const stored = getItemFromSessionStorage<T>(key)
    if (stored !== null) {
      setStoredValue(stored)
    }
  }, [key])

  return [storedValue, setValue]
}
