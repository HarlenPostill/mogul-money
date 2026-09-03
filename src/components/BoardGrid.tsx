import type { CSSProperties } from 'react'
import type { BoardId, GameState } from '../types'
import { clueValue } from '../types'
import { boardContent, isUsed } from '../game'
import './BoardGrid.css'

interface Props {
  board: BoardId
  state: GameState
  /** omit to render a read-only board (the audience screen) */
  onPick?: (category: number, row: number) => void
  compact?: boolean
}

export default function BoardGrid({ board, state, onPick, compact }: Props) {
  const { categories } = boardContent(board)
  const activeCategory = state.active?.board === board ? state.active.category : null

  return (
    <div
      className={[
        'board',
        compact ? 'board--compact' : '',
        !compact ? 'board--reveal' : '',
        activeCategory !== null ? 'board--opening' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="board__row board__row--head">
        {categories.map((category, col) => (
          <div
            key={category.title}
            className={[
              'board__category',
              activeCategory === col ? 'board__category--active' : '',
              `board__category--${col}`,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--reveal-delay': `${col * 90}ms` } as CSSProperties}
          >
            <span>{category.title}</span>
          </div>
        ))}
      </div>

      {categories[0].clues.map((_, row) => (
        <div className="board__row" key={row}>
          {categories.map((category, col) => {
            const spent = isUsed(state, board, col, row)
            const active =
              state.active?.board === board &&
              state.active.category === col &&
              state.active.row === row

            return (
              <button
                key={category.title}
                type="button"
                className={[
                  'board__cell',
                  spent ? 'board__cell--spent' : '',
                  active ? 'board__cell--active' : '',
                  `board__cell--col-${col}`,
                  `board__cell--row-${row}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--reveal-delay': `${(row + col + 1) * 90}ms` } as CSSProperties}
                disabled={!onPick || spent}
                onClick={() => onPick?.(col, row)}
              >
                <span className="board__value">{spent ? '' : clueValue(board, row)}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
