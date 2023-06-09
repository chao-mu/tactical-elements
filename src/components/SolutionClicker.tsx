"use client";

// React
import React from "react";
import { useState } from "react";

// Chess.js
import { Chess, BLACK } from "chess.js";

// Chessground
import { Key } from "chessground/types";

// Components
import { Chessboard } from "@/components/Chessboard";
import { GameOverScreen } from "@/components/GameOverScreen";
import { GameHUD } from "@/components/GameHUD";
import { GameStartScreen } from "@/components/GameStartScreen";
import { ActionBar } from "@/components/ActionBar";

// Types
import { Puzzle, PlayerStatus, PuzzleCollection } from "@/types";

export type SolutionType = "move" | "square";

type SolutionClickerProps = {
  collection: PuzzleCollection;
};

const GameStatus = {
  START: "start",
  PLAYING: "playing",
  OVER: "over",
};

const MAX_HEALTH = 3;

export const SolutionClicker = ({ collection }: SolutionClickerProps) => {
  const [gameUrl, setGameUrl] = useState<string | undefined>();
  const [fen, setFen] = useState<string>();
  const [solutions, setSolutions] = useState<Map<string, string>>(new Map());
  const [flipped, setFlipped] = useState(false);
  const [goodGuesses, setGoodGuesses] = useState<string[]>([]);
  const [badGuesses, setBadGuesses] = useState<string[]>([]);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(GameStatus.START);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("idle");
  const [advanced, setAdvanced] = useState(false);

  const { puzzles, title, rules, story, autoAdvance, solutionType } =
    collection;

  const readyToAdvance = goodGuesses.length == solutions.size;

  const nextPuzzle = () => {
    return puzzles[Math.floor(Math.random() * puzzles.length)] as Puzzle;
  };

  const playAgain = (newGame: boolean) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
    }

    setHealth(MAX_HEALTH);
    setCurrentScore(0);
    setGameStatus(GameStatus.PLAYING);
    setPlayerStatus("playing");

    if (newGame) {
      gotoNextPuzzle();
    } else {
      setPlayerStatus("respawn");
    }
  };

  const gotoNextPuzzle = () => {
    setGoodGuesses([]);
    setBadGuesses([]);

    const puzzle = nextPuzzle();
    setFen(puzzle.fen);
    console.log(puzzle);
    setSolutions(new Map(Object.entries(puzzle.solutions)));

    if (puzzle.site) {
      setGameUrl(puzzle.site);
    }

    try {
      const chess = new Chess(puzzle.fen);
      setFlipped(chess.turn() === BLACK);
    } catch (e) {
      // We support invalid FENs
    }
  };

  const loseHealth = () => {
    const newHealth = health - 1;
    setHealth(newHealth);
    if (newHealth < 1) {
      setGameStatus(GameStatus.OVER);
    }
  };

  const gainPoints = () => {
    setCurrentScore((score) => score + 1);
  };

  const checkCompleted = () => {
    if (playerStatus === "gave-up" || readyToAdvance) {
      if (solutions.size == 0) {
        setAdvanced(true);
      }
      gotoNextPuzzle();
      setPlayerStatus("playing");
      gainPoints();
    } else {
      setPlayerStatus("premature-advancement");
      loseHealth();
    }
  };

  const checkGuess = (guess: string) => {
    setPlayerStatus("playing");

    if (
      goodGuesses.includes(guess) ||
      goodGuesses.includes(solutions.get(guess) || "") ||
      badGuesses.includes(guess)
    ) {
      return false;
    }

    const isCorrect =
      solutions.has(guess) || Object.values(solutions).includes(guess);

    if (isCorrect) {
      const newGoodGuesses = [...goodGuesses, solutions.get(guess) || guess];
      setGoodGuesses(newGoodGuesses);

      // Check if puzzle is complete
      if (newGoodGuesses.length === solutions.size && autoAdvance) {
        gotoNextPuzzle();
      }

      gainPoints();
    } else {
      loseHealth();
      setBadGuesses([...badGuesses, guess]);
      setPlayerStatus("wrong-guess");
    }

    return isCorrect;
  };

  const giveUp = () => {
    if (playerStatus != "premature-advancement" && playerStatus != "respawn") {
      loseHealth();
    }

    setPlayerStatus("gave-up");
    solutions.forEach((alias, solution) => {
      if (!goodGuesses.includes(solution) && !goodGuesses.includes(alias)) {
        setGoodGuesses((guesses) => [...guesses, alias]);
      }
    });
  };

  return (
    <div className="flex h-[95vh] min-w-[33vw] flex-col bg-gray-800/50">
      {gameStatus === GameStatus.START && (
        <GameStartScreen
          title={title}
          story={story}
          onGameStart={() => playAgain(true)}
          rules={rules}
        />
      )}
      {gameStatus === GameStatus.OVER && (
        <GameOverScreen
          title={title}
          rules={rules}
          finalScore={currentScore}
          previousHighScore={highScore}
          onContinue={() => playAgain(false)}
        />
      )}
      {gameStatus == GameStatus.PLAYING && (
        <>
          <div>
            <div className="m-2 text-center font-header text-2xl font-bold">
              {title}
            </div>
            <div className="mt-2 p-4">{rules}</div>
            <GameHUD
              score={currentScore}
              health={health}
              highScore={highScore}
              maxHealth={MAX_HEALTH}
            />
          </div>
          <Chessboard
            movable={solutionType == "move"}
            fen={fen}
            gameUrl={gameUrl}
            goodSquares={solutionType == "square" ? (goodGuesses as Key[]) : []}
            badSquares={solutionType == "square" ? (badGuesses as Key[]) : []}
            highlightedSquares={
              playerStatus == "gave-up"
                ? (Object.values(solutions) as Key[])
                : []
            }
            onSelect={checkGuess}
            onMove={checkGuess}
            flipped={flipped}
          >
            <div className="flex h-full flex-wrap items-center justify-between gap-2 px-2">
              <div>
                {goodGuesses && goodGuesses.length > 0 && (
                  <div className="flex gap-2 bg-gray-800/50 px-2">
                    {goodGuesses.map((guess) => (
                      <div className="text-green-500" key={guess}>
                        {guess}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {badGuesses && badGuesses.length > 0 && (
                  <div className="flex gap-2 bg-gray-800/50 px-2 line-through">
                    {badGuesses.map((guess) => (
                      <div className="text-red-500" key={guess}>
                        {guess}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Chessboard>
          <div>
            <ActionBar
              autoAdvance={autoAdvance}
              pulseNoSolution={!advanced && solutions.size == 0}
              onAdvance={checkCompleted}
              onGiveUp={giveUp}
              allowNoSolution={collection.noSolution}
              playerStatus={playerStatus}
              onSanEntry={(san) => checkGuess(san)}
              sanEntry={solutionType == "move"}
            />
          </div>
        </>
      )}
    </div>
  );
};
