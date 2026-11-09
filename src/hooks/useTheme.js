import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage.js'

const KEY = 'pokedex:tema'

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Tema claro ou escuro: começa pelo do sistema e lembra a escolha da pessoa. */
export function useTheme() {
  const [theme, setTheme] = useState(() => readStorage(KEY, null) ?? systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    // Só a escolha explícita fica salva; sem ela, o tema acompanha o sistema.
    writeStorage(KEY, next)
  }

  return { theme, toggleTheme }
}
