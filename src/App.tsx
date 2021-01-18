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
                <h1 className="subcontent">Tower Defense Enemy Route Generator (<a href="https://github.com/austinmilt/tower-defense-route-gen">GitHub</a>)</h1>
                <Controls/>
                <DisplayGrid/>
            </div>
        );
    }
}

export default App;
