import { typeStyle } from '../constants/types.js'
import '../css/TypeFilter.css'

/**
 * Filtro por tipo, com os tipos e as contagens vindos do JSON.
 * layout "column": lista na barra lateral; "row": selos com rolagem no celular.
 */
export default function TypeFilter({ types, total, value, onChange, layout = 'column' }) {
  const options = [{ name: null, label: 'Todos', count: total }, ...types.map((t) => ({ ...t, label: t.name }))]

  return (
    <div className={`type-filter type-filter--${layout}`} role="group" aria-labelledby={`type-filter-${layout}`}>
      <p className="type-filter__title" id={`type-filter-${layout}`}>
        Tipos
      </p>
      <ul className="type-filter__list">
        {options.map((option) => {
          const selected = value === option.name
          return (
            <li key={option.label}>
              <button
                type="button"
                className="type-filter__option"
                aria-pressed={selected}
                style={option.name ? typeStyle(option.name) : undefined}
                onClick={() => onChange(option.name)}
              >
                <span className="type-filter__name">
                  {option.name && <span className="type-filter__dot" aria-hidden="true" />}
                  {option.label}
                </span>
                <span className="type-filter__count tabular">{option.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
