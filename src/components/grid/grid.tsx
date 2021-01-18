import React from 'react';
import { DEFAULT_ALGORITHM, DEFAULT_COLUMNS, DEFAULT_ROWS, MAX_COLUMNS, MAX_ROWS, ROUTE_ANIMATION_INTERVAL_MS } from '../../config/configs';
import { Cell } from '../../model/cell/cell';
import { Forcing } from '../../model/cell/forcing';
import { Generator } from '../../model/generator/generator';
import { Grid } from '../../model/grid/grid';
import { Move } from '../../model/path/moves';
import { DisplayCell, MoveData } from '../cell/cell';
import { DirectRouteControls } from '../controls/generator/direct';
import { DrunkardControls } from '../controls/generator/drunkard';
import { GnomeControls } from '../controls/generator/gnome';
import { Events } from '../events/events';
import './style.css';

interface Props {
}


interface State {
    rows : number;
    columns : number;
}


interface DownloadableGrid {
    cells : {[iY : number] : {[iX : number] : Forcing}};
    nColumnsOnEvenIndexRows : number;
    nColumnsOnOddIndexRows : number;
}


/**
 * Component that shows the hexagon grid, i.e. all the {@link DisplayCell}. This also manages most functionality
 * of the UI, including updating cell forcings, telling cells to display (or clear) moves from generated routes,
 * download the grid state and generate routes, etc.
 */
class DisplayGrid extends React.Component<Props, State> {
    private readonly displayCellRefs : Map<number, Map<number, React.RefObject<DisplayCell>>>;
    private cellShowLabelStart : boolean = false;
    private animateRoutes : boolean = false;
    private selectedAlgorithm : string = DEFAULT_ALGORITHM;
    private activePaths : Cell[][] = [];

    constructor(props : Props) {
        super(props);
        this.state = {columns: DEFAULT_COLUMNS, rows: DEFAULT_ROWS};
        this.updateRows = this.updateRows.bind(this);
        this.updateColumns = this.updateColumns.bind(this);
        this.setCellShowLabelStart = this.setCellShowLabelStart.bind(this);
        this.setSelectedAlgorithm = this.setSelectedAlgorithm.bind(this);
        this.generateRoutes = this.generateRoutes.bind(this);
        this.updateDoAnimateRoutes = this.updateDoAnimateRoutes.bind(this);
        this.downloadGrid = this.downloadGrid.bind(this);
        this.displayCellRefs = new Map<number, Map<number, React.RefObject<DisplayCell>>>();
        for (let r : number = 0; r < MAX_ROWS; r++) {
            this.displayCellRefs.set(r, new Map<number, React.RefObject<DisplayCell>>());
            for (let c : number = 0; c < MAX_COLUMNS; c++) {
                this.displayCellRefs.get(r)!.set(c, React.createRef());
            }
        }
    }


    componentDidMount() {
        Events.COLUMNS_SLIDER_VALUE_CHANGE.subscribe(this.updateColumns);
        Events.ROWS_SLIDER_VALUE_CHANGE.subscribe(this.updateRows);
        Events.SHOW_LABELS_CHECKBOX_CHANGE.subscribe(this.setCellShowLabelStart);
        Events.GENERATOR_ALGORITHM_SELECT.subscribe(this.setSelectedAlgorithm);
        Events.GENERATE_BUTTON.subscribe(this.generateRoutes);
        Events.ANIMATE_ROUTES_CHECKBOX_CHANGE.subscribe(this.updateDoAnimateRoutes);
        Events.DOWNLOAD_GRID_BUTTON.subscribe(this.downloadGrid);
    }


    componentWillUnmount() {
        Events.COLUMNS_SLIDER_VALUE_CHANGE.unsubscribe(this.updateColumns);
        Events.ROWS_SLIDER_VALUE_CHANGE.unsubscribe(this.updateRows);
        Events.SHOW_LABELS_CHECKBOX_CHANGE.unsubscribe(this.setCellShowLabelStart);
        Events.GENERATOR_ALGORITHM_SELECT.unsubscribe(this.setSelectedAlgorithm);
        Events.GENERATE_BUTTON.unsubscribe(this.generateRoutes);
        Events.ANIMATE_ROUTES_CHECKBOX_CHANGE.unsubscribe(this.generateRoutes);
        Events.DOWNLOAD_GRID_BUTTON.unsubscribe(this.downloadGrid);
    }


