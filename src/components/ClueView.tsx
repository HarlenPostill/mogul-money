import type { ActiveClue, GameState, Player } from '../types'
import { clueValue } from '../types'
import { boardContent, buzzOrder } from '../game'
import './ClueView.css'

interface Props {
  active: ActiveClue
  state: GameState
  /** show the answer text too — host screen only, never the audience screen */
  showAnswer?: boolean
}

export default function ClueView({ active, state, showAnswer }: Props) {
  const category = boardContent(active.board).categories[active.category]
  const clue = category.clues[active.row]
  const order = buzzOrder(state)
  const buzzed: Player[] = order
    .map((id) => state.players[id])
    .filter((p): p is Player => Boolean(p))

  return (
    <div className="clue">
      <div className="clue__head">
        <span className="clue__category">{category.title}</span>
        <span className="clue__value">{clueValue(active.board, active.row)}</span>
      </div>

      <div className="clue__body">
        {active.revealed ? (
          <p className="clue__question">{clue.question}</p>
        ) : (
          <p className="clue__hidden">Question hidden</p>
        )}
        {showAnswer && <p className="clue__answer">{clue.answer}</p>}
      </div>

      {buzzed.length > 0 && (
        <ol className="clue__buzzes">
          {buzzed.map((player, i) => (
            <li key={player.id} className={i === 0 ? 'is-first' : ''}>
              <span className="clue__buzz-rank">{i + 1}</span>
              {player.name}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
