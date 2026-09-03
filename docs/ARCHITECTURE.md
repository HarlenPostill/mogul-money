# Architecture

## Shape of the app

Three React screens read from one shared Firebase Realtime Database node and
write back through a single module. There is no server of our own.

```
src/
  types.ts       Every shared type + the two pure maths helpers (clueKey, clueValue)
  content.ts     All questions, answers, categories. Content only — edit freely.
  firebase.ts    SDK init from env vars, exports `db` and `GAME_ID`
  game.ts        THE data layer: useGameState(), every mutation, every selector
  identity.ts    Which player this phone is, persisted in localStorage
  theme.css      The whole design system (see docs/DESIGN.md)
  screens/
    MainScreen.tsx    "/"      read-only projection of state for the room
    HostScreen.tsx    "/host"  every control, phone sized
    PlayerScreen.tsx  "/play"  join, buzz, wager, answer
  components/
    Lobby, CategoryPreview, BoardGrid, ClueView, FinalReveal, Standings
```

**Rule: components never touch Firebase directly.** They call `useGameState()`
to read and the exported functions in `game.ts` to write. If you need a new
mutation, add it to `game.ts`.

## The database

One room, at `games/${GAME_ID}` (`GAME_ID` comes from `VITE_GAME_ID`, default
`main`). Bump that env var to start a clean show without wiping the old one.

```jsonc
games/main: {
  phase: "lobby",           // lobby | preview1 | board1 | preview2 | board2 | final | podium
  previewIndex: 0,          // which category slide the preview phases are on
  startedAt: 1730000000000,
  players: {
    "-Nxyz": { name: "The Liquidators", score: 800, joinedAt: 1730000000000 }
  },
  used: { "1-3-2": true },  // `${board}-${category}-${row}` — spent clues
  active: {                 // null when the board is showing
    board: 1, category: 3, row: 2,
    revealed: true,         // false = main screen goes blank, host keeps talking
    answerRevealed: false   // true = main screen also shows the correct response
  },
  buzzes: { "-Nxyz": 1730000000123 },  // playerId -> SERVER timestamp
  final: {
    revealed: false,
    wagers:  { "-Nxyz": 500 },
    answers: { "-Nxyz": "The VOC" },
    revealIndex: -1         // -1 nothing, 0..n-1 that player, n the real answer
  }
}
```

RTDB deletes empty objects and nulls, so **every read goes through
`normalizeState()`** in `game.ts`. Consumers are guaranteed a complete
`GameState` and never have to null-check a branch.

## Phases

Phases do **not** auto-advance. The host has six tabs and can jump in any
direction at any time; nothing is destroyed by moving backwards because all
progress lives in `used`, `players[].score` and `final`.

| Phase                | Main screen                             | Host controls                                       |
| -------------------- | --------------------------------------- | --------------------------------------------------- |
| `lobby`              | QR code + joined team names             | Remove teams, **Start game**                        |
| `preview1`/`preview2`| Categories slide in one at a time       | Back/Next; **Start board N** appears on the last one |
| `board1`/`board2`    | 5×5 grid, or the open clue              | Tap a value to open it; buzz queue; award points     |
| `final`              | Wagers, then answers around the truth   | Reveal question, cycle the reveal cursor, score      |
| `podium`             | Pedestals + also-rans, uncovered last→first | Advance the podium cursor, reveal all, reset     |

Board 1 is 100–500; board 2 is 200–1000. Values are always derived from
position by `clueValue(board, row)` — never stored.

## Buzzers

`buzz(playerId)` writes `buzzes/${playerId} = serverTimestamp()` and refuses if
a value already exists, so **a player can never un-buzz or improve their
position**. Ordering uses the server clock, not the phone's, so it survives
clock skew across four different phones. The rule in `database.rules.json`
enforces the write-once property server-side:

```jsonc
"buzzes": { "$playerId": { ".validate": "!data.exists() || newData.val() == data.val()" } }
```

Only the host can clear a buzz (`clearBuzz`) or the whole queue
(`clearAllBuzzes`); opening a new clue clears them automatically.

## Identity

A contestant's player id is pushed by Firebase and stored in `localStorage`
under `mogul-money-player`. If the host removes them (or the game is reset),
`PlayerScreen` notices the id has vanished from `players` and drops the phone
back to the join form.

## Testing

`src/game.test.ts` covers the pure surface: `clueKey`, `clueValue`,
`normalizeState` against partial/garbage input, and the selectors. Network
mutations are deliberately untested — they are thin wrappers over the SDK.
`.env.test` supplies dummy Firebase values so the SDK can initialise under
Vitest.
