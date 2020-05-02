import React from 'react';
import { useState, useCallback } from 'react';
import usePointerSelectDrag from './hooks/usePointerSelectDrag';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [list, setList] = useState([]);
    const addCoords = useCallback(
        (...coords) => setList((list) => list.concat([coords])),
        []
    );
    const removeCoords = useCallback(
        (index) => setList((list) => list.filter((v, i) => i !== index)),
        []
    );
    const { selectDragMouseHandlers, currentBox } = usePointerSelectDrag(
        addCoords
    );

    return (
        <div className="App">
            <div className="grid-container">
                <Sidebar {...{ list, currentBox, removeCoords }} />
                <Editor
                    {...{
                        currentBox,
                        selectDragMouseHandlers,
                    }}
                />
            </div>
        </div>
    );
}

export default App;
