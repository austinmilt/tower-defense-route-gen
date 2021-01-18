const DEFAULT_ROWS : number = 8;
const DEFAULT_COLUMNS : number = 35;
const MIN_ROWS : number = 2;
const MAX_ROWS : number = 100;
const MIN_COLUMNS : number = 2;
const MAX_COLUMNS : number = 100;
const ROUTE_ANIMATION_INTERVAL_MS = 250;
const DEFAULT_ALGORITHM : string = "The Traveling Gnome";
const GENERATOR_ALGORITHMS : string[] = ["Direct", "Drunkard", "The Traveling Gnome"];
const PAINT_MODES : string[] = ["Make Impassable", "Force Entrance", "Force Exit"];

export {
    DEFAULT_ROWS, 
    DEFAULT_COLUMNS,
    MIN_COLUMNS, 
    MAX_COLUMNS,
    MIN_ROWS, 
    MAX_ROWS, 
    DEFAULT_ALGORITHM, 
    GENERATOR_ALGORITHMS,
    PAINT_MODES,
    ROUTE_ANIMATION_INTERVAL_MS
};