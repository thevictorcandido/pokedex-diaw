# DESIGN.md — Pokédex de Kanto

Direção visual da Pokédex (Atividade 03 de DIAW). Vale para todo componente: nenhum valor de cor, fonte ou espaço fica fora dos tokens abaixo.

## 1. O que é a tela

Uma tela de trabalho, não uma página de marketing. A pessoa abre para **achar um Pokémon e ver como ele se compara aos outros**. Essa é a pergunta da tela, e ela decide o que é maior:

1. A lista dos 151 Pokémon, com os seis atributos lado a lado, é o bloco principal.
2. A busca e o filtro de tipo ficam sempre à vista, antes da lista.
3. O detalhe abre por cima da lista, sem trocar de tela, e mostra onde aquele Pokémon fica entre os 151.

**Ideia:** a Pokédex como um catálogo de campo. Cada linha é uma ficha: número, retrato, nome, tipos e os seis atributos em números alinhados. Ordenar por qualquer coluna é o gesto principal, e o detalhe responde "esse é forte?" com a posição no ranking ("Total 534 · 12º de 151"), não com adjetivos.

**Rosto do produto:** o vermelho da Pokédex como único matiz forte, só em marcas pequenas (botão principal, item ativo, barras de atributo). As cores dos 17 tipos entram como tons pálidos com tinta escura do mesmo matiz, porque tipo é dado, não decoração.

## 2. Estilo base

Estilo "escada de um matiz", tirado de telas de catálogo e painel:

- O matiz forte aparece só em marcas pequenas; seus tons pálidos fazem o trabalho de área.
- Superfícies planas, separadas por um passo de tom ou por linha de 1px. Nenhuma sombra em repouso; sombra só no painel de detalhe, que flutua.
- Sem gradiente, sem vidro, sem brilho, sem emoji, sem ícone em quadrado colorido.

## 3. Tokens

```css
:root {
  /* superfícies */
  --ground: #fbf8f7;        /* fundo puxado para o tom mais pálido do vermelho */
  --surface: #ffffff;
  --raised: #f4f1f0;
  --border: #e7e2e0;
  --rule: #f1edeb;
  --control: #d6d0cd;

  /* texto */
  --text: #1c1917;
  --muted: #625b57;

  /* o matiz: vermelho Pokédex */
  --accent: #c23a2b;
  --accent-soft: #fdf1ef;
  --accent-track: #f7dcd7;
  --accent-ink: #7a1f15;

  /* estados */
  --positive: #247b50;
  --warning: #92400e;

  --radius-card: 8px;
  --radius-control: 6px;
  --row-height: 56px;
  --sidebar-width: 232px;
  --topbar-height: 64px;
  --gap: 24px;
  --pad: 24px;
  --control-height: 36px;

  --fs-title: 32px;
  --fs-section: 18px;
  --fs-kpi: 24px;
  --fs-body: 14px;
  --fs-small: 12px;
}
```

**Tema escuro** (alternância no topo, guardada no navegador, padrão segue o sistema): fundo `#0c0a09`, superfície `#171412`, elevado `#24201d`, linhas `#2e2926`, texto `#f5f2f0`, secundário `#a8a19c`, matiz `#ef6b5b`, tom pálido `#3a1a15`, trilho `#4a2620`. Elevação por luminosidade, sem borda nos cards.

### Cores dos tipos

Cada tipo tem um fundo pálido (`oklch(94% 0.045 H)`) e uma tinta escura (`oklch(40% 0.11 H)`), com contraste acima de 4,5:1. No tema escuro, invertem: fundo `oklch(30% 0.06 H)` e tinta `oklch(88% 0.08 H)`.

| Tipo | Matiz H | Tipo | Matiz H |
|---|---|---|---|
| Normal | 80 (croma baixo) | Psychic | 355 |
| Fire | 40 | Bug | 125 |
| Water | 245 | Rock | 70 |
| Grass | 145 | Ghost | 295 |
| Electric | 95 | Dark | 40 (croma baixo) |
| Ice | 210 | Dragon | 275 |
| Fighting | 25 | Steel | 235 (croma baixo) |
| Poison | 320 | Typeless | cinza neutro |
| Ground | 65 | Flying | 260 |

O Mew vem sem tipo no JSON; ele aparece como `Typeless`, o tipo de id 0 do próprio arquivo.

## 4. Tipografia

- **DM Sans**, instalada pelo pacote `@fontsource-variable/dm-sans` (sem CDN externo). Pesos 400, 500, 600 e 700.
- Tamanhos: título 32px/700 · seção 18px/600 · número em destaque 24px/600 · corpo 14px · pequeno 12px.
- `font-variant-numeric: tabular-nums` em toda coluna de número, no total e no ranking.
- Caixa de frase em tudo. Nada de rótulo em maiúsculas espaçadas.
- Número do Pokémon com três dígitos (`#025`), na mesma fonte, cor secundária.

## 5. Estrutura da tela

