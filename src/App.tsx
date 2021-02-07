import React, { useReducer } from 'react';
import usePointerSelectDrag, { Box } from './hooks/usePointerSelectDrag';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// @ts-ignore
import randomcolor from 'randomcolor';

export type ColoredBox = { box: Box, color: string };

type State = {
    boxes: ColoredBox[],
    nextColor: string
};
type Action = 
    | { type: 'ADD_BOX', box: ColoredBox }
    | { type: 'REMOVE_BOX', index: number };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_BOX':
            return {
                ...state,
                boxes: state.boxes.concat(action.box),
                nextColor: randomcolor()
            }
        case 'REMOVE_BOX':
            return {
                ...state,
                boxes: state.boxes.filter((_, i) => i !== action.index)
            }
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, {boxes: [], nextColor: randomcolor()});
    const { selectDragMouseHandlers, currentBox } = usePointerSelectDrag(
        box => dispatch({type: 'ADD_BOX', box: {
            box,
            color: state.nextColor
        }})
    );

    const nextBox = currentBox && {
        box: currentBox,
        color: state.nextColor
    }

    return (
        <div className="App">
            <div className="grid-container">
                <div className="topbar">
                    <span className="brand">OCR Template Tool</span>
                </div>
                <Sidebar 
                    list={state.boxes}
                    currentBox={nextBox}
                    removeCoords={i => dispatch({type: 'REMOVE_BOX', index: i})}
                />
                <Editor
                    list={state.boxes}
                    currentBox={nextBox}
                    selectDragMouseHandlers={selectDragMouseHandlers}
                />
            </div>
        </div>
    );
}

export default App;
