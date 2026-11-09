/**
 * Busca, filtro e ordenação da lista. Funções puras: recebem a lista e os
 * critérios e devolvem uma lista nova, sem alterar a original.
 */

/** Minúsculas, sem acento e sem espaços nas pontas. */
export function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Busca por nome (trecho em qualquer posição) ou por número.
 * "25" e "#25" acham o 25 e os que começam com 25; "025" compara com o número
 * de três dígitos, então "00" lista do 1 ao 9.
 */
export function matchesQuery(pokemon, query) {
  const q = normalizeText(query).replace(/^#/, '')
  if (q === '') return true

  if (/^\d+$/.test(q)) {
    const id = String(pokemon.id)
    return q.startsWith('0') ? id.padStart(3, '0').startsWith(q) : id.startsWith(q)
  }

  return normalizeText(pokemon.name).includes(q)
}

export function matchesType(pokemon, type) {
  return !type || pokemon.types.includes(type)
}

export function filterPokemon(list, { query = '', type = null } = {}) {
  return list.filter((pokemon) => matchesType(pokemon, type) && matchesQuery(pokemon, query))
}

function sortValue(pokemon, key) {
  if (key === 'id' || key === 'name' || key === 'total') return pokemon[key]
  return pokemon.stats[key]
}

/**
 * Ordena por número, nome, total ou um dos seis atributos.
 * Empates ficam na ordem do número, para a lista não "pular" ao reordenar.
 */
export function sortPokemon(list, { key = 'id', direction = 'asc' } = {}) {
  const sign = direction === 'desc' ? -1 : 1
  return [...list].sort((a, b) => {
    const va = sortValue(a, key)
    const vb = sortValue(b, key)
    const diff = typeof va === 'string' ? va.localeCompare(vb, 'pt-BR') : va - vb
    return diff !== 0 ? diff * sign : a.id - b.id
  })
}

/** Direção inicial ao clicar numa coluna: número e nome sobem, atributos descem. */
export function defaultDirection(key) {
  return key === 'id' || key === 'name' ? 'asc' : 'desc'
}
