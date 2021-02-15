import React, { useReducer } from 'react';
import { Box } from './hooks/usePointerSelectDrag';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// @ts-ignore
import randomcolor from 'randomcolor';
import StateContext from './contexts/StateContext';

import produce, { Draft } from 'immer';

export type ColoredBox = { box: Box, color: string };

export type State = {
    readonly boxes: readonly ColoredBox[],
    readonly nextBox: Box | null,
    readonly nextColor: string,
    readonly format: string,
};
export type Action = 
    | { type: 'SET_NEXT_BOX', box: Box | null }
    | { type: 'ADD_BOX', box: ColoredBox }
    | { type: 'REMOVE_BOX', index: number }
    | { type: 'SET_FORMAT', format: string }
    | { type: 'UPDATE_BOX', box: Partial<Box>, index: number };

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'ADD_BOX':
            state.boxes.push(action.box);
            state.nextColor = randomcolor();
            break;
        case 'REMOVE_BOX':
            state.boxes.splice(action.index, 1);
            break;
        case 'SET_FORMAT':
            state.format = action.format;
            break;
        case 'SET_NEXT_BOX':
            state.nextBox = action.box;
            break;
        case 'UPDATE_BOX':
            const box = state.boxes[action.index];
            box.box = {...box.box, ...action.box};
            break;
    }
}

const initialState = (): State => ({
    boxes: [], 
    nextColor: randomcolor(), 
    format: '$x1, $y1, $x2, $y2', 
    nextBox: null
});

const curriedReducerFunction = produce(reducer);

function App() {
    const [state, dispatch] = useReducer(curriedReducerFunction, null, initialState);

    return (
        <StateContext.Provider value={{state,dispatch}}>
            <div className="App">
                <div className="grid-container">
                    <div className="topbar">
                        <span className="brand">OCR Template Tool</span>
                    </div>
                    <Sidebar/>
                    <Editor/>
                </div>
            </div>
        </StateContext.Provider>
    );
}

export default App;
