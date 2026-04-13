# Prompt técnico — Demo de "Hunch"

> App que conecta mercados de predicción alternativos con un onramp educativo a cripto, con estética editorial (no cripto-bro). Este documento es el prompt maestro para generar el demo frontend.

---

## 1. Contexto del producto

**Nombre tentativo:** Hunch
**Tagline:** *Read the world. Back your hunches.*

**Concepto:** Una app tipo feed editorial (inspiración: Artifact, NYT Morning Briefing, Arc) donde cada historia del día tiene un mercado de predicción asociado. El usuario lee, forma una opinión, y con un tap toma una micro-posición. La app lleva un "track record de intuición" a lo largo del tiempo. La capa cripto (stablecoins, wallets, blockchain) se introduce progresivamente mediante micro-lecciones contextuales — nunca como feature principal.

**Audiencia objetivo:** adultos 25–45 sin experiencia cripto, curiosos, lectores de medios, personas que *ya* opinan sobre el mundo pero no apuestan. Anti-target: day-traders, cripto-natives.

**Alcance del demo:** frontend puro, datos mock, sin backend, sin wallet real, sin base de datos. Todo el estado vive en memoria (React state / Zustand). El objetivo es validar look & feel, flujo de usuario, y sensación general del producto.

---

## 2. Stack técnico

- **Framework:** Next.js 15 (App Router, React Server Components donde aplique, cliente para interactividad).
- **Lenguaje:** TypeScript estricto (`"strict": true`).
- **Styling:** Tailwind CSS v4 con tokens de diseño definidos en `@theme` (ver sección 4).
- **Componentes:** shadcn/ui como base, customizados a la paleta editorial. Evitar look "default shadcn".
- **Animación:** Framer Motion (transiciones de página, micro-interacciones, spring-based).
- **Iconografía:** Lucide, pero solo en tamaño pequeño y peso fino (stroke 1.5). Preferir glifos tipográficos y formas geométricas mínimas sobre íconos cuando sea posible.
- **Tipografía:** importar de Google Fonts.
  - Headline: **Instrument Serif** (gratis, vibe editorial italiano).
  - Body: **Inter** en peso 400/500, tracking -0.01em.
  - Mono (para números grandes, contadores, odds): **JetBrains Mono** peso 300.
- **Charts:** Recharts para sparklines minimalistas. Sin candlesticks. Sin verde/rojo default.
- **Gestión de estado:** Zustand para estado global (portfolio, predicciones, onboarding step). React Context para theme.
- **Data mock:** archivo `lib/mock-data.ts` con ~20 historias pre-redactadas y ~40 mercados simulados. Cambios de precio simulados con `setInterval` para sensación de liveness.

---

## 3. Arquitectura del demo (rutas)

```
/              → Feed editorial (home)
/story/[id]    → Vista de historia individual con mercado embebido
/portfolio     → "Belief portfolio" del usuario
/track-record  → Histórico de predicciones con stats de intuición
/learn         → Biblioteca de micro-lecciones desbloqueadas
/onboarding    → Flujo de bienvenida de 4 pasos (solo primera visita)
/settings      → Placeholder con opción "graduar a self-custody" (solo UI, no funcional)
```

Todas las rutas usan un layout común con navegación inferior (mobile) / sidebar colapsado (desktop).

---

## 4. Sistema de diseño (specs exactas)

### 4.1 Paleta de color

Paleta warm-editorial. **No usar** negros puros, verdes neón, gradientes cripto, ni azules tech saturados.

**Light mode (default):**

| Token | Hex | Uso |
|---|---|---|
| `bg-canvas` | `#F5F1EA` | Fondo principal (papel crema) |
| `bg-surface` | `#FFFFFF` | Tarjetas elevadas |
| `bg-sunken` | `#EDE7DD` | Secciones hundidas, inputs |
| `ink-primary` | `#1C1A17` | Texto principal (no negro puro) |
| `ink-secondary` | `#5C544A` | Texto secundario, metadatos |
| `ink-tertiary` | `#9A9288` | Captions, timestamps |
| `accent-ink` | `#2B1F14` | CTAs principales (marrón tinta) |
| `accent-signal` | `#B8471C` | Terracota — único color "caliente" de la marca, para precios que suben, highlights |
| `accent-cool` | `#3D5A5C` | Verde-azulado sobrio para precios que bajan |
| `accent-highlight` | `#E8D9B8` | Mostaza suave — marcador, estados hover |
| `border-soft` | `#E0D8CB` | Bordes apenas visibles |
| `border-firm` | `#C9BEAD` | Bordes de componentes activos |

