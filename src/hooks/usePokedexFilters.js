import { useMemo, useState } from 'react'
import { defaultDirection, filterPokemon, sortPokemon } from '../utils/filters.js'

const INITIAL_SORT = { key: 'id', direction: 'asc' }

/**
 * Estado da busca, do tipo escolhido e da ordenação.
 * A lista visível é derivada desse estado, nunca guardada à parte.
 */
export function usePokedexFilters(source) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState(null)
  const [sort, setSort] = useState(INITIAL_SORT)

  const visible = useMemo(
    () => sortPokemon(filterPokemon(source, { query, type }), sort),
    [source, query, type, sort],
  )

  /** Clicar na coluna já ordenada inverte a direção; outra coluna começa na direção dela. */
  function sortBy(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: defaultDirection(key) },
    )
  }

  function clearFilters() {
    setQuery('')
    setType(null)
  }

  return { query, setQuery, type, setType, sort, setSort, sortBy, clearFilters, visible }
}
