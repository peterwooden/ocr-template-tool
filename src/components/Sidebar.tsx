import React from 'react';
import { Alert } from 'react-bootstrap';
import { ColoredBox } from '../App';

export default function Sidebar({ currentBox, list, removeCoords }: { currentBox?: ColoredBox; list: ColoredBox[]; removeCoords: (i: number) => void }) {
    return (
        <div className="sidebar">
            <h4>Coordinates</h4>
            <small>(x1, y1, x2, y2)</small>
            {list.map(({box, color}, i) => (
                <Alert key={i} variant="info" style={{backgroundColor: color + '33'}}>
                    {[
                        box.x1,
                        box.y1,
                        box.x2,
                        box.y2,
                    ].map(Math.round).join(', ')}
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => removeCoords(i)}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Alert>
            ))}
            {currentBox && (
                <Alert variant="light" style={{backgroundColor: currentBox.color + '33'}}>
                    {[
                        currentBox.box.x1,
                        currentBox.box.y1,
                        currentBox.box.x2,
                        currentBox.box.y2,
                    ].map(Math.round).join(', ')}
                </Alert>
            )}
        </div>
    );
}
