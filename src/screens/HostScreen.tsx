import { useMemo } from 'react'
import {
  awardPoints,
  boardComplete,
  boardContent,
  buzzOrder,
  clearAllBuzzes,
  clearBuzz,
  closeClue,
  openClue,
  playersSorted,
  rankedByScore,
  removePlayer,
  resetFinal,
  resetGame,
  revealFinalQuestion,
  setClueAnswerRevealed,
  setClueRevealed,
  setFinalRevealIndex,
  setPhase,
  setPodiumIndex,
  setPreviewIndex,
  stepPodiumIndex,
  startGame,
  unmarkClue,
  useGameState,
} from '../game'
import { PHASES, PHASE_LABELS, clueValue } from '../types'
import type { BoardId, GameState, Player } from '../types'
import { FINAL } from '../content'
import BoardGrid from '../components/BoardGrid'
import './HostScreen.css'

function PhaseTabs({ phase }: { phase: GameState['phase'] }) {
  return (
    <nav className="host__tabs">
      {PHASES.map((p) => (
        <button
          key={p}
          type="button"
          className={`host__tab${p === phase ? ' host__tab--on' : ''}`}
          onClick={() => setPhase(p)}
        >
          {PHASE_LABELS[p]}
        </button>
      ))}
    </nav>
  )
}

function LobbyPanel({ players }: { players: Player[] }) {
  return (
    <section className="host__panel">
      <p className="mm-eyebrow">Teams ({players.length})</p>
      <ul className="host__list">
        {players.map((player) => (
          <li key={player.id} className="host__row">
            <span>{player.name}</span>
            <button
              type="button"
              className="mm-btn mm-btn--danger host__small"
              onClick={() => removePlayer(player.id)}
            >
              Remove
            </button>
          </li>
        ))}
        {players.length === 0 && <li className="host__muted">Nobody has joined yet.</li>}
      </ul>
      <button
        type="button"
        className="mm-btn host__wide"
        disabled={players.length === 0}
        onClick={() => startGame()}
      >
        Start game
      </button>
    </section>
  )
}

function PreviewPanel({ board, index }: { board: BoardId; index: number }) {
  const { categories } = boardContent(board)
  const last = index >= categories.length - 1
  const current = index >= 0 ? categories[index] : null

  return (
    <section className="host__panel">
      <p className="mm-eyebrow">
        Categories · {Math.max(0, index + 1)} of {categories.length}
      </p>
      <h2 className="host__title">{current?.title ?? 'Ready to reveal'}</h2>
      <p className="host__muted">{current?.description ?? 'Press Next to reveal the first category.'}</p>

      <div className="host__pair">
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          disabled={index <= -1}
          onClick={() => setPreviewIndex(index - 1)}
        >
          Back
        </button>
        <button
          type="button"
          className="mm-btn"
          disabled={last}
          onClick={() => setPreviewIndex(index + 1)}
        >
          Next
        </button>
      </div>

      {last && (
        <button
          type="button"
          className="mm-btn host__wide"
          onClick={() => setPhase(board === 1 ? 'board1' : 'board2')}
        >
          Start board {board}
        </button>
      )}
    </section>
  )
}

