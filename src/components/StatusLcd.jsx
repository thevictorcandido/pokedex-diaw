import '../css/StatusLcd.css'

/** LCD verde: duas linhas curtas de estado, anunciadas aos leitores de tela. */
export default function StatusLcd({ primary, secondary }) {
  return (
    <output className="status-lcd" aria-live="polite">
      <span className="status-lcd__primary tabular">{primary}</span>
      <span className="status-lcd__secondary tabular">{secondary}</span>
    </output>
  )
}
