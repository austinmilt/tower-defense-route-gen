import { Cell } from "../cell/cell";
import { Forcing } from "../cell/forcing";
import { Direction, DIRECTIONS, DIRECTION_TO_MOVE, Move } from "../path/moves";

/**
 * This hexagonal grid class is a container and manager of hexagonal grid cells. Cells are
 * assumed to be arranged vertex-up (as opposed to having a side/edge at the top). Columns are
 * shared between cells on different rows, such that the total number of cells in a given row
 * is approximately half the number of of configured columns. The easiest way to think of this arrangement
 * is that half - the odd-indexed half - of the rows are shifted right by half of a cell's width. So,
 * cell (row=1, column=0) will be shifted to the right of cell (row=0, column=0). Despite the fact that
 * the aforementioned cells share the same column index, they are considered to be in different columns.
 */
class Grid implements Iterable<Cell> {
    private static readonly PI_OVER_SIX : number = Math.PI / 6.0;
    private static readonly E_NBR_END : number = Grid.PI_OVER_SIX;
    private static readonly NE_NBR_END : number = 3 * Grid.PI_OVER_SIX;
    private static readonly NW_NBR_END : number = 5.0 * Grid.PI_OVER_SIX;
    private static readonly W_NBR_END : number = 7.0 * Grid.PI_OVER_SIX;
    private static readonly SW_NBR_END : number = 9.0 * Grid.PI_OVER_SIX;
    private static readonly SE_NBR_END : number = 11.0 * Grid.PI_OVER_SIX;
    
    private readonly cells : Map<number, Map<number, Cell>>;
    private readonly nColumnsOnEvenIndexRows : number;
    private readonly nColumnsOnOddIndexRows : number;
    private readonly nCells : number;

    private constructor(cells : Map<number, Map<number, Cell>>) {
        this.cells = cells;
        let nColumnsOnEvenIndexRows : number = 0;
        let nColumnsOnOddIndexRows : number = 0;
        let nEvenRows : number = Math.ceil(cells.size / 2.0);
        let nOddRows : number = cells.size - nEvenRows;
        if (cells.size > 0) {
            nColumnsOnEvenIndexRows = cells.get(0)!.size;
        }
        if (cells.size > 1) {
            nColumnsOnOddIndexRows = cells.get(1)!.size;
        }
        this.nColumnsOnEvenIndexRows = nColumnsOnEvenIndexRows;
        this.nColumnsOnOddIndexRows = nColumnsOnOddIndexRows;
        this.nCells = nColumnsOnEvenIndexRows * nEvenRows + nColumnsOnOddIndexRows + nOddRows;
    }


    /**
     * Creates a grid with nominally the number of rows and columns given. See the description of
     * this class for more on how the grid is structured.
     * 
     * @param sizeY number of rows the grid should have
     * @param sizeX number of columns the grid should have (each row will have approximately half the number of requested columns)
     */
    public static ofNominalSize(sizeY : number, sizeX : number) : Grid {
        const cells : Map<number, Map<number, Cell>> = new Map<number, Map<number, Cell>>();

        // If the number of request columns is odd, then on every odd-index row, you'll have one less column than on the even-index rows. In other words,
        //  put the extra column on the even-index rows.
        // If the number of request columns is even, then on every row you'll have the same number of columns.
        const nColumnsOnEvenIndexRows : number = Math.floor(0.5*sizeX) + (sizeX % 2);
        const nColumnsOnOddIndexRows : number =  Math.floor(0.5*sizeX);

        for (let iY = 0; iY < sizeY; iY++) {
            let nColIterated : number = ((iY % 2) === 0) ? nColumnsOnEvenIndexRows : nColumnsOnOddIndexRows;
            cells.set(iY, new Map<number, Cell>());
            for (let iX = 0; iX < nColIterated; iX++) {
                cells.get(iY)!.set(iX, new Cell(iY, iX));
            }
        }
        return new Grid(cells);
    }


