const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json');


const settings = {
    // animate: true,
    dimensions: [2048, 2048]
};

const sketch = () => {
    const xCount = 100;
    const yCount = 10;
    let obj = [];

    for (let x = 0; x < xCount; x++) {
        for (let y = 0; y < yCount; y++) {
            const u = x / (xCount - 1);
            const v = y / (yCount - 1);
            const color = random.chance(0.3) ? 'transparent' : random.pick(random.pick(palettes));
            obj.push([u, v, color]);
        }
    }

    return ({ context, width, height }) => {
        context.fillStyle = '#000b42';
        context.fillRect(0, 0, width, height);
        const margin = 0.1 * width;

        obj.forEach(data => {
            context.beginPath();
            let [u, v] = [data[0], data[1]];

            let x = lerp(margin, width - margin, u);
            let y = lerp(margin, width - margin, v);
            const rect_width = (width - (margin * 2)) / xCount;
            const rect_height = ((height - (margin * 2)) / yCount) * 0.7;


            context.rect(x, y - (rect_height / 2), rect_width, rect_height);


            context.fillStyle = data[2];
            context.fill();
        });

    };
};

canvasSketch(sketch, settings);
