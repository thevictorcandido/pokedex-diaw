import { formatId, pluralize } from '../utils/format.js'
import PokemonImage from './PokemonImage.jsx'

/** Kanto tem 8 insígnias; quem tem mais (Ash, Gary e Lance, com 9) mostra todas. */
const BADGE_SLOTS = 8

/** Um treinador: nome, insígnias e a equipe, que abre o detalhe de cada Pokémon. */
export default function TrainerCard({ trainer, onSelectPokemon }) {
  const slots = Math.max(BADGE_SLOTS, trainer.badges)
  const teamIds = trainer.team.map((p) => p.id)

  return (
    <li className="trainer-card">
      <div className="trainer-card__info">
        <h2 className="trainer-card__name">{trainer.name}</h2>
        <p className="trainer-card__badges">
          <span className="tabular">{pluralize(trainer.badges, 'insígnia', 'insígnias')}</span>
          <span className="trainer-card__pips" aria-hidden="true">
            {Array.from({ length: slots }, (_, index) => (
              <span key={index} className="trainer-card__pip" data-filled={index < trainer.badges || undefined} />
            ))}
          </span>
        </p>
      </div>

      <ul className="trainer-card__team" aria-label={`Equipe de ${trainer.name}`}>
        {trainer.team.map((pokemon, index) => (
          // Chave por posição: a equipe pode repetir o mesmo Pokémon (Koga tem três Venonat).
          <li key={`${pokemon.id}-${index}`}>
            <button
              type="button"
              className="trainer-card__member"
              aria-haspopup="dialog"
              onClick={() => onSelectPokemon(pokemon.id, teamIds)}
            >
              <PokemonImage pokemon={pokemon} decorative />
              <span className="trainer-card__member-text">
                <span className="trainer-card__member-name">{pokemon.name}</span>
                <span className="trainer-card__member-id tabular">{formatId(pokemon.id)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </li>
  )
}
