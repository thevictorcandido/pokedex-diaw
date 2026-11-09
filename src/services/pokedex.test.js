import { describe, expect, it } from 'vitest'
import { buildPokedex, pokedex } from './pokedex.js'
import raw from '../data/pokedex-data.json'

describe('pokedex', () => {
  it('carrega os 151 Pokémon e os 12 treinadores do JSON', () => {
    expect(pokedex.pokemon).toHaveLength(raw.pokemon.length)
    expect(pokedex.pokemon).toHaveLength(151)
    expect(pokedex.trainers).toHaveLength(12)
  })

  it('soma os seis atributos no total', () => {
    expect(pokedex.byId.get(1).total).toBe(45 + 49 + 49 + 65 + 65 + 45)
  })

  it('dá a mesma posição a totais iguais', () => {
    expect(pokedex.byId.get(150).rank).toBe(1) // Mewtwo, 680
    expect(pokedex.byId.get(149).rank).toBe(2) // Dragonite, 600
    expect(pokedex.byId.get(151).rank).toBe(2) // Mew, 600
    expect(pokedex.byId.get(6).rank).toBe(11) // Charizard, 534
  })

  it('mostra o Mew, que vem sem tipo, como Typeless', () => {
    expect(pokedex.byId.get(151).types).toEqual(['Typeless'])
  })

  it('lista só os tipos que têm Pokémon, com a contagem', () => {
    const names = pokedex.types.map((t) => t.name)
    expect(names).not.toContain('Dark')
    expect(pokedex.types.find((t) => t.name === 'Water').count).toBe(32)
    expect(pokedex.types.find((t) => t.name === 'Typeless').count).toBe(1)
  })

  it('resolve a equipe dos treinadores, mantendo repetidos', () => {
    const koga = pokedex.trainers.find((t) => t.name === 'Koga')
    expect(koga.team.map((p) => p.name)).toEqual(['Venonat', 'Venonat', 'Venonat', 'Venomoth'])
  })

  it('liga cada Pokémon aos treinadores que o têm, sem repetir', () => {
    expect(pokedex.byId.get(6).trainers).toEqual(['Ash'])
    expect(pokedex.byId.get(65).trainers).toEqual(['Sabrina', 'Gary'])
    expect(pokedex.byId.get(149).trainers).toEqual(['Lance'])
    expect(pokedex.byId.get(10).trainers).toEqual([])
  })

  it('ignora id de treinador que não existe na lista de Pokémon', () => {
    const data = { ...raw, trainers: [{ id: 1, name: 'Teste', badges: 0, pokemonIds: [1, 999] }] }
    expect(buildPokedex(data).trainers[0].team.map((p) => p.id)).toEqual([1])
  })

  it('calcula a média de cada atributo', () => {
    const hp = raw.pokemon.reduce((sum, p) => sum + p.stats.hp, 0) / 151
    expect(pokedex.averages.hp).toBeCloseTo(hp)
  })
})
