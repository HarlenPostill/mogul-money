import type { GameState, Player } from '../types'
import { FINAL } from '../content'
import './FinalReveal.css'

interface Props {
  players: Player[]
  state: GameState
}

function PlayerCard({
  player,
  state,
  revealed,
}: {
  player: Player
  state: GameState
  revealed: boolean
}) {
  const wager = state.final.wagers[player.id]
  const answer = state.final.answers[player.id]

  return (
    <article className={`final-card${revealed ? ' final-card--revealed' : ''}`}>
      <h3 className="final-card__name">{player.name}</h3>
      <p className="final-card__answer">
        {revealed ? answer || '— no answer —' : '• • •'}
      </p>
      <p className="final-card__wager">
        {revealed
          ? `Wagered ${(wager ?? 0).toLocaleString()}`
          : wager === undefined
            ? 'No wager yet'
            : 'Wager locked'}
      </p>
    </article>
  )
}

/**
 * Final round display. Players sit either side of the correct answer, which
 * only appears once the host has cycled past everyone.
 */
export default function FinalReveal({ players, state }: Props) {
  const { revealIndex, revealed } = state.final
  const answerShown = revealIndex >= players.length

  const left = players.filter((_, i) => i % 2 === 0)
  const right = players.filter((_, i) => i % 2 === 1)
  const indexOf = (player: Player) => players.findIndex((p) => p.id === player.id)

  const column = (group: Player[], side: string) => (
    <div className={`final__column final__column--${side}`}>
      {group.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          state={state}
          revealed={revealIndex >= indexOf(player)}
        />
      ))}
    </div>
  )

  return (
    <div className="final">
      {column(left, 'left')}

      <div className="final__centre">
        <p className="mm-eyebrow">{FINAL.category}</p>
        <p className="final__question">
          {revealed ? FINAL.question : 'Place your wagers'}
        </p>
        <div className={`final__answer${answerShown ? ' final__answer--in' : ''}`}>
          {answerShown ? FINAL.answer : ''}
        </div>
      </div>

      {column(right, 'right')}
    </div>
  )
}
