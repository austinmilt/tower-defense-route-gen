import React from 'react';
import './dropdown.css';

interface Props {
    /** Placeholder string to show in the dropdown before options are selected. */
    placeholder : string,

    /** Menu options. */
    options : string[],

    /**
     * Callback function to fire when an item is selected.
     * 
     * @param selected selected menu item
     */
    onSelect : (selected : string) => void
}

interface State {
    selected : string
}


/** Basic dropdown selection menu component. */
class Dropdown extends React.Component<Props, State> {

    constructor(props : Props) {
        super(props);
        this.state = {selected: this.props.placeholder}
        this.makeOptions = this.makeOptions.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }


    private makeOptions() : any {
        const results = [];
        for (let option of this.props.options) {
            results.push(<nav key={option} onClick={() => this.onSelect(option)}>{option}</nav>)
        }
        return results;
    }


    private onSelect(selected : string) : void {
        this.props.onSelect(selected);
        this.setState({selected : selected});
    }


    render() {
        return <div className="dropdown">
            <button className="dropbtn">{this.state.selected + "  ▼"}</button>
            <div className="dropdown-content">
                {this.makeOptions()}
            </div>
      </div>
    }
}

export {Dropdown};