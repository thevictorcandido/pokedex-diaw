/** Marca da Pokédex: círculo dividido, desenhado em SVG. */
export default function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
      <path d="M2 16a14 14 0 0 1 28 0z" fill="#c8202f" stroke="#1c1917" strokeWidth="3" />
      <circle cx="16" cy="16" r="5" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
    </svg>
  )
}
