/**
 * Textos curtos do LCD verde: onde a pessoa está na lista e o que está filtrando.
 * Ex.: "4 de 12 · Fire", "1 de 3 · “char”", "Nenhum resultado".
 */
export function describePosition({ index, count, query = '', type = null, favoritesOnly = false }) {
  if (count === 0) return 'Nenhum resultado'
  const parts = [`${index + 1} de ${count}`]
  const q = query.trim()
  if (q) parts.push(`“${q}”`)
  if (type) parts.push(type)
  if (favoritesOnly) parts.push('favoritos')
  return parts.join(' · ')
}

export function describeSeen(seenCount, total) {
  return `Vistos ${seenCount} de ${total}`
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
