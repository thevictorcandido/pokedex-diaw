import { STATS } from '../constants/stats.js'
import { typeRelations, formatMultiplier } from '../utils/typeChart.js'
import { joinNames } from '../utils/format.js'
import StatBar from './StatBar.jsx'
import TypeBadge from './TypeBadge.jsx'

/** Aba Atributos: seis barras em segmentos, total e posição entre os 151. */
export function PokemonStats({ pokemon, total, averages, seenCount, onResetSeen }) {
  return (
    <>
      <div className="info-head">
        <h3>Atributos</h3>
        <p className="info-head__figure tabular">
          <strong>{pokemon.total}</strong> · {pokemon.rank}º de {total}
        </p>
      </div>
      {/* key: as barras crescem de novo a cada Pokémon */}
      <div key={pokemon.id}>
        {STATS.map(({ key, label }, index) => (
          <StatBar key={key} label={label} value={pokemon.stats[key]} average={averages[key]} index={index} />
        ))}
      </div>
      <div className="info-foot">
        <span>Cada segmento vale 51 pontos; o traço é a média dos {total}.</span>
        {seenCount > 0 && (
          <button type="button" onClick={onResetSeen}>
            Zerar vistos
          </button>
        )}
      </div>
    </>
  )
}

const GROUPS = [
  { key: 'weaknesses', label: 'Fraquezas', empty: 'Nenhuma' },
  { key: 'resistances', label: 'Resistências', empty: 'Nenhuma' },
  { key: 'immunities', label: 'Imunidades', empty: 'Nenhuma' },
]

/** Aba Tipagem: quanto dano cada tipo de ataque causa neste Pokémon. */
export function PokemonTyping({ pokemon }) {
  const relations = typeRelations(pokemon.types)
  const hasAny = GROUPS.some(({ key }) => relations[key].length > 0)

  return (
    <>
      <div className="info-head">
        <h3>Tipagem de {pokemon.name}</h3>
      </div>
      {hasAny ? (
        <dl className="relations">
          {GROUPS.map(({ key, label, empty }) => (
            <div key={key} style={{ display: 'contents' }}>
              <dt>{label}</dt>
              <dd>
                {relations[key].length === 0 && <span className="relations__none">{empty}</span>}
                {relations[key].map(({ type, multiplier }) => (
                  <TypeBadge key={type} type={type} extra={formatMultiplier(multiplier)} />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="info-note">Sem tipo no JSON: nenhuma relação de tipagem.</p>
      )}
      <p className="info-note">Tabela de tipos da 2ª geração, a mesma do JSON (com Steel e Dark, sem Fairy).</p>
    </>
  )
}

/** Aba Treinadores: quem tem este Pokémon na equipe, com atalho para cada um. */
export function PokemonOwners({ pokemon, trainers, onOpenTrainer }) {
  const owners = trainers.filter((trainer) => pokemon.trainers.includes(trainer.name))

  return (
    <>
      <div className="info-head">
        <h3>Treinadores</h3>
      </div>
      {owners.length === 0 ? (
        <p className="info-note">Nenhum dos 12 treinadores tem {pokemon.name} na equipe.</p>
      ) : (
        <>
          <p className="info-note">
            Na equipe de <strong>{joinNames(owners.map((t) => t.name))}</strong>.
          </p>
          <ul className="owner-list" style={{ marginTop: 10 }}>
            {owners.map((trainer) => (
              <li key={trainer.id}>
                <button type="button" onClick={() => onOpenTrainer(trainer.id)}>
                  Ver {trainer.name}
                  <span className="tabular">{trainer.badges} insígnias</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

/** Tela azul no modo Treinadores: os 12, para escolher qual vai ao visor. */
export function TrainerList({ trainers, currentId, onSelect }) {
  return (
    <>
      <div className="info-head">
        <h3>Treinadores</h3>
        <p className="info-head__figure tabular">{trainers.length}</p>
      </div>
      <ul className="trainer-list">
        {trainers.map((trainer) => (
          <li key={trainer.id}>
            <button
              type="button"
              aria-current={trainer.id === currentId || undefined}
              onClick={() => onSelect(trainer.id)}
            >
              {trainer.name}
              <span className="tabular">{trainer.badges} ins.</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
