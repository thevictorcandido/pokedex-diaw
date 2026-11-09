import { useEffect, useRef, useState } from 'react'
import { typeStyle } from '../constants/types.js'
import { artworkUrl, spriteUrl } from '../utils/sprites.js'
import { initials } from '../utils/format.js'
import '../css/PokemonImage.css'

/**
 * Imagem do Pokémon vinda da PokéAPI. Se ela não carregar (sem internet, por
 * exemplo), aparecem as iniciais no tom do primeiro tipo: a Pokédex continua
 * funcionando só com o JSON.
 *
 * variant "sprite": miniatura da lista e da equipe; "artwork": arte oficial do visor.
 * silhouette: desenha o Pokémon todo escuro (ainda não visto).
 */
export default function PokemonImage({
  pokemon,
  variant = 'sprite',
  decorative = false,
  silhouette = false,
  onLoad,
  onError,
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const imgRef = useRef(null)
  const src = variant === 'artwork' ? artworkUrl(pokemon.id) : spriteUrl(pokemon.id)

  // Imagem que já estava no cache pode terminar antes do React ligar o onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) onLoad?.(pokemon.id)
  }, [src, onLoad, pokemon.id])
  const size = variant === 'artwork' ? 475 : 96
  const className = `pokemon-image pokemon-image--${variant}${silhouette ? ' pokemon-image--silhouette' : ''}`

  if (failedSrc === src) {
    return (
      <span
        className={`${className} pokemon-image--fallback`}
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
    <span className={className}>
      <img
        ref={imgRef}
        src={src}
        alt={decorative ? '' : pokemon.name}
        width={size}
        height={size}
        loading={variant === 'artwork' ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
        onLoad={() => onLoad?.(pokemon.id)}
        onError={() => {
          setFailedSrc(src)
          onError?.(pokemon.id)
        }}
      />
    </span>
  )
}
