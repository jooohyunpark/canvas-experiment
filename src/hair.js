const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [2048, 2048]
};

const sketch = () => {
    let count = 1200;
    let seedCount = [random.rangeFloor(1, 4), random.rangeFloor(1, 4)];
    let controlCount = random.rangeFloor(2, 5);
    let points = [];
    let controls = [];
    let seeds_x = [];
    let seeds_y = [];
    let thresold = 1 / 20;
    let colors = random.pick(['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff']);

    // set seed coordinates
    for (let h = 0; h < seedCount[0]; h++) {
        seeds_x.push(random.range(thresold, 1 - thresold))
    }
    for (let h = 0; h < seedCount[1]; h++) {
        seeds_y.push(random.range(thresold, 1 - thresold))
    }
    // iterate points
    for (let i = 0; i < count; i++) {
        let x = random.pick(seeds_x) + random.gaussian() * 0.03
        let y = random.pick(seeds_y) + random.gaussian() * 0.03
        points.push([x, y]);
    }
    // set control points
    for (let j = 0; j < controlCount; j++) {
        controls.push([random.range(0, 1), random.range(0, 1)])
    }

    return ({ context, width, height }) => {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);

        points.forEach(point => {
            context.beginPath();

            const y0 = lerp(0, height, point[0]);
            const y1 = lerp(0, height, point[1]);

            const m = width / 8;
            const n = height / 8;

            let control0 = random.pick(controls)
            let control1 = random.pick(controls)

            let xControl0 = lerp(m, width - m, control0[0]);
            let yControl0 = lerp(n, height - n, control0[1]);
            let xControl1 = lerp(m, width - m, control1[0]);
            let yControl1 = lerp(n, height - n, control1[1]);

            context.moveTo(0, y0);
            context.bezierCurveTo(xControl0, yControl0, xControl1, yControl1, width, y1)

            context.lineWidth = 2;
            context.strokeStyle = random.chance(0.08) ? colors : '#000';
            context.globalAlpha = 0.18;
            context.stroke();
        })
    };
};

canvasSketch(sketch, settings);
