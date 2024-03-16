// random
import random from "random";

// Ours
import type {
  GameInfo,
  Error,
  Success,
  GameLevel,
  Puzzle,
  PuzzleCollection,
} from "@/types";

// Assets
import knightForks from "@/assets/puzzles/knight-forks.json";
import checksCaptures from "@/assets/puzzles/checks-captures.json";
import undefended from "@/assets/puzzles/checks-captures.json";
import counting from "@/assets/puzzles/checks-captures.json";

const PUZZLES_PER_LEVEL = 10;

const games: Record<string, GameInfo & { collection: PuzzleCollection }> = {
  "knight-forks": {
    logic: { autoAdvance: true, solutionType: "square", noSolution: true },
    flavor: {
      title: "Catapult Knights",
      rules:
        "Click a square that if you were to drop a knight on it, all pieces would be attacked. Otherwise click No Solution.",
      story:
        "The king and queen of the enemy army think they're safe chilling at the local outdoor pub. Catapult a knight across the kingdom (it's a Tactical Elements brand catapult) and cause mayhem!",
    },
    collection: knightForks as PuzzleCollection,
  },
  "checks-captures": {
    logic: { autoAdvance: false, solutionType: "move", noSolution: false },
    flavor: {
      title: "Checks/Captures",
      rules:
        "By clicking squares, perform all legal captures and checks for either side.",
      story:
        "Tomorrow the war reaches your small village. Analyze the crawling battlefield to determine where destruction is inevitable.",
    },
    collection: checksCaptures as PuzzleCollection,
  },
  counting: {
    logic: { autoAdvance: true, solutionType: "number", noSolution: false },
    flavor: {
      title: "Count Capture Points",
      rules:
        "Watch the animation and determine the final change in material difference after all captures, using relative piece values. Captures of Pawns are worth 1 point, Knights and Bishops are worth 3 points, Rooks are worth 5 points, and Queens are worth 9 points. For example, if a pawn captures a knight and then the pawn is captured, the answer would be 2. If a queen captures a pawn and a pawn takes back, the total is -8",
      story:
        "The death toll from the war increases every day. The war has gone on far too long and soon will be the mutual ruin of both kingdoms. You must prepare a PowerPoint slide presentation to convince the ruling monarchs that peace is the best option.",
    },
    collection: counting as PuzzleCollection,
  },
  undefended: {
    logic: { solutionType: "square", autoAdvance: false },
    flavor: {
      title: "Enchant the Undefended",
      rules:
        "Click undefended pieces. A piece is considered undefended if there are no allies who have sight on its square.",
      story:
        "The battlefield is littered with fallen chesspersons. Opposing forces clash, blinded by mutual hatred and pricked on by a thirst for blood. There is however a chance for peace. Find the chesspersons who are most vulnerable and pacify them to quell the cycle of violence.",
    },
    collection: undefended as PuzzleCollection,
  },
};

export function getFlavor(id: string) {
  const game = games[id];

  return game?.flavor ?? null;
}

export function getLogic(id: string) {
  const game = games[id];

  return game?.logic ?? null;
}

function newError(error: string): Error {
  return { error, success: false };
}

export async function getLevel(
  gameId: string,
  level?: number,
): Promise<Error | Success<GameLevel>> {
  const { collection } = games[gameId];
  if (collection === undefined) {
    return newError("Game not found");
  }

  let candidates: Puzzle[] = [];
  let name = "bonus";
  if (level === undefined) {
    candidates = Object.values(collection).flat();
  } else {
    name = level.toString();
    candidates = collection[level];
  }

  if (candidates === undefined) {
    return newError("Level not found");
  }

  const puzzles = [];
  for (let i = 0; i < PUZZLES_PER_LEVEL; i++) {
    const idx = random.int(0, candidates.length - 1);
    const [puzzle] = candidates.splice(idx, 1);
    if (puzzle === undefined) {
      break;
    }

    puzzles.push(puzzle);
  }

  let nextLevel = level;
  if (nextLevel !== undefined) {
    nextLevel += 1;

    if (collection[nextLevel] === undefined) {
      nextLevel = undefined;
    }
  }

  return { success: true, data: { name, level, puzzles, nextLevel } };
}
