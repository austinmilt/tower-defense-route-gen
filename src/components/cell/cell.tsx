import React from 'react';
import { Forcing } from '../../model/cell/forcing';
// this weird import allows the svg to be treated as a react component
import {ReactComponent as Hexagon} from './svg/hexagon.svg';
import { Move } from '../../model/path/moves';
import { DisplayMoves } from './moves';
import { Events } from '../events/events';
import './style.css';

interface Props {
    /** Horizontal position (%) in container. */
    x : number,

    /** Vertical position (%) in container. */
    y : number,

    /** Row in grid. */
    row : number,

    /** Column in grid. */
    column : number,

    /** Size as percent of container. */
    size : number,

    /** Whether to show the cell label. */
    showLabel : boolean,

    /** React ref. */
    ref : any
}

interface MoveData {
    move : Move,
    step : number,
    pathLength : number
}

interface State {
    moves: MoveData[],
    showLabel: boolean,
    forcing: Forcing
}

/**
 * The React component counterpart of analysis cell.
 */
class DisplayCell extends React.Component<Props, State> {
    private static paintModeToggle : Forcing = Forcing.NONE;
    private static selectedPaintMode : Forcing = Forcing.NONE;

    constructor(props : Props) {
        super(props);
        this.state = {forcing: Forcing.NONE, moves: [], showLabel: this.props.showLabel};
        this.toggleForcing = this.toggleForcing.bind(this);
        this.sweepForcing = this.sweepForcing.bind(this);
        this.getLabel = this.getLabel.bind(this);
        this.setShowLabel = this.setShowLabel.bind(this);
        this.setMoves = this.setMoves.bind(this);
        this.clearMoves = this.clearMoves.bind(this);
        this.addMove = this.addMove.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        Events.SHOW_LABELS_CHECKBOX_CHANGE.subscribe(this.setShowLabel);
        Events.CLEAR_ROUTES_BUTTON.subscribe(this.clearMoves);
        Events.RESET_GRID_BUTTON.subscribe(this.reset);
    }
    
    
    componentWillUnmount() {
        Events.SHOW_LABELS_CHECKBOX_CHANGE.unsubscribe(this.setShowLabel);
        Events.CLEAR_ROUTES_BUTTON.unsubscribe(this.clearMoves);
        Events.RESET_GRID_BUTTON.unsubscribe(this.reset);
    }


    /**
     * Sets the forcing to use when painting over cells.
     * 
     * @param mode active mode for setting the cell forcing
     */
    public static updatePaintMode(mode : string) : void {
        switch (mode) {
            case "Make Impassable":
                DisplayCell.selectedPaintMode = Forcing.NOT_TRAVERSABLE;
                break;

            case "Force Entrance":
                DisplayCell.selectedPaintMode = Forcing.ENTRANCE;
                break;

            case "Force Exit":
                DisplayCell.selectedPaintMode = Forcing.EXIT;
                break;

            default:
                DisplayCell.selectedPaintMode = Forcing.NONE;
                console.warn(`Unrecognized paint mode ${mode}. Resetting to None`);
        }
    }


    private setShowLabel(doShow : boolean) : void {
        this.setState({showLabel: doShow});
    }


    private setMoves(moves : MoveData[]) : void {
        this.setState({moves : moves});
    }


    /**
     * Clears all moves (i.e. parts of a path) from the cell.
     */
    public clearMoves() : void {
        // for some reason using setState here doesnt fully clear out the
        //  moves, so setting the length of the moves array to 0 forces it
        //  to clear
        // eslint-disable-next-line
        this.state.moves.length = 0;
        this.setState({moves: []});
    }


    private reset() : void {
        this.setState({moves: [], forcing: Forcing.NONE});
    }


    /**
     * @param move move to add and display in cell
     */
    public addMove(move : MoveData) : void {
        this.state.moves.push(move);
        this.setState({moves : this.state.moves});
    }


    private sweepForcing(event : React.MouseEvent) : void {
        // see the following for the value of "buttons" being checked: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        if (event.buttons === 1) {
            this.setState({forcing: DisplayCell.paintModeToggle});
        }
    }


    private toggleForcing() : void {
        let forcing : Forcing = this.state.forcing;
        if (Forcing.NONE === forcing) {
            forcing =  DisplayCell.selectedPaintMode;

        } else {
            forcing = Forcing.NONE;
        }
        this.setState({forcing: forcing});
    }


    public getForcing() : Forcing {
        return this.state.forcing;
    }


    private getLabel() : any {
        if (this.state.showLabel) {
            return <label className="cell-label no-interactions" style={{fontSize: `${this.props.size/7}em`}}>{`(${this.props.row}, ${this.props.column})`}</label>;

        } else {
            return null;
        }
    }

    private getColors() : string {
        const isPartOfPath = (this.state.moves !== null) && (this.state.moves.length > 0);
        if (isPartOfPath) {
            return "cell-svg-route";

        } else {
            switch (this.state.forcing) {
                case Forcing.NOT_TRAVERSABLE:
                    return "cell-svg-not-traversable";

                case Forcing.ENTRANCE:
                    return "cell-svg-entrance";

                case Forcing.EXIT:
                    return "cell-svg-exit";

                default:
                    return "cell-svg-base";
            }
        }
    }

    render() {
        return <div className="cell-container" style={{top: `${this.props.y}%`, left: `${this.props.x}%`, width: `${this.props.size}%`} }>
            {this.getLabel()}
            <DisplayMoves configs={this.state.moves}/>
            <Hexagon className={this.getColors()}
                onMouseEnter={this.sweepForcing}
                onMouseDown={() => {
                    this.toggleForcing();
                    DisplayCell.paintModeToggle = (DisplayCell.paintModeToggle === DisplayCell.selectedPaintMode) ? Forcing.NONE : DisplayCell.selectedPaintMode;
                }}
            />
        </div>;
    }
}


Events.PAINT_MODE_SELECT.subscribe(DisplayCell.updatePaintMode);

export {DisplayCell};
export type {MoveData};