import React, { useContext } from 'react';
import StateContext from '../contexts/StateContext';
import { EditableBox } from './EditableBox';

export function Boxes() {
    const { state } = useContext(StateContext);

    return (
        <>
            {state.boxes.map((box, i) => (
                <EditableBox
                    box={box}
                    key={i}
                    id={i}
                    editable={state.nextBox === null} />
            ))}
            {state.nextBox && (
                <rect
                x={state.nextBox.x1}
                y={state.nextBox.y1}
                width={state.nextBox.w}
                height={state.nextBox.h}
                fill={state.nextColor + '33'}
                pointerEvents="none"
            />
            )}
        </>
    );
}
