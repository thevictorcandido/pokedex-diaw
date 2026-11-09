import { STATS } from '../constants/stats.js'
import Icon from './Icon.jsx'
import PokemonCard from './PokemonCard.jsx'
import '../css/PokemonList.css'

const COLUMNS = [
  { key: 'id', label: '№', title: 'Número', align: 'left' },
  { key: 'name', label: 'Pokémon', title: 'Nome', align: 'left' },
  { key: 'types', label: 'Tipos', align: 'left', sortable: false, wide: true },
  ...STATS.map(({ key, short, label }) => ({ key, label: short, title: label, wide: true })),
  { key: 'total', label: 'Total', title: 'Total dos atributos' },
]

function SortableHeader({ column, sort, onSort }) {
  const active = sort.key === column.key
  const ariaSort = active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
  const className = [
    'pokemon-list__head',
    column.align === 'left' && 'pokemon-list__head--left',
    column.wide && 'pokemon-list__wide',
  ]
    .filter(Boolean)
    .join(' ')

  if (column.sortable === false) {
    return (
      <th scope="col" className={className}>
        {column.label}
      </th>
    )
  }

  return (
    <th scope="col" className={className} aria-sort={ariaSort}>
      <button
        type="button"
        className="pokemon-list__sort"
        title={`Ordenar por ${column.title.toLowerCase()}`}
        onClick={() => onSort(column.key)}
      >
        {column.label !== column.title ? <abbr title={column.title}>{column.label}</abbr> : column.label}
        <span className="pokemon-list__arrow" aria-hidden="true">
          {active && <Icon name={sort.direction === 'asc' ? 'up' : 'down'} />}
        </span>
      </button>
    </th>
  )
}

/** Tabela dos Pokémon: cabeçalhos ordenáveis e uma linha (PokemonCard) por Pokémon. */
export default function PokemonList({ pokemon, sort, onSort, onSelect, selectedId, favorites, onToggleFavorite, caption }) {
  return (
    <table className="pokemon-list">
      <caption className="visually-hidden">{caption}</caption>
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <SortableHeader key={column.key} column={column} sort={sort} onSort={onSort} />
          ))}
          <th scope="col" className="pokemon-list__head">
            <span className="visually-hidden">Favorito</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            selected={p.id === selectedId}
            favorite={favorites.has(p.id)}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </tbody>
    </table>
  )
}
