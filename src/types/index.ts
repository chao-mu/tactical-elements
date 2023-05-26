import { Color, PieceSymbol, Square } from 'chess.js';

export type Game = {
  event: string
  pgn: string
}

export type Puzzle = {
  fen: string
  solution: string[]
}

export type Rank = (
  { color: Color, type: PieceSymbol, square: Square } | null
)[]

export type Board = Rank[]
