import { typeStyle } from '../constants/types.js'
import '../css/TypeBadge.css'

/** Selo do tipo, com o fundo pálido e a tinta escura do matiz do tipo. */
export default function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={typeStyle(type)}>
      {type}
    </span>
  )
}

/** Lista de selos, na ordem do JSON. */
export function TypeBadges({ types }) {
  return (
    <span className="type-badges">
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </span>
  )
}
