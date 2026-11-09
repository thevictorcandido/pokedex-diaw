import Icon from './Icon.jsx'
import '../css/SearchBar.css'

/**
 * Visor de busca: campo controlado, a lista muda a cada tecla.
 * O botão ⟲ limpa a busca e o tipo de uma vez.
 */
export default function SearchBar({ value, onChange, placeholder, label, onReset, canReset }) {
  return (
    <div className="search-bar" role="search">
      <label className="visually-hidden" htmlFor="search">
        {label}
      </label>
      <span className="search-bar__field">
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
      </span>
      <button
        type="button"
        className="search-bar__reset press"
        aria-label="Limpar busca e filtro"
        title="Limpar busca e filtro"
        disabled={!canReset}
        onClick={onReset}
      >
        <Icon name="reset" />
      </button>
    </div>
  )
}
