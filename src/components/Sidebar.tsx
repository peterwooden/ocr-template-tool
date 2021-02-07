import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import StateContext from '../contexts/StateContext';
import { Box } from '../hooks/usePointerSelectDrag';
import { formatBoxToString } from '../utils';

export default function Sidebar() {
    const {state, dispatch} = useContext(StateContext);
    return (
        <div className="sidebar">
            <h4>Boxes</h4>
            Format: <input type="text" value={state.format} onChange={e => dispatch({type: 'SET_FORMAT', format: e.target.value})}/>
            {state.boxes.map(({box, color}, i) => (
                <Alert key={i} variant="info" style={{backgroundColor: color + '33'}}>
                    {formatBoxToString(box, state.format)}
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => dispatch({type: 'REMOVE_BOX', index: i})}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Alert>
            ))}
            {state.nextBox && (
                <Alert variant="light" style={{backgroundColor: state.nextColor + '33'}}>
                    {[
                        state.nextBox.x1,
                        state.nextBox.y1,
                        state.nextBox.x2,
                        state.nextBox.y2,
                    ].map(Math.round).join(', ')}
                </Alert>
            )}
        </div>
    );
}
