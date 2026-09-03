# Writing your own boards

Everything the audience reads lives in `src/content.ts`. Nothing else needs to
change — point values, board layout and the preview slides are all derived.

```ts
export const BOARD_1: BoardContent = {
  baseValue: 100,
  categories: [
    {
      title: 'Startup Slang',                    // column header, keep it short
      description: 'One line the host reads.',   // shown on the preview slide
      clues: [                                   // exactly 5, easiest first
        { question: '…', answer: '…' },
      ],
    },
    // …exactly 5 categories
  ],
}
```

Constraints the app relies on:

- **Exactly 5 categories per board, exactly 5 clues per category.** The grid is
  built from `categories[0].clues.length`, so a short category breaks alignment.
- **Row order is difficulty order.** Row 0 is worth 100 (board 1) or 200
  (board 2); row 4 is worth 500 or 1000.
- `title` renders in condensed uppercase display type — two or three words max
  before it wraps awkwardly.
- `answer` is only ever shown on the host's phone during play, and on the big
  screen at the end of the final round. Write it as a crib for the host
  ("Steve Jobs", "Ramen profitable (accept: break even)"), not as a full
  sentence.

`FINAL` is a single `{ category, question, answer }` used by the wager round.

After editing, `npm test` still passes (content is untyped by the tests) but
`npx tsc -b` will catch a malformed shape.
