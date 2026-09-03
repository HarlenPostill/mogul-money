import { useEffect, useState } from 'react'
import {
  get,
  onValue,
  push,
  ref,
  remove,
  runTransaction,
  serverTimestamp,
  set,
  update,
} from 'firebase/database'
import { GAME_ID, db } from './firebase'
import { BOARD_1, BOARD_2 } from './content'
import type {
  BoardContent,
  BoardId,
  GameState,
  Phase,
  Player,
} from './types'
import { clueKey } from './types'

const ROOT = `games/${GAME_ID}`
const path = (...parts: (string | number)[]) => ref(db, [ROOT, ...parts].join('/'))

export const DEFAULT_STATE: GameState = {
  phase: 'lobby',
  previewIndex: -1,
  players: {},
  used: {},
  active: null,
  buzzes: {},
  final: { revealed: false, wagers: {}, answers: {}, revealIndex: -1 },
  podiumIndex: 0,
  startedAt: null,
}

type Raw = Record<string, unknown> | null | undefined

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}

/**
 * RTDB drops empty objects and nulls entirely, so every consumer would
 * otherwise have to null-check each branch. Fill in the gaps once, here.
 */
export function normalizeState(raw: unknown): GameState {
  const r = asRecord(raw) as Raw & Record<string, unknown>
  const finalRaw = asRecord(r.final)

  const players: Record<string, Player> = {}
  for (const [id, value] of Object.entries(asRecord(r.players))) {
    const p = asRecord(value)
    players[id] = {
      id,
      name: typeof p.name === 'string' ? p.name : 'Unnamed',
      score: typeof p.score === 'number' ? p.score : 0,
      joinedAt: typeof p.joinedAt === 'number' ? p.joinedAt : 0,
    }
  }

  const buzzes: Record<string, number> = {}
  for (const [id, value] of Object.entries(asRecord(r.buzzes))) {
    if (typeof value === 'number') buzzes[id] = value
  }

  const used: Record<string, boolean> = {}
  for (const [key, value] of Object.entries(asRecord(r.used))) {
    if (value) used[key] = true
  }

  const wagers: Record<string, number> = {}
  for (const [id, value] of Object.entries(asRecord(finalRaw.wagers))) {
    if (typeof value === 'number') wagers[id] = value
  }

  const answers: Record<string, string> = {}
  for (const [id, value] of Object.entries(asRecord(finalRaw.answers))) {
    if (typeof value === 'string') answers[id] = value
  }

  const activeRaw = r.active ? asRecord(r.active) : null
  const active =
    activeRaw && typeof activeRaw.category === 'number' && typeof activeRaw.row === 'number'
      ? {
          board: (activeRaw.board === 2 ? 2 : 1) as BoardId,
          category: activeRaw.category,
          row: activeRaw.row,
          revealed: activeRaw.revealed !== false,
          answerRevealed: activeRaw.answerRevealed === true,
        }
      : null

  return {
    phase: typeof r.phase === 'string' ? (r.phase as Phase) : 'lobby',
    previewIndex: typeof r.previewIndex === 'number' ? r.previewIndex : -1,
    players,
    used,
    active,
    buzzes,
    final: {
      revealed: finalRaw.revealed === true,
      wagers,
      answers,
      revealIndex: typeof finalRaw.revealIndex === 'number' ? finalRaw.revealIndex : -1,
    },
    podiumIndex: typeof r.podiumIndex === 'number' ? r.podiumIndex : 0,
    startedAt: typeof r.startedAt === 'number' ? r.startedAt : null,
  }
}

export function useGameState(): { state: GameState; loading: boolean } {
  const [state, setState] = useState<GameState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onValue(ref(db, ROOT), (snap) => {
      setState(normalizeState(snap.val()))
      setLoading(false)
    })
  }, [])

  return { state, loading }
}

/* ------------------------------------------------------------------ players */

export async function joinGame(name: string): Promise<string> {
  const playerRef = push(path('players'))
  await set(playerRef, { name: name.trim(), score: 0, joinedAt: serverTimestamp() })
  if (!playerRef.key) throw new Error('Firebase did not return a player key')
  return playerRef.key
}

export const renamePlayer = (id: string, name: string) =>
  set(path('players', id, 'name'), name.trim())

