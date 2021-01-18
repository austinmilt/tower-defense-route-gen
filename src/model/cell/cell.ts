import { Forcing } from "./forcing";

/** Analysis cell, for storing state of cells in the grid. */
class Cell {
    private iY : number;
    private iX : number;
    private forcing : Forcing = Forcing.NONE;

    /**
     * @param iY cell row (assumes top-to-bottom orientation of grid)
     * @param iX cell column
     */
    public constructor(iY : number, iX : number) {
        this.iY = iY;
        this.iX = iX;
    }


    /**
     * @returns cell column
     */
    public getIX() : number {
        return this.iX;
    }


    /**
     * @returns cell row (assumes top-to-bottom orientation of grid)
     */
    public getIY() : number {
        return this.iY;
    }


    /**
     * @returns true if this cell's forcing is not {@link Forcing.NOT_TRAVERSABLE}
     */
    public isTraversable() : boolean {
        return Forcing.NOT_TRAVERSABLE !== this.forcing;
    }


    /**
     * @returns true if this cell's forcing is {@link Forcing.ENTRANCE}
     */
    public isEntrance() : boolean {
        return Forcing.ENTRANCE === this.forcing;
    }


    /**
     * @returns true if this cell's forcing is not {@link Forcing.EXIT}
     */
    public isExit() : boolean {
        return Forcing.EXIT === this.forcing;
    }


    /**
     * @returns cell's forcing (see {@link Forcing})
     */
    public getForcing() : Forcing {
        return this.forcing;
    }


    /**
     * Sets the cell's forcing. A cell can only have one forcing at a time.
     * 
     * @param forcing forcing to give the cell
     */
    public setForcing(forcing : Forcing) : void {
        this.forcing = forcing;
    }


    /**
     * 
     * @param copyForcings forcings that should be retained to the output cell
     * @returns fresh instance of a {@link Cell} with this cell's state
     */
    public deepCopy(copyForcings? : Forcing[]) : Cell {
        const copy : Cell = new Cell(this.iY, this.iX);
        if (copyForcings && copyForcings.includes(this.forcing)) {
            copy.setForcing(this.forcing);
        }
        return copy;
    }


    /**
     * @param other cell to compare against
     * @returns true if this cell has identical attributes to the given cell
     */
    public identical(other : Cell | null | undefined) : boolean {
        return this.cospatial(other) && (this.forcing === other!.forcing);
    }


    /**
     * @param other cell to compare against
     * @returns true if this cell has the same position in the grid as the given cell
     */
    public cospatial(other : Cell | null | undefined) : boolean {
        return (other !== undefined) 
            && (other !== null)
            && (this.iY === other.iY) 
            && (this.iX === other.iX);
    }


    public toString() : string {
        return `Cell(${this.iY}, ${this.iX}, ${Forcing[this.forcing]})`;
    }
}

export {Cell};