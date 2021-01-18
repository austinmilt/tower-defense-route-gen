enum Move {
    E2E,  E2NE,  E2NW,  E2W,  E2SW,  E2SE,  E_IN,  E_OUT,
    NE2E, NE2NE, NE2NW, NE2W, NE2SW, NE2SE, NE_IN, NE_OUT,
    NW2E, NW2NE, NW2NW, NW2W, NW2SW, NW2SE, NW_IN, NW_OUT,
    W2E,  W2NE,  W2NW,  W2W,  W2SW,  W2SE,  W_IN,  W_OUT,
    SW2E, SW2NE, SW2NW, SW2W, SW2SW, SW2SE, SW_IN, SW_OUT,
    SE2E, SE2NE, SE2NW, SE2W, SE2SW, SE2SE, SE_IN, SE_OUT
}

const MOVES : Move[] = [
    Move.E2E,  Move.E2NE,  Move.E2NW,  Move.E2W,  Move.E2SW,  Move.E2SE,  Move.E_IN,  Move.E_OUT,
    Move.NE2E, Move.NE2NE, Move.NE2NW, Move.NE2W, Move.NE2SW, Move.NE2SE, Move.NE_IN, Move.NE_OUT,
    Move.NW2E, Move.NW2NE, Move.NW2NW, Move.NW2W, Move.NW2SW, Move.NW2SE, Move.NW_IN, Move.NW_OUT,
    Move.W2E,  Move.W2NE,  Move.W2NW,  Move.W2W,  Move.W2SW,  Move.W2SE,  Move.W_IN,  Move.W_OUT,
    Move.SW2E, Move.SW2NE, Move.SW2NW, Move.SW2W, Move.SW2SW, Move.SW2SE, Move.SW_IN, Move.SW_OUT,
    Move.SE2E, Move.SE2NE, Move.SE2NW, Move.SE2W, Move.SE2SW, Move.SE2SE, Move.SE_IN, Move.SE_OUT
];

enum Direction {
    E, NE, NW, W, SW, SE
}


const DIRECTIONS : Direction[] = [Direction.E, Direction.NE, Direction.NW, Direction.W, Direction.SW, Direction.SE];


const DIRECTION_TO_MOVE : Map<Direction, Map<Direction, Move>> = new Map<Direction, Map<Direction, Move>>();
DIRECTION_TO_MOVE.set(Direction.E, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.E, Move.E2E);
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.NE, Move.E2NE);
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.NW, Move.E2NW);
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.W, Move.E2W);
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.SW, Move.E2SW);
DIRECTION_TO_MOVE.get(Direction.E)!.set(Direction.SE, Move.E2SE);

DIRECTION_TO_MOVE.set(Direction.NE, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.E, Move.NE2E);
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.NE, Move.NE2NE);
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.NW, Move.NE2NW);
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.W, Move.NE2W);
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.SW, Move.NE2SW);
DIRECTION_TO_MOVE.get(Direction.NE)!.set(Direction.SE, Move.NE2SE);

DIRECTION_TO_MOVE.set(Direction.NW, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.E, Move.NW2E);
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.NE, Move.NW2NE);
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.NW, Move.NW2NW);
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.W, Move.NW2W);
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.SW, Move.NW2SW);
DIRECTION_TO_MOVE.get(Direction.NW)!.set(Direction.SE, Move.NW2SE);

DIRECTION_TO_MOVE.set(Direction.W, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.E, Move.W2E);
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.NE, Move.W2NE);
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.NW, Move.W2NW);
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.W, Move.W2W);
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.SW, Move.W2SW);
DIRECTION_TO_MOVE.get(Direction.W)!.set(Direction.SE, Move.W2SE);

DIRECTION_TO_MOVE.set(Direction.SW, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.E, Move.SW2E);
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.NE, Move.SW2NE);
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.NW, Move.SW2NW);
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.W, Move.SW2W);
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.SW, Move.SW2SW);
DIRECTION_TO_MOVE.get(Direction.SW)!.set(Direction.SE, Move.SW2SE);

DIRECTION_TO_MOVE.set(Direction.SE, new Map<Direction, Move>());
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.E, Move.SE2E);
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.NE, Move.SE2NE);
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.NW, Move.SE2NW);
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.W, Move.SE2W);
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.SW, Move.SE2SW);
DIRECTION_TO_MOVE.get(Direction.SE)!.set(Direction.SE, Move.SE2SE);

export {Move, MOVES, Direction, DIRECTIONS, DIRECTION_TO_MOVE}