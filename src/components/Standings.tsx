import { useEffect, useRef, useState } from 'react'
import type { Player } from '../types'
import './Standings.css'

const SCORE_ANIMATION_DURATION = 1_500

interface Props {
  players: Player[]
  /** highlight ring, e.g. the player who buzzed first */
  activeId?: string | null
  /** optional per-player caption, e.g. a wager or buzz position */
  captionFor?: (player: Player, index: number) => string | null
  onSelect?: (player: Player) => void
}

function AnimatedScore({ score }: { score: number }) {
  const [displayedScore, setDisplayedScore] = useState(score)
  const displayedScoreRef = useRef(score)

  useEffect(() => {
    const from = displayedScoreRef.current

    if (score === from) return

    setDisplayedScore(from)
    const startTime = performance.now()
    let frame: number | undefined

    const countUp = (now: number) => {
      const progress = Math.min((now - startTime) / SCORE_ANIMATION_DURATION, 1)
      // Math.round() can produce -0 while counting up from a negative score.
      const current = Math.round(from + (score - from) * progress) || 0

      displayedScoreRef.current = current
      setDisplayedScore(current)

      if (progress < 1) {
        frame = requestAnimationFrame(countUp)
      }
    }

    frame = requestAnimationFrame(countUp)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [score])

  return <>{(displayedScore || 0).toLocaleString()}</>
}

/**
 * The scoreboard strip. Built as a flex row so 3 players look deliberate and
 * 6 players still fit without a horizontal scrollbar.
 */
export default function Standings({ players, activeId, captionFor, onSelect }: Props) {
  if (players.length === 0) return null

  return (
    <div className="standings">
      {players.map((player, index) => {
        const caption = captionFor?.(player, index) ?? null
        const className = [
          'standings__card',
          activeId === player.id ? 'standings__card--active' : '',
          onSelect ? 'standings__card--clickable' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={player.id}
            type="button"
            className={className}
            disabled={!onSelect}
            onClick={() => onSelect?.(player)}
          >
            <span className="standings__name">{player.name}</span>
            <span className="standings__score">
              <AnimatedScore score={player.score} />
            </span>
            {caption && <span className="standings__caption">{caption}</span>}
          </button>
        )
      })}
    </div>
  )
}
