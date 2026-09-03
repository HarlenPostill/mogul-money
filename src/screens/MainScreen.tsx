import { useMemo } from 'react'
import { useGameState, playersSorted } from '../game'
import Lobby from '../components/Lobby'
import CategoryPreview from '../components/CategoryPreview'
import BoardGrid from '../components/BoardGrid'
import ClueView from '../components/ClueView'
import FinalReveal from '../components/FinalReveal'
import Standings from '../components/Standings'
import { buzzOrder } from '../game'
import miniLogo from '../assets/mini-logo.png'
import './MainScreen.css'

/**
 * The shared screen the room watches. It is purely a projection of game
 * state — it never mutates anything.
 */
export default function MainScreen() {
  const { state, loading } = useGameState()
  const players = useMemo(() => playersSorted(state), [state])
  const joinUrl = `${window.location.origin}/play`

  if (loading) {
    return (
      <div className="main main--loading">
        <p className="mm-eyebrow">Connecting…</p>
      </div>
    )
  }

  const showBoard = state.phase === 'board1' || state.phase === 'board2'
  const board = state.phase === 'board2' ? 2 : 1
  const firstBuzz = buzzOrder(state)[0] ?? null

  return (
    <div className="main mm-screen">
      {state.phase !== 'lobby' && (
        <header className="main__bar">
          <img className="main__logo" src={miniLogo} alt="Mogul Money" />
        </header>
      )}

      {state.phase === 'lobby' && <Lobby players={players} joinUrl={joinUrl} />}

      {(state.phase === 'preview1' || state.phase === 'preview2') && (
        <CategoryPreview
          board={state.phase === 'preview2' ? 2 : 1}
          index={state.previewIndex}
        />
      )}

      {showBoard &&
        (state.active ? (
          <ClueView active={state.active} state={state} />
        ) : (
          <BoardGrid board={board} state={state} />
        ))}

      {state.phase === 'final' && <FinalReveal players={players} state={state} />}

      {state.phase !== 'lobby' && (
        <Standings
          players={players}
          activeId={showBoard ? firstBuzz : null}
          captionFor={(player) =>
            state.phase === 'final' && state.final.wagers[player.id] !== undefined
              ? 'Wager in'
              : null
          }
        />
      )}
    </div>
  )
}
