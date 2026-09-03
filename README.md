# Mogul Money

A live, phone-buzzer Jeopardy-style game show. One big screen for the room, one
control deck for the host, and a buzzer in every contestant's pocket. State is
synced through Firebase Realtime Database so buzzes land in true server order.

```
npm install
cp .env.example .env      # fill in your Firebase project details
npm run dev
```

| Route   | Who opens it        | What it is                                        |
| ------- | ------------------- | ------------------------------------------------- |
| `/`     | The projector / TV  | Lobby QR, category previews, the board, the final |
| `/host` | You                 | Phone-sized control deck (unlisted — type the URL) |
| `/play` | Contestants         | What the lobby QR code points at                  |

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — data model, phases, file map
- [docs/RUNNING.md](docs/RUNNING.md) — Firebase setup, running a show, deploying
- [docs/DESIGN.md](docs/DESIGN.md) — the visual system and its rules
- [docs/CONTENT.md](docs/CONTENT.md) — writing your own boards

## Scripts

| Command         | Does                          |
| --------------- | ----------------------------- |
| `npm run dev`   | Vite dev server               |
| `npm run build` | Typecheck + production bundle |
| `npm test`      | Vitest unit tests             |
| `npm run lint`  | ESLint                        |
