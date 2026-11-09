import Icon from './Icon.jsx'
import '../css/SearchBar.css'

/** Campo de busca controlado: a lista muda a cada tecla. */
export default function SearchBar({ value, onChange, placeholder, label }) {
  return (
    <div className="search-bar" role="search">
      <label className="visually-hidden" htmlFor="search">
        {label}
      </label>
      <Icon name="search" className="search-bar__icon" />
      <input
        id="search"
        className="search-bar__input"
        type="search"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="search-bar__clear" aria-label="Limpar busca" onClick={() => onChange('')}>
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}
