/** 25 -> "#025" */
export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`
}

/** "Mr. Mime" -> "MM", "Pikachu" -> "Pi" */
export function initials(name) {
  const words = name.split(/[\s.-]+/).filter(Boolean)
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2)
}

/** ["Ash", "Gary", "Misty"] -> "Ash, Gary e Misty" */
export function joinNames(names) {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`
}

/** (1, "insígnia", "insígnias") -> "1 insígnia" */
export function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`
}
