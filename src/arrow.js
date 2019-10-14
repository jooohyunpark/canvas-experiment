const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048],
  animate: true
};

const sketch = async () => {
  const count = 20;
  const characters = '←↑→↓'.split('');
  const background = '#171717'
  // const palette = ['hsl(0, 0%, 90%)'];

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
        const duration = random.range(1, 4);
        const time = random.range(0, duration);
        const randomization = random.range(0, 1);
        points.push({
          // color: random.pick(palette),
          color: `hsl(259, 0%, ${random.range(20, 100)}% )`,
          radius: Math.abs(r + e * random.gaussian()),
          position,
          character,
          time: time,
          duration: duration,
          randomization: randomization
        });
      }
    }
    return points;
  };

  let points = createGrid().filter(() => random.chance(0.5));

  // Now return a render function for the sketch
  return ({ context, width, height, deltaTime }) => {
    const margin = width * 0.1;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        character
      } = data;

      let x = lerp(margin, width - margin, position[0]);
      let y = lerp(margin, height - margin, position[1]);

      data.time += deltaTime;

      if (data.time > data.duration) {
        data.time = 0;
        data.duration = random.range(1, 4);
        data.randomization = random.range(0, 1);
      }

      if (character === '→') {
        x += (width - margin * 2) / count * data.time * data.randomization
      } else if (character === '←') {
        x -= (width - margin * 2) / count * data.time * data.randomization
      } else if (character === '↑') {
        y -= (width - margin * 2) / count * data.time * data.randomization
      } else if (character === '↓') {
        y += (width - margin * 2) / count * data.time * data.randomization
      }

      // Draw the character
      context.fillStyle = color;
      context.font = `${radius}px "SpaceGrotesk-Medium"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(character, x, y);
    });
  };
};

canvasSketch(sketch, settings);
