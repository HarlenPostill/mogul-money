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

  return (
    <div className={`board${compact ? ' board--compact' : ''}`}>
      <div className="board__row board__row--head">
        {categories.map((category) => (
          <div key={category.title} className="board__category">
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
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={!onPick || spent}
                onClick={() => onPick?.(col, row)}
              >
                {spent ? '' : clueValue(board, row)}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
