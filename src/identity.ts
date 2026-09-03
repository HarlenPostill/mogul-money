import { useCallback, useEffect, useState } from 'react'

const KEY = 'mogul-money-player'
const EVENT = 'mogul-money-identity'

export const getStoredPlayerId = (): string | null => localStorage.getItem(KEY)

export function setStoredPlayerId(id: string) {
  localStorage.setItem(KEY, id)
  window.dispatchEvent(new Event(EVENT))
}

export function clearStoredPlayerId() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(EVENT))
}

/** The id of the player using this device, reactive to sign-in/sign-out. */
export function usePlayerId(): [string | null, (id: string | null) => void] {
  const [id, setId] = useState<string | null>(() => getStoredPlayerId())

  useEffect(() => {
    const sync = () => setId(getStoredPlayerId())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const update = useCallback((next: string | null) => {
    if (next) setStoredPlayerId(next)
    else clearStoredPlayerId()
  }, [])

  return [id, update]
}
