import { SORT_FIELDS } from '../constants/stats.js'

/**
 * Linha que diz o que está na tela, logo abaixo do título.
 * Ex.: "151 Pokémon de Kanto", "12 do tipo Fire", "1 resultado para “char” no tipo Flying".
 */
export function describeResults({ count, query, type, sort, scope = 'de Kanto' }) {
  const q = query.trim()
  let text

  if (q) {
    text = `${count} ${count === 1 ? 'resultado' : 'resultados'} para “${q}”${type ? ` no tipo ${type}` : ''}`
  } else if (type) {
    text = `${count} do tipo ${type}`
  } else {
    text = `${count} Pokémon ${scope}`
  }

  return `${text}${describeSort(sort)}`
}

export function describeSort({ key, direction }) {
  if (key === 'id' && direction === 'asc') return ''
  const label = SORT_FIELDS.find((field) => field.key === key)?.label.toLowerCase() ?? key
  if (key === 'id') return ' · do maior número para o menor'
  if (key === 'name') return direction === 'asc' ? ' · por nome, de A a Z' : ' · por nome, de Z a A'
  return ` · por ${label}, ${direction === 'desc' ? 'do maior para o menor' : 'do menor para o maior'}`
}

/** Anterior e próximo de um id numa lista de ids. */
export function neighbours(ids, id) {
  const index = ids.indexOf(id)
  if (index === -1) return { previousId: null, nextId: null }
  return {
    previousId: index > 0 ? ids[index - 1] : null,
    nextId: index < ids.length - 1 ? ids[index + 1] : null,
  }
}
