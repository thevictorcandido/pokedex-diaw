# DESIGN.md — Pokédex de Kanto

Direção visual da Pokédex (Atividade 03 de DIAW). Vale para todo componente: nenhum valor de cor, fonte ou espaço fica fora dos tokens abaixo.

> Versão 2, de 2026-11-09. A versão 1 era uma tabela ordenável; a pedido de Victor, a interface virou o próprio aparelho. Dados, busca, filtro, ordenação, favoritos e tema continuam os mesmos.

## 1. A ideia

**A tela é a Pokédex.** A pessoa não navega por uma página: ela segura um aparelho vermelho, aberto como um livro, e opera os controles dele. Cada peça do aparelho faz uma coisa de verdade; nenhuma é só enfeite.

- **O visor da esquerda mostra o Pokémon**: um de cada vez, grande, com número, nome e tipos. É onde o olho cai primeiro.
- **A metade da direita é o painel de consulta**: busca, atributos, filtro por tipo e os modos do aparelho.
- **Trocar de Pokémon é apertar botão**: direcional, teclado do computador, lista de miniaturas no próprio visor ou o botão de sorteio.

A pergunta da tela continua a mesma: **como este Pokémon se compara aos outros?** O painel da direita responde com os seis atributos em barras, a média dos 151 marcada em cada uma e a posição pelo total ("534 · 11º de 151").

O aparelho é uma interpretação própria, inspirada na Pokédex vermelha da série: mesma leitura (lente azul, visor à esquerda, painel e teclado à direita), com formas, medidas e funções decididas aqui. Nada de imagem do brinquedo; tudo é desenhado em CSS.

### Referências misturadas (2026-11-09)

O aparelho continua sendo o modelo. Destas duas referências entram só os pontos abaixo, redesenhados no estilo dele:

