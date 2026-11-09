import { BrandMark } from './Sidebar.jsx'
import Icon from './Icon.jsx'
import SearchBar from './SearchBar.jsx'
import '../css/TopBar.css'

/** Barra superior: busca, Pokémon aleatório e alternância de tema. */
export default function TopBar({ search, onRandom, theme, onToggleTheme }) {
  const nextTheme = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <header className="top-bar">
      <span className="top-bar__brand" aria-hidden="true">
        <BrandMark />
      </span>
      <SearchBar {...search} />
      <div className="top-bar__actions">
        <button type="button" className="button" onClick={onRandom}>
          <Icon name="shuffle" />
          <span className="top-bar__label">Aleatório</span>
        </button>
        <button
          type="button"
          className="button button--icon"
          aria-label={`Ativar tema ${nextTheme}`}
          title={`Ativar tema ${nextTheme}`}
          onClick={onToggleTheme}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  )
}
