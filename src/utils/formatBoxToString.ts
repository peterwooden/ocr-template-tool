import { Box } from "../hooks/usePointerSelectDrag";


export function formatBoxToString(box: Box, format: string): string {
    return format.replace(
        /\$(x1|x2|y1|y2|w|h)/g,
        (_, k) => Math.round(box[k as keyof Box] as number).toString()
    );
}
