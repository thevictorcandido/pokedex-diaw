import { SORT_FIELDS } from '../constants/stats.js'
import '../css/SortSelect.css'

/** Ordenação no celular, onde a tabela não mostra cabeçalhos clicáveis. */
export default function SortSelect({ sort, onChange }) {
  const value = `${sort.key}:${sort.direction}`

  return (
    <label className="sort-select">
      <span className="sort-select__label">Ordenar por</span>
      <select
        value={value}
        onChange={(event) => {
          const [key, direction] = event.target.value.split(':')
          onChange({ key, direction })
        }}
      >
        {SORT_FIELDS.flatMap(({ key, label }) =>
          key === 'id' || key === 'name'
            ? [
                <option key={`${key}:asc`} value={`${key}:asc`}>
                  {label}, {key === 'id' ? 'crescente' : 'de A a Z'}
                </option>,
                <option key={`${key}:desc`} value={`${key}:desc`}>
                  {label}, {key === 'id' ? 'decrescente' : 'de Z a A'}
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
