const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

random.setSeed(random.getRandomSeed());

const settings = {
  seed: random.getSeed(),
  // exportPixelRatio: 2,
  dimensions: [1200, 1200]
};

const sketch = ({ width, height }) => {
  const lineCount = 300;
  const lineSegments = 500;

  let lines = [];
  const margin = width * 0.1;

  for (let i = 0; i < lineCount; i++) {
    const A = i / (lineCount - 1);
    const line = [];

    const x = lerp(margin, width - margin, A);

    for (let j = 0; j < lineSegments; j++) {
      const B = j / (lineSegments - 1);
      const y = lerp(margin, height - margin, B);

      const frequency0 = 0.00105 + random.gaussian() * 0.00003;
      const z0 = noise(x * frequency0, y * frequency0, -1);
      const z1 = noise(x * frequency0, y * frequency0, +1);

      const warp = random.gaussian(1, 2);

      const x_variation = z0 * warp;
      const y_variation = z1 * warp;

      const fx = x + x_variation;
      const fy = y + y_variation;

      const point = [fx, fy];
      line.push(point);
    }

    lines.push(line);
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#000';
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 1;

    let seed_color = random.rangeFloor(0, 360);

    lines.forEach(line => {
      context.beginPath();
      line.forEach(([x, y]) => {
        // curve
        let index = indexOf(line, [x, y], arraysIdentical);
        let data = bezierCommand([x, y], index, line)
        context.quadraticCurveTo(data[0], data[1], data[2], data[3], data[4], data[5])

        let color_variation = x / (width * 0.75);
        context.strokeStyle = `hsla(${seed_color + 100 * color_variation}, ${100}%, ${50}%, ${1})`;
      });

      context.globalCompositeOperation = 'lighter';
      context.globalAlpha = 0.9;
      context.stroke();
    });

  };

  function noise(nx, ny, z, freq = 0.75) {
    // This uses many layers of noise to create a more organic pattern
    nx *= freq;
    ny *= freq;
    let e = (1.00 * (random.noise3D(1 * nx, 1 * ny, z) * 0.5 + 0.5) +
      0.50 * (random.noise3D(2 * nx, 2 * ny, z) * 0.5 + 0.5) +
      0.25 * (random.noise3D(4 * nx, 4 * ny, z) * 0.5 + 0.5) +
      0.13 * (random.noise3D(8 * nx, 8 * ny, z) * 0.5 + 0.5) +
      0.06 * (random.noise3D(16 * nx, 16 * ny, z) * 0.5 + 0.5) +
      0.03 * (random.noise3D(32 * nx, 32 * ny, z) * 0.5 + 0.5));
    e /= (1.00 + 0.50 + 0.25 + 0.13 + 0.06 + 0.03);
    e = Math.pow(e, 2);
    e = Math.max(e, 0);
    e *= 2;
    return e * 2 - 1;
  }

  function curve(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }
  function controlPoint(current, previous, next, reverse) {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current
    const n = next || current
    // The smoothing ratio
    const smoothing = 0.2
    // Properties of the opposed-line
    const o = curve(p, n)
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing
    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
  }

  function bezierCommand(point, i, a) {
    // start control point
    const [cpsX, cpsY] = controlPoint(i < 1 ? 0 : a[i - 1], i < 2 ? 0 : a[i - 2], point)
    // end control point
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
    // return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
    return [cpsX, cpsY, cpeX, cpeY, point[0], point[1]]
  }

  // Shallow array comparer
  function arraysIdentical(arr1, arr2) {
    var i = arr1.length;
    if (i !== arr2.length) {
      return false;
    }
    while (i--) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  // get index of target in 2x2 array
  function indexOf(arr, val, comparer) {
    for (var i = 0, len = arr.length; i < len; ++i) {
      if (i in arr && comparer(arr[i], val)) {
        return i;
      }
    }
    return -1;
  }


};

canvasSketch(sketch, settings);
