import React from 'react';
import { Direction, Move } from '../../model/path/moves';
// this weird import allows the svg to be treated as a react component
import {ReactComponent as E2E} from './svg/e2e.svg';
import {ReactComponent as E2NE} from './svg/e2ne.svg';
import {ReactComponent as E2NW} from './svg/e2nw.svg';
import {ReactComponent as E2W} from './svg/e2w.svg';
import {ReactComponent as E2SW} from './svg/e2sw.svg';
import {ReactComponent as E2SE} from './svg/e2se.svg';
import {ReactComponent as InE} from './svg/in_e.svg';
import {ReactComponent as OutE} from './svg/out_e.svg';
import './style.css';
import { MoveData } from './cell';
import { getColor } from './colors';


interface Props {
    /** Moves (parts of the path) for the cell. */
    configs : MoveData[];
}


interface State {
}

const RAD2DEG = 180. / Math.PI;
const HEX_SECTION_RAD = Math.PI / 3.;
const HEX_SECTION_DEG = -1 * Math.round(HEX_SECTION_RAD * RAD2DEG);
const ROTATION : {[key : number]: number} = {};
ROTATION[Direction.E] = 0;
ROTATION[Direction.NE] = HEX_SECTION_DEG;
ROTATION[Direction.NW] = 2*HEX_SECTION_DEG;
ROTATION[Direction.W] = 3*HEX_SECTION_DEG;
ROTATION[Direction.SW] = 4*HEX_SECTION_DEG;
ROTATION[Direction.SE] = 5*HEX_SECTION_DEG;

/**
 * Logic for building the moves that are displayed in a cell.
 */
class DisplayMoves extends React.Component<Props, State> {

    constructor(props : Props) {
        super(props);
        this.getMoves = this.getMoves.bind(this);
    }

    private getMoves() : any[] {
        const moves : any[] = [];
        for (let config of this.props.configs) {
            const move : Move = config.move;
            const color : string = getColor(config.step / config.pathLength);
            const key : string = `${Move[move]}-${config.step}-${config.pathLength}-${Math.trunc(Math.random()*1000)}`;
            switch (move) {

                // Source is East
                case Move.E2E:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;
                
                case Move.E2NE:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;
                
                case Move.E2NW:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;   
                    
                case Move.E2W:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break; 
                    
                case Move.E2SW:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;

                case Move.E2SE:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;

                case Move.E_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;

                case Move.E_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.E]})`}/>);
                    break;


                // Source is North East
                // Notice how each "partial spin" (e.g. going from E to NE, or SW to SE) of the source direction also "spins" the 
                //  SVGs to correctly match the source and destination. For instance, to show a move from North East to East, 
                //  we need to use the SVG that shows moving from the source direction (North East) to the cell that is one 
                //  partial spin clockwise. This is the East-to-South-East SVG. Then, the SVG is is rotated counter-clockwise 
                //  one partial spin to make the source be North East instead of East.
                case Move.NE2E:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;
                
                case Move.NE2NE:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;
                
                case Move.NE2NW:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;   
                    
                case Move.NE2W:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break; 
                    
                case Move.NE2SW:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;

                case Move.NE2SE:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;

                case Move.NE_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;

                case Move.NE_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NE]})`}/>);
                    break;


                // Source is North West
                case Move.NW2E:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;
                
                case Move.NW2NE:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;
                
                case Move.NW2NW:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;   
                    
                case Move.NW2W:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break; 
                    
                case Move.NW2SW:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;

                case Move.NW2SE:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;

                case Move.NW_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;

                case Move.NW_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.NW]})`}/>);
                    break;


                
                // Source is West
                case Move.W2E:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;
                
                case Move.W2NE:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;
                
                case Move.W2NW:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;   
                    
                case Move.W2W:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break; 
                    
                case Move.W2SW:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;

                case Move.W2SE:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;

                case Move.W_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;

                case Move.W_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.W]})`}/>);
                    break;
                    

                // Source is South West
                case Move.SW2E:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;
                
                case Move.SW2NE:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;
                
                case Move.SW2NW:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;   
                    
                case Move.SW2W:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break; 
                    
                case Move.SW2SW:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;

                case Move.SW2SE:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;

                case Move.SW_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;

                case Move.SW_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SW]})`}/>);
                    break;


                // Source is South East
                case Move.SE2E:
                    moves.push(<E2NE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;
                
                case Move.SE2NE:
                    moves.push(<E2NW key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;
                
                case Move.SE2NW:
                    moves.push(<E2W key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;   
                    
                case Move.SE2W:
                    moves.push(<E2SW key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break; 
                    
                case Move.SE2SW:
                    moves.push(<E2SE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;

                case Move.SE2SE:
                    moves.push(<E2E key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;

                case Move.SE_IN:
                    moves.push(<InE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;

                case Move.SE_OUT:
                    moves.push(<OutE key={key} fill={color} transform={`rotate(${ROTATION[Direction.SE]})`}/>);
                    break;
            }
        }
        return moves;
    }

    render() {
        return <div className="no-interactions">
            {this.getMoves()}
        </div>;
    }
}

export {DisplayMoves};