function BoardPanel({
  board,
  state,
  players,
}: {
  board: BoardId
  state: GameState
  players: Player[]
}) {
  const active = state.active
  const order = buzzOrder(state)

  if (!active) {
    return (
      <section className="host__panel">
        <p className="mm-eyebrow">Tap a value to put it on the big screen</p>
        <BoardGrid
          board={board}
          state={state}
          compact
          onPick={(category, row) => openClue(board, category, row)}
        />
        {boardComplete(state, board) && (
          <button
            type="button"
            className="mm-btn host__wide"
            onClick={() => {
              setPreviewIndex(-1)
              setPhase(board === 1 ? 'preview2' : 'final')
            }}
          >
            {board === 1 ? 'Go to board 2 preview' : 'Go to final round'}
          </button>
        )}
        <ScoreEditor players={players} step={board === 1 ? 100 : 200} />
      </section>
    )
  }

  const category = boardContent(active.board).categories[active.category]
  const clue = category.clues[active.row]
  const value = clueValue(active.board, active.row)

  return (
    <section className="host__panel">
      <p className="mm-eyebrow">
        {category.title} &middot; {value}
      </p>
      <p className="host__question">{clue.question}</p>
      <p className="host__answer">{clue.answer}</p>

      <div className="host__pair">
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          onClick={() => setClueRevealed(!active.revealed)}
        >
          {active.revealed ? 'Hide from room' : 'Show to room'}
        </button>
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          onClick={() => setClueAnswerRevealed(!active.answerRevealed)}
        >
          {active.answerRevealed ? 'Hide answer' : 'Reveal answer'}
        </button>
      </div>

      <div className="host__pair">
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          onClick={() => clearAllBuzzes()}
        >
          Clear buzzers
        </button>
      </div>

      <p className="mm-eyebrow">Buzz order</p>
      <ol className="host__list">
        {order.map((id, i) => {
          const player = state.players[id]
          if (!player) return null
          return (
            <li key={id} className={`host__row${i === 0 ? ' host__row--first' : ''}`}>
              <span>
                {i + 1}. {player.name}
              </span>
              <button
                type="button"
                className="mm-btn mm-btn--danger host__small"
                onClick={() => clearBuzz(id)}
              >
                Un-buzz
              </button>
            </li>
          )
        })}
        {order.length === 0 && <li className="host__muted">No buzzes yet.</li>}
      </ol>

      <p className="mm-eyebrow">Award {value}</p>
      <div className="host__awards">
        {players.map((player) => (
          <div key={player.id} className="host__award">
            <span className="host__award-name">{player.name}</span>
            <button
              type="button"
              className="mm-btn host__small"
              onClick={() => awardPoints(player.id, value)}
            >
              +{value}
            </button>
            <button
              type="button"
              className="mm-btn mm-btn--danger host__small"
              onClick={() => awardPoints(player.id, -value)}
            >
              −{value}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mm-btn host__wide"
        onClick={() => closeClue(active.board, active.category, active.row)}
      >
        Close clue &amp; return to board
      </button>
      <button
        type="button"
        className="mm-btn mm-btn--ghost host__wide"
        onClick={() => unmarkClue(active.board, active.category, active.row)}
      >
        Put this clue back on the board
      </button>
    </section>
  )
}

function ScoreEditor({ players, step }: { players: Player[]; step: number }) {
  return (
    <>
      <p className="mm-eyebrow">Manual score fix</p>
      <div className="host__awards">
        {players.map((player) => (
          <div key={player.id} className="host__award">
            <span className="host__award-name">
              {player.name} · {player.score}
            </span>
            <button
              type="button"
              className="mm-btn host__small"
              onClick={() => awardPoints(player.id, step)}
            >
              +{step}
            </button>
            <button
              type="button"
              className="mm-btn mm-btn--danger host__small"
              onClick={() => awardPoints(player.id, -step)}
            >
              −{step}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

function FinalPanel({ state, players }: { state: GameState; players: Player[] }) {
  const { wagers, answers, revealIndex, revealed } = state.final
  const maxIndex = players.length

  return (
    <section className="host__panel">
      <p className="mm-eyebrow">{FINAL.category}</p>
      <p className="host__question">{FINAL.question}</p>
      <p className="host__answer">{FINAL.answer}</p>

      <button
        type="button"
        className="mm-btn host__wide"
        onClick={() => revealFinalQuestion(!revealed)}
      >
        {revealed ? 'Hide question from room' : 'Reveal question to room'}
      </button>

      <p className="mm-eyebrow">Wagers &amp; answers</p>
      <ul className="host__list">
        {players.map((player) => (
          <li key={player.id} className="host__row host__row--stack">
            <span>
              {player.name} · has {player.score}
            </span>
            <span className="host__muted">
              Wager: {wagers[player.id] ?? '—'} · Answer: {answers[player.id] || '—'}
            </span>
            <span className="host__pair">
              <button
                type="button"
                className="mm-btn host__small"
                disabled={wagers[player.id] === undefined}
                onClick={() => awardPoints(player.id, wagers[player.id] ?? 0)}
              >
                Correct
              </button>
              <button
                type="button"
                className="mm-btn mm-btn--danger host__small"
                disabled={wagers[player.id] === undefined}
                onClick={() => awardPoints(player.id, -(wagers[player.id] ?? 0))}
              >
                Wrong
              </button>
            </span>
          </li>
        ))}
      </ul>

      <p className="mm-eyebrow">
        Reveal cursor:{' '}
        {revealIndex < 0
          ? 'nothing shown'
          : revealIndex >= maxIndex
            ? 'correct answer'
            : players[revealIndex]?.name}
      </p>
      <div className="host__pair">
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          disabled={revealIndex < 0}
          onClick={() => setFinalRevealIndex(revealIndex - 1)}
        >
          Back
        </button>
        <button
          type="button"
          className="mm-btn"
          disabled={revealIndex >= maxIndex}
          onClick={() => setFinalRevealIndex(revealIndex + 1)}
        >
          Reveal next
        </button>
      </div>

      <button
        type="button"
        className="mm-btn mm-btn--ghost host__wide"
        onClick={() => resetFinal()}
      >
        Reset final round
      </button>

      <button
        type="button"
        className="mm-btn host__wide"
        onClick={() => {
          setPodiumIndex(0)
          setPhase('podium')
        }}
      >
        Go to podium
      </button>
    </section>
  )
}

function PodiumPanel({ state, players }: { state: GameState; players: Player[] }) {
  const ranked = rankedByScore(state)
  const total = ranked.length
  const { podiumIndex } = state
  // Places are revealed from last up to first, so the next reveal is the
  // best-scoring team not yet uncovered.
  const nextUp = podiumIndex < total ? ranked[total - podiumIndex - 1] : null

  return (
    <section className="host__panel">
      <p className="mm-eyebrow">Reveal places · last to first</p>
      <p className="host__question">
        {podiumIndex >= total
          ? 'Every place revealed 🎉'
          : nextUp
            ? `Next: ${nextUp.name} (${nextUp.score.toLocaleString()})`
            : 'Nobody to reveal'}
      </p>

      <div className="host__pair">
        <button
          type="button"
          className="mm-btn mm-btn--ghost"
          disabled={podiumIndex <= 0}
          onClick={() => stepPodiumIndex(-1, total)}
        >
          Back
        </button>
        <button
          type="button"
          className="mm-btn"
          disabled={podiumIndex >= total}
          onClick={() => stepPodiumIndex(1, total)}
        >
          Reveal next
        </button>
      </div>

      <button
        type="button"
        className="mm-btn mm-btn--ghost host__wide"
        onClick={() => setPodiumIndex(total)}
      >
        Reveal everyone
      </button>
      <button
        type="button"
        className="mm-btn mm-btn--ghost host__wide"
        onClick={() => setPodiumIndex(0)}
      >
        Reset podium
      </button>

      <p className="mm-eyebrow">Standings</p>
      <ol className="host__list">
        {ranked.map((player, i) => (
          <li
            key={player.id}
            className={`host__row${i === 0 ? ' host__row--first' : ''}`}
          >
            <span>
              {i + 1}. {player.name}
            </span>
            <span className="host__muted">{player.score.toLocaleString()}</span>
          </li>
        ))}
        {players.length === 0 && <li className="host__muted">No teams.</li>}
      </ol>
    </section>
  )
}

export default function HostScreen() {
  const { state, loading } = useGameState()
  const players = useMemo(() => playersSorted(state), [state])

  if (loading) {
    return (
      <div className="host mm-screen">
        <p className="mm-eyebrow host__panel">Connecting…</p>
      </div>
    )
  }

  return (
    <div className="host mm-screen">
      <PhaseTabs phase={state.phase} />

      {state.phase === 'lobby' && <LobbyPanel players={players} />}
      {state.phase === 'preview1' && <PreviewPanel board={1} index={state.previewIndex} />}
      {state.phase === 'preview2' && <PreviewPanel board={2} index={state.previewIndex} />}
      {state.phase === 'board1' && <BoardPanel board={1} state={state} players={players} />}
      {state.phase === 'board2' && <BoardPanel board={2} state={state} players={players} />}
      {state.phase === 'final' && <FinalPanel state={state} players={players} />}
      {state.phase === 'podium' && <PodiumPanel state={state} players={players} />}

      <footer className="host__footer">
        <button
          type="button"
          className="mm-btn mm-btn--danger host__small"
          onClick={() => {
            if (confirm('Wipe the whole game back to an empty lobby?')) resetGame()
          }}
        >
          Reset game
        </button>
      </footer>
    </div>
  )
}
