const canvasSketch = require('canvas-sketch');
const { lerp, linspace } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    animate: true,
    duration: 8,
    dimensions: [800, 800]
};

const sketch = () => {
    const lines = linspace(100, true).map(y => {
        return linspace(100, true).map(x => {
            return [
                x, y
            ];
        });
    });
    return ({ context, width, height, playhead }) => {
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        const margin = 0.1 * width;
        lines.forEach(line => {
            context.beginPath();
            line.forEach(position => {
                let [u, v] = position;

                u += 0.01 * loopNoise(u, v, playhead);
                const x = lerp(margin, width - margin, u);
                const y = lerp(margin, width - margin, v);

                context.lineTo(x, y);
                context.lineTo(y, x);
                // console.log(position)
                // console.log('x, y : ', x, y);
                // console.log('y, x : ', y, x);
            });
            context.lineWidth = 0.0001 * width;
            context.strokeStyle = '#fff';
            context.stroke();
        })
    };

    function loopNoise(x, y, t, scale = 1) {
        const duration = scale;
        const current = t * scale;
        return ((duration - current) * random.noise3D(x, y, current) + current * random.noise3D(x, y, current - duration)) / duration;
    }
};

canvasSketch(sketch, settings);
