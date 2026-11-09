import { memo } from 'react'
import { STATS } from '../constants/stats.js'
import { formatId } from '../utils/format.js'
import FavoriteButton from './FavoriteButton.jsx'
import PokemonImage from './PokemonImage.jsx'
import { TypeBadges } from './TypeBadge.jsx'

/**
 * Ficha de um Pokémon na lista, desenhada como linha da tabela.
 * No celular, a mesma linha vira um item de duas linhas por CSS: os tipos e os
 * atributos aparecem embaixo do nome, e as colunas largas somem.
 */
function PokemonCard({ pokemon, selected, favorite, onSelect, onToggleFavorite }) {
  const { id, name, types, stats, total } = pokemon

  return (
    <tr className="pokemon-card" data-selected={selected || undefined} onClick={() => onSelect(id)}>
      <td className="pokemon-card__id pokemon-list__wide tabular">{formatId(id)}</td>
      <td className="pokemon-card__identity">
        <div className="pokemon-card__who">
          <PokemonImage pokemon={pokemon} decorative />
          <div className="pokemon-card__text">
            <span className="pokemon-card__compact pokemon-card__compact-id tabular">{formatId(id)}</span>
            <button
              type="button"
              className="pokemon-card__name"
              aria-haspopup="dialog"
              onClick={(event) => {
                event.stopPropagation()
                onSelect(id)
              }}
            >
              {name}
            </button>
            <span className="pokemon-card__compact pokemon-card__compact-total tabular">
              <span className="visually-hidden">Total </span>
              {total}
            </span>
            <span className="pokemon-card__compact pokemon-card__compact-types">
              <TypeBadges types={types} />
            </span>
            <dl className="pokemon-card__compact pokemon-card__stats tabular">
              {STATS.map(({ key, short }) => (
                <div key={key}>
                  <dt>{short}</dt>
                  <dd>{stats[key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </td>
      <td className="pokemon-list__wide">
        <TypeBadges types={types} />
      </td>
      {STATS.map(({ key }) => (
        <td key={key} className="pokemon-card__stat pokemon-list__wide tabular">
          {stats[key]}
        </td>
      ))}
      <td className="pokemon-card__total pokemon-list__wide tabular">{total}</td>
      <td className="pokemon-card__favorite">
        <FavoriteButton name={name} active={favorite} onToggle={() => onToggleFavorite(id)} />
      </td>
    </tr>
  )
}

// A lista tem 151 linhas: memo evita redesenhar todas a cada tecla da busca.
export default memo(PokemonCard)
