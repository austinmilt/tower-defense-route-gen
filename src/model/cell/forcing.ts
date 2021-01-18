enum Forcing {
    
    /** No forcing (default state of cells). */
    NONE, 
    
    /** Forces a cell to be an entrance, i.e. where enemies would come from. */
    ENTRANCE, 
    
    /** Forces a cell to be an exit, i.e. where enemies would exit to. */
    EXIT, 
    
    /** Forces a cell to be impassable, ie.e not valid for entrances, exits, or any other parts of paths. */
    NOT_TRAVERSABLE
}

export {Forcing}