/** Ordem, rótulos e abreviações dos seis atributos do JSON. */
export const STATS = [
  { key: 'hp', label: 'HP', short: 'HP' },
  { key: 'attack', label: 'Ataque', short: 'Atq.' },
  { key: 'defense', label: 'Defesa', short: 'Def.' },
  { key: 'specialAttack', label: 'Ataque especial', short: 'Atq. esp.' },
  { key: 'specialDefense', label: 'Defesa especial', short: 'Def. esp.' },
  { key: 'speed', label: 'Velocidade', short: 'Vel.' },
]

/** Teto da escala das barras: o maior valor possível de um atributo base. */
export const STAT_MAX = 255

/** Campos que a lista sabe ordenar. */
export const SORT_FIELDS = [
  { key: 'id', label: 'Número' },
  { key: 'name', label: 'Nome' },
  ...STATS.map(({ key, label }) => ({ key, label })),
  { key: 'total', label: 'Total' },
]
