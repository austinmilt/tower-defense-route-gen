import React from 'react';
import { DEFAULT_ALGORITHM, DEFAULT_COLUMNS, DEFAULT_ROWS, GENERATOR_ALGORITHMS, MAX_COLUMNS, MAX_ROWS, MIN_COLUMNS, MIN_ROWS, PAINT_MODES } from '../../config/configs';
import { Events } from '../events/events';
import { Info } from '../info/info';
import { Button } from './button/button';
import { Checkbox } from './checkbox/checkbox';
import { Dropdown } from './dropdown/dropdown';
import { DirectRouteControls } from './generator/direct';
import { DrunkardControls } from './generator/drunkard';
import { Slider } from './slider/slider';
import './controls.css';
import { GnomeControls } from './generator/gnome';

interface Props {
}

interface State {
    algorithm : string,
}


/** Component/container for all controls. */
class Controls extends React.Component<Props, State> {

    constructor(props : Props) {
        super(props);
        this.state = {algorithm: DEFAULT_ALGORITHM}
        this.getAlgorithmControls = this.getAlgorithmControls.bind(this);
        this.updateSelectedAlgorithm = this.updateSelectedAlgorithm.bind(this);
    }


    componentDidMount() {
        Events.GENERATOR_ALGORITHM_SELECT.subscribe(this.updateSelectedAlgorithm);
    }


    componentWillUnmount() {
        Events.GENERATOR_ALGORITHM_SELECT.unsubscribe(this.updateSelectedAlgorithm);
    }


    private updateSelectedAlgorithm(algorithm : string) : void {
        this.setState({algorithm: algorithm});
    }


    private getAlgorithmControls() : any {
        switch (this.state.algorithm) {
            case "Direct":
                return <DirectRouteControls ref={DirectRouteControls.ref}/>;

            case "Drunkard":
                return <DrunkardControls ref={DrunkardControls.ref}/>;

            case "The Traveling Gnome":
                return <GnomeControls ref={GnomeControls.ref}/>;
        }
    }

    
    render() {
        return <div className="controls-outer">
            <div className="controls-inner">
                <div className="control">
                    <Slider label="columns" min={MIN_COLUMNS} max={MAX_COLUMNS} startingValue={DEFAULT_COLUMNS} onChangeEvent={Events.COLUMNS_SLIDER_VALUE_CHANGE.fire}/>
                    <Slider label="rows" min={MIN_ROWS} max={MAX_ROWS} startingValue={DEFAULT_ROWS} onChangeEvent={Events.ROWS_SLIDER_VALUE_CHANGE.fire}/>
                </div>
                <div className="control">
                    <Dropdown placeholder={"Select Paint Mode"} options={PAINT_MODES} onSelect={Events.PAINT_MODE_SELECT.fire}/>
                </div>
                <div className="control">
                    <Button label="Generate Routes" onPressEvent={Events.GENERATE_BUTTON}/>
                </div>
                <div className="control">
                    <Button label="Clear Routes" onPressEvent={Events.CLEAR_ROUTES_BUTTON}/>
                </div>
                <div className="control">
                    <Button label="Reset Grid" onPressEvent={Events.RESET_GRID_BUTTON}/>
                </div>
                <div className="control">
                    <Checkbox label="Labels?" onChangeEvent={Events.SHOW_LABELS_CHECKBOX_CHANGE.fire}/>
                </div>
                <div className="control">
                    <Checkbox label="Animate Routes?" onChangeEvent={Events.ANIMATE_ROUTES_CHECKBOX_CHANGE.fire}/>
                </div>
                <div className="control">
                    <Button label="Download Grid" onPressEvent={Events.DOWNLOAD_GRID_BUTTON}/>
                </div>
            </div>
            <div className="controls-inner controls-algorithm">
                <label style={{paddingBottom: "0.5em"}}>Algorithm Controls</label>
                <Dropdown placeholder={DEFAULT_ALGORITHM} options={GENERATOR_ALGORITHMS} onSelect={Events.GENERATOR_ALGORITHM_SELECT.fire}/>
                <Info startValue="" updateEvent={Events.GENERATOR_STATUS_INFO}/>
                {this.getAlgorithmControls()}
            </div>
        </div>
    }
}

export {Controls};