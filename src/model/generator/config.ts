
// so that we can easily track the params that
//  created a given path
interface AlgorithmConfig {
    
    /** Number of path entrances; overriden by having forced entrances. */
    numEntrances? : number;

    /** Number of path exits; overriden by having forced exits. */
    numExits? : number;
}

interface DirectRouteConfig extends AlgorithmConfig {
    /**
     * How much the route should be affected by random perturbations (0-1).
     */
    randomness? : number;
}

interface DrunkardConfig extends AlgorithmConfig {
}

interface TheTravelingGnomeConfig extends AlgorithmConfig {
    /** 
     * How much wandering the gnome should do in its travels. This affects
     * the tortuosity of routes as well as the number of detours the route
     * takes on its way from entrance to exit.
     */
    wandering? : number;
}

const DEFAULT_DIRECT_ROUTE_CONFING : DirectRouteConfig = {
    numEntrances: 1,
    numExits: 1,
    randomness: 0,
}

const DEFAULT_DRUNKARD_CONFIG : DrunkardConfig = {
    numEntrances: 1, 
    numExits: 1
}

const DEFAULT_THE_TRAVELING_GNOME_CONFIG : TheTravelingGnomeConfig = {
    numEntrances: 1,
    numExits: 1,
    wandering: 0.5
}


export type {AlgorithmConfig, DirectRouteConfig, TheTravelingGnomeConfig, DrunkardConfig};
export {DEFAULT_DIRECT_ROUTE_CONFING, DEFAULT_DRUNKARD_CONFIG, DEFAULT_THE_TRAVELING_GNOME_CONFIG};