import React from 'react';
import { DEFAULT_DRUNKARD_CONFIG, DirectRouteConfig, DrunkardConfig } from '../../../model/generator/config';
import { Slider } from '../slider/slider';

interface Props {
}

interface State {
}

/**
 * React controls for the 'drunkard' path generation algorithm.
 */
class DrunkardControls extends React.Component<Props, State> {
    public static readonly ref : React.RefObject<DrunkardControls> = React.createRef();
    private readonly config : DirectRouteConfig = Object.assign({}, DEFAULT_DRUNKARD_CONFIG);

    constructor(props : Props) {
        super(props);
        this.updateNumEntrances = this.updateNumEntrances.bind(this);
        this.updateNumExits = this.updateNumExits.bind(this);
    }


    private updateNumEntrances(numEntrances : number) : void {
        this.config.numEntrances = numEntrances;
    }
    
    
    private updateNumExits(numExits : number) : void {
        this.config.numExits = numExits;
    }
    

    /**
     * @returns the current configuration for the algorithm
     */
    public getConfig() : DrunkardConfig {
        return this.config;
    }


    render() {
        return <div>
            <Slider label="Number of Entrances" min={1} startingValue={1} max={20} onChangeEvent={this.updateNumEntrances}/>
            <Slider label="Number of Exits" min={1} startingValue={1} max={20} onChangeEvent={this.updateNumExits}/>
        </div>

    }
}

export {DrunkardControls};