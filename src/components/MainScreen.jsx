import '../css/MainScreen.css'

/** Moldura clara do visor (pontos, botão e alto-falante) com a tela dentro. */
export default function MainScreen({ label, style, children }) {
  return (
    <section className="bezel" aria-label={label}>
      <span className="bezel__dots" aria-hidden="true">
        <span />
        <span />
      </span>
      <div className="screen" style={style}>
        {children}
      </div>
      <span className="bezel__dot" aria-hidden="true" />
      <span className="bezel__speaker" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </section>
  )
}
