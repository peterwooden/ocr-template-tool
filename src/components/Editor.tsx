import React, { useContext } from 'react';
import StateContext from '../contexts/StateContext';
import useImageDropzone from '../hooks/useImageDropzone';
import usePointerSelectDrag from '../hooks/usePointerSelectDrag';
import { coordsToStyle } from '../utils';

export default function Editor() {
    const { imgSrc, getRootProps, getInputProps } = useImageDropzone();
    const { state, dispatch } = useContext(StateContext);
    const selectDragMouseHandlers = usePointerSelectDrag({
        onComplete: (box) => dispatch({type: 'ADD_BOX', box: {
            box,
            color: state.nextColor
        }}),
        onUpdate: (box) => dispatch({type: 'SET_NEXT_BOX', box})
    });

    return (
        <div className="editor">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        draggable="false"
                        alt="template"
                        {...selectDragMouseHandlers}
                    />
                ) : (
                    <div className="centered">Drop an image here</div>
                )}
                {state.boxes.map((box, i) => <div key={i} className="box" style={coordsToStyle(box)} />)}
                {state.nextBox && <div className="box" style={coordsToStyle({box: state.nextBox, color: state.nextColor})} />}
            </div>
        </div>
    );
}