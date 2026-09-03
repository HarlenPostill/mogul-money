# Running a show

## One-time Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. Build → **Realtime Database** → Create database. (Realtime Database, *not*
   Firestore — the whole buzzer design depends on RTDB latency.)
3. Project settings → Your apps → Web app. Copy the config values.
4. `cp .env.example .env` and fill them in. `VITE_FIREBASE_DATABASE_URL` must be
   the RTDB URL, e.g. `https://mogul-money-default-rtdb.firebaseio.com`.
5. Publish the rules in `database.rules.json`:
   `npx firebase deploy --only database`

The rules are open read/write apart from the write-once buzz guard — this is a
party game with an unlisted URL, not a bank. If you want it locked down, add
Firebase Anonymous Auth and gate on `auth != null`.

### Local emulator instead

```
npx firebase emulators:start --only database
```
then set `VITE_FIREBASE_EMULATOR=true` in `.env`.

## On the night

1. Open `/` on the big screen. Leave it there all night — it never needs input.
2. Open `/host` on your phone. Contestants must not see this URL.
3. Contestants scan the QR on the big screen, which opens `/play`, and pick a
   team name. They can change it until you press **Start game**.
4. Remove any duplicate or joke entries from the host lobby panel.
5. **Start game** → the board 1 preview. Use Back/Next to talk through each
   category; **Start board 1** appears on the last slide.
6. On the board, tap a value. The room sees the clue and every phone's buzzer
   goes live. Buzz order appears on your phone; **Un-buzz** fixes an accident,
   **Hide from room** blanks the big screen while you talk.
7. Tap **+value** next to whoever got it, then **Close clue**. The tile is spent.
8. When the board is empty a button appears to move on. Repeat for board 2
   (double points), then the final round.
9. Final: contestants wager anything from 0 up to their current score. Once
   every wager is in, **Reveal question**; they type free-text answers. Then
   **Reveal next** walks the big screen through each answer one at a time and
   finishes on the truth. Score with **Correct** / **Wrong** — those add or
   subtract exactly that player's wager.

Every tab stays reachable the whole time. If you skipped a clue or scored the
wrong team, jump back — nothing is lost.

## Deploying

```
npm run build
npx firebase deploy --only hosting
```

`firebase.json` already rewrites everything to `index.html`, which is what makes
`/host` and `/play` work as deep links. Any static host works as long as you
configure the same SPA fallback.

## Gotchas

- **The QR code encodes `window.location.origin + '/play'`.** On a laptop dev
  server that is `localhost`, which phones cannot reach. Run
  `npm run dev -- --host` and open the LAN address on the big screen so the QR
  points somewhere phones can actually load.
- Phones need to be on a network that can reach both the app and Firebase.
- **Reset game** on the host footer wipes everything back to an empty lobby.
