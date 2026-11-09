import { SECTIONS } from '../constants/sections.js'
import Icon from './Icon.jsx'
import '../css/BottomNav.css'

/** Navegação entre seções no tablet e no celular, presa ao pé da tela. */
export default function BottomNav({ section, counts, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Seções">
      {SECTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="bottom-nav__item"
          aria-current={section === item.id ? 'page' : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <Icon name={item.icon} filled={item.icon === 'star' && section === item.id} />
          <span>
            {item.label} <span className="tabular">{counts[item.id]}</span>
          </span>
        </button>
      ))}
    </nav>
  )
}
