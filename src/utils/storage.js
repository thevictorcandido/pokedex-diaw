/**
 * Leitura e escrita no localStorage sem quebrar a tela: em janela anônima ou
 * com armazenamento bloqueado, o acesso lança erro e a Pokédex segue sem guardar.
 */
export function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sem armazenamento disponível: a preferência vale só nesta visita.
  }
}
