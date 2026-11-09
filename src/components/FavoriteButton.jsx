import Icon from './Icon.jsx'
import '../css/FavoriteButton.css'

/** Estrela de favorito, com estado anunciado por aria-pressed. */
export default function FavoriteButton({ name, active, onToggle, withLabel = false }) {
  return (
    <button
      type="button"
      className={`favorite-button${withLabel ? ' button' : ''}`}
      aria-pressed={active}
      aria-label={withLabel ? undefined : `Favoritar ${name}`}
      title={active ? `Tirar ${name} dos favoritos` : `Favoritar ${name}`}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
    >
      <Icon name="star" filled={active} />
      {withLabel && <span>{active ? 'Favorito' : 'Favoritar'}</span>}
    </button>
  )
}
