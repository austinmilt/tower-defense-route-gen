import React from 'react';
import { Event } from '../events/events';

interface Props {
    /** Starting value string for the info box. */
    startValue : string,

    /** Event to use to update the value. */
    updateEvent : Event<string>
}

interface State {
    value : string
}


/** Basic info (text) component that can update based on events. */
class Info extends React.Component<Props, State> {
    constructor(props : Props) {
        super(props);
        this.state = {value : this.props.startValue};
        this.updateValue = this.updateValue.bind(this);
    }


    componentDidMount() : void {
        this.props.updateEvent.subscribe(this.updateValue);
    }


    componentWillUnmount() : void {
        this.props.updateEvent.unsubscribe(this.updateValue);
    }


    private updateValue(newValue : string) {
        this.setState({value : newValue});
    }

    
    render() {
        return <p>{this.state.value}</p>
    }
}

export {Info};