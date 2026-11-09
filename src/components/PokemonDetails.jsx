import { useEffect, useRef } from 'react'
import { STATS } from '../constants/stats.js'
import { typeStyle } from '../constants/types.js'
import { formatId, joinNames } from '../utils/format.js'
import FavoriteButton from './FavoriteButton.jsx'
import Icon from './Icon.jsx'
import PokemonImage from './PokemonImage.jsx'
import StatBar from './StatBar.jsx'
import { TypeBadges } from './TypeBadge.jsx'
import '../css/PokemonDetails.css'

/**
 * Detalhe de um Pokémon em painel lateral (folha inferior no celular).
 * Usa <dialog> com showModal: foco preso no painel, Esc fecha e o fundo fica inerte.
 * As setas do teclado trocam para o anterior e o próximo da lista atual.
 */
export default function PokemonDetails({
  pokemon,
  total,
  averages,
  previous,
  next,
  onNavigate,
  onClose,
  favorite,
  onToggleFavorite,
}) {
  const dialogRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  // Ao trocar de Pokémon, o painel volta ao topo.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [pokemon.id])

  function handleKeyDown(event) {
    if (event.target.closest('input, select, textarea')) return
    if (event.key === 'ArrowLeft' && previous) onNavigate(previous.id)
    if (event.key === 'ArrowRight' && next) onNavigate(next.id)
  }

  // Clique no fundo escurecido (fora do painel) fecha.
  function handleClick(event) {
    if (event.target === dialogRef.current) dialogRef.current.close()
  }

  const owners = pokemon.trainers

  return (
    <dialog
      ref={dialogRef}
      className="pokemon-details"
      aria-labelledby="details-name"
      onClose={onClose}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="pokemon-details__panel" ref={bodyRef}>
        <div className="pokemon-details__hero" style={typeStyle(pokemon.types[0])}>
          <PokemonImage key={pokemon.id} pokemon={pokemon} variant="artwork" />
          <button
            type="button"
            className="button button--icon pokemon-details__close"
            aria-label="Fechar detalhe"
            onClick={() => dialogRef.current.close()}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="pokemon-details__body">
          <div className="pokemon-details__heading">
            <div>
              <p className="pokemon-details__id tabular">{formatId(pokemon.id)}</p>
              <h2 id="details-name" className="pokemon-details__name">
                {pokemon.name}
              </h2>
              <TypeBadges types={pokemon.types} />
            </div>
            <FavoriteButton
              name={pokemon.name}
              active={favorite}
              onToggle={() => onToggleFavorite(pokemon.id)}
              withLabel
            />
          </div>

          <dl className="pokemon-details__figures">
            <div>
              <dt>Total dos atributos</dt>
              <dd className="tabular">{pokemon.total}</dd>
            </div>
            <div>
              <dt>Posição pelo total</dt>
              <dd className="tabular">
                {pokemon.rank}º de {total}
              </dd>
            </div>
          </dl>

          <section className="pokemon-details__section" aria-labelledby="details-stats">
            <h3 id="details-stats">Atributos</h3>
            <p className="pokemon-details__note">
              Escala de 0 a 255. O traço marca a média dos {total} Pokémon.
            </p>
            <div key={pokemon.id}>
              {STATS.map(({ key, label }, index) => (
                <StatBar
                  key={key}
                  label={label}
                  value={pokemon.stats[key]}
                  average={averages[key]}
                  index={index}
                />
              ))}
            </div>
          </section>

          <section className="pokemon-details__section" aria-labelledby="details-trainers">
            <h3 id="details-trainers">Treinadores</h3>
            <p>
              {owners.length > 0
                ? `Na equipe de ${joinNames(owners)}.`
                : 'Nenhum treinador da Pokédex tem este Pokémon.'}
            </p>
          </section>

          <nav className="pokemon-details__pager" aria-label="Outros Pokémon da lista">
            {previous ? (
              <button type="button" className="button" onClick={() => onNavigate(previous.id)}>
                <Icon name="left" />
                <span className="tabular">{formatId(previous.id)}</span> {previous.name}
              </button>
            ) : (
              <span />
            )}
            {next && (
              <button type="button" className="button" onClick={() => onNavigate(next.id)}>
                <span className="tabular">{formatId(next.id)}</span> {next.name}
                <Icon name="right" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </dialog>
  )
}