    /**
     * @param cell cell for which to get neighbors
     * @returns all neighbors for the given cell
     */
    public getNeighbors(cell : Cell) : Cell[] {
        const neighbors : Cell[] = [];
        for (let direction of DIRECTIONS) {
            const neighbor : Cell | null = this.getNeighborTowardDirection(cell, direction);
            if (neighbor !== null) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }


    /**
     * @param angleRadians direction to look, based on unit circle angle
     * @returns neighboring cell in that direction, or null if there isnt one
     */
    public getNeighborTowardAngle(cell : Cell, angleRadians : number) : Cell | null {
        // based on dividng the hexagon in six parts, figure out
        //  which neighbor is in the direction of the given angle
        // Also, assumes odd numbered rows are shifted right compared to even-numbered rows.
        angleRadians = angleRadians % (2*Math.PI);
        let iXNbr : number | null = null;
        let iYNbr : number | null = null;
        const diffRowColumnShift : number = cell.getIY() % 2 === 0 ? -1 : 0;
        if (angleRadians < Grid.E_NBR_END) {
            iXNbr = cell.getIX() + 1;
            iYNbr = cell.getIY();

        } else if (angleRadians < Grid.NE_NBR_END) {
            iXNbr = cell.getIX() + 1 + diffRowColumnShift;
            iYNbr = cell.getIY() - 1;
        
        } else if (angleRadians < Grid.NW_NBR_END) {
            iXNbr = cell.getIX() + diffRowColumnShift;
            iYNbr = cell.getIY() - 1;

        } else if (angleRadians < Grid.W_NBR_END) {
            iXNbr = cell.getIX() - 1;
            iYNbr = cell.getIY();

        } else if (angleRadians < Grid.SW_NBR_END) {
            iXNbr = cell.getIX() + diffRowColumnShift;
            iYNbr = cell.getIY() + 1;

        } else if (angleRadians < Grid.SE_NBR_END) {
            iXNbr = cell.getIX() + 1 + diffRowColumnShift;
            iYNbr = cell.getIY() + 1;

        } else {
            iXNbr = cell.getIX() + 1;
            iYNbr = cell.getIY();
        }

        let neighbor : Cell | null = null;
        if (this.cells.has(iYNbr) && (this.cells.get(iYNbr)!.has(iXNbr))) {
            neighbor = this.cells.get(iYNbr)!.get(iXNbr)!;
        }
        return neighbor;
    }


    /**
     * @param cell cell to look for a neighbor for
     * @param direction direction to look
     * @returns neighboring cell in that direction, or null if there isnt one
     */
    public getNeighborTowardDirection(cell : Cell, direction : Direction) : Cell | null {
        let iXNbr : number | null = null;
        let iYNbr : number | null = null;
        const diffRowColumnShift : number = cell.getIY() % 2 === 0 ? -1 : 0;

        switch (direction) {
            case Direction.E:
                iXNbr = cell.getIX() + 1;
                iYNbr = cell.getIY();
                break;

            case Direction.NE:
                iXNbr = cell.getIX() + 1 + diffRowColumnShift;
                iYNbr = cell.getIY() - 1;
                break;

            case Direction.NW:
                iXNbr = cell.getIX() + diffRowColumnShift;
                iYNbr = cell.getIY() - 1;
                break;

            case Direction.W:
                iXNbr = cell.getIX() - 1;
                iYNbr = cell.getIY();
                break;

            case Direction.SW:
                iXNbr = cell.getIX() + diffRowColumnShift;
                iYNbr = cell.getIY() + 1;
                break;

            case Direction.SE:
                iXNbr = cell.getIX() + 1 + diffRowColumnShift;
                iYNbr = cell.getIY() + 1;
                break;
        }

        let neighbor : Cell | null = null;
        if (this.cells.has(iYNbr) && (this.cells.get(iYNbr)!.has(iXNbr))) {
            neighbor = this.cells.get(iYNbr)!.get(iXNbr)!;
        }
        return neighbor;
    }


    /**
     * @param source source cell to check angle to destination
     * @param destination destination cell being triangulated to
     * @returns angle (in radians) between center of source cell and destination cell
     */
    public static angleTowardOtherCell(source : Cell, destination : Cell) : number {
        return Grid.directionBetween(source.getIY(), source.getIX(), destination.getIY(), destination.getIX());
    }


    /**
     * @param rowSource row of the source cell
     * @param colSource column of the source cell
     * @param rowDest row of the destination cell
     * @param colDest column of the desination cell
     * @returns angle (in radians, from 0 to 2PI) in the hex grid using the coordinate system in this repo, such that the rows are ordered
     *  from top to bottom, starting at 0, and columns are ordered from left to right, starting at 0, and such that every odd
     *  row is shifted to the right of every even row (e.g. the northeast neighbor in an even row has the same column number, despite
     *  being shifted to the right)
     */
    public static angleBetween(rowSource : number, colSource : number, rowDest : number, colDest : number) : number {
        // xShift accounts for odd and even rows being shifted relative to one another. If both rows are the same type (odd or even),
        //  then there's no shift to do. However, if one is odd and the other even, we need to shift the column difference
        //  left or right depending on their relative orientations
        const xShift : number = -0.5*((rowSource % 2) - (rowDest % 2));
        const xDiff : number = colDest - colSource + xShift;

        // yDiff is swapped from expected because rows are ordered from top to bottom instead of bottom to top, like they would be
        //  in a normal Euclidean coordinate system
        const yDiff : number = rowSource - rowDest;

        // this last part accounts for the relative magnitudes of the width (2 times length of a side) and height (sqrt(3) times length of a side) 
        //  of a hexagon. Finally, the angle using trig is arc-tan of their ratio.
        const angle = Math.atan2(2*yDiff, Math.sqrt(3)*xDiff);
        const positiveAngle = angle < 0 ? (2*Math.PI + angle) : angle;
        return positiveAngle;
    }


    /**
     * @param rowSource row of the source cell
     * @param colSource column of the source cell
     * @param rowDest row of the destination cell
     * @param colDest column of the desination cell
     * @returns closest direction if taking a single step toward destination from the source in the hex grid using the coordinate system in this repo, 
     *  such that the rows are ordered from top to bottom, starting at 0, and columns are ordered from left to right, starting at 0, and such that every odd
     *  row is shifted to the right of every even row (e.g. the northeast neighbor in an even row has the same column number, despite
     *  being shifted to the right)
     */
    public static directionBetween(rowSource : number, colSource : number, rowDest : number, colDest : number) : Direction {
        const angleRadians : number = Grid.angleBetween(rowSource, colSource, rowDest, colDest);
        let result : Direction;
        if (angleRadians < Grid.E_NBR_END) {
            result = Direction.E

        } else if (angleRadians < Grid.NE_NBR_END) {
            result = Direction.NE;
        
        } else if (angleRadians < Grid.NW_NBR_END) {
            result = Direction.NW;

        } else if (angleRadians < Grid.W_NBR_END) {
            result = Direction.W;

        } else if (angleRadians < Grid.SW_NBR_END) {
            result = Direction.SW;

        } else if (angleRadians < Grid.SE_NBR_END) {
            result = Direction.SE;

        } else {
            result = Direction.E;
        }
        return result;
    }



    /**
     * 
     * @param source cell where route is coming from
     * @param intermediate cell that route passes through
     * @param destination cell where route is going to
     * @returns move you would assign to the intermediate cell going from source to destination through intermediate
     */
    public getMoveTowardOtherCell(source : Cell | null, intermediate : Cell, destination : Cell | null) : Move {
        let sourceDirection : Direction;
        if (source === null) {
            sourceDirection = this.findDirectionWithNoNeighbor(intermediate, Direction.E);
        } else {
            sourceDirection = Grid.directionBetween(intermediate.getIY(), intermediate.getIX(), source.getIY(), source.getIX());
        }

        let destinationDirection : Direction;
        if (destination === null) {
            destinationDirection = this.findDirectionWithNoNeighbor(intermediate, Direction.W);
        } else {
            destinationDirection = Grid.directionBetween(intermediate.getIY(), intermediate.getIX(), destination.getIY(), destination.getIX());
        }

        const move : Move = DIRECTION_TO_MOVE.get(sourceDirection)!.get(destinationDirection)!;
        return move;
    }


    /**
     * @param cell cell to look for no neighbor to
     * @param defaultTo default direction to return if this cell is surrounded
     * @returns the first direction where this cell doesnt have a neighbor
     */
    public findDirectionWithNoNeighbor(cell : Cell, defaultTo : Direction) : Direction {
        for (let direction of DIRECTIONS) {
            if (this.getNeighborTowardDirection(cell, direction) === null) {
                return direction;
            }
        }
        return defaultTo;
    }


    /**
     * @returns all cells that are on the outside boundary of the grid
     */
    public getBoundaryCells() : Cell[] {
        const boundaryCells : Cell[] = [];
        for (let iY of this.cells.keys()) {
            const row : Map<number, Cell> = this.cells.get(iY)!;
            if ((iY === 0) || (iY === (this.cells.size - 1))) {
                for (let iX of row.keys()) {
                    boundaryCells.push(row.get(iX)!);
                }
            } else {
                boundaryCells.push(row.get(0)!);
                const nCellsOnRow : number = ((iY % 2) === 0) ? this.nColumnsOnEvenIndexRows : this.nColumnsOnOddIndexRows;
                boundaryCells.push(row.get(nCellsOnRow - 1)!);
            }
        }
        return boundaryCells;
    }


    /**
     * @returns all cells that have been forced to be entrances
     */
    public getEntrances() : Cell[] {
        const entrances : Cell[] = [];
        for (let cell of this) {
            if (cell.isEntrance()) {
                entrances.push(cell);
            }
        }
        return entrances;
    }


    /**
     * @returns all cells that have been forced to be exits
     */
    public getExits() : Cell[] {
        const entrances : Cell[] = [];
        for (let cell of this) {
            if (cell.isExit()) {
                entrances.push(cell);
            }
        }
        return entrances;
    }


    /**
     * @param iY row index of the cell to get
     * @param iX column index of the cell to get
     * @returns the given cell if it exits, or undefined if it does not
     */
    public getCell(iY : number, iX : number) : Cell | undefined {
        return this.cells.get(iY)?.get(iX);
    }


    /**
     * @returns the cell map of this grid
     */
    public getCells() : Map<number, Map<number, Cell>> {
        return this.cells;
    }


    /**
     * @returns all cells in this grid as a flat array
     */
    public getCellsFlat() : Cell[] {
        return [...this];
    }


    /**
     * @returns number of cells in the grid
     */
    public getCellCount() : number {
        return this.nCells;
    }


    /**
     * @returns number of rows in the grid
     */
    public getRowCount() : number {
        return this.cells.size;
    }


    /**
     * @param row row to get column count for
     * @returns the number of cells in the given row
     */
    public getColumnCount(row : number) : number {
        return (row % 2) === 0 ? this.nColumnsOnEvenIndexRows : this.nColumnsOnOddIndexRows;
    }


    /**
     * @returns the number of columns on even-indexed-rows (rows 0, 2, etc)
     */
    public getNumberOfColumnsOnEvenIndexRows() : number {
        return this.nColumnsOnEvenIndexRows;
    }


    /**
     * @returns the number of columns on odd-indexed-rows (rows 1, 3, etc)
     */
    public getNumberOfColumnsOnOddIndexRows() : number {
        return this.nColumnsOnOddIndexRows;
    }


    /**
     * @param copyForcings cell forcings that should be kept in the output grid
     * @returns a deep copy of this grid, where every cell is new and unlinked to the cells in this grid
     */
    public deepCopy(copyForcings? : Forcing[]) : Grid {
        const copy : Map<number, Map<number, Cell>> = new Map<number, Map<number, Cell>>();
        for (let iY of this.cells.keys()) {
            copy.set(iY, new Map<number, Cell>());
            const row : Map<number, Cell> = this.cells.get(iY)!;
            for (let iX of row.keys()) {
                copy.get(iY)!.set(iX, row.get(iX)!.deepCopy(copyForcings));
            }
        } 
        return new Grid(copy);
    }

    [Symbol.iterator](): Iterator<Cell> {
        return new CellIterator(this.cells);
    }
}


class CellIterator implements Iterator<Cell> {
    private readonly cells : Map<number, Map<number, Cell>>;
    private iY : number = 0;
    private iX : number = 0;

    constructor(cells : Map<number, Map<number, Cell>>) {
        this.cells = cells;
    }

    next(value?: any): IteratorResult<Cell> {
        let row : Map<number, Cell> = this.cells.get(this.iY)!;
        if (row.size === this.iX) {
            this.iX = 0;
            this.iY += 1;
            if (this.cells.size === this.iY) {
                return {done: true, value: undefined};
            }
            row = this.cells.get(this.iY)!;
        }
        const result : Cell = row.get(this.iX)!;
        this.iX += 1;
        return {value: result, done: false};
    }
}

export {Grid};