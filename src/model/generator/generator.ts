import { Cell } from "../cell/cell";
import { Grid } from "../grid/grid";
import { 
    DirectRouteConfig, 
    DrunkardConfig, 
    TheTravelingGnomeConfig } from "./config";
import { direct } from "./direct";
import { drunkard } from "./drunkard";
import { theTravelingGnome } from "./gnome";

/**
 * Main service class for generating routes. A container for the various algorithms.
 */
class Generator {

    /**
     * Generates enemy route(s) attempting to take a direct route from entrance(s) to exit(s). Routes are
     * generated using dijkstra's algorithm with a randomly generated cost surface that looks (roughly) like
     * mountainness terrain. Increasing the randomness of the algorithm results in an attempt to create more
     * circuitous routes from from entrance to exit.
     * 
     * @param grid analysis grid to pull forcings and grid size from
     * @param config settings to use for this route generation
     */
    public static generateDirectRoutePaths(grid : Grid, config? : DirectRouteConfig) : Cell[][] {
        return direct(grid, config);
    }


    /**
     * Generates enemy route(s) by taking a random walk across the grid. I'd be there in a jiffy, if only the
     * world werent so topsy turvy. 
     * 
     * @param grid analysis grid to pull forcings and grid size from
     * @param config settings to use for this route generation
     */
    public static generateDrunkardPaths(grid : Grid, config? : DrunkardConfig) : Cell[][] {
        return drunkard(grid, config);
    }


    /**
     * Generates enemy route(s) by taking detours along a direct(ish) route from entrance(s) to exit(s). The
     * number of detours and tortuosity of detours is controlled by the wandering parameter.
     * 
     * @param grid analysis grid to pull forcings and grid size from
     * @param config settings to use for this route generation
     */
    public static generateTheTravelingGnomePaths(grid : Grid, config? : TheTravelingGnomeConfig) : Cell[][] {
        return theTravelingGnome(grid, config);
    }
}

export {Generator};