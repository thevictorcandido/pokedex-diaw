import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage.js'

const KEY = 'pokedex:vistos'

/**
 * Registro dos Pokémon já abertos no visor, como a Pokédex que guarda o que
 * foi descoberto. Fica no navegador; na lista, os não vistos viram silhueta.
 */
export function useSeen() {
  const [seen, setSeen] = useState(() => new Set(readStorage(KEY, [])))

  useEffect(() => {
    writeStorage(KEY, [...seen])
  }, [seen])

  const markSeen = useCallback((id) => {
    setSeen((current) => (current.has(id) ? current : new Set(current).add(id)))
  }, [])

  const resetSeen = useCallback(() => setSeen(new Set()), [])

  return { seen, markSeen, resetSeen }
}