    private updateRows(rows : number) : void {
        this.setState({rows: rows});
    }


    private updateColumns(columns : number) : void {
        this.setState({columns: columns});
    }


    private setCellShowLabelStart(startState : boolean) : void {
        this.cellShowLabelStart = startState;
    }


    private setSelectedAlgorithm(algorithm : string) : void {
        this.selectedAlgorithm = algorithm;
    }


    private updateDoAnimateRoutes(doAnimation : boolean) : void {
        this.animateRoutes = doAnimation;
    }


    private downloadGrid() : void {
        const analysisGrid : Grid = Grid.ofNominalSize(this.state.rows, this.state.columns);
        const cellsObj : DownloadableGrid = {
            nColumnsOnEvenIndexRows: analysisGrid.getNumberOfColumnsOnEvenIndexRows(), 
            nColumnsOnOddIndexRows: analysisGrid.getNumberOfColumnsOnOddIndexRows(),
            cells: {}
        };
        for (let analysisCell of analysisGrid) {
            const iY = analysisCell.getIY();
            const iX = analysisCell.getIX();
            if (!cellsObj.cells.hasOwnProperty(iY)!) {
                cellsObj.cells[iY] = {};
            }
            const displayCell : DisplayCell = this.displayCellRefs.get(iY)!.get(iX)!.current!;
            cellsObj.cells[iY]![iX] = displayCell.getForcing();
        }
        
        const forcings : {[name : string] : number} = {
            'NONE': Forcing.NONE,
            'ENTRANCE': Forcing.ENTRANCE, 
            'EXIT': Forcing.EXIT, 
            'NOT_TRAVERSABLE': Forcing.NOT_TRAVERSABLE
        };

        const paths : number[][][] = [];
        for (let path of this.activePaths) {
            const outputPath : number[][] = [];
            for (let cell of path) {
                outputPath.push([cell.getIY(), cell.getIX()]);
            }
            paths.push(outputPath);
        }

        let algorithmSettings : any = null;
        switch (this.selectedAlgorithm) {
            case "Drunkard":
                algorithmSettings = DrunkardControls.ref.current!.getConfig();
                break;
                
            case "Direct":
                algorithmSettings = DirectRouteControls.ref.current!.getConfig();
                break;

            case "The Traveling Gnome":
                algorithmSettings = GnomeControls.ref.current!.getConfig();
                break;
        }
        
        const contents : any = {
            forcings: forcings, 
            grid: cellsObj, 
            paths: paths,
            settings: {
                algorithm: this.selectedAlgorithm,
                algorithmSettings: algorithmSettings
            }
        };

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(contents, undefined, 2)));
        element.setAttribute('download', 'grid.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }


    private generateRoutes() : void {

        // set up for route generation
        const analysisGrid : Grid = Grid.ofNominalSize(this.state.rows, this.state.columns);
        for (let analysisCell of analysisGrid) {
            const iY = analysisCell.getIY();
            const iX = analysisCell.getIX();
            const displayCell : DisplayCell = this.displayCellRefs.get(iY)!.get(iX)!.current!;
            // clear any existing moves from the display cell so as not to continually grow
            //  their moves (or mistakingly show a move that shouldnt be there). It would be
            //  preferable to do this in DisplayCell, but based on the order in which subscribers
            //  to the button-press are called, it can cause parts of the path to not be rendered
            //  in those cells (I dont know why)
            displayCell.clearMoves();
            analysisCell.setForcing(displayCell.getForcing());
        }


        // generate routes
        let paths : Cell[][] = [];
        switch (this.selectedAlgorithm) {
            case "Drunkard":
                paths = Generator.generateDrunkardPaths(analysisGrid, DrunkardControls.ref.current!.getConfig());
                break;
                
            case "Direct":
                paths = Generator.generateDirectRoutePaths(analysisGrid, DirectRouteControls.ref.current!.getConfig());
                break;

            case "The Traveling Gnome":
                paths = Generator.generateTheTravelingGnomePaths(analysisGrid, GnomeControls.ref.current!.getConfig());
                break;
        }
        this.activePaths = paths;


        // display results on grid
        const animationIntervalMs = this.animateRoutes ? ROUTE_ANIMATION_INTERVAL_MS : 0;
        let currentAnimationDelay = 0;
        for (let path of paths) {
            if (path.length === 0) continue;
            let displayCell : DisplayCell | null = this.getDisplayCellFromAnalysisCell(path[0]);
            let move : Move = analysisGrid.getMoveTowardOtherCell(null, path[0], path[1]);
            let moveData : MoveData = {move: move, step: 0, pathLength: path.length};
            setTimeout(displayCell!.addMove, currentAnimationDelay, moveData);
            currentAnimationDelay += animationIntervalMs;
            for (let i : number = 1; i < (path.length - 1); i++) {
                displayCell = this.getDisplayCellFromAnalysisCell(path[i]);
                if (displayCell === null) continue;
                move = analysisGrid.getMoveTowardOtherCell(path[i-1], path[i], path[i+1]);
                moveData = {move: move, step: i, pathLength: path.length};
                setTimeout(displayCell!.addMove, currentAnimationDelay, moveData);
                currentAnimationDelay += animationIntervalMs;
            }
            const i : number = path.length - 1;
            displayCell = this.getDisplayCellFromAnalysisCell(path[i]);
            move = analysisGrid.getMoveTowardOtherCell(path[i-1], path[i], null);
            moveData = {move: move, step: (path.length - 1), pathLength: path.length};
            setTimeout(displayCell!.addMove, currentAnimationDelay, moveData);
            currentAnimationDelay += animationIntervalMs;
        }
    }


    private getDisplayCellFromAnalysisCell(cell : Cell) : DisplayCell | null {
        return this.displayCellRefs.get(cell.getIY())!.get(cell.getIX())!.current; 
    }


    private createDisplayGrid(rows : number, columns : number) : DisplayCell[] {
        // I would prefer to keep the grid as a member variable of the display grid, but the display
        //  cells dont seem to hold on to the reference of the analysis cells (in the Grid), and
        //  as a result arent transfering state when starting path generation. For that reason, I 
        //  create a new grid and copy over the state each time path generation starts.
        const analysisGrid : Grid = Grid.ofNominalSize(rows, columns);
        const result : DisplayCell[] = [];
        for (let analysisCell of analysisGrid) {
            const iY = analysisCell.getIY();
            const iX = analysisCell.getIX();
            const ref : React.RefObject<DisplayCell> = this.displayCellRefs.get(iY)!.get(iX)!;
            const displayCell : DisplayCell = this.createDisplayCell(analysisCell, ref);
            result.push(displayCell);
        }
        return result;
    }


    private createDisplayCell(cell : Cell, ref : React.RefObject<DisplayCell>) : any {
        // because each "column" overlaps its neighbors by 50% and the total number of
        //  "columns" (in the array of grid cells) is 50% of what's requested, the
        //  actual width of each cell should account for this 50% overlap by being larger
        //  by adjusting the number of effective columns to be 50% of requested (and some other adjustments
        //  I just played around with :O)
        const c : number = this.state.columns;
        const r : number = this.state.rows;
        const row : number = cell.getIY();
        const column : number = cell.getIX();
        // actual number of cells wide is reduced due to overlap of columns
        const gridWidthPropOfCellWidth : number = 0.5*c + 0.5;
        const cellSizePercent = (1.0 / gridWidthPropOfCellWidth)*100.0;
        const cellTopPercent = ((Math.sqrt(3)/2) / r)*100.0 + 12/(r + 10); // small adjustment to make things work nicely (dont know why the math doesnt work)
        // shift every other row half-width to the right to make cells line up in a proper grid
        const xShift = (row % 2) === 1 ? 0.5 : 0.0;
        const x : number = (column + xShift)*cellSizePercent;
        const y : number = row*cellTopPercent;
        return <DisplayCell key={`(${row},${column})`} 
            x={x} 
            y={y} 
            row={row}
            column={column}
            size={cellSizePercent}
            ref={ref}
            showLabel={this.cellShowLabelStart}/>;
    }


    render() {
        const c = this.state.columns;
        const r = this.state.rows;
        const gridWidthPropOfCellWidth : number = 0.5*c + 0.5;
        const containerHeightProportionOfWidth = Math.sqrt(1/12) * ((3*r + 1) / gridWidthPropOfCellWidth);

        return <div className="grid-section">
            <div className="grid-container" style={{height: `calc(95vw*${containerHeightProportionOfWidth})`}}>
                {this.createDisplayGrid(r, c)}
            </div>
        </div>;
    }
}

export {DisplayGrid};