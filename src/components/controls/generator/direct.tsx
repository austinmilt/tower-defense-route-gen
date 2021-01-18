import React from 'react';
import { DEFAULT_DIRECT_ROUTE_CONFING, DirectRouteConfig } from '../../../model/generator/config';
import { Slider } from '../slider/slider';

interface Props {
}

interface State {
}

/**
 * React controls for the 'direct' path generation algorithm.
 */
class DirectRouteControls extends React.Component<Props, State> {
    public static readonly ref : React.RefObject<DirectRouteControls> = React.createRef();
    private readonly config : DirectRouteConfig = Object.assign({}, DEFAULT_DIRECT_ROUTE_CONFING);

    constructor(props : Props) {
        super(props);
        this.updateNumEntrances = this.updateNumEntrances.bind(this);
        this.updateNumExits = this.updateNumExits.bind(this);
        this.updateRandomness = this.updateRandomness.bind(this);
    }


    private updateNumEntrances(numEntrances : number) : void {
        this.config.numEntrances = numEntrances;
    }
    
    
    private updateNumExits(numExits : number) : void {
        this.config.numExits = numExits;
    }
    
    
    private updateRandomness(randomness : number) : void {
        this.config.randomness = randomness;
    }

    /**
     * @returns the current configuration for the algorithm
     */
    public getConfig() : DirectRouteConfig {
        return this.config;
    }

    render() {
        return <div>
            <Slider label="Number of Entrances" min={1} startingValue={1} max={20} onChangeEvent={this.updateNumEntrances}/>
            <Slider label="Number of Exits" min={1} startingValue={1} max={20} onChangeEvent={this.updateNumExits}/>
            <Slider label="Randomness" min={0} startingValue={0} max={1} step={0.01} onChangeEvent={this.updateRandomness}/>
        </div>

    }
}

export {DirectRouteControls};