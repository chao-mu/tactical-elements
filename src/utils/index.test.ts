// Jest
import { describe, expect, test } from "@jest/globals";

// Chess.js
import { Chess } from "chess.js";

// Ours
import { parseFen, toSquareName } from "@/utils";

describe("parseFen", () => {
  test("returns correct number of rows, columns, and pieces", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 3";
    const board = parseFen(fen);

    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
  });

  test("places pieces correctly", () => {
    const fen = "r1bBk2r/pppn1ppp/8/3n4/1b1P4/8/PP1QPPPP/R3KBNR b KQkq - 2 8";
    const expectedBoard = new Chess(fen).board();
    const actualBoard = parseFen(fen);

    expect(actualBoard).toEqual(expectedBoard);
  });

  test("places pieces correctly (abbreviated fen)", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 3";
    const expectedBoard = new Chess(fen).board();
    const actualBoard = parseFen(fen);

    expect(actualBoard).toEqual(expectedBoard);
  });
});

describe("toSquareName", () => {
  test("returns correct square name", () => {
    expect(toSquareName(0, 0)).toBe("a8");
    expect(toSquareName(7, 0)).toBe("a1");
    expect(toSquareName(0, 7)).toBe("h8");
    expect(toSquareName(7, 7)).toBe("h1");

    expect(toSquareName(0, 0)).toBe("a8");
    expect(toSquareName(0, 1)).toBe("b8");
    expect(toSquareName(0, 2)).toBe("c8");
    expect(toSquareName(0, 3)).toBe("d8");
    expect(toSquareName(0, 4)).toBe("e8");
    expect(toSquareName(0, 5)).toBe("f8");
    expect(toSquareName(0, 6)).toBe("g8");
  });
});
