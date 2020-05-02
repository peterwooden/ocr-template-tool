import { useCallback, useState } from 'react';

function eventToPointerCoordinates(e) {
    const { left, top } = e.target.getBoundingClientRect();
    return [e.clientX - left, e.clientY - top];
}

export default function usePointerSelectDrag(onComplete) {
    const [mouseDown, setMouseDown] = useState(false);
    const [[x1, y1], setStartingPoint] = useState([0, 0]);
    const [[x2, y2], setCurrentPoint] = useState([0, 0]);
    const onMouseDown = useCallback((e) => {
        if (e.button === 0) {
            setStartingPoint(eventToPointerCoordinates(e));
            setCurrentPoint(eventToPointerCoordinates(e));
            setMouseDown(true);
        }
    }, []);
    const onMouseUp = useCallback(
        (e) => {
            if (mouseDown) {
                setMouseDown(false);
                onComplete(x1, y1, x2, y2);
            }
        },
        [x1, y1, x2, y2, onComplete, mouseDown]
    );
    const onMouseMove = useCallback(
        (e) => {
            if (mouseDown) setCurrentPoint(eventToPointerCoordinates(e));
        },
        [mouseDown]
    );

    const currentBox = mouseDown && {
        x1,
        y1,
        x2,
        y2,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2),
    };

    return {
        selectDragMouseHandlers: { onMouseDown, onMouseMove, onMouseUp },
        currentBox,
    };
}
