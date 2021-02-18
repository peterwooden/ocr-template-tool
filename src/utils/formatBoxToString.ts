import { ColoredBox } from "../App";
import { Box } from "../hooks/usePointerSelectDrag";


export function formatBoxToString(box: ColoredBox, format: string): string {
    return format.replace(
        /\$(x1|x2|y1|y2|w|h)/g,
        (_, k) => Math.round(box.box[k as keyof Box] as number).toString()
    ).replace(
        /\$tag/g, box.tag
    );
}
