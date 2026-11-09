import { SECTIONS } from '../constants/sections.js'
import Icon from './Icon.jsx'
import TypeFilter from './TypeFilter.jsx'
import '../css/Sidebar.css'

/** Marca da Pokédex: círculo dividido, desenhado em SVG. */
export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" className="brand-mark__body" />
      <path d="M2 16a14 14 0 0 1 28 0z" className="brand-mark__top" />
      <circle cx="16" cy="16" r="5" className="brand-mark__button" />
    </svg>
  )
}

/**
 * Barra lateral do computador: marca, seções com contagem e filtro de tipo.
 * No celular e no tablet ela some; a BottomNav e o TypeFilter em linha assumem.
 */
export default function Sidebar({ section, counts, onNavigate, types, total, activeType, onTypeChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div>
          <span className="brand__name">Pokédex</span>
          <span className="brand__region">Kanto</span>
        </div>
      </div>

      <nav aria-label="Seções">
        <ul className="sidebar__nav">
          {SECTIONS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="sidebar__item"
                aria-current={section === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
              >
                <span className="sidebar__label">
                  <Icon name={item.icon} />
                  {item.label}
                </span>
                <span className="sidebar__count tabular">{counts[item.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <TypeFilter types={types} total={total} value={activeType} onChange={onTypeChange} layout="column" />
    </aside>
  )
}
