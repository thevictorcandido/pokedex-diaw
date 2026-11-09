import { formatId } from '../utils/format.js'
import PokemonImage from './PokemonImage.jsx'
import { TypeBadges } from './TypeBadge.jsx'
import '../css/PokemonCard.css'

/**
 * Um Pokémon no visor: círculo na cor do tipo, arte oficial, número, nome e tipos.
 * O App usa o id como `key`, então a arte entra de novo a cada troca.
 */
export default function PokemonCard({ pokemon, onImageLoad, onImageError }) {
  const { id, name, types } = pokemon

  return (
    <article className="pokemon-card" aria-label={`${name}, número ${id}, tipos ${types.join(' e ')}`}>
      <div className="pokemon-card__art">
        <span className="pokemon-card__disc" aria-hidden="true" />
        <PokemonImage pokemon={pokemon} variant="artwork" onLoad={onImageLoad} onError={onImageError} />
      </div>
      <div className="pokemon-card__caption">
        <div>
          <p className="pokemon-card__id tabular">{formatId(id)}</p>
          <h2 className="pokemon-card__name">{name}</h2>
        </div>
        <TypeBadges types={types} />
      </div>
    </article>
  )
}