| Referência | O que entra | Onde |
|---|---|---|
| [gabrielayresdev/Pokedex](https://github.com/gabrielayresdev/Pokedex) | Faixa vermelha no topo com uma pergunta grande e anéis concêntricos ao fundo | Topo da página: "Quem é esse Pokémon?", com o aparelho começando sobre a faixa |
| | Círculo na cor do tipo atrás da arte | Visor e miniaturas da lista |
| | Barras de atributo em segmentos | Tela azul: 5 segmentos de 51 pontos cada |
| | Seção de fraquezas | Aba "Tipagem" da tela azul |
| [Informações da Pokédex (psoul)](https://psoul.gg/wiki/guides/informacoes-da-pokedex/) | Registro do que já foi descoberto, com contador | "Vistos": cada Pokémon aberto no visor fica registrado no navegador; na lista, os não vistos aparecem em silhueta escura, com número e nome |
| | Relações de tipagem: fraquezas, resistências e imunidades | Aba "Tipagem", calculada pela tabela de tipos da 2ª geração (a do JSON, que tem Steel e Dark e não tem Fairy) |
| | Lista para escolher o Pokémon e ver os dados ao lado | Grade do visor, já prevista |

Não entram: logotipo oficial, Pokébola em 3D, ícones de tipo da referência, sombra de cartão, dados que o JSON não tem (altura, peso, habilidades).

## 2. Mapa do aparelho

```text
 ┌────────────── metade esquerda ──────────────┐┃┌────────────── metade direita ──────────────┐
 │ (◉) lente   ● ● ●  luzes                    │┃│ [ Buscar: nome ou número…            ]  ⟲ │ visor de busca
 │ ╭─────────────────────────────────────────╮ │┃│ ┌──────────────────────────────────────┐   │
 │ │ ·  ·                                    │ │┃│ │ Atributos            534 · 11º de 151 │   │ tela de informação
 │ │ ┌─────────────────────────────────────┐ │ │┃│ │ HP          78 ▓▓▓▓▓░░░░░░░░░░       │   │ (azul-escura)
 │ │ │                                     │ │ │┃│ │ Ataque      84 ▓▓▓▓▓░░░░░░░░░░       │   │
 │ │ │        arte oficial do Pokémon      │ │ │┃│ │ …                                     │   │
 │ │ │                                     │ │ │┃│ │ Na equipe de Ash                      │   │
 │ │ │ #006  Charizard        Fire Flying  │ │ │┃│ └──────────────────────────────────────┘   │
 │ │ └─────────────────────────────────────┘ │ │┃│ [Todos][Normal][Fire][Water][Grass][Elec]  │ teclado de tipos
 │ │ ●                              ≡≡≡      │ │┃│ [Ice][Fight][Poison][Ground][Flying]…     │ (azul-claro)
 │ ╰─────────────────────────────────────────╯ │┃│ [Pokémon][Treinadores]   ━ ━     (●)      │ modos · favorito · sorteio
 │ ━━━ ━━━    ┌───────────────┐       ✚       │┃│ [Ordenar: número ▾]   [★ Só favoritos 3]  │ telas inferiores
 │ lista fav  │ LCD de status │   direcional   │┃│                                            │
 └──────────────────────────────────────────────┘┃└────────────────────────────────────────────┘
```

| Peça | Função |
|---|---|
| **Lente azul** | Acende por 400ms a cada troca de Pokémon ("identificando") |
| **Três luzes** | Vermelha: o Pokémon na tela é favorito. Amarela: há busca ou filtro ativo. Verde: a imagem carregou |
| **Visor (esquerda)** | Modo *um*: arte oficial sobre o fundo pálido do primeiro tipo, com `#006`, nome e selos de tipo. Modo *lista*: grade de miniaturas dos resultados, com rolagem dentro do visor. No modo Treinadores, mostra o treinador: nome, insígnias e equipe |
| **Botões em pílula** (sob o visor) | "Lista", que alterna entre um Pokémon e a grade de miniaturas, e "Favorito" (estrela) |
| **LCD verde** | Duas linhas. Em cima, a posição na lista ("4 de 12", "3 resultados para “char”", "Nenhum resultado"); embaixo, o registro ("Vistos 23 de 151") |
| **Direcional** | ◀ ▶ anterior e próximo na lista atual. ▲ ▼ na grade, sobem e descem uma linha. O centro abre ou fecha a lista |
| **Visor de busca** (direita, topo) | Campo de busca por nome ou número, filtrando a cada tecla. O botão ⟲ limpa busca e tipo |
| **Tela de informação** (azul-escura) | Três abas. *Atributos*: barras de 0 a 255 em 5 segmentos, com a média marcada, total e posição. *Tipagem*: fraquezas (×4 e ×2), resistências (×½ e ×¼) e imunidades (×0), em selos de tipo. *Treinadores*: quem tem o Pokémon. No modo Treinadores, a tela lista os 12 treinadores |
| **Teclado azul** | Filtro por tipo: "Todos" e os 17 tipos do JSON, cada tecla com o ponto da cor do tipo e a contagem. A tecla ativa fica afundada |
| **Botões brancos** | Modo: Pokémon ou Treinadores |
| **Botão amarelo redondo** | Sorteia um Pokémon da lista atual |
| **Telas inferiores** | Ordenação (`<select>`) e o filtro "Só favoritos", com a contagem |
| **Dobradiça** | Separa as metades; no celular vira a dobra horizontal entre elas |

O tema claro ou escuro troca o ambiente em volta do aparelho e o brilho das telas; o corpo vermelho não muda. A alternância fica no canto da página, fora do aparelho.

### Topo da página

Uma faixa de 260px em vinho (`--band`), com a marca à esquerda, a alternância de tema à direita e, no centro, o título "Quem é esse Pokémon?" (40px/700, branco) com a linha "Os 151 de Kanto, com atributos, tipagem e treinadores" embaixo. Atrás, três anéis concêntricos em `--band-ring`, centrados sob o aparelho. O aparelho começa 120px antes do fim da faixa, como se saísse dela; abaixo, o ambiente (`--room`). No celular, a faixa encolhe para 180px e o título para 28px.

## 3. Tokens

```css
:root {
  /* ambiente (página) */
  --room: #ece6e0;
  --room-ink: #2b2420;
  --room-muted: #6b625c;

  /* faixa do topo */
  --band: #6e0d18;
  --band-ring: #7f1421;
  --band-ink: #ffffff;
  --band-muted: #f3c9cd;

  /* corpo do aparelho: tons planos, sem degradê */
  --device: #c8202f;
  --device-shade: #a3192a;    /* dobradiça, bordas internas, botão apertado */
  --device-light: #db3a46;    /* friso de 2px no topo das peças */
  --device-ink: #ffffff;      /* texto gravado no corpo */

  /* moldura do visor */
  --bezel: #ece8e2;
  --bezel-shade: #cfc9c1;

  /* telas */
  --screen: #f7f5f1;          /* fundo do visor quando o tipo não pinta */
  --screen-ink: #1c1917;
  --info: #17306e;            /* tela azul-escura */
  --info-raised: #22408a;
  --info-ink: #eef2ff;
  --info-muted: #b4c2ea;
  --info-bar: #ffcf3f;        /* barra de atributo */
  --info-track: #2c4c9a;
  --lcd: #a9d86e;
  --lcd-ink: #1d2e0e;

  /* controles */
  --key: #9fd0f2;
  --key-ink: #0c2a45;
  --key-pressed: #6fb3e4;
  --pill-red: #f06a74;
  --pill-green: #76c25b;
  --white-key: #f5f3ef;
  --white-key-ink: #2b2420;
  --yellow: #f6c445;
  --dpad: #2a2422;
  --dpad-ink: #f5f3ef;

  /* luzes e lente */
  --lens: #2f8fd8;
  --lens-glint: #cfeaff;
  --led-red: #ef4444;
  --led-yellow: #facc15;
  --led-green: #4ade80;
  --led-off: #6b1a22;

  --focus: #ffcf3f;           /* anel de foco: amarelo sobre o vermelho */

  --radius-device: 20px;
  --radius-screen: 10px;
  --radius-key: 6px;
  --gap: 16px;

  --fs-name: 28px;
  --fs-title: 18px;
  --fs-body: 14px;
  --fs-small: 12px;
}
```

**Tema escuro:** `--room: #0f0d0c`, `--room-ink: #f2eeea`, `--room-muted: #a39b95`, `--screen: #1c1a18`, `--screen-ink: #f2eeea`, `--info: #0c1c45`, `--info-raised: #142a5e`; o fundo de tipo do visor usa a versão escura (seção abaixo). O aparelho continua vermelho.

**Profundidade sem degradê:** as peças em relevo levam um friso de 2px em `--device-light` no topo e outro em `--device-shade` na base. O aparelho tem a única sombra da página, porque é o único objeto que flutua.

### Cores dos tipos

Mesma regra da versão 1. Cada tipo tem um fundo pálido (`oklch(94% 0.045 H)`) e uma tinta escura (`oklch(40% 0.11 H)`), com contraste acima de 4,5:1; no tema escuro, `oklch(30% 0.06 H)` e `oklch(88% 0.08 H)`. O fundo pálido do primeiro tipo pinta o visor atrás da arte.

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

O Mew vem sem tipo no JSON; ele aparece como `Typeless`, o tipo de id 0 do próprio arquivo, e a aba Tipagem diz "Sem tipo: nenhuma relação de tipagem".

No visor, o fundo é o tom pálido do primeiro tipo e, atrás da arte, um círculo de 72% da altura no tom um passo mais forte (`oklch(88% 0.07 H)`; no escuro, `oklch(36% 0.07 H)`). As miniaturas da lista repetem o círculo em pequeno.

## 4. Tipografia

- **DM Sans**, pelo pacote `@fontsource-variable/dm-sans` (sem CDN). Pesos 400 a 700.
- Nome no visor: 28px/700. Títulos das telas: 18px/600. Corpo: 14px. Teclas e LCD: 12px a 13px/600.
- `font-variant-numeric: tabular-nums` em número, atributo, total, posição e contagem.
- Caixa de frase. Sem maiúsculas espaçadas, sem fonte monoespaçada.

## 5. Tamanhos e faixas

| Largura | Aparelho |
|---|---|
| 1100px ou mais | Aberto na horizontal: duas metades de até 560px lado a lado, com a dobradiça de 18px entre elas, centrado na página |
| 900px a 1099px | Igual, com as metades encolhendo; o visor guarda a proporção de 4:3 |
| até 899px | Aberto na vertical: metade do visor em cima, painel embaixo, dobradiça horizontal. Largura total menos 16px de cada lado |
| até 599px | Teclado de tipos em 3 colunas; direcional e botões com 44px no mínimo |

A página não rola na horizontal em nenhuma largura. Em 1440×900 o visor e a tela azul aparecem inteiros sem rolar; só o pé do aparelho pode ficar abaixo da dobra.

## 6. Interação

- **Teclado do computador:** ◀ ▶ trocam de Pokémon e ▲ ▼ andam na grade quando o foco não está num campo. `L` abre e fecha a lista, e `Esc` fecha a lista. Todas as peças são botões de verdade, com nome acessível ("Próximo Pokémon", "Filtrar por Fire").
- **Lista no visor:** grade de miniaturas de 4 colunas (3 no celular), com o número embaixo. A atual fica marcada com anel amarelo. Clicar escolhe o Pokémon e volta ao modo *um*.
- **Busca e filtro** mudam a lista atual. Se o Pokémon na tela sair da lista, o visor passa para o primeiro resultado.
- **Treinadores:** o visor mostra um treinador por vez, e ◀ ▶ passam para o próximo. A tela azul lista os 12; clicar num deles o leva ao visor. Clicar num Pokémon da equipe volta ao modo Pokémon, já nele.
- **Vistos:** abrir um Pokémon no visor o registra (no `localStorage`). A lista mostra os não vistos como silhueta escura, com número e nome legíveis; ao abrir, a cor aparece. O botão ⟲ não apaga o registro; "Zerar vistos" fica no fim da aba Atributos, com confirmação.
- **Leitores de tela:** o LCD é `aria-live="polite"`; o visor tem um título oculto com "Charizard, número 6, tipos Fire e Flying".

## 7. Estados

- **Sem resultado:** o visor mostra "Nenhum Pokémon encontrado" e "Busca “xyz” no tipo Fire", com o botão "Limpar" em destaque; o LCD diz "Nenhum resultado".
- **Favoritos vazio:** "Nenhum favorito ainda. Use a estrela sob o visor para guardar um Pokémon."
- **Imagem que falha:** iniciais grandes no tom do tipo; a luz verde fica apagada.
- **Foco visível:** anel de 2px em `--focus` (amarelo), com 2px de afastamento, legível sobre o vermelho e sobre as telas.

## 8. Movimento

- Troca de Pokémon: a arte entra subindo 12px com opacidade, em 180ms; a lente acende por 400ms.
- Barras de atributo crescem da esquerda em 320ms, escalonadas em 30ms.
- Teclas e botões afundam 2px ao apertar (o friso inferior some).
- Com `prefers-reduced-motion: reduce`, tudo troca sem deslocamento e a lente só muda de cor.

## 9. Imagens

Arte oficial e miniaturas da PokéAPI, servidas pelo repositório público de sprites:

- Miniatura da lista e da equipe: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
- Arte do visor: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`

Largura e altura fixas (sem salto de layout), `alt` com o nome e `loading="lazy"` nas miniaturas. Fonte citada no README. Pokémon é marca da Nintendo, da Game Freak e da Creatures; uso só acadêmico.

## 10. O que não entra

Tabela, grade de cards fora do visor, degradê, brilho, vidro, foto ou imagem do brinquedo, emoji, fonte monoespaçada, peça decorativa sem função.
