import React, {
    useCallback,
    useContext,
    useState,
} from 'react';
import StateContext from '../contexts/StateContext';
import useImageDropzone from '../hooks/useImageDropzone';
import usePointerSelectDrag from '../hooks/usePointerSelectDrag';
import { Boxes } from './Boxes';

export default function Editor() {
    const { imgSrc, getRootProps, getInputProps } = useImageDropzone();
    const { state, dispatch } = useContext(StateContext);
    const [imageBoundingBox, setImageBoundingBox] = useState<DOMRect | null>(
        null
    );
    const measureRef = useCallback(
        (node: SVGImageElement | null) =>
            setImageBoundingBox(node?.getBBox() || null),
        []
    );
    const selectDragMouseHandlers = usePointerSelectDrag({
        onComplete: (box) =>
            dispatch({
                type: 'ADD_BOX',
                box: {
                    box,
                    color: state.nextColor,
                },
            }),
        onUpdate: (box) => dispatch({ type: 'SET_NEXT_BOX', box }),
    });

    return (
        <div className="editor">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <svg
                    style={{
                        position: 'absolute',
                        width: imageBoundingBox?.width || '100%',
                        height: imageBoundingBox?.height || '100%',
                    }}
                >
                    {imgSrc ? (
                        <image
                            href={imgSrc}
                            {...selectDragMouseHandlers}
                            ref={measureRef}
                        />
                    ) : (
                        <text textAnchor="middle" x="50%" y="15%">
                            Drop an image here
                        </text>
                    )}

                    <Boxes />
                </svg>
            </div>
        </div>
    );
}
