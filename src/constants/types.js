/**
 * Matiz (H) e croma de cada tipo, usados para gerar o fundo pálido e a tinta
 * escura dos selos em OKLCH (ver DESIGN.md, seção "Cores dos tipos").
 */
export const TYPE_HUES = {
  Typeless: { hue: 0, chroma: 0 },
  Normal: { hue: 80, chroma: 0.02 },
  Fire: { hue: 40, chroma: 0.11 },
  Water: { hue: 245, chroma: 0.11 },
  Grass: { hue: 145, chroma: 0.11 },
  Electric: { hue: 95, chroma: 0.11 },
  Ice: { hue: 210, chroma: 0.09 },
  Fighting: { hue: 25, chroma: 0.11 },
  Poison: { hue: 320, chroma: 0.11 },
  Ground: { hue: 65, chroma: 0.1 },
  Flying: { hue: 260, chroma: 0.09 },
  Psychic: { hue: 355, chroma: 0.11 },
  Bug: { hue: 125, chroma: 0.1 },
  Rock: { hue: 70, chroma: 0.07 },
  Ghost: { hue: 295, chroma: 0.1 },
  Dark: { hue: 40, chroma: 0.03 },
  Dragon: { hue: 275, chroma: 0.11 },
  Steel: { hue: 235, chroma: 0.03 },
}

/** Tipo usado quando o Pokémon vem sem tipos no JSON (caso do Mew). */
export const FALLBACK_TYPE = 'Typeless'

/** Variáveis CSS que os selos e fundos usam para montar as cores do tipo. */
export function typeStyle(typeName) {
  const { hue, chroma } = TYPE_HUES[typeName] ?? TYPE_HUES.Typeless
  return { '--type-hue': hue, '--type-chroma': chroma }
}