```text
┌──────────────┬───────────────────────────────────────────────────────┐
│ ● Pokédex    │  [ Buscar por nome ou número…          ]  Aleatório ◐ │  barra superior 64px
│   Kanto      ├───────────────────────────────────────────────────────┤
│              │  Pokémon                                              │  título 32px
│ Pokémon  151 │  151 de Kanto · 14 do tipo Grass                      │  linha de achado
│ Treinadores12│                                                       │
│ Favoritos  3 │  № ▾  Pokémon        Tipos      HP Atq Def AtE DfE Vel Total ★ │
│              │  #001 [img] Bulbasaur Grass Poison 45  49  49  65  65  45  318  ☆ │
│ Tipos        │  #002 [img] Ivysaur   …                                │
│  Todos   151 │  …                                                    │
│  Water    32 │                                                       │
│  Poison   33 │                                                       │
│  …           │                                                       │
└──────────────┴───────────────────────────────────────────────────────┘
```

- **Barra lateral** (232px): marca desenhada (círculo dividido, em CSS), navegação entre Pokémon, Treinadores e Favoritos com contagem, e a lista de tipos com a contagem de cada um. O tipo escolhido fica com o fundo pálido do matiz e o texto em `--accent-ink`. Os tipos e as contagens vêm do JSON.
- **Barra superior**: busca (nome ou número, filtra a cada tecla), botão "Aleatório" e alternância de tema.
- **Lista**: tabela de verdade (`<table>`), sem card em volta. Cabeçalho em cinza 12px, sem fundo. Linhas de 56px com retrato de 40px. Números alinhados à direita. Clicar no cabeçalho ordena a coluna; clicar de novo inverte. A linha inteira abre o detalhe e é alcançável pelo teclado.
- **Linha de achado** abaixo do título: diz o que está na tela ("151 de Kanto", "14 do tipo Grass", "3 resultados para 'char'").

## 6. Detalhe do Pokémon

Painel lateral de 440px à direita (folha inferior no celular), feito com `<dialog>` para ter foco preso, `Esc` e fundo inerte.

1. Cabeçalho: arte oficial grande (240px) sobre fundo pálido do primeiro tipo, `#025`, nome em 32px, selos de tipo, botão de favorito.
2. Total e posição: "Total 320 · 112º de 151".
3. Seis barras de atributo, escala fixa de 0 a 255, com o valor ao lado. A barra usa `--accent` sobre `--accent-track`. Um traço fino marca a média dos 151 em cada atributo.
4. Treinadores que têm este Pokémon, vindos das relações do JSON ("Com Ash e Gary").
5. Navegação anterior e próximo, respeitando a lista filtrada.

## 7. Treinadores

Lista com uma linha por treinador: nome, insígnias em número e em marcas (preenchidas até o total) e a equipe como retratos de 40px. Clicar num retrato abre o mesmo detalhe. Pokémon repetidos na equipe (Koga com três Venonat, Lance com dois Dragonite) aparecem como estão no JSON.

## 8. Estados

- **Vazio:** "Nenhum Pokémon encontrado para 'xyz' no tipo Fire", com botão "Limpar filtros". A tabela mantém o cabeçalho.
- **Imagem que falha:** o retrato vira um círculo com as iniciais em tom pálido do tipo. A Pokédex funciona inteira sem a PokéAPI.
- **Favoritos vazio:** "Nenhum favorito ainda. Toque na estrela de um Pokémon para guardá-lo aqui."
- **Foco visível** em toda linha, botão e campo: anel de 2px em `--accent` com 2px de afastamento.

## 9. Celular (até 767px)

- A barra lateral vira barra inferior com três destinos (Pokémon, Treinadores, Favoritos).
- O filtro de tipo vira uma fileira de selos com rolagem horizontal, acima da lista.
- A tabela vira itens de duas linhas: retrato, `#025` e nome, tipos e total na primeira; os seis atributos em 13px cinza na segunda.
- A ordenação passa para um `<select>` ("Ordenar por").
- Alvos de toque com no mínimo 44px.

## 10. Movimento

- Painel de detalhe entra deslizando 24px e com opacidade, em 200ms, `cubic-bezier(0.2, 0, 0, 1)`.
- Barras de atributo crescem da esquerda ao abrir, 320ms, escalonadas em 30ms.
- Linha: fundo `--raised` no hover, em 120ms.
- Com `prefers-reduced-motion: reduce`, tudo aparece sem deslocamento.

## 11. Imagens

Arte oficial e retratos da PokéAPI, servidos pelo repositório público de sprites:

- Retrato da lista: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
- Arte do detalhe: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`

Imagens com `loading="lazy"`, largura e altura fixas (sem salto de layout) e `alt` com o nome. Fonte citada no README. Pokémon é marca da Nintendo, Game Freak e Creatures; uso só acadêmico.

## 12. O que não entra

Card por Pokémon em grade, gradiente, sombra em repouso, ícone em quadrado colorido, rótulo pequeno acima do título, emoji na interface, fonte monoespaçada, violeta como cor da interface.
