import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage.js'

const KEY = 'pokedex:favoritos'

/** Ids dos Pokémon favoritos, guardados no navegador. */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => new Set(readStorage(KEY, [])))

  useEffect(() => {
    writeStorage(KEY, [...favorites])
  }, [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return { favorites, toggleFavorite }
}
