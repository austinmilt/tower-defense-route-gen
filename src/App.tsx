import React from 'react';
import { Controls } from './components/controls/controls';
import { DisplayGrid } from './components/grid/grid';
import './App.css';

interface Props {}

interface State {
}

class App extends React.Component<Props, State> {

    render() {
        return (
            <div className="App">
                <Controls/>
                <DisplayGrid/>
            </div>
        );
    }
}

export default App;
