import React from 'react';
import { DEFAULT_THE_TRAVELING_GNOME_CONFIG, TheTravelingGnomeConfig } from '../../../model/generator/config';
import { Slider } from '../slider/slider';

interface Props {
}

interface State {
}

/**
 * React controls for the 'gnome' path generation algorithm.
 */
class GnomeControls extends React.Component<Props, State> {
    public static readonly ref : React.RefObject<GnomeControls> = React.createRef();
    private readonly config : TheTravelingGnomeConfig = Object.assign({}, DEFAULT_THE_TRAVELING_GNOME_CONFIG);

    constructor(props : Props) {
        super(props);
        this.updateNumEntrances = this.updateNumEntrances.bind(this);
        this.updateNumExits = this.updateNumExits.bind(this);
        this.updateWandering = this.updateWandering.bind(this);
    }


    private updateNumEntrances(numEntrances : number) : void {
        this.config.numEntrances = numEntrances;
    }
    
    
    private updateNumExits(numExits : number) : void {
        this.config.numExits = numExits;
    }


    private updateWandering(tortuosity : number) : void {
        this.config.wandering = tortuosity;
    }


    /**
     * @returns the current configuration for the algorithm
     */
    public getConfig() : TheTravelingGnomeConfig {
        return this.config;
    }


    render() {
        return <div>
            <Slider label="Number of Entrances" min={1} startingValue={DEFAULT_THE_TRAVELING_GNOME_CONFIG.numEntrances} max={20} onChangeEvent={this.updateNumEntrances}/>
            <Slider label="Number of Exits" min={1} startingValue={DEFAULT_THE_TRAVELING_GNOME_CONFIG.numExits} max={20} onChangeEvent={this.updateNumExits}/>
            <Slider label="Wandering" min={0} startingValue={DEFAULT_THE_TRAVELING_GNOME_CONFIG.wandering} max={1} step={0.01} onChangeEvent={this.updateWandering}/>
        </div>

    }
}

export {GnomeControls};