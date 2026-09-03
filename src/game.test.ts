import { describe, expect, it } from 'vitest'
import { DEFAULT_STATE, boardComplete, buzzOrder, isUsed, normalizeState, playersSorted } from './game'
import { clueKey, clueValue } from './types'
import type { GameState } from './types'

const withPlayers = (): GameState => ({
  ...DEFAULT_STATE,
  players: {
    b: { id: 'b', name: 'Bears', score: 300, joinedAt: 200 },
    a: { id: 'a', name: 'Aces', score: 100, joinedAt: 100 },
  },
  buzzes: { b: 5, a: 9 },
})

describe('clue maths', () => {
  it('keys clues by board, category and row', () => {
    expect(clueKey(2, 3, 4)).toBe('2-3-4')
  })

  it('doubles every value on board 2', () => {
    expect(clueValue(1, 0)).toBe(100)
    expect(clueValue(1, 4)).toBe(500)
    expect(clueValue(2, 0)).toBe(200)
    expect(clueValue(2, 4)).toBe(1000)
  })
})

describe('normalizeState', () => {
  it('returns the default shape for empty input', () => {
    expect(normalizeState(null)).toEqual(DEFAULT_STATE)
    expect(normalizeState(undefined)).toEqual(DEFAULT_STATE)
    expect(normalizeState('nonsense')).toEqual(DEFAULT_STATE)
  })

  it('fills in branches Firebase omits', () => {
    const state = normalizeState({ phase: 'board2', players: { x: { name: 'X' } } })
    expect(state.phase).toBe('board2')
    expect(state.players.x).toEqual({ id: 'x', name: 'X', score: 0, joinedAt: 0 })
    expect(state.buzzes).toEqual({})
    expect(state.final.revealIndex).toBe(-1)
    expect(state.active).toBeNull()
  })

  it('keeps a well-formed active clue and defaults revealed to true', () => {
    const state = normalizeState({ active: { board: 2, category: 1, row: 3 } })
    expect(state.active).toEqual({
      board: 2,
      category: 1,
      row: 3,
      revealed: true,
      answerRevealed: false,
    })
  })

  it('drops an active clue missing its coordinates', () => {
    expect(normalizeState({ active: { board: 1 } }).active).toBeNull()
  })
})

describe('selectors', () => {
  it('orders players by join time, not by key', () => {
    expect(playersSorted(withPlayers()).map((p) => p.name)).toEqual(['Aces', 'Bears'])
  })

  it('orders buzzes by timestamp', () => {
    expect(buzzOrder(withPlayers())).toEqual(['b', 'a'])
  })

  it('reports spent clues', () => {
    const state: GameState = { ...DEFAULT_STATE, used: { '1-0-0': true } }
    expect(isUsed(state, 1, 0, 0)).toBe(true)
    expect(isUsed(state, 1, 0, 1)).toBe(false)
    expect(isUsed(state, 2, 0, 0)).toBe(false)
  })

  it('only calls a board complete once every clue is spent', () => {
    const used: Record<string, boolean> = {}
    for (let c = 0; c < 5; c += 1) for (let r = 0; r < 5; r += 1) used[clueKey(1, c, r)] = true
    expect(boardComplete({ ...DEFAULT_STATE, used }, 1)).toBe(true)
    delete used[clueKey(1, 4, 4)]
    expect(boardComplete({ ...DEFAULT_STATE, used }, 1)).toBe(false)
  })
})
