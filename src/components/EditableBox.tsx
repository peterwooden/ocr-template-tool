import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { ColoredBox } from '../App';
import StateContext from '../contexts/StateContext';
import { Box } from '../hooks/usePointerSelectDrag';

const STROKE_WIDTH = 4;


const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
if (context) {
    context.font = '13px monospace';
}

export function EditableBox({
    box,
    editable,
    id,
}: {
    box: ColoredBox;
    editable: boolean;
    id: number;
}) {
    const { dispatch, state } = useContext(StateContext);

    // Focus on the input element if it is new
    const inputRef = useCallback((node: HTMLInputElement | null) => {
        if (node && id === state.current.boxes.length - 1 && state.next.length === 0) {
            node.select();
        }
        // eslint-disable-next-line
    }, [id]);

    // Clean up subscriptions
    const cleanupFn = useRef<(() => void) | undefined>();
    useEffect(() => cleanupFn.current, []);

    // General function to simplify transforming the pointer position into new box coords
    const subscribe = useCallback(
        (
            ev: React.MouseEvent<SVGElement, MouseEvent>,
            fn: (
                oldBox: Box,
                difference: { dx: number; dy: number }
            ) => Partial<Box>
        ) => {
            dispatch({ type: 'CREATE_UNDO_POINT' });
            cleanupFn.current?.();
            const oldScreenCoords = { x: ev.screenX, y: ev.screenY };
            const oldBox = box.box;
            const subscription = (ev2: MouseEvent) => {
                dispatch({
                    type: 'UPDATE_BOX',
                    index: id,
                    box: fn(oldBox, {
                        dx: ev2.screenX - oldScreenCoords.x,
                        dy: ev2.screenY - oldScreenCoords.y,
                    }),
                });
            };
            document.addEventListener('mousemove', subscription);
            const removeSubscription = () => {
                document.removeEventListener('mousemove', subscription);
            };
            document.addEventListener('mouseup', removeSubscription, {
                once: true,
            });
            document.addEventListener('mouseleave', removeSubscription, {
                once: true,
            });
            cleanupFn.current = removeSubscription;
        },
        [dispatch, id, box]
    );

    // Create callbacks for resize and move pointer events
    const onX1MouseDown = useCallback(
        (ev: React.MouseEvent<SVGLineElement, MouseEvent>) => {
            subscribe(ev, ({ x1, x2 }, { dx }) => ({
                x1: Math.min(x1 + dx, x2),
                x2: Math.max(x1 + dx, x2),
                w: Math.abs(x1 + dx - x2),
            }));
        },
        [subscribe]
    );
    const onX2MouseDown = useCallback(
        (ev: React.MouseEvent<SVGLineElement, MouseEvent>) => {
            subscribe(ev, ({ x1, x2 }, { dx }) => ({
                x1: Math.min(x1, x2 + dx),
                x2: Math.max(x1, x2 + dx),
                w: Math.abs(x1 - dx - x2),
            }));
        },
        [subscribe]
    );
    const onY1MouseDown = useCallback(
        (ev: React.MouseEvent<SVGLineElement, MouseEvent>) => {
            subscribe(ev, ({ y1, y2 }, { dy }) => ({
                y1: Math.min(y1 + dy, y2),
                y2: Math.max(y1 + dy, y2),
                h: Math.abs(y1 + dy - y2),
            }));
        },
        [subscribe]
    );
    const onY2MouseDown = useCallback(
        (ev: React.MouseEvent<SVGLineElement, MouseEvent>) => {
            subscribe(ev, ({ y1, y2 }, { dy }) => ({
                y1: Math.min(y1, y2 + dy),
                y2: Math.max(y1, y2 + dy),
                h: Math.abs(y1 - dy - y2),
            }));
        },
        [subscribe]
    );
    const onBoxMouseDown = useCallback(
        (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
            subscribe(ev, ({ x1, x2, y1, y2 }, { dx, dy }) => ({
                x1: x1 + dx,
                x2: x2 + dx,
                y1: y1 + dy,
                y2: y2 + dy,
            }));
        },
        [subscribe]
    );

    const tagWidth = useMemo(() => context ? context.measureText(box.tag).width + 5 : 20, [box.tag]);

    return (
        <>
            <rect
                x={box.box.x1}
                y={box.box.y1}
                width={box.box.w}
                height={box.box.h}
                fill={box.color}
                pointerEvents={editable ? 'visiblePainted' : 'none'}
                onMouseDown={onBoxMouseDown}
                cursor="move"
                style={{ strokeWidth: 1, stroke: box.color + 'c3' }}
                className="editable-box"
            />
            <rect 
                x={box.box.x1 + Math.max(0, (box.box.w - tagWidth) / 2)}
                y={box.box.y1 + Math.max(0, (box.box.h - 18) / 2)}
                width={Math.min(tagWidth, box.box.w)}
                height={Math.min(18, box.box.h)}
                fill={box.color}
                className="tag-input-background"
            />
            <foreignObject 
                x={box.box.x1 + Math.max(0, (box.box.w - tagWidth) / 2)}
                y={box.box.y1 + Math.max(0, (box.box.h - 18) / 2)}
                width={Math.min(tagWidth, box.box.w)}
                height={Math.min(18, box.box.h)}
            >
                <div className="tag-input-div">
                    <input
                        value={box.tag}
                        onChange={(e) => dispatch({ type: 'SET_BOX_TAG', index: id, tag: e.target.value})}
                        onFocus={() => dispatch({ type: 'CREATE_UNDO_POINT' })}
                        className="tag-input"
                        ref={inputRef}
                    />
                </div>
            </foreignObject>
            
            <line
                x1={box.box.x1}
                x2={box.box.x1}
                y1={box.box.y1}
                y2={box.box.y2}
                stroke={box.color}
                strokeWidth={STROKE_WIDTH}
                cursor="e-resize"
                onMouseDown={onX1MouseDown}
                className="editable-line"
            />
            <line
                x1={box.box.x2}
                x2={box.box.x2}
                y1={box.box.y1}
                y2={box.box.y2}
                stroke={box.color}
                strokeWidth={STROKE_WIDTH}
                cursor="w-resize"
                onMouseDown={onX2MouseDown}
                className="editable-line"
            />
            <line
                x1={box.box.x1}
                x2={box.box.x2}
                y1={box.box.y1}
                y2={box.box.y1}
                stroke={box.color}
                strokeWidth={STROKE_WIDTH}
                cursor="n-resize"
                onMouseDown={onY1MouseDown}
                className="editable-line"
            />
            <line
                x1={box.box.x1}
                x2={box.box.x2}
                y1={box.box.y2}
                y2={box.box.y2}
                stroke={box.color}
                strokeWidth={STROKE_WIDTH}
                cursor="s-resize"
                onMouseDown={onY2MouseDown}
                className="editable-line"
            />
        </>
    );
}
