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
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      writeStorage(KEY, next)
      return next
    })
  }

  return { theme, toggleTheme }
}
