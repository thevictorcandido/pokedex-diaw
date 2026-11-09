import raw from '../data/pokedex-data.json'
import { FALLBACK_TYPE } from '../constants/types.js'
import { STATS } from '../constants/stats.js'

/**
 * Transforma o JSON do professor no formato que a tela usa:
 * - tipos como lista de nomes, com "Typeless" quando o Pokémon vem sem tipo;
 * - total dos seis atributos e posição no ranking pelo total;
 * - nomes dos treinadores que têm cada Pokémon;
 * - treinadores com a equipe resolvida pelos pokemonIds;
 * - contagem de Pokémon por tipo e média de cada atributo.
 */
export function buildPokedex(data) {
  const trainersOf = new Map()
  for (const trainer of data.trainers) {
    for (const id of new Set(trainer.pokemonIds)) {
      if (!trainersOf.has(id)) trainersOf.set(id, [])
      trainersOf.get(id).push(trainer.name)
    }
  }

  const base = data.pokemon.map((p) => ({
    id: p.id,
    name: p.name,
    stats: { ...p.stats },
    types: p.types.length > 0 ? p.types.map((t) => t.name) : [FALLBACK_TYPE],
    total: STATS.reduce((sum, { key }) => sum + p.stats[key], 0),
    trainers: trainersOf.get(p.id) ?? [],
  }))

  // Ranking de competição: totais iguais dividem a posição (1, 2, 2, 4...).
  const totals = base.map((p) => p.total).sort((a, b) => b - a)
  const pokemon = base.map((p) => ({ ...p, rank: totals.indexOf(p.total) + 1 }))

  const byId = new Map(pokemon.map((p) => [p.id, p]))

  const typeCounts = new Map()
  for (const p of pokemon) {
    for (const type of p.types) typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1)
  }
  // A ordem dos tipos segue os ids do JSON, com Typeless (a exceção do Mew) no fim;
  // tipo sem nenhum Pokémon fica de fora.
  const types = data.types
    .filter((t) => typeCounts.has(t.name))
    .sort((a, b) => (a.name === FALLBACK_TYPE) - (b.name === FALLBACK_TYPE) || a.id - b.id)
    .map((t) => ({ name: t.name, count: typeCounts.get(t.name) }))

  const averages = Object.fromEntries(
    STATS.map(({ key }) => [key, pokemon.reduce((sum, p) => sum + p.stats[key], 0) / pokemon.length]),
  )

  const trainers = data.trainers.map((t) => ({
    id: t.id,
    name: t.name,
    badges: t.badges,
    team: t.pokemonIds.map((id) => byId.get(id)).filter(Boolean),
  }))

  return { pokemon, byId, types, trainers, averages }
}

export const pokedex = buildPokedex(raw)
