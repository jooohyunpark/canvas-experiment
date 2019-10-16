const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048],
  animate: false
};

const sketch = async () => {
  const count = 50;
  const characters = '-'.split('');
  const palette = random.rangeFloor(0, 360);
  const background = `hsl(${palette}, ${5}%, ${15}% )`;

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const position = [u, v];
        const character = random.pick(characters);
        const r = 40
        const e = 20
        points.push({
          color: `hsl(${palette}, ${random.rangeFloor(20, 100)}%, ${random.rangeFloor(10, 90)}% )`,
          radius: Math.abs(r + e * random.gaussian()),
          position,
          character
        });
      }
    }
    return points;
  };

  let points = createGrid().filter(() => random.chance(0.5));

  // Now return a render function for the sketch
  return ({ context, width, height }) => {
    const margin = width * 0.1;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      let {
        position,
        radius,
        color,
        character
      } = data;

      let x = lerp(margin, width - margin, position[0]);
      let y = lerp(margin, height - margin, position[1]);

      // Draw the character
      context.fillStyle = color;
      context.font = `${radius * 1.4}px "SpaceGrotesk-Medium"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(character, x, y);
    });
  };
};

canvasSketch(sketch, settings);
