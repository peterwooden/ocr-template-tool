import { formatBoxToString } from './formatBoxToString';

test('normal', () => {
    expect(
        formatBoxToString(
            { x1: 0, x2: 10, y1: 0, y2: 20, w: 10, h: 20 },
            '$x1, $x2, $y1, $y2, $w, $h'
        )
    ).toBe('0, 10, 0, 20, 10, 20');
});

test('invalid names', () => {
    expect(
        formatBoxToString(
            { x1: 0, x2: 10, y1: 0, y2: 20, w: 10, h: 20 },
            '$x11, $22, $yy1, $y2, $w1, $b, y, w, y1'
        )
    ).toBe('01, $22, $yy1, 20, 101, $b, y, w, y1');
});
