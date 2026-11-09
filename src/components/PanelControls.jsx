import { SORT_FIELDS } from '../constants/stats.js'
import Icon from './Icon.jsx'
import '../css/PanelControls.css'

const MODES = [
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'trainers', label: 'Treinadores' },
]

/** Botões brancos: modo Pokémon ou Treinadores. */
export function ModeSwitch({ mode, onChange }) {
  return (
    <div className="mode-switch" role="group" aria-label="Modo">
      {MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          className="mode-switch__button press"
          aria-pressed={mode === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

/** Botão amarelo redondo: sorteia um Pokémon da lista atual. */
export function RandomButton({ onClick }) {
  return (
    <button type="button" className="random-button press" onClick={onClick} title="Sortear um Pokémon">
      <Icon name="shuffle" />
      <span>Sortear</span>
    </button>
  )
}

/** Pílulas sob o visor: lista e favorito. */
export function ScreenPills({ listOpen, onToggleList, favorite, onToggleFavorite, listDisabled, favoriteDisabled, name }) {
  return (
    <div className="screen-pills">
      <button
        type="button"
        className="screen-pill screen-pill--red press"
        aria-pressed={listOpen}
        disabled={listDisabled}
        onClick={onToggleList}
        title="Abrir ou fechar a lista (L)"
      >
        <Icon name="grid" />
        Lista
      </button>
      <button
        type="button"
        className="screen-pill screen-pill--green press"
        aria-pressed={favorite}
        aria-label={name ? `Favoritar ${name}` : 'Favoritar'}
        disabled={favoriteDisabled || !name}
        onClick={onToggleFavorite}
      >
        <Icon name="star" filled={favorite} />
        Favorito
      </button>
    </div>
  )
}

/** Tela inferior: ordenação da lista. */
export function SortSelect({ sort, onChange, disabled }) {
  const value = `${sort.key}:${sort.direction}`

  return (
    <label className="mini-screen">
      <span className="mini-screen__label">Ordenar</span>
      <select
        className="mini-screen__select"
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const [key, direction] = event.target.value.split(':')
          onChange({ key, direction })
        }}
      >
        {SORT_FIELDS.flatMap(({ key, label }) =>
          key === 'id' || key === 'name'
            ? [
                <option key={`${key}:asc`} value={`${key}:asc`}>
                  {label}, {key === 'id' ? 'crescente' : 'A a Z'}
                </option>,
                <option key={`${key}:desc`} value={`${key}:desc`}>
                  {label}, {key === 'id' ? 'decrescente' : 'Z a A'}
                </option>,
              ]
            : [
                <option key={`${key}:desc`} value={`${key}:desc`}>
                  {label}, maior primeiro
                </option>,
                <option key={`${key}:asc`} value={`${key}:asc`}>
                  {label}, menor primeiro
                </option>,
              ],
        )}
      </select>
    </label>
  )
}

/** Tela inferior: mostrar só os favoritos. */
export function FavoritesToggle({ active, count, onToggle, disabled }) {
  return (
    <button
      type="button"
      className="mini-screen mini-screen--button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="mini-screen__label">Só favoritos</span>
      <span className="mini-screen__value tabular">
        <Icon name="star" filled={active} />
        {count}
      </span>
    </button>
  )
}
