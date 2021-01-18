import React from 'react';

interface Props {
    /** String label displayed with the checkbox. */
    label : string,

    /** 
     * Callback to call when the checkbox changes from checked to unchecked and vice versa.
     * 
     * @param state state of the checkbox after the change
     */
    onChangeEvent : (state : boolean) => void

    /** Starting state of the checkbox. */
    checked? : boolean
}

interface State {
    checked : number
}


/** Basic checkbox component. */
class Checkbox extends React.Component<Props, State> {

    constructor(props : Props) {
        super(props);
        this.state = {checked : this.props.checked ? 1 : 0};
        this.onInput = this.onInput.bind(this);
    }
    
    private onInput() : void {
        const newValue : number = 1 - this.state.checked;
        this.setState({checked: newValue});
        this.props.onChangeEvent(newValue === 1 ? true : false);
    }

    render() {
        return <div>
            <input type="checkbox" 
                id={this.props.label}
                name={this.props.label}
                value={this.state.checked}
                onInput={this.onInput}
            />
            <label>{this.props.label}</label>
        </div>
    }
}

export {Checkbox};