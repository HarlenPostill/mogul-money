import { useEffect, useState } from 'react'
import {
  buzz,
  buzzOrder,
  joinGame,
  playersSorted,
  renamePlayer,
  setFinalAnswer,
  setWager,
  useGameState,
} from '../game'
import { usePlayerId } from '../identity'
import type { GameState, Player } from '../types'
import { FINAL } from '../content'
import miniLogo from '../assets/mini-logo.png'
import './PlayerScreen.css'

function Join({ onJoined }: { onJoined: (id: string) => void }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || busy) return
    setBusy(true)
    try {
      onJoined(await joinGame(name))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="player__panel" onSubmit={submit}>
      <img className="player__logo" src={miniLogo} alt="Mogul Money" />
      <p className="mm-eyebrow">Pick your team name</p>
      <input
        className="mm-input"
        value={name}
        maxLength={24}
        autoFocus
        placeholder="e.g. The Liquidators"
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit" className="mm-btn player__wide" disabled={!name.trim() || busy}>
        Join the game
      </button>
    </form>
  )
}

function NameEditor({ player }: { player: Player }) {
  // Remounted via `key` whenever the stored name changes, so a rename made on
  // the host's device flows back into this field.
  const [draft, setDraft] = useState(player.name)

  return (
    <div className="player__panel">
      <p className="mm-eyebrow">Your team name</p>
      <input
        className="mm-input"
        value={draft}
        maxLength={24}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => draft.trim() && renamePlayer(player.id, draft)}
      />
      <button
        type="button"
        className="mm-btn player__wide"
        disabled={!draft.trim() || draft === player.name}
        onClick={() => renamePlayer(player.id, draft)}
      >
        Save name
      </button>
      <p className="player__muted">
        You can change this right up until the host starts the game.
      </p>
    </div>
  )
}

function Buzzer({ player, state }: { player: Player; state: GameState }) {
  const order = buzzOrder(state)
  const position = order.indexOf(player.id)
  const live = Boolean(state.active)

  return (
    <div className="player__panel player__panel--grow">
      <button
        type="button"
        className={[
          'player__buzzer',
          !live ? 'player__buzzer--idle' : '',
          position >= 0 ? 'player__buzzer--locked' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={!live || position >= 0}
        onClick={() => buzz(player.id)}
      >
        {!live ? 'Stand by' : position >= 0 ? `#${position + 1}` : 'Buzz'}
      </button>
      <p className="player__muted">
        {!live
          ? 'The buzzer wakes up when a clue goes on the board.'
          : position === 0
            ? 'You were first in.'
            : position > 0
              ? `You are number ${position + 1} in the queue.`
              : 'Buzz in to answer.'}
      </p>
    </div>
  )
}

function FinalRound({ player, state }: { player: Player; state: GameState }) {
  const wager = state.final.wagers[player.id]
  const [draftWager, setDraftWager] = useState(String(wager ?? ''))
  const [answer, setAnswer] = useState(state.final.answers[player.id] ?? '')
  const max = Math.max(0, player.score)
  const amount = Number(draftWager)
  const wagerValid = draftWager !== '' && Number.isFinite(amount) && amount >= 0 && amount <= max

  return (
    <div className="player__panel">
      <p className="mm-eyebrow">Final round · you have {player.score}</p>

      <label className="player__field">
        <span className="player__muted">Wager (0 – {max})</span>
        <input
          className="mm-input"
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={draftWager}
          onChange={(event) => setDraftWager(event.target.value)}
        />
      </label>
      <button
        type="button"
        className="mm-btn player__wide"
        disabled={!wagerValid}
        onClick={() => setWager(player.id, amount)}
      >
        {wager === undefined ? 'Lock in wager' : `Update wager (now ${wager})`}
      </button>

      {state.final.revealed ? (
        <>
          <p className="player__question">{FINAL.question}</p>
          <label className="player__field">
            <span className="player__muted">Your answer</span>
            <textarea
              className="mm-input"
              rows={3}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="mm-btn player__wide"
            disabled={!answer.trim()}
            onClick={() => setFinalAnswer(player.id, answer.trim())}
          >
            {state.final.answers[player.id] ? 'Update answer' : 'Submit answer'}
          </button>
        </>
      ) : (
        <p className="player__muted">Waiting for the host to reveal the question…</p>
      )}
    </div>
  )
}

export default function PlayerScreen() {
  const { state, loading } = useGameState()
  const [playerId, setPlayerId] = usePlayerId()
  const player = playerId ? state.players[playerId] : undefined

  // The host removed us (or the game was reset) — drop back to the join form.
  useEffect(() => {
    if (!loading && playerId && !state.players[playerId]) setPlayerId(null)
  }, [loading, playerId, state.players, setPlayerId])

  if (loading) {
    return (
      <div className="player mm-screen">
        <p className="mm-eyebrow player__panel">Connecting…</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="player mm-screen">
        <Join onJoined={setPlayerId} />
      </div>
    )
  }

  const rank = playersSorted(state)
    .slice()
    .sort((a, b) => b.score - a.score)
    .findIndex((p) => p.id === player.id)

  return (
    <div className="player mm-screen">
      <header className="player__header">
        <span className="player__name">{player.name}</span>
        <span className="player__score">
          {player.score.toLocaleString()}
          <small>#{rank + 1}</small>
        </span>
      </header>

      {state.phase === 'lobby' && <NameEditor key={player.name} player={player} />}

      {(state.phase === 'preview1' || state.phase === 'preview2') && (
        <div className="player__panel">
          <p className="player__muted">
            The host is walking through the categories. Sit tight.
          </p>
        </div>
      )}

      {(state.phase === 'board1' || state.phase === 'board2') && (
        <Buzzer player={player} state={state} />
      )}

      {state.phase === 'final' && <FinalRound player={player} state={state} />}
    </div>
  )
}
