import { useCallback, useMemo, useState } from 'react'
import { pokedex } from './services/pokedex.js'
import { usePokedexFilters } from './hooks/usePokedexFilters.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useTheme } from './hooks/useTheme.js'
import { filterTrainers } from './utils/filters.js'
import { describeResults, neighbours } from './utils/describe.js'
import { pluralize } from './utils/format.js'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import TypeFilter from './components/TypeFilter.jsx'
import SortSelect from './components/SortSelect.jsx'
import PokemonList from './components/PokemonList.jsx'
import PokemonDetails from './components/PokemonDetails.jsx'
import TrainerList from './components/TrainerList.jsx'
import EmptyState from './components/EmptyState.jsx'
import './css/App.css'

const TITLES = { pokemon: 'Pokémon', trainers: 'Treinadores', favorites: 'Favoritos' }

export default function App() {
  const [section, setSection] = useState('pokemon')
  // Pokémon aberto no detalhe. "ids" é a lista para anterior e próximo;
  // quando é null, vale a lista visível no momento.
  const [selection, setSelection] = useState(null)

  const { theme, toggleTheme } = useTheme()
  const { favorites, toggleFavorite } = useFavorites()

  const source = useMemo(
    () => (section === 'favorites' ? pokedex.pokemon.filter((p) => favorites.has(p.id)) : pokedex.pokemon),
    [section, favorites],
  )
  const filters = usePokedexFilters(source)
  const { query, setQuery, type, setType, sort, setSort, sortBy, clearFilters, visible } = filters

  const trainers = useMemo(() => filterTrainers(pokedex.trainers, query), [query])

  const counts = { pokemon: pokedex.pokemon.length, trainers: pokedex.trainers.length, favorites: favorites.size }

  const openPokemon = useCallback((id, ids = null) => {
    setSelection({ id, ids: ids ? [...new Set(ids)] : null })
  }, [])

  function navigate(next) {
    setSection(next)
    window.scrollTo({ top: 0 })
  }

  function changeType(next) {
    setType(next)
    if (section === 'trainers') setSection('pokemon')
  }

  function openRandom() {
    const pool = section !== 'trainers' && visible.length > 0 ? visible : pokedex.pokemon
    const pick = pool[Math.floor(Math.random() * pool.length)]
    openPokemon(pick.id)
  }

  const selected = selection ? pokedex.byId.get(selection.id) : null
  const navIds = selection?.ids ?? visible.map((p) => p.id)
  const { previousId, nextId } = selected ? neighbours(navIds, selected.id) : {}

  const isTrainers = section === 'trainers'
  const finding = isTrainers
    ? query.trim()
      ? `${pluralize(trainers.length, 'treinador', 'treinadores')} para “${query.trim()}”`
      : `${trainers.length} treinadores e suas equipes`
    : describeResults({
        count: visible.length,
        query,
        type,
        sort,
        scope: section === 'favorites' ? 'favoritos' : 'de Kanto',
      })

  return (
    <div className="app">
      <Sidebar
        section={section}
        counts={counts}
        onNavigate={navigate}
        types={pokedex.types}
        total={pokedex.pokemon.length}
        activeType={type}
        onTypeChange={changeType}
      />

      <div className="app__main">
        <TopBar
          search={{
            value: query,
            onChange: setQuery,
            label: isTrainers ? 'Buscar treinador ou Pokémon' : 'Buscar Pokémon por nome ou número',
            placeholder: isTrainers ? 'Buscar treinador ou Pokémon…' : 'Buscar por nome ou número…',
          }}
          onRandom={openRandom}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="app__content" id="conteudo">
          <div className="app__title-row">
            <h1 className="app__title">{TITLES[section]}</h1>
            <p className="app__finding" aria-live="polite">
              {finding}
            </p>
          </div>

          {!isTrainers && (
            <div className="app__toolbar">
              <TypeFilter
                types={pokedex.types}
                total={pokedex.pokemon.length}
                value={type}
                onChange={changeType}
                layout="row"
              />
              <SortSelect sort={sort} onChange={setSort} />
            </div>
          )}

          {isTrainers && trainers.length > 0 && <TrainerList trainers={trainers} onSelectPokemon={openPokemon} />}

          {isTrainers && trainers.length === 0 && (
            <EmptyState
              title={`Nenhum treinador encontrado para “${query.trim()}”`}
              description="A busca procura pelo nome do treinador e pelos Pokémon da equipe."
              actionLabel="Limpar busca"
              onAction={() => setQuery('')}
            />
          )}

          {!isTrainers && visible.length > 0 && (
            <PokemonList
              pokemon={visible}
              sort={sort}
              onSort={sortBy}
              onSelect={openPokemon}
              selectedId={selection?.id}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              caption={`${TITLES[section]}: ${finding}`}
            />
          )}

          {!isTrainers && visible.length === 0 && section === 'favorites' && source.length === 0 && (
            <EmptyState
              title="Nenhum favorito ainda"
              description="Toque na estrela de um Pokémon para guardá-lo aqui. Os favoritos ficam salvos neste navegador."
              actionLabel="Ver todos os Pokémon"
              onAction={() => navigate('pokemon')}
            />
          )}

          {!isTrainers && visible.length === 0 && source.length > 0 && (
            <EmptyState
              title="Nenhum Pokémon encontrado"
              description={describeEmpty(query, type)}
              actionLabel="Limpar filtros"
              onAction={clearFilters}
            />
          )}
        </main>
      </div>

      <BottomNav section={section} counts={counts} onNavigate={navigate} />

      {selected && (
        <PokemonDetails
          pokemon={selected}
          total={pokedex.pokemon.length}
          averages={pokedex.averages}
          previous={previousId ? pokedex.byId.get(previousId) : null}
          next={nextId ? pokedex.byId.get(nextId) : null}
          onNavigate={(id) => setSelection((current) => ({ ...current, id }))}
          onClose={() => setSelection(null)}
          favorite={favorites.has(selected.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}

function describeEmpty(query, type) {
  const q = query.trim()
  if (q && type) return `Nada com “${q}” no tipo ${type}. Tente outro nome, um número de 1 a 151 ou outro tipo.`
  if (q) return `Nada com “${q}”. Tente outro nome ou um número de 1 a 151.`
  return `Nenhum Pokémon do tipo ${type} nesta lista.`
}
