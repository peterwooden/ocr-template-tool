import { ColoredBox } from "./App";
import { Box } from "./hooks/usePointerSelectDrag";

export function coordsToStyle({box: {x1, y1, x2, y2}, color}: ColoredBox){
    return {
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2),
        backgroundColor: color + '33',
        borderColor: color + 'c8',
    }
}

export function formatBoxToString(box: Box, format: string): string {
    return format.replace(
        /\$(x1|x2|y1|y2|w|h)/g, 
        (_, k) => Math.round(box[k as keyof Box] as number).toString()
    );
}