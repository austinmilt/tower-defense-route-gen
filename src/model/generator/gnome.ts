import { Cell } from "../cell/cell";
import { Forcing } from "../cell/forcing";
import { Grid } from "../grid/grid";
import { DEFAULT_THE_TRAVELING_GNOME_CONFIG, TheTravelingGnomeConfig } from "./config";
import { direct } from "./direct";
import { shuffleInPlace, defaultValue, extractPathTerminals } from "./util";

const DETOUR_MAX_DISTANCE_FROM_START : number = 7;

/**
 * Generates enemy route(s) by taking detours along a direct(ish) route from entrance(s) to exit(s). The
 * number of detours and tortuosity of detours is controlled by the wandering parameter.
 * 
 * @param grid analysis grid to pull forcings and grid size from
 * @param config settings to use for this route generation
 */
function theTravelingGnome(grid : Grid, config? : TheTravelingGnomeConfig) : Cell[][] {
    
    // update and validate configs
    const safeConfig : TheTravelingGnomeConfig = config === undefined ? DEFAULT_THE_TRAVELING_GNOME_CONFIG : config;
    const numEntrances : number = defaultValue(safeConfig.numEntrances, DEFAULT_THE_TRAVELING_GNOME_CONFIG.numEntrances)!;
    const numExits : number = defaultValue(safeConfig.numExits, DEFAULT_THE_TRAVELING_GNOME_CONFIG.numExits)!;
    const wandering : number = defaultValue(safeConfig.wandering, DEFAULT_THE_TRAVELING_GNOME_CONFIG.wandering)!;
    if ((wandering < 0) || (wandering > 1)) {
        throw new Error("Wandering must be between 0 and 1, but it was " + wandering);
    }
    
    
    // move toward the exits, but with some sightseeing along the way
    const pathTerminals : Cell[][] = extractPathTerminals(grid, numEntrances, numExits);
    const paths : Cell[][] = [];
    for (let terminals of pathTerminals) {
        const entrance : Cell = terminals[0];
        const exit : Cell = terminals[1];
        let path : Cell[] = generateDirectRoute(grid, entrance, exit, wandering);
        // Detour interval is how often we will take a detour in terms of number of cells along the path between the
        //  approximate end of each detour and the start of the next. In the formula below, we use half the original
        //  path length such that at low levels of wandering, we'll take one or so detours just in the middle of the
        //  path, rather than really close to the exit (though for some values of wandering we'll still end up in that
        //  situation). Also ensure that minimum detour interval 2 cells. Otherwise the detour can keep happening on the
        //  same cell (I think).
        if (path && (path.length > 0)) {
            const detourInterval : number = (wandering === 0) ? Number.MAX_SAFE_INTEGER : Math.max(Math.ceil((path.length / 2.0) * (1-wandering)), 2);
            let nextDetourIndex : number = detourInterval;
            while (nextDetourIndex < (path.length - 1)) {
                const detourResult : DetourResult = takeADetour(grid, path, nextDetourIndex, wandering);
                const detourLength : number = detourResult.path.length - path.length;
                path = detourResult.path;
                nextDetourIndex = detourResult.detourStartIndex + detourLength + detourInterval;
            }
            paths.push(path);
        }
    }
    return paths;
}


interface DetourResult {
    path : Cell[],
    detourDestinationIndex : number,
    detourStartIndex : number
}


function takeADetour(grid : Grid, path : Cell[], detourStartIndex : number, wandering : number) : DetourResult {
    const detourStart : Cell = path[detourStartIndex];
    const detourDestination : Cell = generateDetourDestination(grid, detourStart);
    let pathFromStartToDest : Cell[] = generateDirectRoute(grid, detourStart, detourDestination, wandering);
    let pathFromDestToExit : Cell[] = generateDirectRoute(grid, detourDestination, path[path.length-1], wandering);
    if (!pathFromStartToDest || !pathFromDestToExit) {
        return {path: path, detourDestinationIndex: detourStartIndex, detourStartIndex: detourStartIndex};
    }
    const newPath : Cell[] = path.slice(0, detourStartIndex);
    newPath.push(...pathFromStartToDest);
    // want to only add the detour destination to the output path once. It will already be added from startToDetourPath
    pathFromDestToExit.shift();
    newPath.push(...pathFromDestToExit);
    return {path: newPath, detourDestinationIndex: detourStartIndex + pathFromStartToDest.length-1, detourStartIndex: detourStartIndex}
}


function generateDetourDestination(grid : Grid, start : Cell) : Cell {
    const candidates : Cell[] = grid.getCellsFlat();
    shuffleInPlace(candidates);
    for (let candidate of candidates) {
        if (candidate.isTraversable() && (distance(start, candidate) <= DETOUR_MAX_DISTANCE_FROM_START)) {
            return candidate;
        }
    }
    // This will never happen afaict, because at worst we'll return the starting cell itself in the above loop
    return start;
}


function generateDirectRoute(grid : Grid, start : Cell, stop : Cell, wandering : number) : Cell[] {
    if (start.cospatial(stop)) {
        return [stop];
    }
    const tripLegGrid = grid.deepCopy([Forcing.NOT_TRAVERSABLE]);
    tripLegGrid.getCell(start.getIY(), start.getIX())!.setForcing(Forcing.ENTRANCE);
    tripLegGrid.getCell(stop.getIY(), stop.getIX())!.setForcing(Forcing.EXIT);
    const directRouteResult : Cell[][] = direct(tripLegGrid, {randomness: wandering});
    if (directRouteResult != null) {
        return directRouteResult[0];
    }
    return [];
}


function distance(a : Cell, b : Cell) : number {
    const iXDiff = a.getIX() - b.getIX();
    const iYDiff = a.getIY() - b.getIY();
    return Math.sqrt(iXDiff*iXDiff + iYDiff*iYDiff);
}


export {theTravelingGnome}