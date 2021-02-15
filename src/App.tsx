import React, { useReducer } from 'react';
import { Box } from './hooks/usePointerSelectDrag';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// @ts-ignore
import randomcolor from 'randomcolor';
import StateContext from './contexts/StateContext';

export type ColoredBox = { box: Box, color: string };

export type State = {
    boxes: ColoredBox[],
    nextBox: Box | null,
    nextColor: string,
    format: string,
};
export type Action = 
    | { type: 'SET_NEXT_BOX', box: Box | null }
    | { type: 'ADD_BOX', box: ColoredBox }
    | { type: 'REMOVE_BOX', index: number }
    | { type: 'SET_FORMAT', format: string }
    | { type: 'UPDATE_BOX', box: Partial<Box>, index: number };

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
        case 'SET_FORMAT':
            return {
                ...state,
                format: action.format
            }
        case 'SET_NEXT_BOX':
            return {
                ...state,
                nextBox: action.box
            }
        case 'UPDATE_BOX':
            return {
                ...state,
                boxes: state.boxes.map((box, i) => i === action.index ? { box: {...box.box, ...action.box}, color: box.color } : box)
            }
    }
}

const initialState = (): State => ({
    boxes: [], 
    nextColor: randomcolor(), 
    format: '$x1, $y1, $x2, $y2', 
    nextBox: null
});

function App() {
    const [state, dispatch] = useReducer(reducer, null, initialState);

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