**Dark mode (disponible, toggle en settings):**

| Token | Hex |
|---|---|
| `bg-canvas` | `#14110D` |
| `bg-surface` | `#1E1A15` |
| `bg-sunken` | `#0E0B08` |
| `ink-primary` | `#F0EADE` |
| `ink-secondary` | `#B5A898` |
| `accent-signal` | `#D66838` |
| `accent-cool` | `#6B9294` |
| `accent-highlight` | `#5C4A28` |

**Reglas de uso:**
- Nunca más de dos colores de acento visibles en una misma pantalla.
- Precios no usan rojo/verde saturados — usan `accent-signal` (subida) y `accent-cool` (bajada).
- Los estados de éxito usan tinta oscura + subrayado, no verde.

### 4.2 Tipografía

| Rol | Fuente | Tamaño | Line-height | Tracking |
|---|---|---|---|---|
| Display (hero) | Instrument Serif Regular | 72px / 5rem | 0.95 | -0.02em |
| H1 | Instrument Serif Regular | 48px / 3rem | 1.05 | -0.015em |
| H2 | Instrument Serif Regular | 32px / 2rem | 1.1 | -0.01em |
| H3 | Inter SemiBold | 20px | 1.3 | -0.005em |
| Body large | Inter Regular | 18px | 1.55 | -0.005em |
| Body | Inter Regular | 16px | 1.6 | 0 |
| Caption | Inter Medium | 13px | 1.4 | 0.01em |
| Overline | Inter Medium UPPERCASE | 11px | 1.2 | 0.12em |
| Number display | JetBrains Mono Light | variable | 1.0 | -0.02em |

Italicizar liberalmente en serif para títulos emocionales o editoriales ("*Will she run again?*").

### 4.3 Espaciado y layout

- Grid base: 4px.
- Padding de tarjetas: 24px (mobile), 32px (desktop).
- Max-width del contenido editorial: 680px (lectura cómoda).
- Max-width de la app: 1280px.
- Gutter entre tarjetas: 16px mobile, 24px desktop.
- Border-radius: 12px para tarjetas, 8px para botones, 24px para modales, 999px para pills.

### 4.4 Motion

- Transiciones entre páginas: fade + subtle slide 12px, duración 320ms, easing `[0.22, 1, 0.36, 1]` (ease-out-quart).
- Hover en tarjetas: elevar 2px con sombra warm `0 8px 24px -8px rgba(28,26,23,0.08)`, duración 180ms.
- Spring por defecto para drags y sliders: `{ stiffness: 260, damping: 28 }`.
- Números que cambian (precios, porcentajes): animar con roll-up tipo odometer, no fade.
- Nunca animación de bounce agresiva ni rebotes tipo "fintech".

### 4.5 Iconografía y decoración

- Lucide stroke 1.5, 16–20px máximo.
- Uso de marcas tipográficas: asteriscos (✳︎), flechas (↗ ↘), bullets (•), em-dash (—) como elementos de diseño.
- Separadores horizontales: líneas hairline 1px en `border-soft`, nunca gruesas.
- Cero ilustraciones 3D, cero emojis de cripto (⚡💎🚀), cero gradientes neón. Si se usan ilustraciones, estilo grabado editorial (línea fina, una o dos tintas).

---

## 5. Pantallas — specs detalladas

### 5.1 Onboarding (4 pasos, full-screen, solo primera visita)

**Paso 1 — Bienvenida.** Fondo `bg-canvas`. Título en Instrument Serif 72px: *"Read the world. Back your hunches."* Subtítulo 18px: "A new way to track what you believe — and see how often you're right." Botón único inferior: *Continue →*.

**Paso 2 — Topics.** "Qué te interesa seguir." Grid 3×3 de pills seleccionables: Política, Clima, Cultura, Deportes, Tecnología, Economía, Ciencia, Entretenimiento, Mundo. Seleccionar mínimo 3.

**Paso 3 — Intro a micro-predicciones.** Una historia de ejemplo con un mercado embebido. Tooltip guiado: "Tap here to back your hunch with $1." Animación que muestra el flujo sin ejecutarlo.

**Paso 4 — Dinero de práctica.** "Te damos $10 de práctica para empezar. Cuando estés listo, podrás agregar fondos reales." CTA: *Start reading →*. **No mencionar cripto, wallet, ni blockchain en onboarding.**

