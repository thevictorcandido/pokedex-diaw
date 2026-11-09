import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pokedex } from './services/pokedex.js'
import { usePokedexFilters } from './hooks/usePokedexFilters.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useSeen } from './hooks/useSeen.js'
import { useTheme } from './hooks/useTheme.js'
import { useMediaQuery } from './hooks/useMediaQuery.js'
import { filterTrainers } from './utils/filters.js'
import { describePosition, describeSeen } from './utils/describe.js'
import { pluralize } from './utils/format.js'
import { typeStyle } from './constants/types.js'
import BrandMark from './components/BrandMark.jsx'
import Icon from './components/Icon.jsx'
import DeviceTop from './components/DeviceTop.jsx'
import MainScreen from './components/MainScreen.jsx'
import PokemonCard from './components/PokemonCard.jsx'
import PokemonList from './components/PokemonList.jsx'
import TrainerCard from './components/TrainerCard.jsx'
import EmptyState from './components/EmptyState.jsx'
import StatusLcd from './components/StatusLcd.jsx'
import DPad from './components/DPad.jsx'
import SearchBar from './components/SearchBar.jsx'
import InfoScreen from './components/InfoScreen.jsx'
import { PokemonOwners, PokemonStats, PokemonTyping, TrainerList } from './components/PokemonDetails.jsx'
import TypeFilter from './components/TypeFilter.jsx'
import { FavoritesToggle, ModeSwitch, RandomButton, ScreenPills, SortSelect } from './components/PanelControls.jsx'
import './css/App.css'

const TOTAL = pokedex.pokemon.length
const INFO_TABS = [
  { id: 'stats', label: 'Atributos' },
  { id: 'typing', label: 'Tipagem' },
  { id: 'owners', label: 'Treinadores' },
]

