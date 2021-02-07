import React from 'react';
import { ColoredBox } from '../App';
import useImageDropzone from '../hooks/useImageDropzone';
import { SelectDragMouseHandlers } from '../hooks/usePointerSelectDrag';
import { coordsToStyle } from '../utils';

export default function Editor({ list, currentBox, selectDragMouseHandlers }: { list: ColoredBox[]; currentBox?: ColoredBox; selectDragMouseHandlers: SelectDragMouseHandlers }) {
    const { imgSrc, getRootProps, getInputProps } = useImageDropzone();

    return (
        <div className="editor">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        {...selectDragMouseHandlers}
                        draggable="false"
                        alt="template"
                    />
                ) : (
                    <div className="centered">Drop an image here</div>
                )}
                {list.map((box, i) => <div key={i} className="box" style={coordsToStyle(box)} />)}
                {currentBox && <div className="box" style={coordsToStyle(currentBox)} />}
            </div>
        </div>
    );
}