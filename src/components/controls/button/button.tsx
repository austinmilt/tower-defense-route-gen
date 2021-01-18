import React from 'react';
import { Event } from '../../events/events';
import './button.css';

interface Props {
    /** String displayed in the button. */
    label : string,

    /** Event to fire when the button is pressed. */
    onPressEvent : Event<void>
}

interface State {
}


/** Basic button component. */
class Button extends React.Component<Props, State> {

    render() {
        return <button className="button" onMouseUp={() => this.props.onPressEvent.fire()}>{this.props.label}</button>

    }
}

export {Button};