### 5.2 Feed editorial (`/`)

Layout: columna única centered, 680px max-width en desktop, full-width en mobile.

**Header:**
- Logo tipográfico "Hunch" en Instrument Serif 24px italic.
- Fecha actual en overline derecha: "MONDAY, APRIL 13".
- Avatar del usuario a la derecha (circle 32px).

**Cuerpo:** lista de ~8 "story cards". Cada card:
- Overline con topic + tiempo: "POLITICS • 3H AGO".
- Título editorial H2 (serif, italic liberal).
- 2 líneas de resumen en body (18px).
- Thumbnail ilustrativa opcional — estilo grabado, una tinta.
- **Market strip inferior:** barra horizontal 56px de alto con:
  - Pregunta del mercado: "Will X happen before Y?"
  - Probabilidad actual como número mono grande: "63%".
  - Mini-sparkline 60px × 20px mostrando movimiento de las últimas 24h.
  - Botón pill secundario: *Back this →*.

Separación entre cards: línea hairline + 48px de espacio vertical.

Al scroll, infinite-load mock (simular con ~20 historias en loop).

### 5.3 Story detail (`/story/[id]`)

Hero tipográfico: título 72px, byline en caption, hero image opcional abajo del título (no arriba).

Cuerpo en columna estrecha 600px: 3–5 párrafos de lorem-ipsum editorial escritos con voz de revista.

**Sticky market module** a la derecha en desktop, abajo en mobile:
- Pregunta en H3.
- Probabilidad actual grande (mono 64px).
- Sparkline 7d.
- Slider personalizado: "How much?" — muestra $0.50 / $1 / $5 / $25, default $1.
- Stepper "Yes / No" toggle en pills.
- Botón CTA: *Back $X on Yes/No*.
- Micro-texto inferior: "You believe this more than 73% of readers."

Al hacer tap en el CTA: modal de confirmación editorial (sin loaders dramáticos), animación de entrada spring suave, mensaje: *"Your hunch is on the record."* Ofrecer compartir con amigos (placeholder).

### 5.4 Belief portfolio (`/portfolio`)

Header: "Your beliefs, in one place."

**Bento grid** de tarjetas (diferentes tamaños, sin uniformidad tipo trading dashboard):
- Tarjeta grande superior: "Total positions: 14" + balance en USD grande mono.
- 6–8 tarjetas con cada posición activa: título abreviado de la pregunta, probabilidad actual, posición del usuario (Yes/No), P&L micro al costado.
- Una tarjeta especial: "Conviction compass" — mini-chart radial mostrando la distribución de posiciones por topic.
- Cada tarjeta con hover lift y tap-to-expand.

### 5.5 Track record (`/track-record`)

Hero con una sola métrica grande: "You've been right **62%** of the time." (serif mezclado con mono grande).

Debajo: timeline vertical de predicciones pasadas, agrupadas por mes. Cada entry muestra la pregunta, tu posición, el resultado, y un ✓ o ✗ minimalista (no rojo/verde, usar `accent-signal` vs `ink-tertiary`).

Al final de la página: "Year in review" button (placeholder).

### 5.6 Learn (`/learn`)

Biblioteca de micro-lecciones de 30 segundos. Layout tipo revista: grid de 2 columnas en desktop, 1 en mobile.

Cada lección es una tarjeta con:
- Número romano (I, II, III...) como decoración en serif grande semi-transparente.
- Título: "What's a stablecoin, really?"
- Subtítulo de 1 línea.
- Estado: "Unlocked" / "Locked — complete 3 predictions to unlock".
- Tap abre overlay editorial tipo longform corto, con CTA al final: "Got it →".

Lecciones sugeridas (con orden de desbloqueo):
1. What is a prediction market?
2. How does your money move when you back a hunch?
3. What's a stablecoin?
4. Who decides if you were right?
5. What is a wallet, and why don't you see yours yet?
6. The blockchain, explained in under a minute.
7. When would you want to "graduate" to self-custody?

### 5.7 Settings (`/settings`)

Lista sobria, estilo iOS settings pero warm:
- Account (mock).
- Appearance: Light / Dark / Auto.
- Notifications (toggles placeholder).
- **Advanced › Graduate to self-custody.** Click abre panel explicando qué significa, con CTA disabled ("Available after 10 predictions — you have 3"). Esta es la única vez que se expone el concepto explícitamente.

