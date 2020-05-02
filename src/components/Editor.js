import React from 'react';
import useImageDropzone from '../hooks/useImageDropzone';

export default function Editor({ currentBox, selectDragMouseHandlers }) {
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
                {currentBox && <div className="box" style={currentBox} />}
            </div>
        </div>
    );
}