import '../css/DeviceTop.css'

/**
 * Topo da metade esquerda: a lente, que acende a cada troca (a `scanKey` muda e
 * a animação recomeça), e as três luzes de estado.
 */
export default function DeviceTop({ scanKey, favorite, filtered, loaded }) {
  const leds = [
    { color: 'red', on: favorite, label: favorite ? 'Favorito' : 'Não é favorito' },
    { color: 'yellow', on: filtered, label: filtered ? 'Filtro ativo' : 'Sem filtro' },
    { color: 'green', on: loaded, label: loaded ? 'Imagem carregada' : 'Imagem não carregada' },
  ]

  return (
    <div className="device-top">
      <span className="lens" aria-hidden="true">
        <span key={scanKey} className="lens__glass" />
      </span>
      <ul className="leds" aria-label="Luzes de estado">
        {leds.map((led) => (
          <li key={led.color} className={`led led--${led.color}`} data-on={led.on || undefined} title={led.label}>
            <span className="visually-hidden">{led.label}</span>
          </li>
        ))}
      </ul>
      <p className="device-top__brand">
        Pokédex <span>Kanto</span>
      </p>
    </div>
  )
}
