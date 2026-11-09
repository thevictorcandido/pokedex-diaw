import { describe, expect, it } from 'vitest'
import { defaultDirection, filterPokemon, filterTrainers, matchesQuery, normalizeText, sortPokemon } from './filters.js'
import { pokedex } from '../services/pokedex.js'

const ids = (list) => list.map((p) => p.id)
const { pokemon } = pokedex

describe('normalizeText', () => {
  it('tira acento, espaços e maiúsculas', () => {
    expect(normalizeText('  Pokémon ')).toBe('pokemon')
  })
})

describe('matchesQuery', () => {
  const pikachu = pokedex.byId.get(25)

  it('acha por trecho do nome, sem diferenciar maiúsculas', () => {
    expect(matchesQuery(pikachu, 'kach')).toBe(true)
    expect(matchesQuery(pikachu, 'PIKA')).toBe(true)
    expect(matchesQuery(pikachu, 'bulba')).toBe(false)
  })

  it('acha por número, com ou sem # e zeros à esquerda', () => {
    expect(matchesQuery(pikachu, '25')).toBe(true)
    expect(matchesQuery(pikachu, '#25')).toBe(true)
    expect(matchesQuery(pikachu, '025')).toBe(true)
    expect(matchesQuery(pikachu, '#025')).toBe(true)
    expect(matchesQuery(pikachu, '26')).toBe(false)
  })

  it('aceita busca vazia', () => {
    expect(matchesQuery(pikachu, '   ')).toBe(true)
  })
})

describe('filterPokemon', () => {
  it('"Bulba" devolve o Bulbasaur, como no enunciado', () => {
    expect(ids(filterPokemon(pokemon, { query: 'Bulba' }))).toEqual([1])
  })

  it('número sem zero lista os que começam com ele', () => {
    expect(ids(filterPokemon(pokemon, { query: '15' }))).toEqual([15, 150, 151])
  })

  it('"00" lista do 1 ao 9', () => {
    expect(ids(filterPokemon(pokemon, { query: '00' }))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('filtra por tipo, contando quem tem dois tipos', () => {
    const fire = filterPokemon(pokemon, { type: 'Fire' })
    expect(fire).toHaveLength(12)
    expect(fire.every((p) => p.types.includes('Fire'))).toBe(true)
    expect(filterPokemon(pokemon, { type: 'Poison' })).toHaveLength(33)
  })

  it('combina busca e tipo', () => {
    expect(ids(filterPokemon(pokemon, { query: 'char', type: 'Flying' }))).toEqual([6])
  })

  it('devolve lista vazia quando nada combina', () => {
    expect(filterPokemon(pokemon, { query: 'agumon' })).toEqual([])
  })

  it('não altera a lista original', () => {
    const copy = [...pokemon]
    filterPokemon(pokemon, { type: 'Water' })
    expect(pokemon).toEqual(copy)
  })
})

describe('sortPokemon', () => {
  it('ordena por atributo, do maior para o menor', () => {
    const byHp = sortPokemon(pokemon, { key: 'hp', direction: 'desc' })
    expect(byHp[0].name).toBe('Chansey')
    expect(byHp[0].stats.hp).toBe(250)
  })

  it('ordena por total e desempata pelo número', () => {
    const byTotal = sortPokemon(pokemon, { key: 'total', direction: 'desc' })
    expect(byTotal.slice(0, 3).map((p) => p.name)).toEqual(['Mewtwo', 'Dragonite', 'Mew'])
  })

  it('ordena por nome em ordem alfabética', () => {
    const byName = sortPokemon(pokemon, { key: 'name' })
    expect(byName[0].name).toBe('Abra')
    expect(byName.at(-1).name).toBe('Zubat')
  })

  it('volta à ordem do número', () => {
    const shuffled = sortPokemon(pokemon, { key: 'speed', direction: 'desc' })
    expect(ids(sortPokemon(shuffled, { key: 'id' }))).toEqual(ids(pokemon))
  })
})

describe('filterTrainers', () => {
  const names = (list) => list.map((t) => t.name)

  it('acha pelo nome do treinador', () => {
    expect(names(filterTrainers(pokedex.trainers, 'mist'))).toEqual(['Misty'])
  })

  it('acha pelo Pokémon da equipe', () => {
    expect(names(filterTrainers(pokedex.trainers, 'pikachu'))).toEqual(['Ash'])
    expect(names(filterTrainers(pokedex.trainers, 'alakazam'))).toEqual(['Sabrina', 'Gary'])
  })

  it('devolve todos com busca vazia', () => {
    expect(filterTrainers(pokedex.trainers, '')).toHaveLength(12)
  })
})

describe('defaultDirection', () => {
  it('número e nome sobem; atributos descem', () => {
    expect(defaultDirection('id')).toBe('asc')
    expect(defaultDirection('name')).toBe('asc')
    expect(defaultDirection('attack')).toBe('desc')
    expect(defaultDirection('total')).toBe('desc')
  })
})
