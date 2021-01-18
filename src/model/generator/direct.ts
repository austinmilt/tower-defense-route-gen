import { Events } from "../../components/events/events";
import { Cell } from "../cell/cell";
import { Grid } from "../grid/grid";
import { DEFAULT_DIRECT_ROUTE_CONFING, DirectRouteConfig } from "./config";
import { defaultValue, extractPathTerminals } from "./util";

// maximum value of "peak" cells which designate the center of "mountains" of cost. Larger values will
//  make the peaks taller and result in greater difference between neighboring cells. Smaller values will
//  do the opposite. In my playing around, this just needed to be sufficiently large to have an effect and
//  didnt seem to do much otherwise.
const MAX_GENERATED_PEAK_COST : number = 1000;

// proportion of of the width of of the grid (in number of cells) that the widest "mountain" can be
//  increasing this will make more cells affected by peaks. If too large, it will result in less variation
//  across the grid. If too small, it will result in very narrow areas of high values. Both extremes
//  will make the paths less interesting.
const MAX_GENERATED_WIDTH_PROP : number = 0.15;

// maximum proportion of (the random part of) a cell's cost we'll randomize at the end, to add more
//  variation between neighboring cells and create more convoluted paths. Large values will result in nearby
//  cells being uncorrelated, essentially erasing the effect of having peaks. Small values will increase the
//  correlation of nearby cells, such that you will get more distinct circles to go around peaks.
const MAX_PERTURBATION_PROP : number = 0.4;

// proportion of the map that should have peaks generated. Extreme values will result in less interesting paths.
const PEAK_PROPORTION : number = 0.25;

// Value to encourage paths to be more interior to the grid. The value will start at this on the boundary 
//  and decrease to zero in the center of the grid.
const MAX_INTERIOR_ROUTE_INCENTIVE : number = MAX_GENERATED_PEAK_COST*0.5;


/**
 * Generates enemy route(s) attempting to take a direct route from entrance(s) to exit(s). Routes are
 * generated using dijkstra's algorithm with a randomly generated cost surface that looks (roughly) like
 * mountainness terrain. Increasing the randomness of the algorithm results in an attempt to create more
 * circuitous routes from from entrance to exit.
 * 
 * @param grid analysis grid to pull forcings and grid size from
 * @param config settings to use for this route generation
 */
function direct(grid : Grid, config? : DirectRouteConfig) : Cell[][] {

    // update and validate configs
    const safeConfig : DirectRouteConfig = config === undefined ? DEFAULT_DIRECT_ROUTE_CONFING : config;
    const numEntrances : number = defaultValue(safeConfig.numEntrances, DEFAULT_DIRECT_ROUTE_CONFING.numEntrances)!;
    const numExits : number = defaultValue(safeConfig.numExits, DEFAULT_DIRECT_ROUTE_CONFING.numExits)!;
    const randomness : number = defaultValue(safeConfig.randomness, DEFAULT_DIRECT_ROUTE_CONFING.randomness)!;
    if ((randomness < 0) || (randomness > 1)) {
        throw new Error("Randomness must be between 0 and 1, but it was " + randomness);
    }

    // dijkstra's
    const pathTerminals : Cell[][] = extractPathTerminals(grid, numEntrances, numExits);
    const cost : Map<number, Map<number, number>> = generateCostSurface(grid, randomness);
    const paths : Cell[][] = [];
    for (let terminalPair of pathTerminals) {
        const entrance : Cell = terminalPair[0];
        const exit : Cell = terminalPair[1];
        try {
            paths.push(dijkstras(grid, cost, entrance, exit));

        } catch (error) {
            alert(error);
            return [];
        }
    }
    
    return paths;
}


