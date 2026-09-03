import { useEffect, useState } from 'react'
import type { BoardId } from '../types'
import { boardContent } from '../game'
import './CategoryPreview.css'

interface Props {
  board: BoardId
  /** how many categories have been revealed so far (index of the current one) */
  index: number
}

/**
 * Categories slide in one at a time as the host talks through them. Every
 * category revealed so far stays on screen; the newest one is enlarged and
 * shows its description.
 */
export default function CategoryPreview({ board, index }: Props) {
  const { categories } = boardContent(board)
  const [displayedIndex, setDisplayedIndex] = useState(index)
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (index === displayedIndex) return

    if (displayedIndex < 0) {
      setDisplayedIndex(index)
      return
    }

    setLeavingIndex(displayedIndex)
    const timeout = window.setTimeout(() => {
      setDisplayedIndex(index)
      setLeavingIndex(null)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [displayedIndex, index])

  return (
    <div className="preview">
      <p className="mm-eyebrow preview__eyebrow">
        Board {board} &middot; {board === 1 ? '100 – 500' : '200 – 1000'}
      </p>
      <ul className="preview__list">
        {categories.map((category, i) => {
          const revealed = i <= displayedIndex
          const current = i === displayedIndex
          const leaving = i === leavingIndex
          return (
            <li
              key={category.title}
              className={[
                'preview__item',
                revealed ? 'preview__item--in' : '',
                current ? 'preview__item--current' : '',
                leaving ? 'preview__item--leaving' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ transitionDelay: current ? '0ms' : '0ms' }}
            >
              <span className="preview__number">{i + 1}</span>
              <span className="preview__body">
                <span className="preview__title">{category.title}</span>
                <span className="preview__desc-shell">
                  <span className="preview__desc">{category.description}</span>
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