export default function App() {
  const [mode, setMode] = useState('pokemon') // 'pokemon' ou 'trainers'
  const [listOpen, setListOpen] = useState(false) // visor em grade de miniaturas
  const [currentId, setCurrentId] = useState(1)
  const [trainerId, setTrainerId] = useState(pokedex.trainers[0].id)
  const [infoTab, setInfoTab] = useState('stats')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [loadedId, setLoadedId] = useState(null) // id cuja arte carregou (luz verde)

  const { theme, toggleTheme } = useTheme()
  const { favorites, toggleFavorite } = useFavorites()
  const { seen, markSeen, resetSeen } = useSeen()
  const columns = useMediaQuery('(max-width: 599px)') ? 3 : 4

  const source = useMemo(
    () => (favoritesOnly ? pokedex.pokemon.filter((p) => favorites.has(p.id)) : pokedex.pokemon),
    [favoritesOnly, favorites],
  )
  const { query, setQuery, type, setType, sort, setSort, clearFilters, visible } = usePokedexFilters(source)
  const trainers = useMemo(() => filterTrainers(pokedex.trainers, query), [query])

  // Estado derivado: se o Pokémon escolhido saiu da lista, o visor mostra o primeiro.
  const current = visible.find((p) => p.id === currentId) ?? visible[0] ?? null
  const index = current ? visible.indexOf(current) : -1
  const trainerIndex = Math.max(0, trainers.findIndex((t) => t.id === trainerId))
  const trainer = trainers[trainerIndex] ?? null

  const isPokemon = mode === 'pokemon'
  const filtered = Boolean(query.trim() || type || favoritesOnly)

  // Abrir um Pokémon no visor o registra como visto.
  useEffect(() => {
    if (isPokemon && !listOpen && current) markSeen(current.id)
  }, [isPokemon, listOpen, current, markSeen])

  const showPokemon = useCallback((id) => {
    setCurrentId(id)
    setListOpen(false)
  }, [])

  function clearAll() {
    clearFilters()
    setFavoritesOnly(false)
  }

  /** Vai ao Pokémon mesmo que o filtro atual o esconda (equipe de treinador). */
  function openFromTrainer(id) {
    clearAll()
    setMode('pokemon')
    showPokemon(id)
  }

  function openTrainer(id) {
    setQuery('')
    setTrainerId(id)
    setMode('trainers')
  }

  function changeType(next) {
    setType(next)
    setMode('pokemon')
  }

  function openRandom() {
    const pool = visible.length > 0 ? visible : pokedex.pokemon
    if (visible.length === 0) clearAll()
    let pick = pool[Math.floor(Math.random() * pool.length)]
    // Com mais de um na lista, nunca sorteia o que já está na tela.
    while (pool.length > 1 && pick.id === current?.id) pick = pool[Math.floor(Math.random() * pool.length)]
    setMode('pokemon')
    showPokemon(pick.id)
  }

  // Direcional: cada ação existe só quando há para onde ir.
  const moveBy = (delta) => {
    if (isPokemon) {
      const target = visible[index + delta]
      return target ? () => setCurrentId(target.id) : null
    }
    const target = trainers[trainerIndex + delta]
    return target ? () => setTrainerId(target.id) : null
  }
  const dpad = {
    onLeft: moveBy(-1),
    onRight: moveBy(1),
    onUp: isPokemon && listOpen ? moveBy(-columns) : null,
    onDown: isPokemon && listOpen ? moveBy(columns) : null,
    onCenter: isPokemon && visible.length > 0 ? () => setListOpen((open) => !open) : null,
  }

  // Teclado do computador: setas = direcional, L = lista, Esc = fecha a lista.
  const keyboard = useRef(null)
  useEffect(() => {
    keyboard.current = { dpad, listOpen }
  })
  useEffect(() => {
    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || !keyboard.current) return
      if (event.target.closest?.('input, select, textarea, [role="tablist"]')) return
      const { dpad: pad, listOpen: open } = keyboard.current
      const actions = {
        ArrowLeft: pad.onLeft,
        ArrowRight: pad.onRight,
        ArrowUp: pad.onUp,
        ArrowDown: pad.onDown,
        l: pad.onCenter,
        L: pad.onCenter,
        Escape: open ? () => setListOpen(false) : null,
      }
      if (!(event.key in actions)) return
      event.preventDefault()
      actions[event.key]?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // LCD verde
  const lcd = isPokemon
    ? {
        primary: describePosition({ index, count: visible.length, query, type, favoritesOnly }),
        secondary: describeSeen(seen.size, TOTAL),
      }
    : {
        primary: trainer
          ? `${trainerIndex + 1} de ${pluralize(trainers.length, 'treinador', 'treinadores')}`
          : 'Nenhum treinador',
        secondary: trainer
          ? `${pluralize(trainer.badges, 'insígnia', 'insígnias')} · ${trainer.team.length} na equipe`
          : 'Limpe a busca para ver todos',
      }

  function renderScreen() {
    if (!isPokemon) {
      return trainer ? (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          position={`Treinador ${trainerIndex + 1} de ${trainers.length}`}
          onSelectPokemon={openFromTrainer}
        />
      ) : (
        <EmptyState
          title="Nenhum treinador encontrado"
          description={`A busca “${query.trim()}” procura pelo nome do treinador e pelos Pokémon da equipe.`}
          actionLabel="Limpar busca"
          onAction={() => setQuery('')}
        />
      )
    }

    if (visible.length === 0) {
      return favoritesOnly && source.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Use o botão Favorito sob o visor para guardar um Pokémon aqui."
          actionLabel="Ver todos"
          onAction={() => setFavoritesOnly(false)}
        />
      ) : (
        <EmptyState
          title="Nenhum Pokémon encontrado"
          description={describeEmpty(query, type, favoritesOnly)}
          actionLabel="Limpar"
          onAction={clearAll}
        />
      )
    }

    if (listOpen) {
      return <PokemonList pokemon={visible} currentId={current.id} seen={seen} onSelect={showPokemon} />
    }

    return (
      <PokemonCard
        key={current.id}
        pokemon={current}
        onImageLoad={setLoadedId}
        onImageError={() => setLoadedId(null)}
      />
    )
  }

  const screenStyle = isPokemon && !listOpen && current ? typeStyle(current.types[0]) : undefined
  const screenLabel = isPokemon ? (listOpen ? 'Lista de Pokémon' : 'Pokémon no visor') : 'Treinador no visor'
  const nextTheme = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <div className="app">
      <header className="band">
        <div className="band__rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="band__bar">
          <p className="band__brand">
            <BrandMark />
            Pokédex · Kanto
          </p>
          <button type="button" className="theme-toggle press" onClick={toggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            Tema {nextTheme}
          </button>
        </div>
        <h1 className="band__title">Quem é esse Pokémon?</h1>
        <p className="band__lead">Os 151 de Kanto, com atributos, tipagem e treinadores</p>
      </header>

      <main className="stage">
        <div className="device">
          <section className="device__half device__half--left" aria-label="Visor da Pokédex">
            <DeviceTop
              scanKey={isPokemon ? `p${current?.id}` : `t${trainer?.id}`}
              favorite={isPokemon && Boolean(current) && favorites.has(current.id)}
              filtered={filtered}
              loaded={isPokemon && !listOpen && Boolean(current) && loadedId === current.id}
            />
            <MainScreen label={screenLabel} style={screenStyle}>
              {renderScreen()}
            </MainScreen>
            <div className="device__controls">
              <ScreenPills
                listOpen={listOpen}
                onToggleList={() => setListOpen((open) => !open)}
                favorite={Boolean(current) && favorites.has(current.id)}
                onToggleFavorite={() => current && toggleFavorite(current.id)}
                disabled={!isPokemon || !current}
                name={current?.name}
              />
              <StatusLcd {...lcd} />
              <DPad
                {...dpad}
                labels={{
                  left: isPokemon ? 'Pokémon anterior' : 'Treinador anterior',
                  right: isPokemon ? 'Próximo Pokémon' : 'Próximo treinador',
                  up: 'Linha de cima',
                  down: 'Linha de baixo',
                  center: listOpen ? 'Fechar a lista' : 'Abrir a lista',
                }}
              />
            </div>
          </section>

          <div className="device__hinge" aria-hidden="true" />

          <section className="device__half device__half--right" aria-label="Painel de consulta">
            <SearchBar
              value={query}
              onChange={setQuery}
              label={isPokemon ? 'Buscar Pokémon por nome ou número' : 'Buscar treinador ou Pokémon da equipe'}
              placeholder={isPokemon ? 'Nome ou número…' : 'Treinador ou Pokémon…'}
              onReset={clearAll}
              canReset={filtered}
            />

            {isPokemon ? (
              <InfoScreen tabs={INFO_TABS} active={infoTab} onTab={setInfoTab} label="Informações do Pokémon">
                {!current && <p className="info-note">Nenhum Pokémon na tela.</p>}
                {current && infoTab === 'stats' && (
                  <PokemonStats
                    pokemon={current}
                    total={TOTAL}
                    averages={pokedex.averages}
                    seenCount={seen.size}
                    onResetSeen={() => {
                      if (window.confirm('Zerar o registro de Pokémon vistos?')) resetSeen()
                    }}
                  />
                )}
                {current && infoTab === 'typing' && <PokemonTyping pokemon={current} />}
                {current && infoTab === 'owners' && (
                  <PokemonOwners pokemon={current} trainers={pokedex.trainers} onOpenTrainer={openTrainer} />
                )}
              </InfoScreen>
            ) : (
              <InfoScreen label="Lista de treinadores">
                <TrainerList trainers={trainers} currentId={trainer?.id} onSelect={setTrainerId} />
              </InfoScreen>
            )}

            <TypeFilter types={pokedex.types} total={TOTAL} value={type} onChange={changeType} />

            <div className="panel-row">
              <ModeSwitch mode={mode} onChange={setMode} />
              <RandomButton onClick={openRandom} />
            </div>

            <div className="panel-bottom">
              <SortSelect sort={sort} onChange={setSort} disabled={!isPokemon} />
              <FavoritesToggle
                active={favoritesOnly}
                count={favorites.size}
                disabled={!isPokemon}
                onToggle={() => setFavoritesOnly((only) => !only)}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="credits">
        <p>
          Teclado: <kbd>←</kbd> <kbd>→</kbd> trocam, <kbd>↑</kbd> <kbd>↓</kbd> andam na lista, <kbd>L</kbd> abre a
          lista.
        </p>
        <p>
          Dados: <code>pokedex-data.json</code> da Atividade 03 · Imagens:{' '}
          <a href="https://github.com/PokeAPI/sprites">PokéAPI</a> · Pokémon é marca da Nintendo, Game Freak e
          Creatures; projeto acadêmico.
        </p>
      </footer>
    </div>
  )
}

function describeEmpty(query, type, favoritesOnly) {
  const q = query.trim()
  const parts = [q && `com “${q}”`, type && `no tipo ${type}`, favoritesOnly && 'entre os favoritos'].filter(Boolean)
  return `Nada ${parts.join(' ')}. Tente outro nome, um número de 1 a 151 ou outro tipo.`
}
