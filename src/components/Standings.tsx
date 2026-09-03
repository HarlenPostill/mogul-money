import type { Player } from '../types'
import './Standings.css'

interface Props {
  players: Player[]
  /** highlight ring, e.g. the player who buzzed first */
  activeId?: string | null
  /** optional per-player caption, e.g. a wager or buzz position */
  captionFor?: (player: Player, index: number) => string | null
  onSelect?: (player: Player) => void
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
            <span className="standings__score">{player.score.toLocaleString()}</span>
            {caption && <span className="standings__caption">{caption}</span>}
          </button>
        )
      })}
    </div>
  )
}
