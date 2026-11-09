import { useState } from 'react'
import { typeStyle } from '../constants/types.js'
import { artworkUrl, spriteUrl } from '../utils/sprites.js'
import { initials } from '../utils/format.js'
import '../css/PokemonImage.css'

/**
 * Imagem do Pokémon vinda da PokéAPI. Se a imagem não carregar (sem internet,
 * por exemplo), mostra as iniciais no tom do primeiro tipo: a Pokédex continua
 * funcionando só com o JSON.
 *
 * variant "sprite": retrato pequeno da lista; "artwork": arte oficial do detalhe.
 */
export default function PokemonImage({ pokemon, variant = 'sprite', decorative = false }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const src = variant === 'artwork' ? artworkUrl(pokemon.id) : spriteUrl(pokemon.id)
  const size = variant === 'artwork' ? 240 : 96
  const alt = decorative ? '' : pokemon.name

  if (failedSrc === src) {
    return (
      <span
        className={`pokemon-image pokemon-image--${variant} pokemon-image--fallback`}
        style={typeStyle(pokemon.types[0])}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : pokemon.name}
        aria-hidden={decorative || undefined}
      >
        {initials(pokemon.name)}
      </span>
    )
  }

  return (
    <span className={`pokemon-image pokemon-image--${variant}`}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading={variant === 'artwork' ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    </span>
  )
}
