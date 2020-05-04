import React from 'react';
import { Alert } from 'react-bootstrap';

export default function Sidebar({ currentBox, list, removeCoords }) {
    return (
        <div className="sidebar">
            <h4>Coordinates</h4>
            <small>(x1, y1, x2, y2)</small>
            {list.map((coord, i) => (
                <Alert key={i} variant="info">
                    {coord.map(Math.round).join(', ')}
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
                <Alert variant="light">
                    {[
                        currentBox.left,
                        currentBox.top,
                        currentBox.left + currentBox.width,
                        currentBox.top + currentBox.height,
                    ].map(Math.round).join(', ')}
                </Alert>
            )}
        </div>
    );
}
