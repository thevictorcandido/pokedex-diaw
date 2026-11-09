import { STAT_MAX } from '../constants/stats.js'
import '../css/StatBar.css'

const SEGMENTS = 5
const PER_SEGMENT = STAT_MAX / SEGMENTS // 51 pontos por segmento

/**
 * Um atributo em 5 segmentos de 51 pontos (0 a 255), com o valor ao lado e um
 * traço na média dos 151 Pokémon. O <meter> dá o valor para leitores de tela.
 */
export default function StatBar({ label, value, average, index = 0 }) {
  return (
    <div className="stat-bar" style={{ '--stat-index': index }}>
      <span className="stat-bar__label">{label}</span>
      <span className="stat-bar__value tabular">{value}</span>
      <span className="stat-bar__track" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, segment) => {
          const fill = Math.min(1, Math.max(0, (value - segment * PER_SEGMENT) / PER_SEGMENT))
          return (
            <span key={segment} className="stat-bar__segment">
              <span className="stat-bar__fill" style={{ width: `${fill * 100}%` }} />
            </span>
          )
        })}
        <span className="stat-bar__average" style={{ left: `${(average / STAT_MAX) * 100}%` }} />
      </span>
      <meter className="visually-hidden" min="0" max={STAT_MAX} value={value}>
        {value} de {STAT_MAX}
      </meter>
    </div>
  )
}
