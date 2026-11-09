import { describe, expect, it } from 'vitest'
import { describePosition, describeSeen, neighbours } from './describe.js'

describe('describePosition', () => {
  it('sem filtro, só a posição', () => {
    expect(describePosition({ index: 5, count: 151 })).toBe('6 de 151')
  })

  it('cita a busca, o tipo e os favoritos', () => {
    expect(describePosition({ index: 0, count: 1, query: ' char ', type: 'Flying', favoritesOnly: true })).toBe(
      '1 de 1 · “char” · Flying · favoritos',
    )
  })

  it('avisa quando a lista está vazia', () => {
    expect(describePosition({ index: 0, count: 0, query: 'xyz' })).toBe('Nenhum resultado')
  })
})

describe('describeSeen', () => {
  it('conta os vistos', () => {
    expect(describeSeen(23, 151)).toBe('Vistos 23 de 151')
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
