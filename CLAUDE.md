# Mogul Money — agent notes

Live Jeopardy-style game show. React 19 + Vite + TypeScript (strict), Firebase
Realtime Database, no backend of our own. Read `docs/ARCHITECTURE.md` first —
it has the full data model and file map.

## Hard rules

- **Components never import `firebase/*`.** Read with `useGameState()` from
  `src/game.ts`, write with the mutations exported from the same file. New
  behaviour that touches the database means a new function in `game.ts`.
- **Never hard-code a colour or font.** Everything is a token in
  `src/theme.css`. See `docs/DESIGN.md`.
- **All questions live in `src/content.ts`** and nowhere else. Point values are
  derived from grid position by `clueValue()`, never stored.
- **Read state is always normalized.** `normalizeState()` guarantees a complete
  `GameState`, because RTDB omits empty branches. Don't add null-checks for
  branches it already fills.
- **Phases never auto-advance.** The host drives them and can go backwards, so
  no code may assume a phase is entered only once or in order.
- Plain CSS files colocated with each component. No Tailwind, no CSS-in-JS, no
  animation libraries.

## Verify before finishing

```
npx tsc -b && npm run lint && npm test
```

Playwright is broken on this machine — do not attempt E2E runs.

## Known trade-offs

- Database rules are open read/write apart from the write-once buzz guard. This
  is an unlisted party game; tighten with Anonymous Auth if that changes.
- One fixed room at `games/${VITE_GAME_ID}`. Multi-room would mean threading a
  room id through `game.ts` and the routes.
- The lobby QR encodes `window.location.origin + '/play'`, so on `localhost` it
  is unscannable from a phone — run `npm run dev -- --host`.
