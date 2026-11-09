import '../css/InfoScreen.css'

/**
 * Tela azul do painel. Com `tabs`, vira um conjunto de abas acessível
 * (setas ← → trocam de aba quando o foco está nelas).
 */
export default function InfoScreen({ tabs, active, onTab, label, children }) {
  function handleKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    event.stopPropagation()
    const index = tabs.findIndex((tab) => tab.id === active)
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
    onTab(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <section className="info-screen" aria-label={label}>
      {tabs && (
        <div className="info-screen__tabs" role="tablist" aria-label="Informações" onKeyDown={handleKeyDown}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              className="info-screen__tab"
              aria-selected={tab.id === active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={tab.id === active ? 0 : -1}
              onClick={() => onTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div
        className="info-screen__body"
        id={tabs ? `panel-${active}` : undefined}
        role={tabs ? 'tabpanel' : undefined}
        aria-labelledby={tabs ? `tab-${active}` : undefined}
      >
        {children}
      </div>
    </section>
  )
}
