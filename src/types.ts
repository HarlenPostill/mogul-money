export type Phase =
  | 'lobby'
  | 'preview1'
  | 'board1'
  | 'preview2'
  | 'board2'
  | 'final'
  | 'podium'

export const PHASES: Phase[] = [
  'lobby',
  'preview1',
  'board1',
  'preview2',
  'board2',
  'final',
  'podium',
]

export const PHASE_LABELS: Record<Phase, string> = {
  lobby: 'Lobby',
  preview1: 'Preview 1',
  board1: 'Board 1',
  preview2: 'Preview 2',
  board2: 'Board 2',
  final: 'Final',
  podium: 'Podium',
}

export type BoardId = 1 | 2

export interface Player {
  id: string
  name: string
  score: number
  joinedAt: number
}

export interface Clue {
  question: string
  answer: string
  /** Optional visual prompt, used by image-based clues such as Geo-guesser. */
  image?: string
  imageAlt?: string
}

/** A column on the board. `clues[0]` is the cheapest row. */
export interface Category {
  title: string
  description: string
  clues: Clue[]
}

export interface BoardContent {
  categories: Category[]
  baseValue: number
}

export interface FinalContent {
  category: string
  question: string
  answer: string
}

export interface ActiveClue {
  board: BoardId
  category: number
  row: number
  /** false = main screen goes blank while the host talks */
  revealed: boolean
  /** true = main screen also shows the correct response */
  answerRevealed: boolean
}

export interface FinalState {
  /** host has revealed the final question to the room */
  revealed: boolean
  wagers: Record<string, number>
  answers: Record<string, string>
  /** -1 = nothing shown, 0..n-1 = that player's answer, n = the correct answer */
  revealIndex: number
}

export interface GameState {
  phase: Phase
  /** which category slide is showing during a preview phase */
  previewIndex: number
  players: Record<string, Player>
  /** keyed by `clueKey` */
  used: Record<string, boolean>
  active: ActiveClue | null
  /** playerId -> server timestamp of their buzz */
  buzzes: Record<string, number>
  final: FinalState
  /**
   * How many podium places the host has revealed, counting up from last
   * place. 0 = nothing shown, n = every place including the winner.
   */
  podiumIndex: number
  startedAt: number | null
}

export const clueKey = (board: number, category: number, row: number) =>
  `${board}-${category}-${row}`

export const clueValue = (board: BoardId, row: number) =>
  (board === 1 ? 100 : 200) * (row + 1)

export const BOARD_SIZE = 5
