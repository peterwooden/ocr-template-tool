import React, { useCallback, useContext, useMemo } from 'react';
import StateContext from '../contexts/StateContext';
import { formatBoxToString } from '../utils';
import { Copy, X } from 'react-feather';
import copy from 'copy-to-clipboard';

export default function Sidebar() {
    const {
        state: { current: state },
        dispatch,
    } = useContext(StateContext);

    const list = useMemo(
        () => state.boxes.map((box) => formatBoxToString(box, state.format)),
        [state.boxes, state.format]
    );
    const copyAll = useCallback(() => copy(list.join('\n')), [list]);
    const copyOne = useCallback(
        (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            copy(list[+(ev.currentTarget.dataset.index as string)]),
        [list]
    );
    const deleteOne = useCallback(
        (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            dispatch({ type: 'CREATE_UNDO_POINT' });
            dispatch({
                type: 'REMOVE_BOX',
                index: +(ev.currentTarget.dataset.index as string),
            });
        },
        [dispatch]
    );

    return (
        <div className="sidebar border-right">
            <h4 className="d-flex align-items-center justify-content-center">
                Boxes{' '}
                <button
                    type="button"
                    className="box-list-item-icon ml-2"
                    onClick={copyAll}
                    title="Copy"
                    disabled={list.length === 0}
                >
                    <Copy size={20} />
                </button>
            </h4>
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
                                data-index={i}
                                onClick={copyOne}
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                            <button
                                type="button"
                                className="box-list-item-icon"
                                data-index={i}
                                onClick={deleteOne}
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
                        {formatBoxToString(
                            {
                                box: state.nextBox,
                                color: state.nextColor,
                                tag: 'Tag',
                            },
                            state.format
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}
