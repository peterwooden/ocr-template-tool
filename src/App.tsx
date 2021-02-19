import React, { useReducer } from 'react';
import { Box } from './hooks/usePointerSelectDrag';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// @ts-ignore
import randomcolor from 'randomcolor';
import StateContext from './contexts/StateContext';
import { equals, last } from 'ramda';
import produce, { Draft } from 'immer';
import { RotateCcw, RotateCw } from 'react-feather';

export type ColoredBox = { box: Box; color: string; tag: string };

export type State = Undoable<{
    readonly boxes: readonly ColoredBox[];
    readonly nextBox: Box | null;
    readonly nextColor: string;
    readonly format: string;
}>;

type Undoable<T> = {
    readonly previous: readonly T[];
    readonly current: T;
    readonly next: readonly T[];
};

export type Action =
    | { type: 'SET_NEXT_BOX'; box: Box | null }
    | { type: 'ADD_BOX'; box: ColoredBox }
    | { type: 'REMOVE_BOX'; index: number }
    | { type: 'SET_BOX_TAG'; tag: string; index: number }
    | { type: 'SET_FORMAT'; format: string }
    | { type: 'UPDATE_BOX'; box: Partial<Box>; index: number }
    | { type: 'CREATE_UNDO_POINT' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'ADD_BOX':
            state.current.boxes.push(action.box);
            state.current.nextColor = randomcolor();
            break;
        case 'REMOVE_BOX':
            state.current.boxes.splice(action.index, 1);
            break;
        case 'SET_FORMAT':
            state.current.format = action.format;
            break;
        case 'SET_NEXT_BOX':
            state.current.nextBox = action.box;
            break;
        case 'SET_BOX_TAG':
            state.current.boxes[action.index].tag = action.tag;
            break;
        case 'UPDATE_BOX':
            const box = state.current.boxes[action.index];
            box.box = { ...box.box, ...action.box };
            break;
        case 'CREATE_UNDO_POINT':
            if (!equals(state.current, last(state.previous))) {
                state.previous.push(state.current);
                state.next = [];
            }
            break;
        case 'UNDO':
            let previous;
            while (
                equals(state.current, (previous = state.previous.pop())) &&
                state.previous.length
            );
            if (previous) {
                state.next.push(state.current);
                state.current = previous;
            }
            break;
        case 'REDO':
            let next = state.next.pop();
            if (next) {
                state.previous.push(state.current);
                state.current = next;
            }
            break;
    }
}

const initialState = (): State => ({
    previous: [],
    current: {
        boxes: [],
        nextColor: randomcolor(),
        format: '$tag: $x1, $y1, $x2, $y2',
        nextBox: null,
    },
    next: [],
});

const curriedReducerFunction = produce(reducer);

function App() {
    const [state, dispatch] = useReducer(
        curriedReducerFunction,
        null,
        initialState
    );

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            <div className="App">
                <div className="grid-container">
                    <div className="topbar">
                        <span className="brand">OCR Template Tool</span>
                        <span className="d-inline-flex">
                            <button
                                onClick={() => dispatch({ type: 'UNDO' })}
                                disabled={state.previous.length === 0}
                                className="box-list-item-icon mr-2"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                onClick={() => dispatch({ type: 'REDO' })}
                                disabled={state.next.length === 0}
                                className="box-list-item-icon"
                            >
                                <RotateCw size={16} />
                            </button>
                        </span>
                        <span />
                    </div>
                    <Sidebar />
                    <Editor />
                </div>
            </div>
        </StateContext.Provider>
    );
}

export default App;
