import React from 'react';
import './slider.css';

interface Props {
    /** String label to display with the slider. */
    label : string,

    /** Minimum allowed value. */
    min : number,

    /** Maximum allowed value. */
    max : number,

    /**
     * Callback function for when the value changes.
     * 
     * @param value new value after the slider value changes
     */
    onChangeEvent : (value : number) => void,

    /** Starting value. */
    startingValue? : number,

    /** How big the steps between values should be (can be a non-integer). */
    step? : number
}

interface State {
    value: number
}


const DECIMAL_TO_INT_FACTOR : number = 1e9;


/** Basic range slider component. */
class Slider extends React.Component<Props, State> {
    private readonly integerStepSize : number;
    private readonly integerMaxValue : number;
    private readonly integerMinValue : number;

    constructor(props : Props) {
        super(props);
        this.integerStepSize = DECIMAL_TO_INT_FACTOR * (props.step ? props.step : 1);
        this.integerMinValue = DECIMAL_TO_INT_FACTOR * props.min;
        this.integerMaxValue = DECIMAL_TO_INT_FACTOR * props.max;
        const integerStartingValue : number = DECIMAL_TO_INT_FACTOR * (props.startingValue ? props.startingValue : props.min);
        this.state = {value: integerStartingValue};
        this.onInput = this.onInput.bind(this);
    }
    
    private onInput(e : React.FormEvent<HTMLInputElement>) : void {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        // avoid causing a redraw unless the value actually changes, which will
        //  not happen when the slider gets to the max/min values
        if (newValue !== this.state.value) {
            this.setState({value: newValue});
            this.props.onChangeEvent(newValue / DECIMAL_TO_INT_FACTOR);
        }
    }

    render() {
        return <div className="slider-container">
            <label>{this.props.label}</label>
            <input style={{marginLeft: "1em"}} type="range" 
                id={this.props.label}
                name={this.props.label}
                min={this.integerMinValue}
                max={this.integerMaxValue}
                value={this.state.value}
                onInput={this.onInput}
                step={this.integerStepSize}
            />
            <label style={{marginLeft: "1em"}}>{this.state.value / DECIMAL_TO_INT_FACTOR}</label>
        </div>

    }
}

export {Slider};