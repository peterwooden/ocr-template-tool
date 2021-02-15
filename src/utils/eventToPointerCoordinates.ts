import { ReactMouseEvent } from '../hooks/usePointerSelectDrag';

export function eventToPointerCoordinates(e: ReactMouseEvent | MouseEvent) {
    const { left, top } = (e.target as HTMLElement).getBoundingClientRect();
    return { x: e.clientX - left, y: e.clientY - top };
}
