/**
 * Imagens do repositório público de sprites da PokéAPI
 * (https://github.com/PokeAPI/sprites). A Pokédex funciona sem elas:
 * o PokemonImage mostra as iniciais quando a imagem falha.
 */
const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const spriteUrl = (id) => `${BASE}/${id}.png`
export const artworkUrl = (id) => `${BASE}/other/official-artwork/${id}.png`
