import { Events } from "../../components/events/events";
import { Cell } from "../cell/cell";
import { Grid } from "../grid/grid";
import { Direction, DIRECTIONS } from "../path/moves";
import { DEFAULT_DRUNKARD_CONFIG, DrunkardConfig } from "./config";
import { defaultValue, extractPathTerminals, shuffleToNew } from "./util";

/**
 * Generates enemy route(s) by taking a random walk across the grid. I'd be there in a jiffy, if only the
 * world werent so topsy turvy. 
 * 
 * @param grid analysis grid to pull forcings and grid size from
 * @param config settings to use for this route generation
 */
function drunkard(grid : Grid, config? : DrunkardConfig) : Cell[][] {
    
    // update and validate configs
    const safeConfig : DrunkardConfig = config === undefined ? DEFAULT_DRUNKARD_CONFIG : config;
    const numEntrances : number = defaultValue(safeConfig.numEntrances, DEFAULT_DRUNKARD_CONFIG.numEntrances)!;
    const numExits : number = defaultValue(safeConfig.numExits, DEFAULT_DRUNKARD_CONFIG.numExits)!;
    
    // stumble about (brownian motion) until we get to all exits
    const pathTerminals : Cell[][] = extractPathTerminals(grid, numEntrances, numExits);
    let iteration = 0;
    const paths : Cell[][] = [];
    for (let terminals of pathTerminals) {
        const entrance : Cell = terminals[0];
        const exit : Cell = terminals[1];
        let current : Cell = entrance;
        const path : Cell[] = [current];
        while (current !== exit) {
            const neighbor : Cell | null = findATraversableNeighbor(grid, current);
            if (neighbor === null) {
                throw new Error("Cant find a valid neighbor. Giving up.");
            }
            current = neighbor;
            path.push(current);
            Events.GENERATOR_STATUS_INFO.fire(`Iteration: ${iteration++}`);
        }
        paths.push(path);
    }
    return paths;
}


function findATraversableNeighbor(grid : Grid, cell : Cell) : Cell | null {
    let neighbor : Cell | null = null;
    let directions : Direction[] = shuffleToNew(DIRECTIONS);
    for (let direction of directions) {
        if (neighbor !== null) break;
        neighbor = grid.getNeighborTowardDirection(cell, direction);
        if ((neighbor !== null) && !neighbor.isTraversable()) {
            neighbor = null;
        }
    }
    return neighbor;
}


export {drunkard}