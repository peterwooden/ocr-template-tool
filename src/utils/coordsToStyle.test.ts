import { coordsToStyle } from './coordsToStyle';

test('Correct coords to styles', () => {
    expect(
        coordsToStyle({
            box: { x1: 0, x2: 10, y1: 0, y2: 20, w: 10, h: 20 },
            color: '#000000',
        })
    ).toEqual({
        left: 0,
        top: 0,
        width: 10,
        height: 20,
        backgroundColor: '#00000033',
        borderColor: '#000000c8',
    });
});