export async function removePlayer(id: string) {
  await Promise.all([
    remove(path('players', id)),
    remove(path('buzzes', id)),
    remove(path('final', 'wagers', id)),
    remove(path('final', 'answers', id)),
  ])
}

export const awardPoints = (id: string, delta: number) =>
  runTransaction(path('players', id, 'score'), (current) => (current ?? 0) + delta)

/* -------------------------------------------------------------------- phase */

export const setPhase = (phase: Phase) => set(path('phase'), phase)

export const setPreviewIndex = (index: number) =>
  set(path('previewIndex'), Math.max(-1, index))

export const startGame = () =>
  update(path(), { phase: 'preview1', previewIndex: -1, startedAt: serverTimestamp() })

/* -------------------------------------------------------------------- clues */

export const openClue = (board: BoardId, category: number, row: number) =>
  update(path(), {
    active: { board, category, row, revealed: true, answerRevealed: false },
    buzzes: null,
  })

export const setClueRevealed = (revealed: boolean) =>
  set(path('active', 'revealed'), revealed)

export const setClueAnswerRevealed = (revealed: boolean) =>
  set(path('active', 'answerRevealed'), revealed)

/** Close the current clue and mark it spent so it cannot be replayed. */
export async function closeClue(board: BoardId, category: number, row: number) {
  await update(path(), {
    [`used/${clueKey(board, category, row)}`]: true,
    active: null,
    buzzes: null,
  })
}

/** Host escape hatch: put a clue back on the board. */
export const unmarkClue = (board: BoardId, category: number, row: number) =>
  remove(path('used', clueKey(board, category, row)))

/* ------------------------------------------------------------------- buzzes */

/**
 * Write-once. The real guarantee is the `!data.exists()` rule in
 * database.rules.json — a player can never un-buzz or improve their position.
 */
export async function buzz(playerId: string) {
  const buzzRef = path('buzzes', playerId)
  const existing = await get(buzzRef)
  if (existing.exists()) return
  await set(buzzRef, serverTimestamp())
}

export const clearBuzz = (playerId: string) => remove(path('buzzes', playerId))

export const clearAllBuzzes = () => remove(path('buzzes'))

/* -------------------------------------------------------------------- final */

export const setWager = (playerId: string, amount: number) =>
  set(path('final', 'wagers', playerId), Math.max(0, Math.round(amount)))

export const setFinalAnswer = (playerId: string, text: string) =>
  set(path('final', 'answers', playerId), text)

export const revealFinalQuestion = (revealed: boolean) =>
  set(path('final', 'revealed'), revealed)

export const setFinalRevealIndex = (index: number) =>
  set(path('final', 'revealIndex'), index)

export const resetFinal = () =>
  set(path('final'), { revealed: false, revealIndex: -1 })

/* ------------------------------------------------------------------- podium */

export const setPodiumIndex = (index: number) =>
  set(path('podiumIndex'), Math.max(0, index))

/**
 * Advance/rewind the reveal cursor relative to whatever is currently stored on
 * the server. A plain `set(current + 1)` reads a value that can be stale by a
 * round-trip, so mashing "Reveal next" would collapse several clicks into one.
 */
export const stepPodiumIndex = (delta: number, max: number) =>
  runTransaction(path('podiumIndex'), (current) =>
    Math.max(0, Math.min(max, (current ?? 0) + delta)),
  )

export const resetGame = () => set(path(), DEFAULT_STATE)

/* ---------------------------------------------------------------- selectors */

export const playersSorted = (state: GameState): Player[] =>
  Object.values(state.players).sort(
    (a, b) => a.joinedAt - b.joinedAt || a.name.localeCompare(b.name),
  )

/** Players from highest score to lowest, ties broken by name. */
export const rankedByScore = (state: GameState): Player[] =>
  Object.values(state.players).sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name),
  )

/** Player ids in the order they buzzed in. */
export const buzzOrder = (state: GameState): string[] =>
  Object.entries(state.buzzes)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => id)

export const isUsed = (state: GameState, board: BoardId, category: number, row: number) =>
  state.used[clueKey(board, category, row)] === true

export const boardContent = (board: BoardId): BoardContent =>
  board === 1 ? BOARD_1 : BOARD_2

export const boardComplete = (state: GameState, board: BoardId) =>
  boardContent(board).categories.every((cat, c) =>
    cat.clues.every((_, r) => isUsed(state, board, c, r)),
  )
