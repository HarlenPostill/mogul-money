import { useEffect, useMemo, useRef, useState } from 'react'
import { useGameState, playersSorted } from '../game'
import Lobby from '../components/Lobby'
import CategoryPreview from '../components/CategoryPreview'
import BoardGrid from '../components/BoardGrid'
import ClueView from '../components/ClueView'
import FinalReveal from '../components/FinalReveal'
import Podium from '../components/Podium'
import Standings from '../components/Standings'
import { buzzOrder, rankedByScore } from '../game'
import miniLogo from '../assets/mini-logo.png'
import './MainScreen.css'

/**
 * The shared screen the room watches. It is purely a projection of game
 * state — it never mutates anything.
 */
export default function MainScreen() {
  const { state, loading } = useGameState()
  const screenRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const players = useMemo(() => playersSorted(state), [state])
  const ranked = useMemo(() => rankedByScore(state), [state])
  const joinUrl = `${window.location.origin}/play`

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === screenRef.current)
    }

    document.addEventListener('fullscreenchange', updateFullscreenState)
    updateFullscreenState()
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await screenRef.current?.requestFullscreen()
      }
    } catch {
      // Fullscreen can be denied by browser permissions or an embedded context.
    }
  }

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
    <div ref={screenRef} className="main mm-screen">
      <button
        type="button"
        className="main__fullscreen"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
        title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
      >
        {isFullscreen ? '⤢' : '⛶'}
      </button>
      {state.phase !== 'lobby' && state.phase !== 'podium' && (
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

      {showBoard && (
        <div className="main__board-stage">
          <BoardGrid board={board} state={state} />
          {state.active && (
            <ClueView
              active={state.active}
              state={state}
              showAnswer={state.active.answerRevealed}
            />
          )}
        </div>
      )}

      {state.phase === 'final' && <FinalReveal players={players} state={state} />}

      {state.phase === 'podium' && (
        <Podium ranked={ranked} podiumIndex={state.podiumIndex} />
      )}

      {state.phase !== 'lobby' && state.phase !== 'podium' && (
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
