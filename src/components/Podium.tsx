import type { CSSProperties } from 'react'
import type { Player } from '../types'
import logo from '../assets/large-logo.png'
import './Podium.css'

interface Props {
  /** already sorted highest score to lowest */
  ranked: Player[]
  /** how many places, counting up from last, the host has revealed */
  podiumIndex: number
}

const ORDINALS = ['1st', '2nd', '3rd']
const ordinal = (rank: number) => ORDINALS[rank] ?? `${rank + 1}th`

/** Rank r (0 = winner) is unveiled once the cursor reaches last-to-first. */
const isRevealed = (rank: number, total: number, podiumIndex: number) =>
  podiumIndex >= total - rank

const CONFETTI = Array.from({ length: 18 }, (_, i) => i)

function Pedestal({
  player,
  rank,
  revealed,
}: {
  player: Player
  rank: number
  revealed: boolean
}) {
  const winner = rank === 0
  return (
    <div
      className={[
        'podium-stand',
        `podium-stand--${rank + 1}`,
        revealed ? 'podium-stand--in' : '',
        winner ? 'podium-stand--winner' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="podium-stand__card">
        {winner && <span className="podium-stand__crown">♛</span>}
        <span className="podium-stand__name">{revealed ? player.name : '???'}</span>
        <span className="podium-stand__score">
          {revealed ? player.score.toLocaleString() : '•••'}
        </span>
      </div>
      <div className="podium-stand__block">
        <span className="podium-stand__place">{ordinal(rank)}</span>
        {winner && revealed && (
          <div className="podium-stand__confetti" aria-hidden>
            {CONFETTI.map((i) => (
              <span
                key={i}
                className="podium-confetti"
                style={
                  {
                    '--i': i,
                    '--x': `${(i * 53) % 100}%`,
                    '--delay': `${(i % 6) * 90}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Final results reveal. The top three take pedestals (2nd · 1st · 3rd) and the
 * rest fill a ranked list, all uncovered from last place up to the winner as the
 * host advances the cursor.
 */
export default function Podium({ ranked, podiumIndex }: Props) {
  const total = ranked.length
  const top = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  // Pedestal display order puts 1st in the middle so it reads like a podium.
  const stageOrder = [1, 0, 2] as const

  return (
    <div className="podium">
      <img className="podium__logo" src={logo} alt="Mogul Money" />
      <p className="mm-eyebrow podium__eyebrow">The Final Standings</p>

      <div className="podium__stage">
        {stageOrder.map((rank) => {
          const player = top[rank]
          if (!player) return <div key={rank} className="podium-stand podium-stand--ghost" />
          return (
            <Pedestal
              key={player.id}
              player={player}
              rank={rank}
              revealed={isRevealed(rank, total, podiumIndex)}
            />
          )
        })}
      </div>

      {rest.length > 0 && (
        <ol className="podium__rest">
          {rest.map((player, i) => {
            const rank = i + 3
            const revealed = isRevealed(rank, total, podiumIndex)
            return (
              <li
                key={player.id}
                className={`podium-row${revealed ? ' podium-row--in' : ''}`}
              >
                <span className="podium-row__place">{ordinal(rank)}</span>
                <span className="podium-row__name">{revealed ? player.name : '???'}</span>
                <span className="podium-row__score">
                  {revealed ? player.score.toLocaleString() : '•••'}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
