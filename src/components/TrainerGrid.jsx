import { useEffect, useRef } from 'react'
import { pluralize } from '../utils/format.js'
import PokemonImage from './PokemonImage.jsx'
import '../css/TrainerGrid.css'

/**
 * Lista no visor do modo Treinadores: todos os treinadores de uma vez, cada um
 * com insígnias e a equipe em miniatura. Escolher um mostra a ficha dele.
 */
export default function TrainerGrid({ trainers, currentId, onSelect }) {
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' })
  }, [currentId])

  return (
    <ul ref={listRef} className="trainer-grid" aria-label="Todos os treinadores">
      {trainers.map((trainer) => (
        <li key={trainer.id}>
          <button
            type="button"
            className="trainer-grid__item"
            aria-current={trainer.id === currentId || undefined}
            onClick={() => onSelect(trainer.id)}
          >
            <span className="trainer-grid__head">
              <span className="trainer-grid__name">{trainer.name}</span>
              <span className="trainer-grid__badges tabular">
                {pluralize(trainer.badges, 'insígnia', 'insígnias')}
              </span>
            </span>
            <span className="trainer-grid__team" aria-label={`Equipe: ${trainer.team.map((p) => p.name).join(', ')}`}>
              {trainer.team.map((pokemon, index) => (
                // Chave por posição: a equipe pode repetir o mesmo Pokémon.
                <PokemonImage key={`${pokemon.id}-${index}`} pokemon={pokemon} decorative />
              ))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
