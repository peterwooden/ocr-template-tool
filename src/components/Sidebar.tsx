import React, { useContext } from 'react';
import StateContext from '../contexts/StateContext';
import { formatBoxToString } from '../utils';
import { Clipboard, X } from 'react-feather';
import copy from 'copy-to-clipboard';

export default function Sidebar() {
    const { state: { current: state }, dispatch } = useContext(StateContext);

    const list = state.boxes.map(box => formatBoxToString(box, state.format));

    return (
        <div className="sidebar border-right">
            <h4>Boxes</h4>
            <div className="format-area">
                <span
                    title="Use the variables $tag, $w, $h, $x1, $y1, $y2, $x2"
                    className="tooltip-span"
                >
                    Format
                </span>
                :{' '}
                <input
                    type="text"
                    value={state.format}
                    onChange={(e) =>
                        dispatch({ type: 'SET_FORMAT', format: e.target.value })
                    }
                    onFocus={() => dispatch({ type: 'CREATE_UNDO_POINT' })}
                    className="format-input form-control d-inline w-auto"
                    size={24}
                />
            </div>
            {state.boxes.map(({ color }, i) => {
                return (
                    <div
                        key={i}
                        style={{ backgroundColor: color + '33' }}
                        className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                    >
                        <span />
                        <span>{list[i]}</span>
                        <span className="d-inline-flex align-items-center">
                            <button
                                type="button"
                                className="box-list-item-icon"
                                onClick={() => copy(list[i])}
                                title="Copy"
                            >
                                <Clipboard size={16} />
                            </button>
                            <button
                                type="button"
                                className="box-list-item-icon"
                                onClick={() => {
                                    dispatch({ type: 'CREATE_UNDO_POINT' });
                                    dispatch({ type: 'REMOVE_BOX', index: i });
                                }}
                                title="Delete"
                            >
                                <X size={16} />
                            </button>
                        </span>
                    </div>
                );
            })}
            {state.nextBox && (
                <div
                    style={{ backgroundColor: state.nextColor + '33' }}
                    className="d-flex justify-content-center align-items-center p-2 mb-2 rounded"
                >
                    <span>
                        {formatBoxToString({ box: state.nextBox, color: state.nextColor, tag: 'Tag'}, state.format)}
                    </span>
                </div>
            )}
        </div>
    );
}
