import { typeStyle } from '../constants/types.js'
import '../css/TypeFilter.css'

/**
 * Teclado azul: filtro por tipo, com os tipos e as contagens vindos do JSON.
 * A tecla do tipo escolhido fica afundada (aria-pressed).
 */
export default function TypeFilter({ types, total, value, onChange }) {
  const options = [{ name: null, label: 'Todos', count: total }, ...types.map((t) => ({ ...t, label: t.name }))]

  return (
    <div className="type-filter" role="group" aria-label="Filtrar por tipo">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          className="type-filter__key press"
          aria-pressed={value === option.name}
          aria-label={`${option.name ? `Filtrar por ${option.label}` : 'Todos os tipos'}, ${option.count}`}
          title={`${option.label}: ${option.count}`}
          style={option.name ? typeStyle(option.name) : undefined}
          onClick={() => onChange(option.name)}
        >
          {option.name && <span className="type-filter__dot" aria-hidden="true" />}
          <span className="type-filter__name">{option.label}</span>
          <span className="type-filter__count tabular" aria-hidden="true">
            {option.count}
          </span>
        </button>
      ))}
    </div>
  )
}
