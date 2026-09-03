# Design system

All of it lives in `src/theme.css`. **Do not hard-code a hex value in a
component stylesheet** — if you need a colour, it is already a token.

## Type

One typeface, everywhere: **Triumvirate CG Inserat**, loaded from
`public/Triumvirate CG Inserat.otf` via `@font-face` as `--mm-font`. It is a
condensed display face, so:

- Set it in uppercase with positive letter-spacing (`0.02em`–`0.14em`).
- Use it big. It is not a body face.
- `--mm-font-body` (system sans) is the *only* exception, reserved for small
  captions, form fields and helper text where the display face is unreadable.

## Colour

| Token                             | Value                          | Use                                   |
| --------------------------------- | ------------------------------ | ------------------------------------- |
| `--mm-bg`                         | `#3A055E` → `#5A089A`, 225deg  | The page. Top-right dark, bottom-left bright. |
| `--mm-gold`                       | `#FAD18E` → `#FDEACF`, 225deg  | Every raised surface: tiles, buttons, score cards |
| `--mm-ink` / `--mm-ink-soft`      | `#2C0549`                      | Text on gold. Nothing else goes on gold. |
| `--mm-text` / `--mm-muted`        | pale gold                      | Text on the purple field              |
| `--mm-line`                       | translucent gold               | Hairlines and ghost-button borders    |
| `--mm-veil`                       | translucent ink                | Recessed panels on the purple field   |

Both gradients run in the same direction, so a gold tile always reads as lit
from the same corner as the background. Keep new gradients at `225deg`.

Two rules cover almost every decision:

1. **Raised = gold with ink on it.** Clue tiles, buttons, score cards, the
   buzzer, a revealed answer.
2. **Recessed = `--mm-veil` with a `--mm-line` border and pale-gold text.**
   Spent clue tiles, host list rows, the final round's centre panel.

State is shown by *promoting* an element from recessed to raised — that's how a
final-round answer reveals and how the leading buzzer is marked.

## Shared classes

`.mm-btn` (`--ghost`, `--danger`), `.mm-input`, `.mm-panel`, `.mm-eyebrow`,
`.mm-screen`, `.mm-gold-surface`. Reach for these before writing new CSS.

## Motion

CSS only, no animation libraries. `--mm-ease` is
`cubic-bezier(0.22, 1, 0.36, 1)` — everything decelerates into place. The
signature moves:

- Category preview cards slide in from the right and dim once they are no
  longer the one being explained.
- Clues scale up from 0.94 on open.
- Buzz chips pop in from below; first place flips to gold.
- Final answers flip from recessed to gold as the host advances the cursor.

## Layout

Everything is fluid: `clamp()` on font sizes and padding, `flex: 1 1 0` columns,
no fixed pixel widths. The board and the scoreboard are designed around four
players but are pure flex, so three looks deliberate and six still fits.
`FinalReveal` splits players into left/right columns around the centre answer
and collapses to a single stacked column below 900px.
