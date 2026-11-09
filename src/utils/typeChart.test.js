import { describe, expect, it } from 'vitest'
import { ATTACK_TYPES, TYPE_CHART, effectiveness, formatMultiplier, typeRelations } from './typeChart.js'
import { pokedex } from '../services/pokedex.js'

const pick = (list) => Object.fromEntries(list.map(({ type, multiplier }) => [type, multiplier]))

describe('TYPE_CHART', () => {
  it('cobre os 17 tipos do JSON que têm relação (todos menos Typeless)', () => {
    const jsonTypes = new Set(pokedex.pokemon.flatMap((p) => p.types))
    jsonTypes.delete('Typeless')
    for (const type of jsonTypes) expect(ATTACK_TYPES).toContain(type)
    expect(Object.keys(TYPE_CHART).sort()).toEqual([...ATTACK_TYPES].sort())
  })

  it('só usa os multiplicadores da série', () => {
    const values = Object.values(TYPE_CHART).flatMap((row) => Object.values(row))
    expect(new Set(values)).toEqual(new Set([2, 0.5, 0]))
  })
})

describe('effectiveness', () => {
  it('multiplica os dois tipos de quem defende', () => {
    expect(effectiveness('Rock', ['Fire', 'Flying'])).toBe(4)
    expect(effectiveness('Grass', ['Fire', 'Flying'])).toBe(0.25)
    expect(effectiveness('Ground', ['Fire', 'Flying'])).toBe(0)
    expect(effectiveness('Normal', ['Water'])).toBe(1)
  })
})

describe('typeRelations', () => {
  it('Charizard: Rock ×4, Water e Electric ×2, imune a Ground', () => {
    const r = typeRelations(['Fire', 'Flying'])
    expect(pick(r.weaknesses)).toEqual({ Rock: 4, Water: 2, Electric: 2 })
    expect(r.weaknesses[0].type).toBe('Rock')
    expect(pick(r.resistances)).toEqual({ Grass: 0.25, Bug: 0.25, Fire: 0.5, Fighting: 0.5, Steel: 0.5 })
    expect(pick(r.immunities)).toEqual({ Ground: 0 })
  })

  it('Gengar: imune a Normal e Fighting', () => {
    const r = typeRelations(['Ghost', 'Poison'])
    expect(pick(r.immunities)).toEqual({ Normal: 0, Fighting: 0 })
    expect(pick(r.weaknesses)).toEqual({ Ground: 2, Psychic: 2, Ghost: 2, Dark: 2 })
  })

  it('Magnemite (Electric/Steel): Ground ×4 e imune a Poison', () => {
    const r = typeRelations(pokedex.byId.get(81).types)
    expect(pick(r.weaknesses)).toEqual({ Ground: 4, Fire: 2, Fighting: 2 })
    expect(pick(r.immunities)).toEqual({ Poison: 0 })
  })

  it('Mew (Typeless) não tem relação', () => {
    expect(typeRelations(pokedex.byId.get(151).types)).toEqual({ weaknesses: [], resistances: [], immunities: [] })
  })
})

describe('formatMultiplier', () => {
  it('escreve frações como na série', () => {
    expect([4, 2, 0.5, 0.25, 0].map(formatMultiplier)).toEqual(['×4', '×2', '×½', '×¼', '×0'])
  })
})
