import { memo, useEffect, useRef } from 'react'
import { typeStyle } from '../constants/types.js'
import { formatId } from '../utils/format.js'
import PokemonImage from './PokemonImage.jsx'
import '../css/PokemonList.css'

/** Uma miniatura da grade. memo: a grade tem até 151 itens. */
const ListItem = memo(function ListItem({ pokemon, current, seen, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className="pokemon-list__item"
        style={typeStyle(pokemon.types[0])}
        aria-current={current || undefined}
        data-unseen={!seen || undefined}
        onClick={() => onSelect(pokemon.id)}
      >
        <span className="pokemon-list__disc">
          <PokemonImage pokemon={pokemon} decorative silhouette={!seen} />
        </span>
        <span className="pokemon-list__id tabular">{formatId(pokemon.id)}</span>
        <span className="pokemon-list__name">{pokemon.name}</span>
        {!seen && <span className="visually-hidden">(ainda não visto)</span>}
      </button>
    </li>
  )
})

/**
 * Lista dentro do visor: grade de miniaturas da lista atual. Os ainda não vistos
 * aparecem em silhueta; o atual fica marcado e sempre à vista.
 */
export default function PokemonList({ pokemon, currentId, seen, onSelect }) {
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' })
  }, [currentId])

  return (
    <ul ref={listRef} className="pokemon-list" aria-label="Lista de Pokémon">
      {pokemon.map((p) => (
        <ListItem key={p.id} pokemon={p} current={p.id === currentId} seen={seen.has(p.id)} onSelect={onSelect} />
      ))}
    </ul>
  )
}