---

## 6. Componentes a construir (librería interna)

Todos en `/components/ui/` y documentados con Storybook si hay tiempo.

- `<StoryCard />` — feed card con market strip integrado.
- `<MarketStrip />` — barra horizontal reutilizable con probabilidad + sparkline + CTA.
- `<ProbabilityNumber />` — número grande en mono con animación odometer.
- `<Sparkline />` — wrapper de Recharts, config editorial (sin ejes, sin grid, línea 1.5px).
- `<PillToggle />` — Yes/No toggle.
- `<AmountStepper />` — selector de monto con 4 opciones pre-seteadas.
- `<EditorialOverline />` — label tipográfica reutilizable.
- `<LessonCard />` — tarjeta de micro-lección.
- `<BentoTile />` — tile de tamaño variable para portfolio.
- `<NavBar />` — bottom nav mobile, sidebar desktop. Iconos stroke 1.5 + label tipográfica.
- `<ConfirmationModal />` — modal editorial, no fintech.

---

## 7. Datos mock

En `lib/mock-data.ts`:

```ts
export const stories: Story[] = [ /* ~20 stories across topics */ ];
export const markets: Market[] = [ /* tied to stories */ ];
export const user: User = {
  name: "Armando",
  practiceBalance: 10.00,
  positions: [ /* 3-4 pre-seeded positions */ ],
  predictionsCompleted: 3,
  accuracyRate: 0.62,
  unlockedLessons: [1, 2, 3],
};
```

Tipos:

```ts
type Story = {
  id: string;
  topic: 'politics' | 'climate' | 'culture' | 'sports' | 'tech' | 'economy';
  title: string;
  summary: string;
  body: string; // markdown
  publishedAt: string; // ISO
  marketId: string;
};

type Market = {
  id: string;
  question: string;
  probabilityYes: number; // 0-1
  history: { t: string; p: number }[]; // for sparkline
  resolvesAt: string;
};

type Position = {
  marketId: string;
  side: 'yes' | 'no';
  amount: number;
  takenAt: string;
  currentValue: number;
};
```

Simular fluctuación: `setInterval` cada 8s que mueve `probabilityYes` ±1.5% dentro de rango creíble, actualiza `history`, y anima el cambio con odometer.

---

## 8. Accesibilidad

- Contraste AA mínimo en todo texto — validar la paleta con herramienta antes de shipear.
- Navegación por teclado completa (Tab, Enter, Esc cierra modales).
- `prefers-reduced-motion`: reducir todas las transiciones a <100ms y desactivar spring.
- Labels semánticas en todos los CTA de predicción ("Back $1 on Yes for: Will X happen?").
- Focus rings custom en `accent-ink`, nunca el azul default del navegador.

---

## 9. Qué NO incluir en el demo

- Sign-up / login real.
- Integración con wallets (WalletConnect, MetaMask, etc).
- Ninguna dirección 0x visible en ninguna parte.
- Ni la palabra "crypto", "blockchain", "token" o "wallet" en onboarding ni en el feed principal. Sólo aparecen en `/learn` y en `/settings › Advanced`.
- Gráficos de candlesticks.
- Confetti, emojis animados, gamificación ruidosa.
- Notificaciones push / dark patterns.

---

## 10. Entregables

1. Repositorio Next.js funcional corriendo en local con `pnpm dev`.
2. Deploy a Vercel con URL compartible.
3. Archivo `README.md` con instrucciones de instalación y mapa de la arquitectura.
4. Un Figma (o archivo de design tokens exportados) con los 12 colores, 8 estilos de texto, y los 11 componentes base.
5. Video Loom de 2 minutos grabando el flujo completo: onboarding → feed → story → back a hunch → ver portfolio → desbloquear una lección.

---

## 11. Criterios de éxito del demo

El demo se considera exitoso si, al mostrárselo a una persona no-cripto, esa persona dice alguna variante de:

- *"Esto se ve como una app de medios, no como algo financiero."*
- *"Quiero probarlo."*
- *"No entendí que tenía que ver con cripto."*

Y específicamente **no** dice:

- *"Se ve como Binance / Coinbase."*
- *"Muy técnico."*
- *"No sé qué es esto."*

---

**Fin del prompt.** Entregable principal: un demo frontend que transmita la tesis del producto (cripto como consecuencia, no como protagonista) a través de la calidad visual y editorial.
