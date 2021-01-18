import { Cell } from "../cell/cell";
import { Grid } from "../grid/grid";

/**
 * Shuffles an array in place.
 * 
 * @param items items to shuffle
 */
function shuffleInPlace<T>(items : T[]) : void {
    let counter = items.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = items[counter];
        items[counter] = items[index];
        items[index] = temp;
    }
} 


/**
 * Shuffles items into a new array.
 * 
 * @param items items to shuffle
 * @returns new array of shuffled items
 */
function shuffleToNew<T>(items : T[]) : T[] {
    const result : T[] = [...items];
    shuffleInPlace(result);
    return result;
}


/**
 * @param items items to choose from
 * @returns one randomly chosen item from the inputs
 */
function chooseFrom<T>(items : T[]) : T {
    return items[Math.floor(Math.random()*items.length)];
}


/**
 * 
 * @param items items to choose from
 * @param n number of items to choose
 * @returns n items chosen (without replacement) from the given items
 */
function chooseMultiple<T>(items : T[], n : number) : T[] {
    const shuffled = shuffleToNew(items);
    return shuffled.slice(0, n);
}


/**
 * @param desired candidate value to return
 * @param def default value to return if candidate fails checks
 * @returns desired value, or default value if desired value is undefined
 */
function defaultValue<T>(desired : T, def : T): T {
    return desired === undefined ? def : desired;
}


/**
 * Extracts forced entrances and exits from the grid.
 * 
 * If there are more forced entrances than exits, exits will be reused.
 * 
 * If there are more forced exits than entrances, entrances will be reused.
 * 
 * If there are zero forced entrances (exits), then they will be generated from boundary cells.
 * 
 * @param grid analysis grid to pull entrances and exits from
 * @param numEntrances number of entrances to fall back on if there are no forced entrances
 * @param numExits number of exits to fall back on if there are no forced exits
 * @returns pairs of [entrance, exit] path terminals
 */
function extractPathTerminals(grid : Grid, numEntrances : number, numExits : number) : Cell[][] {
    // figure out where we're entering and exiting
    const entrances : Cell[] = grid.getEntrances();
    const exits : Cell[] = grid.getExits();
    let numBoundaryCellsToChooseForEntrances;
    let numBoundaryCellsToChooseForExits;
    if ((entrances.length === 0) && (exits.length === 0)) {
        numBoundaryCellsToChooseForEntrances = numEntrances;
        numBoundaryCellsToChooseForExits = numExits;
        
    } else if (entrances.length === 0) {
        numBoundaryCellsToChooseForEntrances = numEntrances;
        numBoundaryCellsToChooseForExits = 0;
        
    } else if (exits.length === 0) {
        numBoundaryCellsToChooseForEntrances = 0;
        numBoundaryCellsToChooseForExits = numExits;
        
    } else {
        numBoundaryCellsToChooseForEntrances = 0;
        numBoundaryCellsToChooseForExits = 0;
    }
    const numBoundaryCellsToChooseForEntrancesAndExits = numBoundaryCellsToChooseForEntrances + numBoundaryCellsToChooseForExits;
    if (numBoundaryCellsToChooseForEntrancesAndExits > 0) {
        const boundaryCells : Cell[] = grid.getBoundaryCells();
        shuffleInPlace(boundaryCells);
        for (let i : number = 0; i < boundaryCells.length; i++) {
            if (boundaryCells[i].isTraversable()) {
                if (entrances.length < numBoundaryCellsToChooseForEntrances) {
                    entrances.push(boundaryCells[i]);
                    
                } else if (exits.length < numBoundaryCellsToChooseForExits) {
                    exits.push(boundaryCells[i]);
                    
                } else {
                    break;
                }
            }
        }
    }

    if ((entrances.length < numBoundaryCellsToChooseForEntrances) || (exits.length < numBoundaryCellsToChooseForExits)) {
        throw new Error("Not enough boundary cells for entrances and exits.");
    }


    // come up with a source and destination for each path
    const totalPaths : number = Math.max(entrances.length, exits.length);
    let availableExits : Cell[] = [];
    let availableEntrances : Cell[] = [];
    const pathTerminals : Cell[][] = [];
    for (let i = 0; i < totalPaths; i++) {
        if (availableExits.length === 0) {
            availableExits = [...exits];
            shuffleInPlace(availableExits);
        }
        if (availableEntrances.length === 0) {
            availableEntrances = [...entrances];
            shuffleInPlace(availableEntrances);
        }
        pathTerminals.push([availableEntrances.shift()!, availableExits.shift()!]);
    }

    return pathTerminals;
}



export {shuffleInPlace, shuffleToNew, chooseFrom, chooseMultiple, defaultValue, extractPathTerminals}