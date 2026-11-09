import { formatId, pluralize } from '../utils/format.js'
import PokemonImage from './PokemonImage.jsx'
import '../css/TrainerCard.css'

/** Kanto tem 8 insígnias; quem tem mais (Ash, Gary e Lance, com 9) mostra todas. */
const BADGE_SLOTS = 8

/** Um treinador no visor: nome, insígnias e a equipe, que leva a cada Pokémon. */
export default function TrainerCard({ trainer, position, onSelectPokemon }) {
  const slots = Math.max(BADGE_SLOTS, trainer.badges)

  return (
    <article className="trainer-card">
      <header className="trainer-card__header">
        <div>
          <p className="trainer-card__position tabular">{position}</p>
          <h2 className="trainer-card__name">{trainer.name}</h2>
        </div>
        <p className="trainer-card__badges">
          <span className="tabular">{pluralize(trainer.badges, 'insígnia', 'insígnias')}</span>
          <span className="trainer-card__pips" aria-hidden="true">
            {Array.from({ length: slots }, (_, index) => (
              <span key={index} className="trainer-card__pip" data-filled={index < trainer.badges || undefined} />
            ))}
          </span>
        </p>
      </header>

      <ul className="trainer-card__team" aria-label={`Equipe de ${trainer.name}`}>
        {trainer.team.map((pokemon, index) => (
          // Chave por posição: a equipe pode repetir o mesmo Pokémon (Koga tem três Venonat).
          <li key={`${pokemon.id}-${index}`}>
            <button type="button" className="trainer-card__member" onClick={() => onSelectPokemon(pokemon.id)}>
              <PokemonImage pokemon={pokemon} decorative />
              <span className="trainer-card__member-name">{pokemon.name}</span>
              <span className="trainer-card__member-id tabular">{formatId(pokemon.id)}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
