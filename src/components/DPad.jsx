import '../css/DPad.css'

/**
 * Direcional: ◀ ▶ trocam de item, ▲ ▼ andam na grade e o centro abre ou fecha
 * a lista. Cada botão some (fica desligado) quando não tem para onde ir.
 */
export default function DPad({ onLeft, onRight, onUp, onDown, onCenter, labels }) {
  const buttons = [
    { key: 'up', onClick: onUp, label: labels.up, glyph: '▲' },
    { key: 'left', onClick: onLeft, label: labels.left, glyph: '◀' },
    { key: 'center', onClick: onCenter, label: labels.center, glyph: '' },
    { key: 'right', onClick: onRight, label: labels.right, glyph: '▶' },
    { key: 'down', onClick: onDown, label: labels.down, glyph: '▼' },
  ]

  return (
    <div className="dpad" role="group" aria-label="Direcional">
      {buttons.map((button) => (
        <button
          key={button.key}
          type="button"
          className={`dpad__button dpad__button--${button.key}`}
          aria-label={button.label}
          title={button.label}
          disabled={!button.onClick}
          onClick={button.onClick ?? undefined}
        >
          <span aria-hidden="true">{button.glyph}</span>
        </button>
      ))}
    </div>
  )
}
