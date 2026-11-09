import { describe, expect, it } from 'vitest'
import { describeResults, neighbours } from './describe.js'

const byId = { key: 'id', direction: 'asc' }

describe('describeResults', () => {
  it('sem filtro, conta os Pokémon', () => {
    expect(describeResults({ count: 151, query: '', type: null, sort: byId })).toBe('151 Pokémon de Kanto')
  })

  it('com tipo, diz o tipo', () => {
    expect(describeResults({ count: 12, query: '', type: 'Fire', sort: byId })).toBe('12 do tipo Fire')
  })

  it('com busca, cita o texto e acerta o singular', () => {
    expect(describeResults({ count: 1, query: ' char ', type: 'Flying', sort: byId })).toBe(
      '1 resultado para “char” no tipo Flying',
    )
    expect(describeResults({ count: 0, query: 'xyz', type: null, sort: byId })).toBe('0 resultados para “xyz”')
  })

  it('acrescenta a ordenação quando não é a padrão', () => {
    expect(describeResults({ count: 151, query: '', type: null, sort: { key: 'speed', direction: 'desc' } })).toBe(
      '151 Pokémon de Kanto · por velocidade, do maior para o menor',
    )
  })
})

describe('neighbours', () => {
  it('acha o anterior e o próximo', () => {
    expect(neighbours([4, 5, 6], 5)).toEqual({ previousId: 4, nextId: 6 })
  })

  it('não passa das pontas nem acha id ausente', () => {
    expect(neighbours([4, 5, 6], 4)).toEqual({ previousId: null, nextId: 5 })
    expect(neighbours([4, 5, 6], 6)).toEqual({ previousId: 5, nextId: null })
    expect(neighbours([4, 5, 6], 9)).toEqual({ previousId: null, nextId: null })
  })
})
