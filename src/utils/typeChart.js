/**
 * Tabela de tipos da 2ª à 5ª geração: a que combina com o JSON, que tem Steel
 * e Dark e não tem Fairy. Guarda só o que foge de ×1: TYPE_CHART[ataque][defesa].
 */
export const ATTACK_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground',
  'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel',
]

export const TYPE_CHART = {
  Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
  Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
  Grass: {
    Water: 2, Ground: 2, Rock: 2,
    Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5,
  },
  Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Fighting: {
    Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2,
    Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Ghost: 0,
  },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: {
    Grass: 2, Psychic: 2, Dark: 2,
    Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5,
  },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Steel: 0.5, Normal: 0 },
  Dragon: { Dragon: 2, Steel: 0.5 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Steel: 0.5 },
  Steel: { Ice: 2, Rock: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
}

/** Quanto um ataque do tipo `attack` causa num Pokémon com estes tipos. */
export function effectiveness(attack, defenders) {
  return defenders.reduce((total, defender) => total * (TYPE_CHART[attack]?.[defender] ?? 1), 1)
}

/**
 * Fraquezas, resistências e imunidades de um Pokémon, do lado de quem defende.
 * Typeless (o Mew do JSON) não está na tabela e não tem relação nenhuma.
 */
export function typeRelations(types) {
  const known = types.filter((type) => type in TYPE_CHART)
  const result = { weaknesses: [], resistances: [], immunities: [] }
  if (known.length === 0) return result

  for (const attack of ATTACK_TYPES) {
    const multiplier = effectiveness(attack, known)
    if (multiplier > 1) result.weaknesses.push({ type: attack, multiplier })
    else if (multiplier === 0) result.immunities.push({ type: attack, multiplier })
    else if (multiplier < 1) result.resistances.push({ type: attack, multiplier })
  }

  // Mais forte primeiro; empate fica na ordem da tabela (sort é estável).
  result.weaknesses.sort((a, b) => b.multiplier - a.multiplier)
  result.resistances.sort((a, b) => a.multiplier - b.multiplier)
  return result
}

const LABELS = { 4: '×4', 2: '×2', 0.5: '×½', 0.25: '×¼', 0: '×0' }

export function formatMultiplier(multiplier) {
  return LABELS[multiplier] ?? `×${multiplier}`
}