function generateCostSurface(grid : Grid, randomness: number) : Map<number, Map<number, number>> {

    // initialize the cost surface with a gradient decreasing from the boundary of the grid to
    //  encourage paths to be more on the interior of the grid
    const cells : Map<number, Map<number, Cell>> = grid.getCells();
    const cost : Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
    const nRows : number = grid.getRowCount();
    const halfRows : number = nRows / 2.0;
    for (let iY of cells.keys()) {
        cost.set(iY, new Map<number, number>());
        const nCols : number = grid.getColumnCount(iY);
        const halfCols : number = nCols / 2.0;
        for (let iX of cells.get(iY)!.keys()) {
            // Calculate the distance from the boundary as a proportion of the distance between the boundary and the
            //  center of the grid (i.e. half of the "distance" between 0 and nrows or nCols). This allows us to
            //  calculate the incentive along the gradient using this proportion.
            const iYPropDistanceFromBoundary : number = Math.min(iY, (nRows - 1) - iY) / halfRows;
            const iXPropDistanceFromBoundary : number = Math.min(iX, (nCols - 1) - iX) / halfCols;
            const cellPropDistanceFromBoundary : number = Math.min(iYPropDistanceFromBoundary, iXPropDistanceFromBoundary);
            const baseIncentive : number = MAX_INTERIOR_ROUTE_INCENTIVE*(1 - cellPropDistanceFromBoundary);
            const finalIncentive : number = Math.max(baseIncentive, 0);
            cost.get(iY)!.set(iX, finalIncentive);
        }
    }

        
    // choose some peaks and generate their attributes
    const peaks : {iY : number, iX : number, cost : number, halfWidth : number}[] = [];
    for (let iY of cells.keys()) {
        for (let iX of cells.get(iY)!.keys()) {
            if (Math.random() < PEAK_PROPORTION) {
                const peakCost : number = Math.random()*MAX_GENERATED_PEAK_COST;
                const halfWidth : number = Math.random()*MAX_GENERATED_WIDTH_PROP*cells.get(iY)!.size;
                peaks.push({iY: iY, iX: iX, cost: peakCost, halfWidth: halfWidth});
            }
        }
    }
    
    // compute the cost of cells based on how far away they are from peaks (like mountains)
    let maxCost : number = 0;
    for (let iY of cells.keys()) {
        for (let iX of cells.get(iY)!.keys()) {
            let cellCost : number = cost.get(iY)!.get(iX)!;
            for (let peak of peaks) {
                const iXDiff : number = iX - peak.iX;
                const iYDiff : number = iY - peak.iY;
                const distanceFromPeak : number = Math.sqrt(iXDiff*iXDiff + iYDiff*iYDiff);
                let peakContribution : number;
                if (distanceFromPeak > peak.halfWidth) {
                    peakContribution = 0;
                } else {
                    // distScaleOfZ is how we need to scale distance values relative to the z-scale (height) to get the bottom of the 
                    //  mountain to be halfWidth cells away (assuming a cosine function shifted up by half the peak height)
                    const distScaleOfZ : number = Math.PI / peak.halfWidth;
                    // dont let the peak contribute be negative, just to avoid negative costs which dijkstra's cant handle
                    peakContribution = Math.max(0, 0.5*(Math.cos(distanceFromPeak * distScaleOfZ) + peak.cost));
                    // we add to the total cost in order to accumulate "height" from the all nearby peaks,
                    //  rather than overwrite it and wind up with sudden cliffs
                }
                cellCost += peakContribution;
            }
            // perturbation is between -100% and 100% of maxPerturbation*cellCost
            const perturbation : number = (cellCost * MAX_PERTURBATION_PROP) * (2 * Math.random() - 1);
            cellCost += perturbation;
            cost.get(iY)!.set(iX, cellCost);
            if (cellCost > maxCost) {
                maxCost = cellCost;
            }
        }
    }

    // to finalize the cost surface, we need to scale the randomized costs to be between 0 and the
    //  randomness parameter and add this to the determinism such that the value for any cell
    //  is between 0 and 1 (not strictly necessary, but it is easier for me to think about this way),
    //  with the appropriate amounts coming from the deterministic and random portions
    const determinism : number = 1 - randomness;
    for (let iY of cost.keys()) {
        for (let iX of cost.get(iY)!.keys()) {
            const randomizedCost : number = cost.get(iY)!.get(iX)!;
            const scaledRandomizedCost : number = randomness * (randomizedCost / maxCost);
            const finalCost : number = scaledRandomizedCost + determinism;
            cost.get(iY)!.set(iX, finalCost);
        }
    }
    return cost;
}


function dijkstras(grid : Grid, cost : Map<number, Map<number, number>>, source : Cell, destination : Cell) : Cell[] {
    const cells : Map<number, Map<number, Cell>> = grid.getCells();
    const distances : Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
    const previous : Map<number, Map<number, Cell>> = new Map<number, Map<number, Cell>>();
    const unvisitedCells : Set<Cell> = new Set<Cell>();
    for (let iY of cells.keys()) {
         distances.set(iY, new Map<number, number>());
         previous.set(iY, new Map<number, Cell>());
        for (let iX of cells.get(iY)!.keys()) {
            let distance : number = Number.POSITIVE_INFINITY;
            if ((iY === source.getIY()) && (iX === source.getIX())) {
                distance = 0;
            }
            distances.get(iY)!.set(iX, distance);
            unvisitedCells.add(cells.get(iY)!.get(iX)!);
        }
    }


    // traverse the grid from source to destination
    const candidateNextCells : Set<Cell> = new Set<Cell>([source]);
    let iteration : number = 0;
    while (candidateNextCells.size > 0) {
        let current : Cell | null = getNext(distances, candidateNextCells);
        if (current === null) {
            throw new Error(`No path between ${source} and ${destination}`);
            
        } else if (current.cospatial(destination)) {
            break;
        }
        unvisitedCells.delete(current);
        candidateNextCells.delete(current);
        const iY : number = current.getIY();
        const iX : number = current.getIX();
        const currentDistance : number = distances.get(iY)!.get(iX)!;
        for (let neighbor of grid.getNeighbors(current)) {
            if (neighbor.isTraversable() && unvisitedCells.has(neighbor)) {
                const nbrIY : number = neighbor.getIY();
                const nbrIX : number = neighbor.getIX();
                const neighborDistance : number = distances.get(nbrIY)!.get(nbrIX)!;
                const distanceWithCurrent : number = currentDistance + cost.get(nbrIY)!.get(nbrIX)!;
                if (distanceWithCurrent < neighborDistance) {
                    distances.get(nbrIY)!.set(nbrIX, distanceWithCurrent);
                    candidateNextCells.add(neighbor);
                    previous.get(nbrIY)!.set(nbrIX, current);
                }
            }
        }
        Events.GENERATOR_STATUS_INFO.fire(`Direct iteration: ${iteration++}`);
    }


    // back-track to get the path
    const path : Cell[] = [destination];
    let current : Cell = destination;
    while (!current.cospatial(source)) {
        current = previous.get(current.getIY())!.get(current.getIX())!;
        if ((current === null) || (current === undefined)) {
            throw new Error(`No path between ${source} and ${destination}`);
        }
        path.push(current);
    }
    path.reverse();
    return path;
}


function getNext(distances : Map<number, Map<number, number>>, candidates : Set<Cell>) : Cell | null {
    let minDistance : number = Number.POSITIVE_INFINITY;
    let best : Cell | null = null;
    for (let cell of candidates) {
        const distance : number = distances.get(cell.getIY())!.get(cell.getIX())!;
        if (distance < minDistance) {
            best = cell;
            minDistance = distance;
        }
    }
    return best;
}


export {direct}