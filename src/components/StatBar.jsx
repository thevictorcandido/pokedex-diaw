import { STAT_MAX } from '../constants/stats.js'
import '../css/StatBar.css'

/**
 * Um atributo como barra de 0 a 255, com o valor ao lado e um traço na média
 * dos 151 Pokémon. O <meter> dá o valor para leitores de tela.
 */
export default function StatBar({ label, value, average, index = 0 }) {
  const percent = (value / STAT_MAX) * 100
  const averagePercent = (average / STAT_MAX) * 100

  return (
    <div className="stat-bar" style={{ '--stat-index': index }}>
      <span className="stat-bar__label">{label}</span>
      <span className="stat-bar__value tabular">{value}</span>
      <span className="stat-bar__track" aria-hidden="true">
        <span className="stat-bar__fill" style={{ width: `${percent}%` }} />
        <span className="stat-bar__average" style={{ left: `${averagePercent}%` }} />
      </span>
      <meter className="visually-hidden" min="0" max={STAT_MAX} value={value}>
        {value} de {STAT_MAX}
      </meter>
    </div>
  )
}
