const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    animate: true,
    dimensions: [2048, 2048]
};

const sketch = () => {
    const count = 50;
    let points = [];
    let counter = 0;
    let seedColor = random.rangeFloor(0, 360);

    for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
            const u = x / (count - 1);
            const v = y / (count - 1);
            const size = Math.abs(random.noise2D(u, v))
            points.push([u, v, size]);
        }
    }

    return ({ context, width, height }) => {
        context.fillStyle = '#101638';
        context.fillRect(0, 0, width, height);
        const margin = 0.1 * width;

        points.forEach(point => {
            context.beginPath();
            let [u, v] = [point[0], point[1]];
            let size = point[2];

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, width - margin, v);

            let computedSize = Math.abs(Math.sin((size + counter)));

            context.arc(x, y, width / count * computedSize, 0, 2 * Math.PI);

            counter += (Math.PI * 2 / 100) * random.range(0.0001, 0.0003);

            context.lineWidth = 2;
            context.strokeStyle = `hsl(${seedColor + 360 * computedSize}, 100%, 50%)`;
            // context.strokeStyle = '#c2e1ff';
            context.stroke();
        });

    };
};

canvasSketch(sketch, settings);
